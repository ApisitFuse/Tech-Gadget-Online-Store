const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { Token, Role } = require('../models/UserLogin');
const { authenticateToken, authorizeRole } = require('../middleware/authenticateJWT');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const f_host = process.env.F_HOST;
const f_port = process.env.F_PORT;
// Nodemailer Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Function ถอดรหัส email เพื่อส่งไปให้ frontend
const decryptEmail = (encryptedEmail) => {
    
    let textParts = encryptedEmail.split(':'); // แยก IV และข้อมูลที่เข้ารหัส
    let iv = Buffer.from(textParts.shift(), 'hex'); // แปลง IV กลับเป็น Buffer
    let encryptedText = Buffer.from(textParts.join(':'), 'hex'); // แปลงข้อมูลที่เข้ารหัสกลับเป็น Buffer
    const key = crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY).digest(); // สร้างคีย์จาก ENCRYPTION_KEY
    
    // สร้าง decipher เพื่อถอดรหัส
    let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

// API endpoint สำหรับถอดรหัส
router.post('/decrypt', (req, res) => {
    const { encryptedEmail } = req.body; // ดึงข้อมูล email ที่เข้ารหัสจาก request body

    if (!encryptedEmail) {
        return res.status(400).json({ error: 'Missing encryptedEmail' });
    }

    try {
        const decryptedEmail = decryptEmail(encryptedEmail); // เรียกใช้ฟังก์ชันถอดรหัส
        res.status(200).json({ decryptedEmail });
    } catch (error) {
        res.status(500).json({ error: 'Failed to decrypt email' });
    }
});

// Send token API
// router.post('/email_token', async (req, res) => {
router.post('/sup_email_token', authenticateToken, authorizeRole(['Super Admin']), [
    body('email')
        .notEmpty().withMessage('Email is required.').bail()
        .isEmail().withMessage('Invalid email address.'),
    body('role')
        .notEmpty().withMessage('Role is required.').bail()
        .custom(async (role) => {
            if (role != 2 && role != 3) {
                throw new Error('Invalid role.');
            }
            return true;
        }),
], async (req, res) => {
    const { email, role } = req.body;
    const IV_LENGTH = 16; // Length of initialization vector
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // ส่งข้อผิดพลาดกลับ
    }

    const key = crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY).digest();
    
    const encryptEmail = (email) => {
        let iv = crypto.randomBytes(IV_LENGTH);
        let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(email, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted; // ส่งกลับ IV และข้อมูลที่เข้ารหัส
    };

    const encryptedEmail = encryptEmail(email);

    const token = crypto.randomBytes(20).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // กำหนดวันหมดอายุเป็น 1 ชั่วโมง

    let registerUrl = ``;

    if (role == 2) {
        registerUrl = `http://${f_host}:${f_port}/admin_register?email=${encryptedEmail}`;
    } else if (role == 3){
        registerUrl = `http://${f_host}:${f_port}/seller_register?email=${encryptedEmail}`;
    }else{
        throw new Error('Invalid role');
    }

    const user_role = await Role.findByPk(role);
    // ส่งอีเมลไปยังผู้ใช้ (ใช้ nodemailer หรือบริการอื่น ๆ)
    const emailContent = `
      <h3>Register as ${user_role.name}</h3>
      <p>Click the link below to complete your registration:</p>
      <a href="${registerUrl}">Register Here</a>
    `;

    try {

        const newToken = new Token({
            email,
            token,
            roleId: role,
            expiresAt: expiresAt,
        });

        // Save the user to the database
        await newToken.save();

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Register Token',
            html: emailContent,
        };

        // ส่งอีเมล
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send('Error sending email');
            }

            return res.status(200).send({ message: 'Email sent and token stored' });
        });


    } catch (error) {
        console.error('Error sending token:', error);
        res.status(500).json({ message: 'Failed to send token.' });
    }
});

router.post('/admin_email_token', authenticateToken, authorizeRole(['Admin']), [
    body('email')
        .notEmpty().withMessage('Email is required.').bail()
        .isEmail().withMessage('Invalid email address.'),
], async (req, res) => {
    const { email } = req.body;
    const IV_LENGTH = 16; // Length of initialization vector
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // ส่งข้อผิดพลาดกลับ
    }

    const key = crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY).digest();
    
    const encryptEmail = (email) => {
        let iv = crypto.randomBytes(IV_LENGTH);
        let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(email, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted; // ส่งกลับ IV และข้อมูลที่เข้ารหัส
    };

    const encryptedEmail = encryptEmail(email);

    const token = crypto.randomBytes(20).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // กำหนดวันหมดอายุเป็น 1 ชั่วโมง

    const registerUrl = `http://${f_host}:${f_port}/seller_register?email=${encryptedEmail}`;

    // ส่งอีเมลไปยังผู้ใช้ (ใช้ nodemailer หรือบริการอื่น ๆ)
    const emailContent = `
      <h3>Register as Seller</h3>
      <p>Click the link below to complete your registration:</p>
      <a href="${registerUrl}">Register Here</a>
    `;

    try {

        const newToken = new Token({
            email,
            token,
            roleId: 3,
            expiresAt: expiresAt,
        });

        // Save the user to the database
        await newToken.save();

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Register Token',
            html: emailContent,
        };

        // ส่งอีเมล
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send('Error sending email');
            }

            return res.status(200).send({ message: 'Email sent and token stored' });
        });


    } catch (error) {
        console.error('Error sending token:', error);
        res.status(500).json({ message: 'Failed to send token.' });
    }
});

module.exports = router;