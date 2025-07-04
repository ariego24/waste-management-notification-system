const mongoose = require('mongoose');

const wasteSchema = new mongoose.Schema({
    wasteType: String,
    recyclableMaterials: [String],
    quantity: Number,
    location: String,
    pickupTime: String,
    email: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Waste', wasteSchema);
