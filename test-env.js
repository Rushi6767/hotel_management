// Test environment variables
require('dotenv').config();

console.log('🔍 Testing environment variables...');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ Found' : '❌ Missing');
console.log('STRIPE_PUBLIC_KEY:', process.env.STRIPE_PUBLIC_KEY ? '✅ Found' : '❌ Missing');
console.log('PORT:', process.env.PORT || '5000 (default)');

if (!process.env.STRIPE_SECRET_KEY) {
  console.log('\n❌ STRIPE_SECRET_KEY is missing!');
  console.log('Create a .env file in the root directory with:');
  console.log('STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here');
}

if (!process.env.STRIPE_PUBLIC_KEY) {
  console.log('\n❌ STRIPE_PUBLIC_KEY is missing!');
  console.log('Add to your .env file:');
  console.log('STRIPE_PUBLIC_KEY=pk_test_your_actual_public_key_here');
} 