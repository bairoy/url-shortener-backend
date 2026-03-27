const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
    shortCode: {
        type: String,
        required: true,
        index: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    ip: String,
    userAgent: String
});

module.exports = mongoose.model("Analytics", analyticsSchema);