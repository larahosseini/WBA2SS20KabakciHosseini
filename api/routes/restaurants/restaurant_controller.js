const mongoose = require('mongoose');
const Restaurant = require('../../models/restaurant');
const Event = require('../../models/event');

exports.createRestaurant = (req, res) => {
//Hilfs array um die Liste der übergebenen Küchen zu speichern
    let kitchen_styles = [] //erstelle leere liste
    //Schleife um die Anfrage verschiedener Küchen bearbeiten zu können
    for (let i = 0; i < req.body.kitchen_styles.length; i++) { //liste von küchen speichern, for schleife: beim erstellen eines resta. immer angeben was für ne küche aber da ich nicht weiß wie viele es sind, will ich dynamisch halten, wird so oft durchgelaufen wie viel drinne steht
        console.log('Style: ' + req.body.kitchen_styles[i].style); //debug, ausgabe am terminal
        //Speichern des Wertes der Küche in der Hilfsvariable
        const style = {
            style: req.body.kitchen_styles[i].style //speichern der werte
        };
        //den gelesenen Wert in das hilfs Array speichern
        kitchen_styles.push(style); //push:neue elemente ins array hinzufügen
    }

    //neues restaurant in variable speichern
    const restaurant = new Restaurant({ //erstelle variable neues restaurant
        _id: new mongoose.Types.ObjectId(), //id des restaurants einzigartig speichern
        name: req.body.name,
        address: {
            city: req.body.address.city,
            street: req.body.address.street,
            street_number: req.body.address.street_number,
            postal_code: req.body.address.postal_code
        },
        kitchen_styles: kitchen_styles //übergabe komplettes array
    });
    restaurant.save() //speichern der Daten in der DB
        .then(result => {  //gibt formes/funktion zurück, gespeichertes Objekt der db wird zurückgegeben
            console.log('CREATED: ' + result); //im terminal ausgeben der gespeicherten werte
            res.status(201).json(result); //status 201 = CREATED, benutzt man wenn man neue sachen erstellt hat, restaurant erstellt, mit .json objekt wieder zurück schicken
        }).catch(error => { //wenn fehler passiert, dann wird dieser block aktiviert
        console.log('Error: ' + error);
        res.status(500).json({ //status 500 = INTERNAL_SERVER_ERROR
            error: error //fehler wird zurück geschickt
        });
    });
}

exports.getAllRestaurantsOrFilterRestaurantsByNameOrAddress = (req, res) => { //router = Hilfsmethode
    //überprüfen ob query zeichen verfügbar, wenn nicht alle restaurants zurückgeben, wenn ja gefilterte zurückgeben
    if (Object.keys(req.query).length > 0) { //länge nach dem ?name=blabla
        filterRestaurants(res, req.query); //req.query = beinhaltet suchparameter bspl. api/restaurants?name=l'osteria >befindet sich drinne: name : l'osteria; suchparameter werden übergeben
    } else { //wenn man nichts eingibt größe 0 in diesen Block rein
        getAllRestaurants(res);
    }
}

exports.getRestaurantById = (req, res) => { //erst fad angeben, dann handler
    Restaurant.findById(req.params.id) //sucht die db nach dem restaurant mit der angegebenen id
        .exec() //liefert echtes promise zurück
        .then(result => { //liefert das ergebnis aus der suche zurück
            if (result) { //prüfe ob das ergebnis leer ist bzw null
                res.status(200).json(result);
            } else {
                //status 404 = NOT FOUND
                res.status(404).json({
                    message: 'Restaurant [ID: ' + res.params.id + '] Not Found'
                });
            }
        })
        .catch(error => { //bei fehlern wird dies aktiviert
            console.log('Error: ' + error);
            res.status(500).json(
                {
                    error: error
                }
            );
        });
}

