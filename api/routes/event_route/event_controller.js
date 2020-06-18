const Event = require('../../models/event');


exports.getEventById = (req, res) => {
    Event.findById(req.params.id)
        .select('_id name startDate endDate restaurantId')
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
        });
};


exports.getEventByName = (req, res) => {
    console.log('Searching for events...');
    if (req.query.name) {
        if(Object.keys(req.query).length > 1 && !req.query.name) {
            return res.status(400).json({
                message: 'You can only search by name'
            });
        }
        Event.find({name: req.query.name})
            .select('_id name startDate endDate restaurantId')
            .exec()
            .then(results => {
                if (results) {
                    console.log('Found Event: ' + results);
                    return res.status(200).json({
                        count: results.length,
                        events: results
                    });
                }
            })
            .catch(error =>{
                handleError(error, 500, res);
            });
    } else {
        return res.status(400).json(
            {
                message: 'Only search by name or id is allowed'
            }
        )
    }

};

function handleError(error, statusCode, response) {
    console.log('Error: ' + error);
    return response.status(statusCode).json(
        {
            message: error
        }
    );
}
