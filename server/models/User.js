const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  // Split Name for ID Generation Logic (e.g. JODO)
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Admin/Company Fields
  companyName: {
    type: DataTypes.STRING,
    allowNull: true // Nullable because regular employees might not need to re-enter this
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Auth Fields
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // System Fields
  employeeId: {
    type: DataTypes.STRING,
    allowNull: true, // Admin might sign up with just email initially
    unique: true 
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Employee', 'HR'),
    defaultValue: 'Employee'
  },
  currentStatus: {
    type: DataTypes.ENUM('Present', 'Absent', 'On Leave', 'Checked Out'),
    defaultValue: 'Checked Out' // Default status
  },
  joiningDate: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true
});

module.exports = User;