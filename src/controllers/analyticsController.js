const Analytics = require("../models/Analytics");

const getAnalytics = async (req, res) => {
    try {
        const { code } = req.params;

        const totalClicks = await Analytics.countDocuments({
            shortCode: code
        });

        res.json({
            shortCode: code,
            totalClicks
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAnalytics };