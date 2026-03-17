const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Officer = require('../models/Officer');
const connectDB = require('../config/db');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
    await connectDB();

    const officerId = 'admin';
    const password = 'admin';

    // Check if exists
    let officer = await Officer.findOne({ officerId });
    if (officer) {
        console.log('✅ Admin user already exists.');
        // Optional: Update password if needed, but for now just notify
        officer.passwordHash = await bcrypt.hash(password, 10);
        await officer.save();
        console.log('✅ Admin password reset to: admin');
    } else {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        officer = await Officer.create({
            officerId,
            passwordHash,
            station: 'HQ',
            role: 'Admin'
        });
        console.log('✅ Admin user created: admin / admin');
    }
    process.exit();
};

seedAdmin();
