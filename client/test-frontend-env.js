// Test frontend environment variables
require('dotenv').config();

console.log('🔍 Testing frontend environment variables...');
console.log('REACT_APP_STRIPE_PUBLIC_KEY:', process.env.REACT_APP_STRIPE_PUBLIC_KEY ? '✅ Found' : '❌ Missing');

if (!process.env.REACT_APP_STRIPE_PUBLIC_KEY) {
  console.log('\n❌ REACT_APP_STRIPE_PUBLIC_KEY is missing!');
  console.log('Create a .env file in the client directory with:');
  console.log('REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_actual_public_key_here');
  console.log('\nThen restart your React development server.');
} 