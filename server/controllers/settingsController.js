const Settings = require('../models/Settings');

// @desc    Get cafe settings
// @route   GET /api/settings
// @access  Employee+
exports.getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        // Create default settings if none exist
        if (!settings) {
            settings = new Settings({
                nomCafe: 'Café Alt Ben Ali',
                adresse: 'agwassam Marrakech',
                ville: 'Marrakech',
                telephone: '0667736019'
            });
            await settings.save();
        }

        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Update cafe settings
// @route   PUT /api/settings
// @access  Admin/Gerant
exports.updateSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            settings = new Settings(req.body);
        } else {
            Object.keys(req.body).forEach(key => {
                settings[key] = req.body[key];
            });
        }

        await settings.save();
        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Upload cafe logo
// @route   POST /api/settings/logo
// @access  Admin/Gerant
exports.uploadLogo = async (req, res) => {
    try {
        const settings = await Settings.findOne();
        if (!settings) {
            return res.status(404).json({ msg: 'Settings not found' });
        }

        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        // Use the path from Cloudinary
        settings.logoUrl = req.file.path;
        await settings.save();

        res.json({
            msg: 'Logo updated successfully',
            logoUrl: settings.logoUrl
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};