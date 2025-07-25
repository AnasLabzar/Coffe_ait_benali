const Payment = require('../models/Payment');
const Employee = require('../models/Employee');

// @desc    Create payment record
// @route   POST /api/payments
// @access  Admin/Gerant
exports.createPayment = async (req, res) => {
  try {
    const { employeeId, periodStart, periodEnd, daysWorked, salaryRate, notes } = req.body;
    
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    
    const totalAmount = daysWorked * salaryRate;
    
    const payment = new Payment({
      employee: employeeId,
      employeeName: employee.fullName,
      periodStart: new Date(periodStart),
      periodEnd: new Date(periodEnd),
      daysWorked,
      salaryRate,
      totalAmount,
      notes
    });
    
    await payment.save();
    
    res.status(201).json(payment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update payment status
// @route   PUT /api/payments/:id/status
// @access  Admin/Gerant
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status, signatureEmployeur, signatureDirecteur } = req.body;
    
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }
    
    payment.status = status;
    if (signatureEmployeur) payment.signatureEmployeur = signatureEmployeur;
    if (signatureDirecteur) payment.signatureDirecteur = signatureDirecteur;
    
    await payment.save();
    
    res.json(payment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get payments by employee
// @route   GET /api/payments/employee/:id
// @access  Admin/Gerant
exports.getPaymentsByEmployee = async (req, res) => {
  try {
    const payments = await Payment.find({ employee: req.params.id }).sort({ periodStart: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get payments by date range
// @route   GET /api/payments
// @access  Admin/Gerant
exports.getPaymentsByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const payments = await Payment.find({
      periodStart: { $gte: new Date(startDate) },
      periodEnd: { $lte: new Date(endDate) }
    }).sort({ periodStart: -1 });
    
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};