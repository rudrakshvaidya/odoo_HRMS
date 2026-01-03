const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TimeOff = sequelize.define('TimeOff', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' }
  },
  leaveType: { 
    type: DataTypes.ENUM('Paid Time Off', 'Sick Leave', 'Unpaid Leave'), 
    allowNull: false 
  },
  startDate: { type: DataTypes.DATEONLY, allowNull: false },
  endDate: { type: DataTypes.DATEONLY, allowNull: false },
  reason: { type: DataTypes.STRING, allowNull: true },
  status: { 
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'), 
    defaultValue: 'Pending' 
  }
}, {
  timestamps: true
});

module.exports = TimeOff;