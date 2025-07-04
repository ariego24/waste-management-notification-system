// server.js
require('dotenv').config(); // ✅ Load .env variables
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Waste = require('./models/Waste');

const app = express();
const PORT = 3000;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose.connect('mongodb://localhost:27017/basura')
    .then(() => console.log("✅ Connected to MongoDB (basura)"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Gmail Email Configuration (from .env)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // 🔐 Secure from .env
        pass: process.env.EMAIL_PASS   // 🔐 App Password from .env
    }
});

// ✅ Save Waste Record to MongoDB
app.post('/addRecord', async (req, res) => {
    try {
        const { wasteType, recyclableMaterials, quantity, location, pickupTime, email } = req.body;

        const newWaste = new Waste({
            wasteType,
            recyclableMaterials,
            quantity,
            location,
            pickupTime,
            email
        });

        const saved = await newWaste.save();
        console.log('✅ Record saved to MongoDB:', saved);
        res.status(200).json(saved);
    } catch (err) {
        console.error('❌ Failed to save waste record:', err);
        res.status(500).send('Error saving waste record.');
    }
});

// ✅ Send Email Notification
app.post('/send-notification', (req, res) => {
    const { wasteType, quantity, location, pickupTime, email } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email || 'recipient-email@example.com',
        subject: 'New Waste Record Added',
        text: `📦 New Waste Record:\n
Type: ${wasteType}
Quantity: ${quantity} kg
Location: ${location}
Pickup Time: ${pickupTime}
User Email: ${email || 'N/A'}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('❌ Email error:', error);
            return res.status(500).send('Error sending email.');
        }
        console.log('✅ Email sent:', info.response);
        res.status(200).send('Email sent successfully.');
    });
});

// ✅ View all waste records
app.get('/getRecords', async (req, res) => {
    try {
        const records = await Waste.find().sort({ createdAt: -1 });
        res.status(200).json(records);
    } catch (err) {
        console.error('❌ Failed to fetch records:', err);
        res.status(500).send('Error fetching records.');
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
