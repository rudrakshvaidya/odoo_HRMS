const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize'); // Sequelize operators
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Helper: Generate Random Password
const generatePassword = () => {
  return Math.random().toString(36).slice(-8); // 8 character random string
};

// CREATE EMPLOYEE (Protected Route)
router.post('/create', authMiddleware, async (req, res) => {
  try {
    // 1. Check Permissions (Only Admin/HR)
    if (req.user.role !== 'Admin' && req.user.role !== 'HR') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const { firstName, lastName, email, phone, role } = req.body;
    const creatorId = req.user.id;

    // 2. Fetch Creator's Info (to get Company Name)
    const adminUser = await User.findByPk(creatorId);
    if (!adminUser) return res.status(404).json({ message: 'Admin not found' });

    const companyPrefix = adminUser.companyName.substring(0, 2).toUpperCase();

    // 3. Generate ID Parts
    // Part 1: Company Initials (First 2 letters of Admin's Company)
    // Part 2: Name Initials (First 2 letters of First & Last Name)
    const nameInitials = (firstName.substring(0, 2) + lastName.substring(0, 2)).toUpperCase();
    
    // Part 3: Year
    const currentYear = new Date().getFullYear();

    // Part 4: Serial Number (Count employees joined this year + 1)
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);
    
    const count = await User.count({
      where: {
        createdAt: {
          [Op.between]: [startOfYear, endOfYear]
        }
      }
    });
    
    // Pad with zeros (e.g., 1 -> "0001")
    const serial = (count + 1).toString().padStart(4, '0');

    // Final ID: OIJODO20230001
    const generatedEmployeeId = `${companyPrefix}${nameInitials}${currentYear}${serial}`;

    // 4. Generate & Hash Password
    const plainPassword = generatePassword();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // 5. Create User
    const newEmployee = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber: phone,
      password: hashedPassword,
      employeeId: generatedEmployeeId,
      companyName: adminUser.companyName, // Inherit company name
      role: role || 'Employee'
    });

    // 6. Return Credentials (Important! This is the only time plain password is shown)
    res.status(201).json({ 
      message: 'Employee created successfully',
      credentials: {
        employeeId: generatedEmployeeId,
        password: plainPassword, // Admin must copy this!
        email: email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Fetch all users but hide sensitive data like passwords
    const employees = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'role', 'companyName', 'currentStatus', 'email']
    });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// TOGGLE ATTENDANCE STATUS (Check In / Check Out)
router.put('/status', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Toggle logic: If Checked Out -> Present. If Present -> Checked Out.
    const newStatus = user.currentStatus === 'Present' ? 'Checked Out' : 'Present';
    
    user.currentStatus = newStatus;
    await user.save();

    res.json({ status: newStatus });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;