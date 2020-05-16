const mongoose = require('mongoose');

const addressSchema = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        city: String,
        street: String,
        street_number: Number,
        postal_code: Number
    }
);

module.exports = mongoose.model('Address', addressSchema);