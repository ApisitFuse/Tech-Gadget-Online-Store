const { authenticateToken, authorizeRole } = require('../middleware/AuthenticateJWT');
const { Registration, User } = require('../models/UserLogin');  // Import User model
const express = require('express');
const router = express.Router();

router.get('/profile', authenticateToken, authorizeRole(['Super Admin', 'Admin', 'Seller', 'Customer']), async (req, res) => {
    try {
        const user = await Registration.findOne({
            where: { email: req.user.userEmail } // ค้นหาผู้ใช้ตาม email ที่ได้จาก token
        });
        if (!user) {
            return res.sendStatus(404); // ผู้ใช้ไม่พบ
        }
        // res.json(user); // ส่งข้อมูลโปรไฟล์

        // ส่งข้อมูลโปรไฟล์พร้อม role
        res.json({
            GID: user.GID,
            globalName: user.globalName,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            role: req.user.role // role ถูกเก็บใน token
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.sendStatus(500); // ส่งสถานะ 500 หากเกิดข้อผิดพลาด
    }
});

router.get('/user_profile', authenticateToken, authorizeRole(['Super Admin', 'Admin', 'Seller', 'Customer']), async (req, res) => {

    try {
        const registration = await Registration.findOne({ where: { email: req.user.userEmail } });
        const user = await User.findOne({ where: { registrationId: registration.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            id: user.id,
            email: registration.email,
            profileImage: user.profileImage,
        });
        // res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
