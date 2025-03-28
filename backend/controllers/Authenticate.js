const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Registration, Role, User, Token } = require('../models/UserLogin');
const { authenticateToken } = require('../middleware/authenticateJWT');
require('dotenv').config();

const jwt_secret = process.env.JWT_SECRET;
const jwt_refresh_secret = process.env.JWT_REFRESH_SECRET;
const jwt_expire = process.env.JWT_EXPIRATION;
const jwt_refresh_expire = process.env.JWT_REFRESH_EXPIRATION;
const node_env = process.env.NODE_ENV;

// Register route
router.post('/register', [
    body('email')
        .notEmpty().withMessage('Email is required.').bail()
        .isEmail().withMessage('Invalid email address.').bail()
        .custom(async (email) => {
            const user = await Registration.findOne({ where: { email } });
            if (user) {
                throw new Error('Email already in use.');
            }
            return true;
        }),
    body('GID')
        .matches(/^[A-Z]\d{2,}$/).withMessage('GID must start with an uppercase letter followed by at least 2 digits.').bail()
        .custom(async (GID) => {
            const user = await Registration.findOne({ where: { GID } });
            if (user) {
                throw new Error('GID already in use.');
            }
            return true;
        }),
    body('globalName')
        .notEmpty().withMessage('Global name is required.').bail()
        .custom(async (globalName) => {
            const user = await Registration.findOne({ where: { globalName } });
            if (user) {
                throw new Error('Global name already in use.');
            }
            return true;
        }),
    body('confirmPassword')
        .notEmpty().withMessage('Confirm password is required.').bail()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match.');
            }
            return true;
        }),
    body('password')
        .notEmpty().withMessage('Password is required.').bail()
        .isLength({ min: 5 }).withMessage('Email must be at least 5 characters long.').bail()
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.').bail()
        // .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.').bail()
        .matches(/[0-9]/).withMessage('Password must contain at least one number.')
    // .matches(/[\W_]/).withMessage('Password must contain at least one special character (e.g., !@#$%^&*).')
], async (req, res) => {
    const { GID, globalName, email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // ส่งข้อผิดพลาดกลับ
    }


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
            roleId: 4,
        });

        await newUser.save();

        const newUserProfile = new User({
            registrationId: newUser.id
        });

        await newUserProfile.save();

        // สร้าง Access Token (เก็บ role เข้าไปใน token ด้วย)
        const accessToken = jwt.sign(
            { userEmail: newUser.email, role: 'Customer' }, // role อยู่ใน payload
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
            secure: node_env === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 นาที
        });

        // เก็บ Refresh Token ใน httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: node_env === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 วัน
        });

        res.status(201).json({ message: 'User registered successfully', role: 'Customer' });

    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/admin_register', [
    body('email')
        .notEmpty().withMessage('Email is required.').bail()
        .isEmail().withMessage('Invalid email address.').bail()
        .custom(async (email) => {  // เช็คว่าอีเมลนี้มีในระบบหรือยัง
            const user = await Registration.findOne({ where: { email } });
            if (user) {
                throw new Error('Email already in use.');
            }
            return true;
        }),
    body('GID')
        .matches(/^[A-Z]\d{2,}$/).withMessage('GID must start with an uppercase letter followed by at least 2 digits.').bail()
        .custom(async (GID) => {
            const user = await Registration.findOne({ where: { GID } });
            if (user) {
                throw new Error('GID already in use.');
            }
            return true;
        }),
    body('globalName')
        .notEmpty().withMessage('Global name is required.').bail()
        .custom(async (globalName) => {
            const user = await Registration.findOne({ where: { globalName } });
            if (user) {
                throw new Error('Global name already in use.');
            }
            return true;
        }),
    body('confirmPassword')
        .notEmpty().withMessage('Confirm password is required.').bail()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match.');
            }
            return true;
        }),
    body('password')
        .notEmpty().withMessage('Password is required.').bail()
        .isLength({ min: 5 }).withMessage('Email must be at least 5 characters long.').bail()
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.').bail()
        // .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.').bail()
        .matches(/[0-9]/).withMessage('Password must contain at least one number.')
    // .matches(/[\W_]/).withMessage('Password must contain at least one special character (e.g., !@#$%^&*).')
], async (req, res) => {
    const { token, GID, globalName, email, password } = req.body;
    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).json({ errors: errors.array() }); // ส่งข้อผิดพลาดกลับ
    }

    try {

        // ตรวจสอบว่า token มีในฐานข้อมูลและยังไม่หมดอายุ
        // const tokenData = await Token.findOne({
        //     where: { token, expiresAt: { [Op.gt]: new Date() } },
        // });

        // if (!tokenData) {
        //     return res.status(400).json({ success: false, message: 'Invalid or expired token.' });
        // }

        // ตรวจสอบว่า token มีในฐานข้อมูล
        const tokenEntry = await Token.findOne({
            where: { token },
        });

        if (!tokenEntry) {
            return res.status(400).json({ tokenCheck: "token not found", success: false, message: 'Invalid or expired token.' });
        }


        // ตรวจสอบวันหมดอายุของ token
        if (new Date() > tokenEntry.expiresAt) {
            return { success: false, message: 'Token expired' };
        }

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
            roleId: 2,
        });

        // Save the user to the database
        await newUser.save();

        const newUserProfile = new User({
            registrationId: newUser.id
        });

        await newUserProfile.save();

        // ลบ token หลังจากใช้สำเร็จ
        await Token.destroy({
            where: {
                token: token,
            },
        });

        // สร้าง Access Token (เก็บ role เข้าไปใน token ด้วย)
        const accessToken = jwt.sign(
            { userEmail: newUser.email, role: 'Admin' }, // role อยู่ใน payload
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
            secure: node_env === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 นาที
        });

        // เก็บ Refresh Token ใน httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: node_env === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 วัน
        });

        // ถ้า token ถูกต้อง, ส่งผลตอบกลับว่าการยืนยันสำเร็จ
        // return res.status(200).json({ success: true, email: tokenEntry.email });
        res.status(201).json({ message: 'User registered successfully', role: 'Admin' });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/seller_register', [
    body('email')
        .notEmpty().withMessage('Email is required.').bail()
        .isEmail().withMessage('Invalid email address.').bail()
        .custom(async (email) => {  // เช็คว่าอีเมลนี้มีในระบบหรือยัง
            const user = await Registration.findOne({ where: { email } });
            if (user) {
                throw new Error('Email already in use.');
            }
            return true;
        }),
    body('GID')
        .matches(/^[A-Z]\d{2,}$/).withMessage('GID must start with an uppercase letter followed by at least 2 digits.').bail()
        .custom(async (GID) => {
            const user = await Registration.findOne({ where: { GID } });
            if (user) {
                throw new Error('GID already in use.');
            }
            return true;
        }),
    body('globalName')
        .notEmpty().withMessage('Global name is required.').bail()
        .custom(async (globalName) => {
            const user = await Registration.findOne({ where: { globalName } });
            if (user) {
                throw new Error('Global name already in use.');
            }
            return true;
        }),
    body('confirmPassword')
        .notEmpty().withMessage('Confirm password is required.').bail()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match.');
            }
            return true;
        }),
    body('password')
        .notEmpty().withMessage('Password is required.').bail()
        .isLength({ min: 5 }).withMessage('Email must be at least 5 characters long.').bail()
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.').bail()
        // .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.').bail()
        .matches(/[0-9]/).withMessage('Password must contain at least one number.')
    // .matches(/[\W_]/).withMessage('Password must contain at least one special character (e.g., !@#$%^&*).')
], async (req, res) => {
    const { token, GID, globalName, email, password } = req.body;
    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).json({ errors: errors.array() }); // ส่งข้อผิดพลาดกลับ
    }

    try {

        // ตรวจสอบว่า token มีในฐานข้อมูล
        const tokenEntry = await Token.findOne({
            where: { token },
        });

        if (!tokenEntry) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token.' });
        }


        // ตรวจสอบวันหมดอายุของ token
        if (new Date() > tokenEntry.expiresAt) {
            return { success: false, message: 'Token expired' };
        }

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
            roleId: 3,
        });

        // Save the user to the database
        await newUser.save();

        const newUserProfile = new User({
            registrationId: newUser.id
        });

        await newUserProfile.save();

        // ลบ token หลังจากใช้สำเร็จ
        await Token.destroy({
            where: {
                token: token,
            },
        });

        // สร้าง Access Token (เก็บ role เข้าไปใน token ด้วย)
        const accessToken = jwt.sign(
            { userEmail: newUser.email, role: 'Seller' },
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
            secure: node_env === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 นาที
        });

        // เก็บ Refresh Token ใน httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: node_env === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 วัน
        });

        // ถ้า token ถูกต้อง, ส่งผลตอบกลับว่าการยืนยันสำเร็จ
        // return res.status(200).json({ success: true, email: tokenEntry.email });
        res.status(201).json({ message: 'User registered successfully', role: 'Seller' });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Login route
