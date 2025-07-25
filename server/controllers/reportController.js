const Report = require('../models/Report');
const Order = require('../models/Order');
const Finance = require('../models/Finance');

// @desc    Generate daily report
// @route   POST /api/reports/daily
// @access  Gerant+
exports.generateDailyReport = async (req, res) => {
  try {
    const { date } = req.body;
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lt: endDate }
    });
    
    // Calculate report data
    const reportData = {
      totalVentes: 0,
      parProduit: {},
      parEmploye: {},
      parMoyenPaiement: {}
    };
    
    orders.forEach(order => {
      reportData.totalVentes += order.total;
      
      // Group by product
      order.items.forEach(item => {
        if (!reportData.parProduit[item.productName]) {
          reportData.parProduit[item.productName] = {
            nomProduit: item.productName,
            prix: item.price,
            quantite: 0,
            total: 0
          };
        }
        reportData.parProduit[item.productName].quantite += item.quantity;
        reportData.parProduit[item.productName].total += item.total;
      });
      
      // Group by employee
      if (!reportData.parEmploye[order.employeeName]) {
        reportData.parEmploye[order.employeeName] = {
          employeeId: order.employee,
          employeeName: order.employeeName,
          totalVentes: 0
        };
      }
      reportData.parEmploye[order.employeeName].totalVentes += order.total;
      
      // Group by payment method
      if (!reportData.parMoyenPaiement[order.paymentMethod]) {
        reportData.parMoyenPaiement[order.paymentMethod] = {
          method: order.paymentMethod,
          total: 0
        };
      }
      reportData.parMoyenPaiement[order.paymentMethod].total += order.total;
    });
    
    // Create and save report
    const report = new Report({
      type: 'daily',
      dateDebut: startDate,
      dateFin: endDate,
      totalVentes: reportData.totalVentes,
      parProduit: Object.values(reportData.parProduit),
      parEmploye: Object.values(reportData.parEmploye),
      parMoyenPaiement: Object.values(reportData.parMoyenPaiement)
    });
    
    await report.save();
    
    res.json(report);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Gerant+

exports.getReportById = async (req, res) => {
    try {
      // Validate if ID is a valid MongoDB ID
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: 'Invalid report ID format' });
      }
  
      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({ msg: 'Report not found' });
      }
      res.json(report);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };

// @desc    Get reports by date range
// @route   GET /api/reports
// @access  Gerant+
exports.getReportsByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const reports = await Report.find({
      dateDebut: { $gte: new Date(startDate) },
      dateFin: { $lte: new Date(endDate) }
    }).sort({ dateDebut: -1 });
    
    res.json(reports);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};