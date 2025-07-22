const Employee = require('../models/Employee');

exports.createInitialAdmin = async (req, res) => {
  try {
    // Check if any admin exists
    const adminExists = await Employee.findOne({ role: 'Admin' });
    if (adminExists) {
      return res.status(403).json({ 
        msg: 'Initial setup already completed' 
      });
    }

    // Create first admin
    const admin = new Employee({
      pin: '9999', // Default admin PIN
      fullName: 'System Administrator',
      role: 'Admin',
      prixJour: 0,
      isActive: true
    });

    await admin.save();

    res.status(201).json({
      msg: 'Initial admin created successfully',
      pin: admin.pin // Only show PIN during initial setup
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error during setup' });
  }
};

// @desc    Create employee with PIN
// @route   POST /api/employees
// @access  Admin/Gerant
exports.createEmployee = async (req, res) => {
  const { pin, fullName, role, prixJour } = req.body;

  try {
    // Check if PIN exists
    const existingEmployee = await Employee.findOne({ pin });
    if (existingEmployee) {
      return res.status(400).json({ msg: 'PIN already in use' });
    }

    const employee = new Employee({
      pin,
      fullName,
      role,
      prixJour: prixJour || 0
    });

    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Admin/Gerant
exports.updateEmployee = async (req, res) => {
  const { pin, fullName, role, prixJour, isActive } = req.body;

  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    // Check if new PIN is available
    if (pin && pin !== employee.pin) {
      const pinExists = await Employee.findOne({ pin });
      if (pinExists) {
        return res.status(400).json({ msg: 'PIN already in use' });
      }
      employee.pin = pin;
    }

    if (fullName) employee.fullName = fullName;
    if (role) employee.role = role;
    if (prixJour !== undefined) employee.prixJour = prixJour;
    if (isActive !== undefined) employee.isActive = isActive;

    await employee.save();
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Admin/Gerant
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select('-__v');
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Admin
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    res.json({ msg: 'Employee removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};