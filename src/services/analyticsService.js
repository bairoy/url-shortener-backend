const Analytics = require("../models/Analytics");

const trackClick = async ({ shortCode, ip, userAgent }) => {
    try {
        await Analytics.create({
            shortCode,
            ip,
            userAgent
        });
    } catch (err) {
        console.error("Analytics Error:", err.message);
    }
};

module.exports = { trackClick };