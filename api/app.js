const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const addressRoute = require('../api/addresses/address_route');

// database setup
mongoose.connect('mongodb://localhost:27017/db_finder');

// logging setup
app.use(morgan('dev'))

// body Parser
app.use(bodyParser.urlencoded(
    {
        extended: false
    }
))
app.use(bodyParser.json)

// routes
// ======================================================

// route /api/addresses
app.use('/api/addresses', addressRoute);


// ======================================================

// error handling
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

// error
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message
    });
});


module.exports = app;