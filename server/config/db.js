const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // Clean terminal output
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Connected');
    await sequelize.sync(); // Creates tables automatically if they don't exist
    console.log('✅ Models Synced');
  } catch (error) {
    console.error('❌ MySQL Connection Error:', error);
  }
};

module.exports = { sequelize, connectDB };