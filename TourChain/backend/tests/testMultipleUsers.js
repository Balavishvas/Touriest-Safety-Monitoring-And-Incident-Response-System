const axios = require('axios');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const API_URL = 'http://localhost:5000/api/auth/register';

async function registerUser(name, phone) {
    const userData = {
        fullName: name,
        phone: phone,
        password: "password123",
        confirmPassword: "password123",
        age: 25,
        emergencyContact: "9876543210"
    };
    try {
        console.log(`Registering ${name} (${phone})...`);
        const response = await axios.post(API_URL, userData);
        console.log(`✅ Success: ${name} created. ID: ${response.data.user._id}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Failed to register ${name}:`, error.response ? error.response.data : error.message);
        return null;
    }
}

async function verifyInDatabase(phones) {
    try {
        console.log('\nConnecting to database to verify records...');
        await mongoose.connect(process.env.MONGO_URI);
        const User = mongoose.connection.collection('users');

        const count = await User.countDocuments({ phone: { $in: phones } });
        console.log(`Found ${count} out of ${phones.length} new users in the database.`);

        const users = await User.find({ phone: { $in: phones } }).toArray();
        users.forEach(u => console.log(`- Found DB Record: ${u.phone} (Role: ${u.role})`));

    } catch (error) {
        console.error('Database verification failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

async function run() {
    const timestamp = Date.now();
    const phones = [
        '88' + Math.floor(10000000 + Math.random() * 90000000), // Random phone 1
        '88' + Math.floor(10000000 + Math.random() * 90000000)  // Random phone 2
    ];

    await registerUser(`User A ${timestamp}`, phones[0]);
    await registerUser(`User B ${timestamp}`, phones[1]);

    await verifyInDatabase(phones);
}

run();
