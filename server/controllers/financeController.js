const Finance = require('../models/Finance');
const Order = require('../models/Order');
const Payment = require('../models/Payment');

// @desc    Generate financial report
// @route   POST /api/finance/generate
// @access  Admin/Gerant
exports.generateFinancialReport = async (req, res) => {
  try {
    const { period, startDate, endDate } = req.body;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Get orders in period
    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end }
    });
    
    // Get payments in period
    const payments = await Payment.find({
      periodStart: { $gte: start },
      periodEnd: { $lte: end },
      status: 'paid'
    });
    
    // Calculate totals
    const totalOrders = orders.length;
    const totalOrderAmount = orders.reduce((sum, order) => sum + order.total, 0);
    const totalSalaries = payments.reduce((sum, payment) => sum + payment.totalAmount, 0);
    
    // For simplicity - in real app you'd have an Expense model
    const totalExpenses = totalOrderAmount * 0.3; // 30% estimated expenses
    
    const netProfit = totalOrderAmount - totalSalaries - totalExpenses;
    
    // Create finance record
    const finance = new Finance({
      period,
      startDate: start,
      endDate: end,
      totalOrders,
      totalOrderAmount,
      totalSalaries,
      totalExpenses,
      netProfit
    });
    
    await finance.save();
    
    res.json(finance);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get financial reports
// @route   GET /api/finance
// @access  Admin/Gerant
exports.getFinancialReports = async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;
    
    const query = {};
    if (period) query.period = period;
    if (startDate && endDate) {
      query.startDate = { $gte: new Date(startDate) };
      query.endDate = { $lte: new Date(endDate) };
    }
    
    const reports = await Finance.find(query).sort({ startDate: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get net benefit
// @route   GET /api/finance/net-benefit
// @access  Admin/Gerant
exports.getNetBenefit = async (req, res) => {
    try {
      const { period } = req.query;
      
      // Get most recent finance report for the period
      const report = await Finance.findOne({ period })
        .sort({ startDate: -1 })
        .limit(1);
      
      if (!report) {
        return res.status(404).json({ msg: 'No financial report found for this period' });
      }
      
      res.json({
        period: report.period,
        startDate: report.startDate,
        endDate: report.endDate,
        netProfit: report.netProfit
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };