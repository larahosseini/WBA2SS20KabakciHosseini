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

// GET ALL Route
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

// GET ID Route
router.get('/:addressId', ((req, res) => {
    Address.findById(req.params.addressId)
        .exec()
        .then(result => {
            console.log(result);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json(
                    {message: 'Address[Id:' + req.params.addressId + '] NOT FOUND'}
                );
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(
                {message: error}
            );
        });
}));

// DELETE Route
router.delete('/:addressId', (req, res) => {
    const id = req.params.addressId;
    Address.remove({
        _id: id
    })
        .exec()
        .then(result => {
            console.log('DELETE: ' + result)
            res.status(200).json({
                message: 'DELETED successfully the Address',
                deletedObject: result
            });
        })
        .catch(error => {
            console.log(error);
            res.status(404).json(
                {error: error}
            );
        });
});

module.exports = router;