const multer = require("multer");
const { authenticateToken, authorizeRole } = require('../middleware/authenticateJWT');
const path = require("path");
const express = require('express');
const fs = require("fs/promises");
const router = express.Router();

// กำหนดโฟลเดอร์สำหรับเก็บรูปภาพ
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/product/"); // โฟลเดอร์สำหรับเก็บไฟล์
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//         cb(null, uniqueSuffix + path.extname(file.originalname)); // ตั้งชื่อไฟล์ใหม่
//     },
// });

// ตั้งค่าการจัดเก็บไฟล์ไว้ในหน่วยความจำ (RAM)
const storage = multer.memoryStorage();



// กำหนด middleware ของ Multer
const upload = multer({ storage: storage });

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 10 * 1024 * 1024 } // จำกัดขนาดไฟล์ที่ 10MB
// });

router.post("/upload_product_image", authenticateToken, authorizeRole(['Super Admin', 'Admin', 'Seller']), upload.single("image"), async (req, res) => {
    try {

        if (!req.file) {

            return res.status(400).json({ message: "No file uploaded" });
        }

        const originalName = path.parse(req.file.originalname).name; // ดึงเฉพาะชื่อไฟล์ (ไม่มีนามสกุล)

        // ดึง `customFileName` จาก `req.body`
        const customFileName = req.body.customFileName || originalName;

        // ตั้งค่าพาธและเซฟไฟล์เอง
        const uploadPath = path.resolve(process.cwd(), "uploads/product");
        await fs.mkdir(uploadPath, { recursive: true }); // สร้างโฟลเดอร์ถ้ายังไม่มี

        const fileExtension = path.extname(req.file.originalname).toLowerCase(); // ดึงนามสกุลไฟล์
        const baseName = customFileName.replace(fileExtension, ''); // ลบส่วนที่เป็นนามสกุลไฟล์เก่าออก
        const filePath = path.join(uploadPath, `${baseName}${fileExtension}`);

        // บันทึกไฟล์ลงดิสก์
        await fs.writeFile(filePath, req.file.buffer);

        return res.json({
            message: "File uploaded successfully!",
            filename: `${customFileName}${fileExtension}`,
            path: `/uploads/product/${customFileName}${fileExtension}`,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// API อัปโหลดรูปภาพ  (now)
// router.post("/upload_product_image", upload, async (req, res) => {
//     // ตรวจสอบว่าได้ไฟล์หรือไม่
//     if (!req.file) {
//         return res.status(400).json({ message: "No file uploaded" });
//     }

//     console.log("req.body: ", req.body); // ตรวจสอบข้อมูลที่ส่งมาจาก body
//     console.log("req.file: ", req.file); // ตรวจสอบข้อมูลไฟล์ที่ถูกอัปโหลด

//     try {
//         const filename = req.body.customFileName; // ชื่อไฟล์ที่ถูกตั้งขึ้นโดย multer
//         const imagePath = `/uploads/product/${filename}`; // เส้นทางที่ไฟล์ถูกอัปโหลดไป

//         // ส่งกลับข้อมูลใน response
//         res.json({ filename, path: imagePath });
//     } catch (error) {
//         console.error("Error saving image to database:", error);
//         res.status(500).json({ message: "Failed to upload image" });
//     }
// });

// // API อัปโหลดรูปภาพ
// router.post("/upload_product_image", authenticateToken, authorizeRole(['Super Admin', 'Admin', 'Seller']), upload.single("image"), (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ message: "No file uploaded" });
//     }
//     console.log("upload");
//     res.json({ filename: req.file.filename, path: `/uploads/product/${req.file.filename}` });
// });

module.exports = router;