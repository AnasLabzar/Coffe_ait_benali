const jwt = require('jsonwebtoken');

module.exports = {
  // Regular authentication
  authenticate: (roles = []) => {
    return (req, res, next) => {
      const token = req.header('x-auth-token');
      
      if (!token) {
        return res.status(401).json({ msg: 'Authorization token required' });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.employee = decoded.employee;

        if (roles.length && !roles.includes(decoded.employee.role)) {
          return res.status(403).json({ msg: 'Insufficient permissions' });
        }

        next();
      } catch (err) {
        res.status(401).json({ 
          msg: 'Invalid token',
          solution: 'Please login again to get a new token',
          error: err.message 
        });
      }
    };
  },

  // Special setup check middleware
  checkSetup: async (req, res, next) => {
    try {
      const adminExists = await Employee.findOne({ role: 'Admin' });
      if (!adminExists) {
        return res.status(412).json({ 
          msg: 'System not initialized',
          action: 'POST /api/employees/initial-setup'
        });
      }
      next();
    } catch (err) {
      res.status(500).json({ msg: 'Setup check failed' });
    }
  }
};