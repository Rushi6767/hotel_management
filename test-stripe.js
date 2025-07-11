require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function testStripeConnection() {
  try {
    console.log('🔍 Testing Stripe connection...');
    
    // Check if environment variables are loaded
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY not found in environment variables');
      return;
    }
    
    if (!process.env.STRIPE_PUBLIC_KEY) {
      console.error('❌ STRIPE_PUBLIC_KEY not found in environment variables');
      return;
    }
    
    console.log('✅ Environment variables loaded');
    console.log('🔑 Public Key:', process.env.STRIPE_PUBLIC_KEY.substring(0, 20) + '...');
    console.log('🔑 Secret Key:', process.env.STRIPE_SECRET_KEY.substring(0, 20) + '...');
    
    // Test Stripe connection by creating a test payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // 10.00 in cents
      currency: 'inr',
      description: 'Test payment for hotel booking',
    });
    
    console.log('✅ Stripe connection successful!');
    console.log('💰 Test Payment Intent created:', paymentIntent.id);
    console.log('💳 Amount:', paymentIntent.amount / 100, 'INR');
    console.log('📊 Status:', paymentIntent.status);
    
    // Clean up - cancel the test payment intent
    await stripe.paymentIntents.cancel(paymentIntent.id);
    console.log('🧹 Test payment intent cancelled');
    
  } catch (error) {
    console.error('❌ Stripe test failed:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.error('🔐 Authentication failed - check your STRIPE_SECRET_KEY');
    } else if (error.type === 'StripeInvalidRequestError') {
      console.error('📝 Invalid request - check your request parameters');
    }
  }
}

// Run the test
testStripeConnection(); 