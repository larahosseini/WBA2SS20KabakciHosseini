const express = require('express');
const router = express.Router();

const userController = require('./user_controller');



// POST: Ein neuer Benutzer erstellen
router.post('/', userController.createUser);

// POST: ein Restaurant bookmarken
router.post('/:userId/bookmarks/:restaurantId', userController.bookmarkRestaurant);

// POST: ein Restaurant als besucht ändern
router.post('/:userId/visitations/:restaurantId', userController.setRestaurantVisitation);

// GET: Alle Benutzer auslesen oder
// GET: Einen Benutzer durch username finden
router.get('/', userController.getAllUsersOrUsersUsername);

// GET: EIn User mit der ID finden
router.get('/:id', userController.getUserById);

//GET: gibt eine liste von restaurants zurück die in nähe der PLZ sind
router.get('/:id/locations', userController.getRestaurantsNearUserById);

// GET: git eine Statistic eines user zurück
router.get('/:id/statistics', userController.getUserStatistic);

// GET: ein restaurant vorgeschlagen bekommen, dass man noch nicht besucht oder gebookmarked hat
router.get('/:id/recommendations', userController.getRecommendations);

// GET: gibt alle besuche des benutzers zurück
router.get('/:id/visitations', userController.getUserVisitations);

// DELETE: Ein Benutzer durch ID finden und löschen
router.delete('/:id', userController.deleteUserById);

// DELETE: ein restaurant unbookmarken
router.delete('/:userId/bookmarks/:restaurantId', userController.unBookmarkRestaurant);

// PUT: benutzernamen eines users updaten
router.put('/:id/username', userController.updateUsername);




module.exports = router;
