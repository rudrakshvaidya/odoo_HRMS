const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const TimeOff = require('../models/TimeOff');
const User = require('../models/User');

const router = express.Router();

// 1. GET REQUESTS (Logic differs for Admin vs Employee)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { role, id } = req.user;
    
    let requests;
    if (role === 'Admin' || role === 'HR') {
      // Admin sees EVERYONE'S requests
      requests = await TimeOff.findAll({
        include: [{ model: User, attributes: ['firstName', 'lastName', 'employeeId'] }],
        order: [['createdAt', 'DESC']]
      });
    } else {
      // Employee sees ONLY THEIR OWN requests
      requests = await TimeOff.findAll({
        where: { userId: id },
        order: [['createdAt', 'DESC']]
      });
    }
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. CREATE NEW REQUEST
router.post('/request', authMiddleware, async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    await TimeOff.create({
      userId: req.user.id,
      leaveType,
      startDate,
      endDate,
      reason
    });
    res.status(201).json({ message: 'Leave requested successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating request' });
  }
});

// 3. UPDATE STATUS (Admin Only - Approve/Reject)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role !== 'HR') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { status } = req.body; // 'Approved' or 'Rejected'
    const request = await TimeOff.findByPk(req.params.id);
    
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = status;
    await request.save();

    res.json({ message: `Request ${status}`, request });
  } catch (err) {
    res.status(500).json({ message: 'Error updating status' });
  }
});

module.exports = router;