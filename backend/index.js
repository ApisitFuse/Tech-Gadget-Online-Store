const express = require("express");
const app = express();
const cors = require("cors");
const port = 8000;

app.use(
  cors({
    origin: "http://localhost:3000", // ที่อยู่ของ frontend
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// app.get('/', (req, res) => {
//   res.send('Hello, Express.js!');
// });

app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
