const mongoose = require('mongoose');

const fodderSchema = new mongoose.Schema({
    name: {type: String, required: true},
    companyName: {type: String},
    price: {type: Number},
    weight:{type: Number, required:true},
    nutrition_facts: {
        protein: Number,
        fat: Number,
        carbohydrates: Number,
        vitamins: Number
    }

})

module.exports = mongoose.model("Fodder", fodderSchema)
