const mongoose = require('mongoose');

const visitationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    visited_at: {type: Date, default: Date.now},
    restaurant: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user2'}
});

module.exports = mongoose.model('Visitation2', visitationSchema);
