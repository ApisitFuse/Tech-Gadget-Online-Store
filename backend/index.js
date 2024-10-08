const express = require("express");
const cors = require("cors");
const sequelize = require("./config/Database");
const { User, Role, Delivery_status, Address, Gender, Registration, Status } = require("./models/UserLogin");
const { Product, Category, Promotion_type, Promotion, ProductPromotion, CategoryProduct } = require("./models/Product");
const { Cart } = require("./models/Shopping");
const { Wishlist } = require("./models/Wishlist");
const { Payment, Receipt, Payment_method, User_history } = require("./models/Payment");
const { Review } = require("./models/Review");
const { Order } = require("./models/Admin");
const { Search, Recomment } = require("./models/RecommentSearch");
const authRoutes = require('./controllers/Authenticate');
const userRoutes = require('./controllers/User');
const seedData = require('./seedData/Seed');
// const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require("dotenv").config();

const app = express();
const HOST = process.env.BN_HOST;
const B_PORT = process.env.BN_PORT;
const F_PORT = process.env.FN_PORT;

// JSON to JavaScript object
app.use(express.json());
app.use(cookieParser());

// CORS setup
app.use(
  cors({
    origin: `http://${HOST}:${F_PORT}`, // ที่อยู่ของ frontend
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
// app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
// Middleware ให้บริการไฟล์จากโฟลเดอร์ uploads
app.use('/uploads', express.static('uploads'));

// API เพื่อดึงข้อมูล Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll(); // ดึงข้อมูลผู้ใช้ทั้งหมด
    res.json(users); // ส่งข้อมูลกลับเป็น JSON
  } catch (err) {
    console.error("Error fetching users: ", err);
    res.status(500).json({ error: 'An error occurred while fetching users.' });
  }
});

// เชื่อมต่อกับฐานข้อมูลและเริ่มเซิร์ฟเวอร์
const startServer = async () => {
  try {
    // สร้าง schema หากยังไม่มีอยู่
    await sequelize.query('CREATE SCHEMA IF NOT EXISTS tech_gadget_online_store;');

    // Sync กับฐานข้อมูล (สร้างตารางถ้ายังไม่มี) และระบุ schema
    await sequelize.sync({ force: true, schema: 'tech_gadget_online_store' }); //force: true จะสร้างทับถ้ามี
    console.log('Database connected successfully.');


    // Seed ข้อมูลครั้งแรกหลังจากสร้างตาราง
    await seedData();

    // app.listen(port, () => {
    //   console.log(`Server is running on http://localhost:${port}`);
    // });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// เริ่มเซิร์ฟ เกี่ยวกับการสร้างตาราง
// startServer();

app.listen(B_PORT, () => {
  console.log(`Server is running on http://localhost:${B_PORT}`);
});

// const express = require("express");
// const cors = require("cors");
// const db = require("./config/database");
// const User = require("./models/User");
// const port = 8000;

// const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:3000", // ที่อยู่ของ frontend
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true,
//   })
// );

// const seedUsers = async () => {
//   await User.bulkCreate([
//     { username: 'john_doe', email: 'john@example.com', password: 'password123' },
//     { username: 'jane_doe', email: 'jane@example.com', password: 'password456' },
//   ]);
//   console.log('Seed data inserted successfully!');
// };

// db.sync({ force: true, schema: 'tech_gadget_online_store' }) // force: true จะทำให้สร้าง tables ใหม่และลบข้อมูลเก่าทั้งหมด
//   .then(() => {
//     console.log("Tables created successfully!");
//     return seedUsers(); // เซ็ตข้อมูลเริ่มต้นหลังจากสร้าง table
//   })
//   .catch((err) => {
//     console.error("Error creating tables: ", err);
//   });

// db.query("SELECT NOW()", (err, res) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log("PostgreSQL connected: ", res.rows);
//   }
// });


// // app.get('/', (req, res) => {
// //   res.send('Hello, Express.js!');
// // });

// app.get("/api/data", (req, res) => {
//   res.json({ message: "Hello from backend!" });
// });

// // API เพื่อดึงข้อมูล Users
// app.get('/users', async (req, res) => {
//   try {
//     const users = await User.findAll(); // ดึงข้อมูลผู้ใช้ทั้งหมด
//     res.json(users); // ส่งข้อมูลกลับเป็น JSON
//   } catch (err) {
//     console.error("Error fetching users: ", err);
//     res.status(500).json({ error: 'An error occurred while fetching users.' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
