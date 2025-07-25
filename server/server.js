const express = require('express');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.set('strictQuery', true);
mongoose.set('autoIndex', false);

// Routes
app.use('/api/auth', require('./routes/employeeRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/finance', require('./routes/financeRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));