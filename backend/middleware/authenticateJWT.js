const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwt_secret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const token = req.cookies.accessToken; // ดึง access token จาก cookie

    console.log("token from cookie: ", token);
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

// const loginVerify = (req, res, next) => {
//     // const token = req.headers['authorization'];
//     const token = req.headers['authorization']?.split(' ')[1];
//     console.log(token);

//     if (!token) {
//         console.log("Don't have token");
//         return res.sendStatus(403);
//     }

//     if (token) {
//         jwt.verify(token, secretKey, (err, user) => {
//             if (err) {
//                 console.log(err);
//                 return res.sendStatus(403); // Forbidden
//             }
//             req.user = user; // เก็บข้อมูลผู้ใช้ใน req.user
//             next(); // ไปยัง middleware ถัดไป
//         });
//     } else {
//         res.sendStatus(401); // Unauthorized
//     }
// };



module.exports = {
    authorizeRole,
    authenticateToken,
};
