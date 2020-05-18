const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Restaurant = require('../../models/restaurant');

// POST request
router.post('/', (req, res) => {
    const restaurant = new Restaurant({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        address: {
            city: req.body.address.city,
            street_name: req.body.address.street_name,
            street_number: req.body.address.street_number,
            postal_code: req.body.address.postal_code
        },
        kitchen_style: {
            style: req.body.kitchen_styles.style
        }
    });
    restaurant.save()
        .then(result => {
            console.log('CREATED: ' + result);
            res.status(201).json(result);
        }).catch(error => {
        console.log('Error: ' + error);
        res.status(500).json({
            error: error
        });
    });
});

module.exports = router;