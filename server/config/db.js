const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create a new Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS, 
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // Set to console.log to see raw SQL queries
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Connected');
    // Sync models with database (creates tables if they don't exist)
    await sequelize.sync(); 
    console.log('✅ Models Synced');
  } catch (error) {
    console.error('❌ MySQL Connection Error:', error);
  }
};

module.exports = { sequelize, connectDB };