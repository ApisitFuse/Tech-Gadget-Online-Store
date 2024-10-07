const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Registration } = require('../models/UserLogin');  // Import User model
const { loginVerify } = require('../middleware/AuthenticateJWT');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

// Register route
router.post('/register', async (req, res) => {
    const { GID, glocbalName, email, password, roleId } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await Registration.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new Registration({
            GID,
            glocbalName,
            email,
            password: hashedPassword,
            roleId
        });

        // Save the user to the database
        await newUser.save();

        // สร้าง JWT token
        const token = jwt.sign({ userEmail: newUser.email }, secretKey, { expiresIn: '24h' });

        // ส่ง token กลับไปพร้อม response
        res.status(201).json({ token });
        // res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await Registration.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userEmail: user.email }, secretKey, { expiresIn: '24h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/profile', loginVerify, async (req, res) => {
    try {
        // const user = await Registration.findByPk(req.user.userId); // ใช้ ID ของผู้ใช้จาก token อันนี้เป็นการค้นหาด้วย id ถ้าเกิดตอน login ให้ hash ด้วย PK
        const user = await Registration.findOne({
            where: { email: req.user.userEmail } // ค้นหาผู้ใช้ตาม email ที่ได้จาก token
        });
        if (!user) {
            return res.sendStatus(404); // ผู้ใช้ไม่พบ
        }
        res.json(user); // ส่งข้อมูลโปรไฟล์
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.sendStatus(500); // ส่งสถานะ 500 หากเกิดข้อผิดพลาด
    }
});

module.exports = router;
