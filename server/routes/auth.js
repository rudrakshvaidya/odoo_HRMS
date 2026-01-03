const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// 1. REGISTER
router.post('/signup', async (req, res) => {
  try {
    const { fullname, employeeId, email, password, role } = req.body;

    // FIX: Added 'where' clause
    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      fullname,
      employeeId,
      email,
      password: hashedPassword,
      role: role || 'Employee'
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    if (err.name === 'SequelizeUniqueConstraintError') {
       return res.status(400).json({ message: 'User already exists (Email or Employee ID taken)' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // FIX: Added 'where' clause
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.id, fullname: user.fullname, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;