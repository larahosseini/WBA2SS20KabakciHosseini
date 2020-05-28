const mongoose = require('mongoose');
const express = require('express');


const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: String, required: true, lowercase: true},
    favourite_kitchen: [
        {type: String, lowercase: true}
    ]
});

module.exports = mongoose.model('User', userSchema);