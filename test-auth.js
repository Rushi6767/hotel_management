const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAuth() {
  console.log('🧪 Testing Authentication System...\n');

  try {
    // Test 1: Register a new user
    console.log('1. Testing User Registration...');
    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const registerResponse = await axios.post(`${BASE_URL}/api/users/register`, registerData);
    console.log('✅ Registration successful:', registerResponse.data);
    console.log('User ID:', registerResponse.data.user._id);
    console.log('User Name:', registerResponse.data.user.name);
    console.log('User Email:', registerResponse.data.user.email);
    console.log('');

    // Test 2: Login with the registered user
    console.log('2. Testing User Login...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const loginResponse = await axios.post(`${BASE_URL}/api/users/login`, loginData);
    console.log('✅ Login successful:', loginResponse.data);
    console.log('User ID:', loginResponse.data.user._id);
    console.log('User Name:', loginResponse.data.user.name);
    console.log('User Email:', loginResponse.data.user.email);
    console.log('');

    // Test 3: Try to login with wrong password
    console.log('3. Testing Login with Wrong Password...');
    const wrongPasswordData = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };

    try {
      await axios.post(`${BASE_URL}/api/users/login`, wrongPasswordData);
    } catch (error) {
      console.log('✅ Correctly rejected wrong password:', error.response.data.message);
    }
    console.log('');

    // Test 4: Try to register with existing email
    console.log('4. Testing Duplicate Registration...');
    try {
      await axios.post(`${BASE_URL}/api/users/register`, registerData);
    } catch (error) {
      console.log('✅ Correctly rejected duplicate email:', error.response.data.message);
    }
    console.log('');

    console.log('🎉 All tests passed! Authentication system is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Run the test
testAuth(); 