const express = require('express');
const router = express.Router();

const userController = require('./user_controller');



// POST: Ein neuer Benutzer erstellen
router.post('/', userController.createUser);

// POST: ein Restaurant bookmarken
router.post('/:userId/bookmarks/:restaurantId', userController.bookmarkRestaurant);

// GET: Alle Benutzer auslesen oder
// GET: Einen Benutzer durch username finden
router.get('/', userController.getAllUsersOrUsersUsername);

// GET: EIn User mit der ID finden
router.get('/:id', userController.getUserById);

//GET: gibt eine liste von restaurants zurück die in nähe der PLZ sind
router.get('/:id/locations', userController.getRestaurantsNearUserById);

// DELETE: Ein Benutzer durch ID finden und löschen
router.delete('/:id', userController.deleteUserById);

// PUT: benutzernamen eines users updaten
router.put('/:id/username', userController.updateUsername)




module.exports = router;
