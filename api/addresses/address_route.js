const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Address = require('../../models/address');

// POST - Create new Address
router.post('/', (req, res) => {
    const address = new Address(
        {
            _id: mongoose.Types.ObjectId(),
            city: req.body.city,
            street: req.body.street,
            street_number: req.body.street_number,
            postal_code: req.body.postal_code
        }
    );
    address.save()
        .then(result => {
            console.log(result);
            if (result) {
                res.status(201).json({
                    message: 'Address was successfully created',
                    created_object: address
                });
            }
        }).catch(
        err => {
            console.log(err);
            res.status(500).json(
                {
                    message: 'Coudnt create Address',
                    error: err
                }
            );
        }
    )
});

// GET ALL Addresses
router.get('/', (req, res) => {
    Address.find()
        .exec()
        .then(results => {
            if (results) {
                res.status(200).json(results)
            }
        }).catch(err => {
        console.log(err);
        res.status(500).json(
            {error: err}
        );
    });
});

module.exports = router;