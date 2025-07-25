const Client = require('../models/Client');

// @desc    Create a new client
// @route   POST /api/clients
// @access  Employee+
exports.createClient = async (req, res) => {
  try {
    const { nom, prenom, telephone, email, adresse } = req.body;
    
    // Check if client already exists
    const existingClient = await Client.findOne({ telephone });
    if (existingClient) {
      return res.status(400).json({ 
        msg: 'Client with this phone number already exists',
        existingClient
      });
    }

    const client = new Client({
      nom,
      prenom,
      telephone,
      email,
      adresse
    });

    await client.save();
    res.status(201).json(client);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Search clients by name or phone
// @route   GET /api/clients/search
// @access  Employee+
exports.searchClients = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ msg: 'Search query must be at least 2 characters' });
    }

    const clients = await Client.find({
      $or: [
        { nom: { $regex: query, $options: 'i' } },
        { prenom: { $regex: query, $options: 'i' } },
        { telephone: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);

    res.json(clients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update client information
// @route   PUT /api/clients/:id
// @access  Employee+
exports.updateClient = async (req, res) => {
  try {
    const { nom, prenom, telephone, email, adresse, pointsFidelite, notes } = req.body;
    
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ msg: 'Client not found' });
    }

    // Check if new phone number is taken
    if (telephone && telephone !== client.telephone) {
      const existingClient = await Client.findOne({ telephone });
      if (existingClient) {
        return res.status(400).json({ 
          msg: 'Another client already uses this phone number' 
        });
      }
      client.telephone = telephone;
    }

    if (nom) client.nom = nom;
    if (prenom) client.prenom = prenom;
    if (email) client.email = email;
    if (adresse) client.adresse = adresse;
    if (pointsFidelite !== undefined) client.pointsFidelite = pointsFidelite;
    if (notes !== undefined) client.notes = notes;

    await client.save();
    res.json(client);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get client by ID
// @route   GET /api/clients/:id
// @access  Employee+
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ msg: 'Client not found' });
    }
    res.json(client);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Admin
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ msg: 'Client not found' });
    }
    res.json({ msg: 'Client removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Add loyalty points to client
// @route   POST /api/clients/:id/add-points
// @access  Employee+
exports.addLoyaltyPoints = async (req, res) => {
  try {
    const { points } = req.body;
    
    if (!points || points <= 0) {
      return res.status(400).json({ msg: 'Points must be a positive number' });
    }

    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ msg: 'Client not found' });
    }

    client.pointsFidelite += points;
    await client.save();
    
    res.json({
      msg: `Added ${points} loyalty points`,
      newBalance: client.pointsFidelite
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Redeem loyalty points
// @route   POST /api/clients/:id/redeem-points
// @access  Employee+
exports.redeemLoyaltyPoints = async (req, res) => {
  try {
    const { points } = req.body;
    
    if (!points || points <= 0) {
      return res.status(400).json({ msg: 'Points must be a positive number' });
    }

    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ msg: 'Client not found' });
    }

    if (client.pointsFidelite < points) {
      return res.status(400).json({ 
        msg: 'Not enough points',
        currentPoints: client.pointsFidelite
      });
    }

    client.pointsFidelite -= points;
    await client.save();
    
    res.json({
      msg: `Redeemed ${points} loyalty points`,
      newBalance: client.pointsFidelite
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};