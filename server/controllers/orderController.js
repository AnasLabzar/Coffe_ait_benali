const Order = require('../models/Order');
const Employee = require('../models/Employee');

// @desc    Create new order with employee PIN
// @route   POST /api/orders
// @access  Employee+
exports.createOrder = async (req, res) => {
  const { items, tableNumber, paymentMethod, employeePin } = req.body;

  try {
    // Find employee by PIN
    const employee = await Employee.findOne({ pin: employeePin });
    if (!employee || !employee.isActive) {
      return res.status(400).json({ msg: 'Invalid employee PIN' });
    }

    // Calculate total
    let total = 0;
    const orderItems = [];
    
    for (const item of items) {
      // In real implementation, fetch product price from DB
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      orderItems.push({
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
        total: itemTotal
      });
    }

    // Create order
    const order = new Order({
      employee: employee._id,
      items: orderItems,
      total,
      paymentMethod,
      tableNumber
    });

    await order.save();
    
    // Return simplified response for caisse
    res.status(201).json({
      success: true,
      orderId: order._id,
      total,
      employee: employee.fullName,
      timestamp: order.date
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};