var express = require('express');
var router = express.Router();

const { verifyUser } = require('../authenticate');
const usersController = require('../controllers/usersController');

router.get('/:username', verifyUser, usersController.getUser);

router.put('/follow', verifyUser, usersController.followUser);

module.exports = router;