exports.updateRestaurantById = (req, res) => {
    const id = req.params.id;
    const updateOps = {}; //hilfsvariable um die werte abzuspeichern die upgedatet werden sollen
    for (const ops of req.body) { //
        updateOps[ops.propertyName] = ops.value; //speichern der übergebenen werte von der anfrage

    }
    Restaurant.update({_id: id}, {$set: updateOps}) //updateOps -> {"name" :"restaurant" } oder es könnte so aussehen {"name": "restaurant"", "adress.city":"bagdad"}
        .exec()
        .then(result => {
            console.log('Update' + result);
            if (result) {
                res.status(200).json(result); //upgedatete obejtk schicke ich wieder zurück
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
}

exports.updateRestaurantNameById = (req, res) => {
    const newName = req.body.name;
    const id = req.params.id;
    // wenn wert existiert bzw mitgegeben wurde in der anfrage
    if (newName) {
        handleRestaurantUpdates(res, id, {name: newName});
    } else {
        return res.status(400).json(
            {
                message: 'Operation not supported, please specify a name'
            }
        );
    }
}

exports.updateRestaurantAddressById = (req, res) => {
    const address = req.body.address;
    const id = req.params.id;
    if (address) {
        handleRestaurantUpdates(res, id, {address: address});
    } else {
        return res.status(400).json(
            {
                message: 'Operation not supported, please specify a name'
            }
        );
    }
}

exports.deleteRestaurantById = (req, res) => {
    const id = req.params.id;
    Restaurant.findOneAndDelete({_id: id}) //suchparameter angeben
        .exec() //liefert echtes promise
        .then(result => { //ergebnis der suche
            console.log('DELETE: ' + result);
            if (result) { //wenn ergebnis nicht null ist
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
}

// ================================================= events

exports.createEvent = (req, res) => {
    const restaurantId = req.params.id;
    const event = new Event({
        _id: new mongoose.Types.ObjectId(),
        restaurantId: restaurantId,
        name: req.body.name,
        start: req.body.startDate,
        end: req.body.endDate
    });
    event.save()
        .then(event => {
            if (event) {
                console.log('Event created: ' + event);
                return res.status(201).json(
                    {
                        message: 'Event successful created',
                        createdEvent: event
                    }
                );
            }
        })
        .catch(error => {
            handleError(error, 500, res);
        });
}

exports.getEventById = (req, res) => {
    Event.findById(req.params.id)
        .exec()
        .then(result => {
            if (result) {
                console.log('Found Event: ' + result);
                return res.status(200).json(result);
            } else {
                return res.status(404).json({
                    message: 'Event not found'
                });
            }
        })
        .catch(error => {
            handleError(error, 500, res);
        })
};

exports.getEventsByRestaurantId = (req, res) => {
    const restaurantId = req.params.restaurantId;
    Event.find({restaurantId})
        .exec()
        .then(results => {
            console.log('Events found: ' + results);
            return res.status(200).json(
                {
                    count: results.length,
                    events: results
                }
            );
        })
        .catch(error => {
            handleError(error, 500, res);
        });
};

//gets all restaurants
function getAllRestaurants(res) {
    Restaurant.find() //sucht nach den Werten die ich eingebe, sucht in der db nach allen restaurants
        .exec() //liefert ein echtes promise
        .then(result => { //liefert das ergebnis egal ob liste leer oder voll
            console.log(result);
            //status 200 = OK, alles prima
            res.status(200).json(result); //result, liste aller restaurants die in der db gespeichert idt
        })
        .catch(error => {
            console.log('Error: ' + error);
            res.status(500).json({
                    error: error
                }
            );
        });
}

//sucht alle restaurants die die kriterien in query erfüllen
function filterRestaurants(res, query) {
    console.log(query);
    Restaurant.find(query) //query: alles was in dem objekt ist wird danach gesucht
        .exec() //liefert echtes promise
        .then(result => { //liefert die ergebnisse von der suche zurück
            if (result) { //wenn die liste nicht null ist, dann schicke antwort
                res.status(200).json(result); //ergebnisse werden im json format geschickt
            }
        })
        .catch(error => { //falls fehler
            console.log('Error: ' + error);
            res.status(500).json({
                    error: error
                }
            );
        });
}

function handleRestaurantUpdates(res, id, updates) {
    Restaurant.findByIdAndUpdate(id, updates, {new: true})
        .exec()
        .then(result => {
            if (result) {
                return res.status(200).json(
                    {
                        message: 'Updated successful applied',
                        updatedRestaurant: result
                    }
                );
            }
        })
        .catch(error => {
            handleError(error, 500, res);
        });
}

function handleError(error, statusCode, response) {
    return response.status(statusCode).json(
        {
            message: error
        }
    );
}
