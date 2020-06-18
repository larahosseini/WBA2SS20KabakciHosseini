const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    restaurantId: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'},
    name: String,
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true}
});

module.exports = mongoose.model('Event', eventSchema);
