const { Sequelize, DataTypes } = require('sequelize');

// สร้าง instance ของ Sequelize
const sequelize = new Sequelize("postgres", "NateRiver", "Alice1993_", {
  host: "localhost",
  dialect: "postgres",
});

// ทดสอบการเชื่อมต่อ
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.error("Error: ", err));

sequelize
  .query("CREATE SCHEMA IF NOT EXISTS tech_gadget_online_store")
  .then(() => {
    console.log("Schema created successfully!");
  })
  .catch((err) => {
    console.error("Error creating schema: ", err);
  });
// Export instance ของ Sequelize
module.exports = sequelize;
