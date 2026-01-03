const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Attendance = sequelize.define('Attendance', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' }
  },
  date: { type: DataTypes.DATEONLY, allowNull: false }, // e.g. 2023-10-22
  checkInTime: { type: DataTypes.TIME, allowNull: true },
  checkOutTime: { type: DataTypes.TIME, allowNull: true },
  workHours: { type: DataTypes.FLOAT, defaultValue: 0 }, // Store as hours (e.g. 8.5)
  status: { type: DataTypes.ENUM('Present', 'Absent', 'Leave'), defaultValue: 'Present' }
}, {
  timestamps: true
});

module.exports = Attendance;