const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const NodeGeocoder = require('node-geocoder');

const User = require('../../models/user');
const Restaurant = require('../../models/restaurant');

const geoCoder = NodeGeocoder({
    provider: 'openstreetmap'
});

// POST: Ein neuer Benutzer erstellen
router.post('/', (req, res) => {
    const username = req.body.username;
    let favourite_kitchen = [];
    for (let i = 0; i < req.body.favourite_kitchen.length; i++) {
        favourite_kitchen.push(req.body.favourite_kitchen[i]);
        console.log(req.body.favourite_kitchen[i]);
    }
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: username,
        favourite_kitchen: favourite_kitchen
    });
    User.findOne({username: user.username}).exec().then(result => {
        console.log('CREATED: ' + result)
        if (result) {
            res.status(405).json(
                {
                    message: '[User with Username: ' + user.username + '] exists, please choose an another username'
                }
            );
        } else {
            user.save().then(result => {
                console.log(result);
                res.status(201).json(
                    {
                        message: 'New User Created',
                        createUser: result
                    });
            }).catch(error => {
                console.log(error);
                handleError(error, 500, res);
            });
        }
    }).catch(error => {
        console.log(error);
        handleError(error, 500, res);
    });
});

// GET: Alle Benutzer auslesen oder
// GET: Einen Benutzer durch username finden
router.get('/', (req, res) => {
    if (Object.keys(req.query).length > 0) {
        if (req.query.username) {
            getUserByUsername(res, req.query);
        } else {
            res.status(400).json({
                message: 'NOT ALLOWED: Only Search By Username is allowed'
            });
        }
    } else {
        getAllUsers(res);
    }
});

// GET: EIn User mit der ID finden
router.get('/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .exec()
        .then(result => {
            console.log(result);
            if (result) {
                res.status(200).json(result);
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(
                {
                    error: error
                }
            )
        });
});

router.get('/:id/locations', (req, res) => {
    if (Object.keys(req.query).length > 0) {
        if (req.query.lat && req.query.lon) {
            const lat = req.query.lat;
            const lon = req.query.lon;
            geoCoder.reverse({lat: lat, lon: lon})
                .then(results => {
                    console.log(results);
                    getAddress(results, res);
                }).catch((err) => {
                console.log(err);
            });
        }else {
            return res.status(400).json(
                {message: 'Query Not Supported'}
            );
        }
    } else {
        res.status(404).json(
            {error: 'Not Found'}
        );
    }
});

// DELETE: Ein Benutzer durch ID finden und löschen
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const user = User.findByIdAndDelete({_id: id})
        .exec()
        .then(result => {
            console.log('DELETE: ' + result);
            if (result) {
                res.status(200).json(
                    {message: '[User with ID: ' + id + '] Deleted user successfully.'}
                );
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(
                {error: error}
            );
        });
});

/* PATCH Request: how to use
*   [
*       {"propertyName": "username", "value": "Username A"}
*   ]
*
* */
router.patch('/:id', (req, res) => {
    const id = req.params.id;
    const updateOps = {}; // hilfsvariable um die werte abzuspeichern, die upgedatet werden sollen
    for (const ops of req.body) {
        updateOps[ops.propertyName] = ops.value; // speichern der übergebenen werte von der anfrage
    }
    User.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log('UPDATE: ' + result);
            if (result) {
                res.status(200).json(result);
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(
                {error: error}
            );
        });
});

// Hilfsfunktion alle Benutzer herauszubekommen
function getAllUsers(res) {
    User.find()
        .exec()
        .then(results => {
            console.log(results);
            res.status(200).json(results);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(
                {
                    error: error
                }
            )
        });
}

// Hilfsfunktion um Benutzer mit Username zu finden
function getUserByUsername(res, usernameQuery) {
    User.find(usernameQuery)
        .exec()
        .then(results => {
            console.log(results);
            res.status(200).json(results);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(
                {
                    error: error
                }
            )
        });
}

// Hole die Informationen aus der Anfrage an OpenStreetMap
function getAddress(results, response) {
    if (results.length > 0) {
        const address = results[0];
        const city = address.city.toLocaleString();
        const zipcode = address.zipcode;
        const query = {
            'address.postal_code': zipcode
        }
        console.log('City: ' + city + ' | ' + 'ZipCode: ' + zipcode);
        console.log(query);
        Restaurant.find(query)
            .exec()
            .then(results => {
                console.log(results);
                response.status(200).json(results);
            })
            .catch(error => {
                console.log(error);
            });
    }
}

function handleError(error, statuscode, response) {
    console.log(error);
    return response.status(statuscode).json(
        {message: error}
    );
}

module.exports = router;
