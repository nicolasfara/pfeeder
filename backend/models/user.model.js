const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: false},
    surname: {type: String, required: false},
    email: { type: String, unique: true, required: true},
    password: { type: String, minlength: 8, required: true },
    api_keys: [String],
    notifications: [mongoose.ObjectId],
    pets: [{
        name: String,
        weight: Number,
        age: Number,
        petType: String,
        breed: String,
        supply_mode: String,
        rations_per_day: [{
            time: Date,
            daily_ration: Number
        }],
        current_fodder: mongoose.ObjectId,
        feeds: [mongoose.ObjectId]
    }]
})

module.exports = mongoose.model("User", userSchema)
