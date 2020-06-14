const express = require('express');
const router = express.Router(); //damit ich anfragen wie GET POST bearbeiten kann, router funktion um GET POST anfragen abzufangen
const mongoose = require('mongoose'); //importieren für client
const restaurantController = require('./restaurant_controller');
const Restaurant = require('../../models/restaurant');

// POST request, dafür da um neue restaurant zu speichern
router.post('/', restaurantController.createRestaurant);

// GET all restaurants, Liste von allen Restaurants zurückgeben
//req Request = Anfrage, res Response = Antwort
router.get('/', restaurantController.getAllRestaurantsOrFilterRestaurantsByNameOrAddress);

// GET ID From Restaurants, damit ich exaktes restaurant finden kann
router.get('/:id', restaurantController.getRestaurantById);

// PATCH Request
// how to use
/*
*   [
*       {"propertyName": "name", "value": "Restaurant A"},
        {"propertyName": "address.city", "value": "hannover"}
*   ]
*
* */
//patch = man kann einzelne sachen ändern
router.patch('/:id', restaurantController.updateRestaurantById);

// PUT request
// nur den namen des Restaurants updaten
router.put('/:id/name', restaurantController.updateRestaurantNameById);

// PUT request
// nur die Adresse des Restaurants updaten
router.put('/:id/address', restaurantController.updateRestaurantAddressById)

// DELETE Request
router.delete('/:id', restaurantController.deleteRestaurantById);

// ========================================= events

// Post request: ein event erstellen
router.post('/:id/events', restaurantController.createEvent);

// GET request: kriegt mit Hilfe der id ein event zurück
router.get('/events/:id', restaurantController.getEventById);

// GET request: kriegt eine liste aller events von einem restaurant
router.get('/:restaurantId/events', restaurantController.getEventsByRestaurantId);

module.exports = router;
