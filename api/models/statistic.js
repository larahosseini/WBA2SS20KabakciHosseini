const mongoose = require('mongoose');

const statisticSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    bookmarked_restaurants: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'}
    ],
    visitations: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Visitation2'}
    ]
});

module.exports = mongoose.model('Statistic', statisticSchema);
