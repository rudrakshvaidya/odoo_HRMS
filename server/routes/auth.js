const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// 1. COMPANY REGISTRATION (Admin Signup)
router.post('/signup', async (req, res) => {
  try {
    // New fields based on wireframe
    const { companyName, firstName, lastName, email, phone, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Admin User
    await User.create({
      companyName,
      firstName,
      lastName,
      email,
      phoneNumber: phone,
      password: hashedPassword,
      role: 'Admin', // Force role to Admin for public signup
      employeeId: null // Admins login via Email for now
    });

    res.status(201).json({ message: 'Company registered successfully. Please Login.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find User
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate Token
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        fullname: user.fullname, 
        email: user.email, 
        role: user.role 
      } 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;