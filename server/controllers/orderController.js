const Order = require('../models/Order');
const Product = require('../models/Product');
const Employee = require('../models/Employee');
const Client = require('../models/Client');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Employee+
exports.createOrder = async (req, res) => {
  try {
    const { employeeId, tableNumber, items, paymentMethod, clientId } = req.body;

    // Validate employee
    const employee = await Employee.findById(employeeId);
    if (!employee || !employee.isActive) {
      return res.status(400).json({ msg: 'Invalid employee' });
    }

    let subtotal = 0;
    const orderItems = [];
    const stockUpdates = [];

    // Process each item in the order
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ msg: `Product not found: ${item.productId}` });
      }

      if (product.type !== 'local') {
        return res.status(400).json({
          msg: `Only local products can be ordered: ${product.nomLocal}`
        });
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        return res.status(400).json({
          msg: `Insufficient stock for ${product.nomLocal}`,
          available: product.stock
        });
      }

      const price = item.price || product.prixMatin;
      const itemTotal = price * item.quantity;

      orderItems.push({
        product: product._id,
        productName: product.nomLocal,
        price,
        quantity: item.quantity,
        total: itemTotal
      });

      subtotal += itemTotal;
      stockUpdates.push({ productId: product._id, quantity: item.quantity });
    }

    // Calculate total
    const total = subtotal;

    // Create the order object first
    const orderData = {
      employee: employee._id,
      employeeName: employee.fullName,
      tableNumber,
      items: orderItems,
      subtotal,
      total,
      paymentMethod: paymentMethod || 'Espèce',
      isPaid: true
    };

    // Handle client if provided
    let loyaltyPointsEarned = 0;
    if (clientId) {
      const client = await Client.findById(clientId);
      if (!client) {
        return res.status(404).json({ msg: 'Client not found' });
      }

      // Add client reference to order
      orderData.client = clientId;

      // Calculate loyalty points
      loyaltyPointsEarned = Math.floor(total / 10);
    }

    // Create the order FIRST
    const order = new Order({
      employee: employee._id,
      employeeName: employee.fullName,
      tableNumber,
      items: orderItems,
      subtotal,
      total,
      paymentMethod: paymentMethod || 'Espèce',
      isPaid: true
    });

    const savedOrder = await order.save();

    // Update product stock
    for (const update of stockUpdates) {
      await Product.findByIdAndUpdate(
        update.productId,
        { $inc: { stock: -update.quantity } }
      );
    }

    // THEN handle client if provided
    if (clientId) {
      const client = await Client.findById(clientId);
      if (!client) {
        return res.status(404).json({ msg: 'Client not found' });
      }
      
      // Add client reference to order
      order.client = clientId;
      
      // Add loyalty points (1 point per 10 DH)
      const pointsEarned = Math.floor(total / 10);
      client.pointsFidelite += pointsEarned;
      client.derniereVisite = new Date();
      await client.save();
    }

    // Now save the order
    await order.save();

    // Prepare response
    const response = savedOrder.toObject();
    if (clientId) {
      response.loyaltyPointsEarned = loyaltyPointsEarned;
    }

    res.status(201).json(response);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin/Gerant
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get orders by date range
// @route   GET /api/orders/date
// @access  Gerant+
exports.getOrdersByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const orders = await Order.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Employee+
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Admin
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    await order.remove();
    res.json({ msg: 'Order removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};