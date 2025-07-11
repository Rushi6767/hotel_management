// Simple test to verify payment integration
const axios = require('axios');

async function testPayment() {
  try {
    console.log('🧪 Testing payment integration...');
    
    // Test data
    const testData = {
      room: {
        _id: 'test-room-id',
        name: 'Test Room',
        type: 'Standard',
        rentperday: 1000,
        imageurls: []
      },
      userid: 'test-user-id',
      fromdate: '2024-01-15',
      todate: '2024-01-17',
      totalamount: 2360, // 1000 * 2 days + 18% tax
      totaldays: 2
    };

    console.log('📤 Sending test data:', testData);

    const response = await axios.post('http://localhost:5000/api/checkout/create-checkout-session', testData);
    
    console.log('✅ Success! Session created:', response.data);
    console.log('🔗 Session ID:', response.data.id);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('📋 Error details:', error.response.data);
    }
  }
}

testPayment(); 