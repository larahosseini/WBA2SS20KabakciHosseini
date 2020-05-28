
const mongoose = require('mongoose'); //requiere: client wird imporiert (bibliothek die importiert werden soll)




// schema for restaunrants, ist das Model
const restaurantSchema = mongoose.Schema({ //schema = unterfunktion von mongoose, damit der weiß wie die tabelle aufgebaut werden soll
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true, lowercase: true}, //req:darf nicht null sein wird benötigt, lower.alle namen die gespeichert werden sollen klein sein um die suche zu vereinfachen wegen groß Klein schreibung
    address: { //feld von der tabelle restaurant
        city: {type: String, required: true}, //req. wenn ich als feld haben will, dann muss ich das mit aufschreiben, aussage wird benötigt
        street: {type: String, required: true},
        street_number: {type: Number, required: true},
        postal_code: {type: Number, required: true}
    },
    kitchen_styles: [ //array, um mehrere sachen zu speichern
        {
            style: { //objekt was in array gespeichert wird
                type: String,
                required: true,
                lowercase: true //kleine schreibweise
            }
        }
    ]
});

//muss exportiert werden, damit das model benutzt werden kann
//
module.exports = mongoose.model('Restaurant', restaurantSchema);
//mon.mod. sage ich der DB das ich eine tabelle erstellen will die restaurant heißen soll & das Model was oben gemacht wurde benutzen soll



//mongo db - keine sql datenbank, nicht relationale DB, gibt keine beziehungen, so wenig wie möglich beziehungen aufbauen mit anderen tabellen, schneller als sql DB