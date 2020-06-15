//express usw. wird importiert
const express = require('express');
const app = express(); //express app (rest api app) wird erstellt, in variable gespeichert die app heißt
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


//verbindung zur DB wird hergestellt, datei importiert
const restaurantRoute = require('./routes/restaurants/restaurant_route');
const userRoute = require('./routes/users/user_route');
const eventRoute = require('./routes/event_route/event_route');

// database setup, verbindung zur DB wird erstellt
//deprecated - wenn software oder funktion abgeändert wird und das alte nicht mehr benutzt werden soll sondern das neue
mongoose.connect('mongodb+srv://admin:admin@cluster0-8efry.mongodb.net/test?retryWrites=true&w=majority',
    {useNewUrlParser: true, useUnifiedTopology: true});

// logging setup
//middleware- wenn anfrage von server kommt kann man diese abfangen und so weiterleiten
//.use = middleware benutzen, das ertse mal middleware wird benutzt
//nur fürs loggen da: ausgabe auf der konsole, was funktioniert & was nicht auf Server
app.use(morgan('dev'));

// body Parser setup
//wird wieder middleware benutzt mit body parser
app.use(bodyParser.urlencoded(
    {
        extended: true
    })
);
app.use(bodyParser.json()); //url & json anfragen abfangen, brauche das um in body die Daten zu verwenden. postman POST

// cors handling, sorgt dafür das server sicherer wird, Sicherheitsmechanismus
app.use((req, res, next) => { //wird bei jeder anfrage aktivert
    res.header('Access-Control-Allow-Origin', '*'); //erlaube das jeder da drauf zugreifen kann
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); //muss dabei sein
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); //erlaube das der jenige was machen darf
        res.status(200).json({});  //status code 200 heißt alles okey, antowrt wird geschickt anfrage wäre zu ende
    }
    next(); //damit die anfrage weitergeleitet wird
});


//alle anfragen die hier her kommen sollen weitergeleitet werden zu der datei rest.Route
app.use('/api/restaurants', restaurantRoute);
app.use('/api/users', userRoute);
app.use('/api/events', eventRoute);
// ======================================================

// error handling
//sorgt dafür damit ich einen fehler abfangen kann, wenn ein error entsteht erstelle ich neues objekt mit error und gebe nachricht 404 raus leite fehler weiter
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404; //wenn es zb den namen des restaurants nicht gibt kommt so ein fehler
    next(error);
})

// error
app.use((error, req, res) => {
    res.status(error.status || 500); //server error, wenn was ist system falsch ist zb wenn server abgestürtz ist aus irgendeinem grund
    res.json({
        message: error.message
    });
});


module.exports = app; //datei exportieren express app