router.post('/login', [
    body('email')
        .notEmpty().withMessage('Email is required.').bail()
        .isEmail().withMessage('Invalid email address.').bail()
        .custom(async (password, { req }) => {
            const user = await Registration.findOne({ where: { email: req.body.email } });
            if (!user) {
                throw new Error('Invalid email.');
            }
            return true;
        }),
    body('password')
        .notEmpty().withMessage('Password is required.').bail()
        .isLength({ min: 5 }).withMessage('Email must be at least 5 characters long.').bail()
        .custom(async (password, { req }) => {
            const user = await Registration.findOne({ where: { email: req.body.email } });
            if (user) {
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    throw new Error('Invalid password.');
                }
            }
            return true; // ถ้าตรง
        }),
], async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const user = await Registration.findOne({ where: { email } });

        if (!user) {
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
            secure: node_env === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 นาที
        });

        // เก็บ Refresh Token ใน httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: node_env === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 วัน
        });

        res.status(201).json({ message: 'Login successful', role: role.name });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/change_password', authenticateToken, [
    body('confirmNewPassword')
        .notEmpty().withMessage('Confirm password is required.').bail()
        .custom((confirmNewPassword, { req }) => {
            if (confirmNewPassword !== req.body.newPassword) {
                throw new Error('Passwords do not match.');
            }
            return true;
        }),
    body('oldPassword')
        .notEmpty().withMessage('Old password is required.').bail()
        .custom(async (oldPassword, { req }) => {
            const email = req.user.userEmail;
            
            const user = await Registration.findOne({ where: { email } });
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                throw new Error('Old passwords is invalid.');
            }
            return true;
        }),
    body('newPassword')
        .notEmpty().withMessage('Password is required.').bail()
        .isLength({ min: 5 }).withMessage('Email must be at least 5 characters long.').bail()
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.').bail()
        // .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.').bail()
        .matches(/[0-9]/).withMessage('Password must contain at least one number.')
    // .matches(/[\W_]/).withMessage('Password must contain at least one special character (e.g., !@#$%^&*).')
], async (req, res) => {
    const { newPassword } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // ส่งข้อผิดพลาดกลับ
    }


    try {

        // Hash the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await Registration.findOne({ where: { email: req.user.userEmail } });

        if (!user){
            return res.status(400).json({ message: 'User not found' });
        }

        user.password = hashedPassword;

        await user.save();

        res.status(201).json({ message: 'Change password successfully' });

    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/check_auth', authenticateToken, (req, res) => {
    res.status(200).json({ isLoggedIn: true, user: req.user });
});

router.post('/logout', (req, res) => {
    // ลบ cookie ที่เก็บ access token และ refresh token
    res.clearCookie('accessToken', { httpOnly: true, secure: node_env === 'production' });
    res.clearCookie('refreshToken', { httpOnly: true, secure: node_env === 'production' });

    res.status(200).json({ message: 'Logged out successfully' });
});

router.post('/request_token', async (req, res) => {
    const { email } = req.body;
    try {
        // ดึง token จากฐานข้อมูลหรือเซสชันที่เก็บไว้ก่อนหน้า
        const tokenData = await Token.findOne({
            where: { email },
            order: [['created_at', 'DESC']], // เรียงลำดับตามวันที่สร้าง (ล่าสุดไปเก่าสุด)
        });

        if (!tokenData) {
            return res.status(400).json({ message: 'Token not found' });
        }

        res.status(200).json({ token: tokenData.token });
    } catch (error) {
        console.error('Error retrieving token:', error);
        res.status(500).json({ message: 'Failed to retrieve token.' });
    }
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

