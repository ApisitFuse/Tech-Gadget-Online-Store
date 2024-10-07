const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const loginVerify = (req, res, next) => {
    // const token = req.headers['authorization'];
    const token = req.headers['authorization']?.split(' ')[1];
    console.log(token);

    if (!token) {
        console.log("Don't have token");
        return res.sendStatus(403);
    }

    if (token) {
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                console.log(err);
                return res.sendStatus(403); // Forbidden
            }
            req.user = user; // เก็บข้อมูลผู้ใช้ใน req.user
            next(); // ไปยัง middleware ถัดไป
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
};

module.exports = {
    loginVerify,
};
