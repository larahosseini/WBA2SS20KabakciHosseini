const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// const addressRoute = require('../api/addresses/address_route');
const restaurantRoute = require('./restaurants/restaurant_route');

// database setup
mongoose.connect('mongodb+srv://admin:admin@cluster0-8efry.mongodb.net/test?retryWrites=true&w=majority',
    {useNewUrlParser: true, useUnifiedTopology: true});

// logging setup
app.use(morgan('dev'));

// body Parser setup
app.use(bodyParser.urlencoded(
    {
        extended: true
    })
);
app.use(bodyParser.json());

// cors handling
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        res.status(200).json({});
    }
    next();
});

// routes
// ======================================================

// route /api/addresses
// app.use('/api/addresses', addressRoute);

app.use('/api/restaurants', restaurantRoute);


// ======================================================

// error handling
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

// error
app.use((error, req, res) => {
    res.status(error.status || 500);
    res.json({
        message: error.message
    });
});


module.exports = app;