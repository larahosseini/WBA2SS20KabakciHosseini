const mongoose = require('mongoose');
const address = require('../models/address');
const Schema = mongoose.Schema;

// kitchen styles
const styles = ['arabic', 'turkish', 'italian', 'japanese',
    'chinese', 'mexican', 'indian', 'greek', 'american', 'german',
    'vegan', 'thai', 'sushi', 'syrian'
];

//
const restaurantSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    address: {
        city: String,
        street: String,
        street_number: Number,
        postal_code: Number
    },
    kitchen_styles: {
        type: {
            type: String,
            style: styles
        }
    }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);