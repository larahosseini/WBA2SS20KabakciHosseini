const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Restaurant = require('../../models/restaurant');

// POST request
router.post('/', (req, res) => {
    let kitchen_styles = []
    for (let i = 0; i < req.body.kitchen_styles.length; i++) {
        console.log('Style: ' + req.body.kitchen_styles[i].style);
        const style = {
            style: req.body.kitchen_styles[i].style
        };
        kitchen_styles.push(style);
    }

    const restaurant = new Restaurant({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        address: {
            city: req.body.address.city,
            street: req.body.address.street,
            street_number: req.body.address.street_number,
            postal_code: req.body.address.postal_code
        },
        kitchen_styles: kitchen_styles
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
    // check if query strings are available, if not get all restaurants, if yes get the restaurants filtered by the query
    if (Object.keys(req.query).length > 0) {
        filterRestaurants(res, req.query);
    } else {
        getAllRestaurants(res);
    }
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

// DELETE Request
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Restaurant.findOneAndDelete({_id: id})
        .exec()
        .then(result => {
            console.log('DELETE: ' + result);
            if (result) {
                res.status(200).json(
                    {message: 'DELETED [ID: ' + id + '] Restaurant successfully'}
                );
            } else {
                res.status(404).json(
                    {message: 'Restaurant [ID: ' + res.params.id + '] Not Found'}
                );
            }
        }).catch(error => {
        console.log('Error: ' + error);
        res.status(500).json({
            error: error
        });
    });
});


function getAllRestaurants(res) {
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
}

function filterRestaurants(res, query) {
    console.log(query);
    Restaurant.find(query)
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json(result);
            }
        })
        .catch(error => {
            console.log('Error: ' + error);
            res.status(500).json({
                    error: error
                }
            );
        });
}

module.exports = router;