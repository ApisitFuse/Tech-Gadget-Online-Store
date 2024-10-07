const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// สร้าง instance ของ Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: console.log,
});

// // ทดสอบการเชื่อมต่อ
// sequelize
//   .authenticate()
//   .then(() => console.log("Database connected..."))
//   .catch((err) => console.error("Error: ", err));

// sequelize
//   .query("CREATE SCHEMA IF NOT EXISTS tech_gadget_online_store")
//   .then(() => {
//     console.log("Schema created successfully!");
//   })
//   .catch((err) => {
//     console.error("Error creating schema: ", err);
//   });

// Export instance ของ Sequelize
module.exports = sequelize;
