const { User } = require('../models/UserLogin');

// สร้างผู้ใช้งานใหม่
// exports.createUser = async (req, res) => {
//   try {
//     const { profileImage, firstName, middleName, lastName, genderId, registrationId } = req.body;
//     const user = await User.create({ profileImage, firstName, middleName, lastName, genderId, registrationId });
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // ดึงข้อมูลผู้ใช้ทั้งหมด
// exports.getUsers = async (req, res) => {
//   try {
//     const users = await User.findAll();
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };