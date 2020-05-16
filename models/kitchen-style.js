const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const styles = ['arabic', 'turkish', 'italian', 'japanese',
    'chinese', 'mexican', 'indian', 'greek', 'american', 'german',
    'vegan', 'thai', 'sushi', 'syrian'
];

const kitchenStyleSchema = mongoose.Schema({
    kitchen_styles: {
        type: {
            type: String,
            enum: styles
        }
    }
});

module.exports = KitchenStyle = mongoose.model('KitchenStyle', kitchenStyleSchema);