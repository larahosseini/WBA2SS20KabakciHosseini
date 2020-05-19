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

// GET all restaurants
router.get('/', (req, res) => {
    Restaurant.find()
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(error => {
            console.log('Error: ' + error);
            res.status(500).json({
                    error: error
                }
            );
        });
});

// GET ID From Restaurants
router.get('/:id', (req, res) => {
    Restaurant.findById(req.params.id)
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({
                    message: 'Restaurant [ID: ' + res.params.id + '] Not Found'
                });
            }
        })
        .catch(error => {
            console.log('Error: ' + error);
            res.status(500).json(
                {
                    error: error
                }
            );
        });
});

// PATCH Request
// how to use
/*
*   [
*       {"propertyName": "name", "value": "Restaurant A"}
*   ]
*
* */
router.patch('/:id', (req, res) => {
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propertyName] = ops.value;
    }
    Restaurant.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log('Update' + result);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({
                    message: 'Restaurant [ID: ' + res.params.id + '] Not Found'
                });
            }
        })
        .catch(error => {
            console.log('Error: ' + error);
            res.status(500).json(
                {
                    error: error
                }
            );
        });

});

module.exports = router;