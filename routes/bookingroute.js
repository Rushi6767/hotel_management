const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Room = require('../models/room');
const moment = require('moment');

router.post('/bookroom', async (req, res) => {
    const {
      room,
      roomid,
      userid,
      fromdate,
      todate,
      totalamount,
      totaldays,
      transactionid,
    } = req.body;
  
    if (!room || !roomid || !userid || !fromdate || !todate) {
      return res.status(400).json({ message: 'Missing booking details' });
    }
  
    try {
      const newbooking = new Booking({
        room: room.name,        // valid now
        roomid: room._id,
        userid,
        fromdate: moment(fromdate).format('DD-MM-YYYY'),
        todate: moment(todate).format('DD-MM-YYYY'),
        totalamount,
        totaldays,
        transactionid,
      });

      const booking = await newbooking.save();
      const roomDoc = await Room.findOne({ _id: roomid });

      roomDoc.currentbookings.push({
        bookingid: booking._id,
        fromdate: moment(fromdate).format('DD-MM-YYYY'),
        todate: moment(todate).format('DD-MM-YYYY'),
        userid: userid,
        status: booking.status
      });
      await roomDoc.save();

      res.status(200).json({ message: 'Booking successful', booking });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  

module.exports = router;