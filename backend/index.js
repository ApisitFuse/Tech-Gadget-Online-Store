const express = require("express");
const cors = require("cors");
const db = require("./config/database");
const User = require("./models/User");
const port = 8000;

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // ที่อยู่ของ frontend
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

const seedUsers = async () => {
  await User.bulkCreate([
    { username: 'john_doe', email: 'john@example.com', password: 'password123' },
    { username: 'jane_doe', email: 'jane@example.com', password: 'password456' },
  ]);
  console.log('Seed data inserted successfully!');
};

db.sync({ force: true, schema: 'tech_gadget_online_store' }) // force: true จะทำให้สร้าง tables ใหม่และลบข้อมูลเก่าทั้งหมด
  .then(() => {
    console.log("Tables created successfully!");
    return seedUsers(); // เซ็ตข้อมูลเริ่มต้นหลังจากสร้าง table
  })
  .catch((err) => {
    console.error("Error creating tables: ", err);
  });

db.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log("PostgreSQL connected: ", res.rows);
  }
});


// app.get('/', (req, res) => {
//   res.send('Hello, Express.js!');
// });

app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// API เพื่อดึงข้อมูล Users
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll(); // ดึงข้อมูลผู้ใช้ทั้งหมด
    res.json(users); // ส่งข้อมูลกลับเป็น JSON
  } catch (err) {
    console.error("Error fetching users: ", err);
    res.status(500).json({ error: 'An error occurred while fetching users.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
