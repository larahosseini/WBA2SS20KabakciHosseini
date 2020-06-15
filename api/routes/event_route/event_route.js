const express = require('express');
const router = express.Router(); //damit ich anfragen wie GET POST bearbeiten kann, router funktion um GET POST anfragen abzufangen
const mongoose = require('mongoose'); //importieren für client
const eventController = require('./event_controller');

// GET request: kriegt mit Hilfe der id ein event zurück
router.get('/:id', eventController.getEventById);

// GET request: gibt eine liste event namen zurück
router.get('/', eventController.getEventByName);


module.exports = router;
