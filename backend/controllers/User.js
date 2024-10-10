const { authenticateToken, authorizeRole } = require('../middleware/AuthenticateJWT');
const { Registration } = require('../models/UserLogin');  // Import User model
const express = require('express');
const router = express.Router();

router.get('/profile', authenticateToken, authorizeRole(['Super Admin', 'Seller']), async (req, res) => {
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

module.exports = router;
