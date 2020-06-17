const User = require('../../models/user');
const Statistic = require('../../models/statistic');
const Restaurant = require('../../models/restaurant');
const NodeGeocoder = require('node-geocoder');
const mongoose = require('mongoose');
const geoCoder = NodeGeocoder({
    provider: 'openstreetmap'
});


exports.createUser = (req, res) => {
    const username = req.body.username;
    let favourite_kitchen = [];
    for (let i = 0; i < req.body.favourite_kitchen.length; i++) {
        favourite_kitchen.push(req.body.favourite_kitchen[i]);
        console.log(req.body.favourite_kitchen[i]);
    }
    const statistic = new Statistic({
        _id: new mongoose.Types.ObjectId(),
        bookmarked_restaurants: [],
        visitations: []
    });
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: username,
        favourite_kitchen: favourite_kitchen,
        statistic: statistic._id
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
                saveStatistic(res, statistic);
                return res.status(201).json(
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
};

exports.getAllUsersOrUsersUsername = (req, res) => {
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
}

exports.getRestaurantsNearUserById = (req, res) => {
    if (Object.keys(req.query).length > 0) {
        if (req.query.lat && req.query.lon) {
            const lat = req.query.lat;
            const lon = req.query.lon;
            geoCoder.reverse({lat: lat, lon: lon})
                .then(results => {
                    console.log(results);
                    getAddress(results, req.params.id, res);
                }).catch((err) => {
                console.log(err);
            });
        } else {
            return res.status(400).json(
                {message: 'Query Not Supported'}
            );
        }
    } else {
        res.status(404).json(
            {error: 'Not Found'}
        );
    }
};

exports.deleteUserById = (req, res) => {
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
};

exports.updateUsername = (req, res) => {
    const id = req.params.id;
    const newUsername = req.params.username;
    if (!newUsername) {
        return res.status(400).json(
            {
                message: 'Please specify a new User'
            }
        );
    }
    User.findByIdAndUpdate(id, {username: newUsername}, {new: true})
        .exec()
        .then(user => {
            if (user) {
                return res.status(200).json(
                    {
                        message: 'Updates applied',
                        updatedUser: user
                    }
                );
            }
        }).catch(error => {
        handleError(error, 500, res);
    });
};

exports.getUserById = (req, res) => {
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
            handleError(error, 500, res);
        });
};

exports.getUserStatistic = (req, res) => {
    const userId = req.params.id;
    User.findById(userId)
        .exec()
        .then(user => {
            if (user) {
                console.log('Getting Statistic of User');
                getStatistic(res, user.statistic);
            } else {
                return res.status(404).json({
                    message: 'User Not Found'
                });
            }
        })
        .catch(error => {
            handleError(error, 500, res);
        });
};

exports.bookmarkRestaurant = (req, res) => {
    const userId = req.params.userId;
    const restaurantId = req.params.restaurantId;
    console.log('Restaurant: ' + restaurantId);
    User.findByIdAndUpdate(userId, {$push: {bookmarked_restaurants: restaurantId}}, {new: true})
        .exec()
        .then(user => {
            if (user) {
                console.log('Bookmark');
                console.log('StatisticId: ' + user.statistic);
                updateStatisticBookmarks(res, user.statistic, restaurantId);
                return res.status(200).json(
                    {
                        message: 'bookmarked successful the restaurant',
                        updates: user.bookmarked_restaurants
                    }
                );
            } else {
                console.log('User not found');
                return res.status(200).json(
                    {
                        message: 'User Not Found'
                    }
                );
            }
        })
        .catch(error => {
            handleError(error, 500, res);
        });
};

