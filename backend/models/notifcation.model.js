const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    timestamp: {type: Date, default: Date.now()},
    userId: {type: mongoose.ObjectId, required: true},
    read: {type: Boolean, required: true, default: false},
    type: String,
    message: {type: String, required: true}
})

module.exports = mongoose.model("Notification", notificationSchema)
