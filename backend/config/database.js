// const { Sequelize, DataTypes } = require('sequelize');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// สร้าง instance ของ Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: console.log,
});

// Export instance ของ Sequelize
module.exports = sequelize;
