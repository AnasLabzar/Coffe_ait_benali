const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

// @desc    Authenticate with PIN
// @route   POST /api/auth/login
// @access  Public
exports.pinLogin = async (req, res) => {
  try {
    const employee = await Employee.findOne({ pin: req.body.pin, isActive: true });
    if (!employee) return res.status(401).json({ msg: 'Invalid PIN' });

    const payload = {
      employee: {
        id: employee.id,
        role: employee.role
      }
    };

    // Ensure consistent expiration time
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.json({ token, employee });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).send('Server error');
  }
};