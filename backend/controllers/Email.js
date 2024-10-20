const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { authenticateToken, authorizeRole } = require('../middleware/AuthenticateJWT');
require('dotenv').config();


// ฟังก์ชันสำหรับสร้าง token พร้อม expiration
const generateToken = (email, role) => {
    const payload = { email, role };
    const secretKey = process.env.JWT_SECRET;

    // กำหนดเวลา expiration เป็น 1 ชั่วโมง
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    return token;
};

// Nodemailer Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// ฟังก์ชันสำหรับส่งอีเมล
const sendEmail = async (recipientEmail, subject, content) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL,
            to: recipientEmail,
            subject: subject,
            html: content,
        };

        // ส่งอีเมล
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Send token API
router.post('/email_token', authenticateToken, authorizeRole(['Super Admin']), async (req, res) => {
    const { email, role } = req.body;

    // Create a token (e.g., random string or JWT)
    const token = generateToken(email, role);

    // ส่งอีเมลไปยังผู้ใช้ (ใช้ nodemailer หรือบริการอื่น ๆ)
    const emailContent = `
  <h1>Register as Admin</h1>
  <p>Click the link below to register:</p>
  <a href="http://localhost:3000/admin_register?token=${token}">Register Here</a>
`;

    try {
        // await transporter.sendMail(mailOptions);
        await sendEmail(email, 'Register Token', emailContent);
        res.status(200).json({ message: 'Token sent successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send token.' });
    }
});

module.exports = router;