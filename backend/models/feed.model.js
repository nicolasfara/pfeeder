const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
    data: {type: Date, default: Date.now()},
    quantity: { type: Number, required: true},
    kcal: Number,
    fodderId: {type: mongoose.ObjectId, required: true},
    petId: {type: mongoose.ObjectId, required: true}
})

module.exports = mongoose.model("Feed", feedSchema)
