const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Attendance = require('./models/Attendance');
const TimeOff = require('./models/TimeOff');

// 1. Import DB Connection
const { sequelize, connectDB } = require('./config/db');

// 2. Import Models
const User = require('./models/User');
const Salary = require('./models/Salary'); // <--- Ensure this is imported

const app = express();
app.use(express.json());
app.use(cors());

User.hasMany(TimeOff, { foreignKey: 'userId' });
TimeOff.belongsTo(User, { foreignKey: 'userId' });

// 3. DEFINE ASSOCIATIONS HERE (This fixes the circular error)
User.hasOne(Salary, { foreignKey: 'userId', onDelete: 'CASCADE' });
Salary.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Attendance, { foreignKey: 'userId' });
Attendance.belongsTo(User, { foreignKey: 'userId' });

// 4. Connect & Sync
connectDB();

// Change sync to { alter: true } temporarily to add the new tables/columns
sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Database & Tables Synced');
});

// ... Routes and App Listen logic below ...
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employee'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));