exports.unBookmarkRestaurant = (req, res) => {
    const userId = req.params.userId;
    const restaurantId = req.params.restaurantId;
    const update = {restaurant: restaurantId};
    User.findByIdAndUpdate(userId, {$pull: {bookmarked_restaurants: restaurantId}})
        .exec()
        .then(user => {
            if (user) {
                console.log('Undo Bookmark');
                removeStatisticBookmarks(res, user.statistic, restaurantId);
                return res.status(200).json(
                    {
                        message: 'removed successful the bookmark',
                        bookmarked_restaurants_after_delete: user.bookmarked_restaurants
                    }
                );
            } else {
                console.log('User not found');
                return res.status(200).json(
                    {
                        message: 'User Not Found'
                    }
                );
            }
        })
        .catch(error => {
            handleError(error, 500, res);
        });
};

// ==================================================== Helper Functions ===================================

// Hole die Informationen aus der Anfrage an OpenStreetMap
function getAddress(results, userId, response) {
    if (results.length > 0) {
        const address = results[0];
        const city = address.city.toLocaleString();
        const zipcode = address.zipcode;
        const query = {
            'address.zipcode': zipcode
        }
        console.log('City: ' + city + ' | ' + 'ZipCode: ' + zipcode);
        console.log(query);
        Restaurant.find(query)
            .exec()
            .then(results => {
                console.log(results);
                sortForKitchenStyles(response, results, userId);
            })
            .catch(error => {
                console.log(error);
            });
    }
}

function getStatistic(response, statisticId) {
    Statistic.findById(statisticId)
        .select('')
        .exec()
        .then(statistic => {
            if (statistic) {
                console.log('Found Statistic');
                return response.status(200).json(statistic);
            } else {
                console.log('No Statistic found');
                return response.status(404).json({
                    message: 'Statistic does not exist'
                });
            }
        })
        .catch(error => {
            handleError(error, 500, response);
        });
}

function sortForKitchenStyles(response, restaurants, userId) {
    let filteredRestaurants = [];
    User.findById(userId)
        .exec()
        .then(user => {
            if (user) {
                for (let i = 0; i < restaurants.length; i++) {
                    const restaurant = restaurants[i];
                    for (let j = 0; j < user.favourite_kitchen.length; j++) {
                        const favouriteKitchen = user.favourite_kitchen[j];
                        if (restaurant.kitchen_styles.some(kitchenStyle => kitchenStyle.style.includes(favouriteKitchen))) {
                            console.log('Match found');
                            filteredRestaurants.push(restaurant);
                            break;
                        }
                    }
                    // console.log(user.favourite_kitchen[i]);
                    // console.log(restaurants[i].kitchen_styles[0].style)
                }
                return response.status(200).json({
                    unfiltered: {
                        count: restaurants.length,
                        restaurants: restaurants
                    },
                    filtered_after_favourite_kitchen_from_user: {
                        count: filteredRestaurants.length,
                        restaurants: filteredRestaurants
                    }
                });
            }
        })
        .catch(error => {
            handleError(error, 500, response);
        })

}

function handleError(error, statuscode, response) {
    console.log(error);
    return response.status(statuscode).json(
        {message: error}
    );
}

function updateStatisticBookmarks(response, statisticId, restaurantId) {
    Statistic.findByIdAndUpdate(statisticId, {$push: {bookmarked_restaurants: restaurantId}}, {new: true})
        .exec()
        .then(statistic => {
            if (statistic) {
                console.log('Statistic updated');
            }
        })
        .catch(error => {
            handleError(error, 500, response);
        });
}

function removeStatisticBookmarks(response, statisticId, restaurantId) {
    Statistic.findByIdAndUpdate(statisticId, {$pull: {bookmarked_restaurants: restaurantId}}, {new: true})
        .exec()
        .then(statistic => {
            if (statistic) {
                console.log('Statistic updated');
            }
        })
        .catch(error => {
            handleError(error, 500, response);
        });
}

function saveStatistic(response, statistic) {
    statistic.save().then(statistic => {
        if (statistic) {
            console.log('Saving statistic');
        }
    }).catch(error => {
        handleError(error, 500, response);
    });
}

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
