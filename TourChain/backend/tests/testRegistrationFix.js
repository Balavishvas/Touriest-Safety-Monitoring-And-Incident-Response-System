const axios = require('axios');

async function testRegistration() {
    const API_URL = 'http://localhost:5000/api/auth/register';
    const randomPhone = '99' + Math.floor(10000000 + Math.random() * 90000000); // 10 digit random phone

    console.log(`Attempting registration with phone: ${randomPhone}`);

    const userData = {
        fullName: "Test User",
        phone: randomPhone,
        password: "password123",
        confirmPassword: "password123",
        age: 25,
        emergencyContact: "9876543210"
    };

    try {
        const response = await axios.post(API_URL, userData);
        console.log('✅ Registration Successful!');
        console.log('User ID:', response.data.user._id);
        console.log('Profile ID:', response.data.profile._id);
        console.log('Token received:', !!response.data.token);
    } catch (error) {
        console.error('❌ Registration Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

testRegistration();
