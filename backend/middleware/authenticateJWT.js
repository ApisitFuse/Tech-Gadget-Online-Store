const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwt_secret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json({ message: 'Access Token required' });

    jwt.verify(token, jwt_secret, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid Access Token' });

        req.user = decoded;
        console.log("req.user: ", req.user); // ข้อมูล user จะถูก decode จาก token
        next();
    });
};

const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role; // ดึง role จาก req.user
        // ตรวจสอบว่า userRole มีอยู่ใน allowedRoles หรือไม่
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Access denied' }); // ไม่อนุญาตให้เข้าถึง
        }
        next(); // อนุญาตให้ผ่านไปยัง route ถัดไป
    };
};


module.exports = {
    authorizeRole,
    authenticateToken,
};
