const mongoose = require('mongoose');
const address = require('../models/address');
const Schema = mongoose.Schema;

const restaurantSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    address: {type: Schema.Types.ObjectId, ref: 'Address'},
});

module.exports = Restaurant = mongoose.model('Restaurant', restaurantSchema);