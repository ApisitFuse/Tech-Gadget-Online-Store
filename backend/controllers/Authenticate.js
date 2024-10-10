const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Registration, Role } = require('../models/UserLogin');  // Import User model
const { authenticateToken } = require('../middleware/AuthenticateJWT');
require('dotenv').config();

const jwt_secret = process.env.JWT_SECRET;
const jwt_refresh_secret = process.env.JWT_REFRESH_SECRET;
const jwt_expire = process.env.JWT_EXPIRATION;
const jwt_refresh_expire = process.env.JWT_REFRESH_EXPIRATION;
const node_env = process.env.NODE_ENV;

// Register route
router.post('/register', async (req, res) => {
    const { GID, globalName, email, password, roleId } = req.body;

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
            globalName,
            email,
            password: hashedPassword,
            roleId
        });

        // Save the user to the database
        await newUser.save();

        // ดึง role จากผู้ใช้
        const role = await Role.findByPk(newUser.roleId);

        // สร้าง Access Token (เก็บ role เข้าไปใน token ด้วย)
        const accessToken = jwt.sign(
            { userEmail: newUser.email, role: role.name }, // role อยู่ใน payload
            jwt_secret,
            { expiresIn: jwt_expire }
        );

        // สร้าง Refresh Token
        const refreshToken = jwt.sign(
            { userEmail: newUser.email },
            jwt_refresh_secret,
            { expiresIn: jwt_refresh_expire }
        );

        // เก็บ Access Token ใน httpOnly cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            // secure: false,
            secure: node_env === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 นาที
        });

        // เก็บ Refresh Token ใน httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            // secure: false,
            secure: node_env === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 วัน
        });

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log("2");

    try {
        // Check if the user exists
        const user = await Registration.findOne({ where: { email } });
        console.log(email);
        console.log(user);
        if (!user) {
            console.log("3");
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // ดึง role จากผู้ใช้
        const role = await Role.findByPk(user.roleId);

        // สร้าง Access Token (เก็บ role เข้าไปใน token ด้วย)
        const accessToken = jwt.sign(
            { userEmail: user.email, role: role.name }, // role อยู่ใน payload
            jwt_secret,
            { expiresIn: jwt_expire }
        );

        // สร้าง Refresh Token
        const refreshToken = jwt.sign(
            { userEmail: user.email },
            jwt_refresh_secret,
            { expiresIn: jwt_refresh_expire }
        );

        // เก็บ Access Token ใน httpOnly cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            // secure: false,
            secure: node_env === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 นาที
        });

        // เก็บ Refresh Token ใน httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            // secure: false,
            secure: node_env === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 วัน
        });

        res.status(201).json({ message: 'Login successful' });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/check_auth', authenticateToken, (req, res) => {
    res.json({ isLoggedIn: true, user: req.user });
});

router.post('/logout', (req, res) => {
    // ลบ cookie ที่เก็บ access token และ refresh token
    res.clearCookie('accessToken', { httpOnly: true, secure: false });
    res.clearCookie('refreshToken', { httpOnly: true, secure: false });

    res.status(200).json({ message: 'Logged out successfully' });
});

router.get('/refresh_token', (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(403).json({ message: 'Refresh token required' });

    jwt.verify(refreshToken, jwt_refresh_secret, async (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid Refresh Token' });

        const user = await Registration.findOne({ where: { email: decoded.userEmail } });
        const role = await Role.findByPk(user.roleId);

        // สร้าง access token ใหม่
        const newAccessToken = jwt.sign(
            { userEmail: decoded.userEmail, role: role.name },
            jwt_secret,
            { expiresIn: jwt_expire }
        );

        // ส่ง Access Token ใหม่ไปเก็บใน cookie
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            // secure: false,
            secure: node_env === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });

        res.status(200).json({ accessToken: newAccessToken });
    });
});

module.exports = router;


// // Login route
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // Check if the user exists
//         const user = await Registration.findOne({ where: { email } });
//         if (!user) {
//             return res.status(400).json({ message: 'User not found' });
//         }

//         // Compare the password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         // Generate JWT token
//         const token = jwt.sign({ userEmail: user.email }, secretKey, { expiresIn: '24h' });

//         res.status(200).json({ token });
//     } catch (error) {
//         console.error('Error logging in:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// // Register route
// router.post('/register', async (req, res) => {
//     const { GID, glocbalName, email, password, roleId } = req.body;

//     try {
//         // Check if the user already exists
//         const existingUser = await Registration.findOne({ where: { email } });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a new user
//         const newUser = new Registration({
//             GID,
//             glocbalName,
//             email,
//             password: hashedPassword,
//             roleId
//         });

//         // Save the user to the database
//         await newUser.save();

//         // สร้าง JWT token
//         const token = jwt.sign({ userEmail: newUser.email }, secretKey, { expiresIn: '24h' });

//         // ส่ง token กลับไปพร้อม response
//         res.status(201).json({ token });
//         // res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         console.error('Error saving user:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

