const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/booking');
const Room = require('../models/room');
const moment = require('moment');

// Create checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { room, userid, fromdate, todate, totalamount, totaldays } = req.body;

    console.log('Creating session for:', room.name, totalamount);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: room.name,
              description: `${room.type} Room - ${totaldays} nights`,
            },
            unit_amount: Math.round(totalamount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/booking-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/',
      metadata: {
        roomId: room._id,
        userId: userid,
        fromDate: fromdate,
        toDate: todate,
        totalAmount: totalamount.toString(),
        totalDays: totaldays.toString(),
        roomName: room.name,
        roomType: room.type
      },
    });

    console.log('Session created:', session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error('Session creation failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook to handle successful payments
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      // Create booking
      const newbooking = new Booking({
        room: session.metadata.roomName,
        roomid: session.metadata.roomId,
        userid: session.metadata.userId,
        fromdate: moment(session.metadata.fromDate).format('DD-MM-YYYY'),
        todate: moment(session.metadata.toDate).format('DD-MM-YYYY'),
        totalamount: parseFloat(session.metadata.totalAmount),
        totaldays: parseInt(session.metadata.totalDays),
        transactionid: session.payment_intent,
        status: 'confirmed'
      });

      const booking = await newbooking.save();

      // Update room bookings
      const roomDoc = await Room.findOne({ _id: session.metadata.roomId });
      if (roomDoc) {
        roomDoc.currentbookings.push({
          bookingid: booking._id,
          fromdate: moment(session.metadata.fromDate).format('DD-MM-YYYY'),
          todate: moment(session.metadata.toDate).format('DD-MM-YYYY'),
          userid: session.metadata.userId,
          status: 'confirmed'
        });
        await roomDoc.save();
      }

      console.log('Booking created successfully:', booking._id);
    } catch (error) {
      console.error('Error creating booking from webhook:', error);
      return res.status(500).json({ error: 'Failed to create booking' });
    }
  }

  res.json({ received: true });
});

// Get session details for success page
router.get('/session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json(session);
  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
});

// Test route to verify Stripe configuration
router.get('/test', async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'STRIPE_SECRET_KEY not configured' });
    }
    
    // Create a simple test session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Test Room',
              description: 'Test booking for 1 night',
            },
            unit_amount: 1000, // 10.00 INR
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/`,
    });
    
    res.json({ 
      success: true, 
      message: 'Stripe is configured correctly',
      sessionId: session.id,
      checkoutUrl: session.url
    });
  } catch (error) {
    console.error('Stripe test failed:', error);
    res.status(500).json({ 
      error: 'Stripe test failed', 
      message: error.message 
    });
  }
});

module.exports = router; 