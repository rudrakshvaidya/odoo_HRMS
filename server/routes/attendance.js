const express = require('express');
const { Op } = require('sequelize');
const authMiddleware = require('../middleware/authMiddleware');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

const router = express.Router();

// 1. TOGGLE ATTENDANCE (Check In / Check Out)
router.post('/toggle', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toLocaleTimeString('en-US', { hour12: false }); // "14:30:00"

    // Find if record exists for TODAY
    let record = await Attendance.findOne({ where: { userId, date: today } });
    const user = await User.findByPk(userId);

    if (!record) {
      // Logic: CHECK IN
      record = await Attendance.create({
        userId,
        date: today,
        checkInTime: now,
        status: 'Present'
      });
      user.currentStatus = 'Present';
      await user.save();
      return res.json({ message: 'Checked In', status: 'Present' });
    } else {
      // Logic: CHECK OUT
      if (record.checkOutTime) {
         return res.status(400).json({ message: 'Already checked out for today' });
      }
      
      record.checkOutTime = now;
      
      // Calculate Work Hours (Simple diff)
      const [h1, m1] = record.checkInTime.split(':');
      const [h2, m2] = now.split(':');
      const start = new Date(0, 0, 0, h1, m1, 0);
      const end = new Date(0, 0, 0, h2, m2, 0);
      const hours = (end - start) / 1000 / 60 / 60; // Convert ms to hours
      
      record.workHours = hours.toFixed(2);
      await record.save();

      user.currentStatus = 'Checked Out';
      await user.save();
      return res.json({ message: 'Checked Out', status: 'Checked Out' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 2. GET MY ATTENDANCE (For Employee View)
router.get('/my-history', authMiddleware, async (req, res) => {
  try {
    const history = await Attendance.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']]
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching history' });
  }
});

// 3. GET ALL ATTENDANCE (For Admin View - By Date)
router.get('/daily-log', authMiddleware, async (req, res) => {
    try {
      const { date } = req.query; // ?date=2023-10-22
      
      const logs = await Attendance.findAll({
        where: { date: date },
        include: [{ model: User, attributes: ['firstName', 'lastName', 'employeeId'] }]
      });
      res.json(logs);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching logs' });
    }
  });

module.exports = router;