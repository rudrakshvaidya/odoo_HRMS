const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Salary = sequelize.define('Salary', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' } // Link to User
  },
  baseSalary: { type: DataTypes.FLOAT, defaultValue: 0 },
  hra: { type: DataTypes.FLOAT, defaultValue: 0 },
  transportAllowance: { type: DataTypes.FLOAT, defaultValue: 0 },
  providentFund: { type: DataTypes.FLOAT, defaultValue: 0 },
  professionalTax: { type: DataTypes.FLOAT, defaultValue: 0 },
  netSalary: { type: DataTypes.FLOAT, defaultValue: 0 }
}, {
  timestamps: true
});

module.exports = Salary;