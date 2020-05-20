const mongoose = require('mongoose');




//
const restaurantSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true, lowercase: true},
    address: {
        city: {type: String, required: true},
        street: {type: String, required: true},
        street_number: {type: Number, required: true},
        postal_code: {type: Number, required: true}
    },
    kitchen_styles: [
        {
            style: {
                type: String,
                required: true,
                lowercase: true
            }
        }
    ]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);