const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: String, required: true, lowercase: true},
    favourite_kitchen: [
        {type: String, lowercase: true}
    ],
    bookmarked_restaurants: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', unique: true
        }
    ],
    statistic: {type: mongoose.Schema.Types.ObjectId, ref: 'Statistic'}
});

module.exports = mongoose.model('user2', userSchema);

