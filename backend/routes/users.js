var express = require('express');
var router = express.Router();

const { verifyUser } = require('../authenticate');
const usersController = require('../controllers/usersController');

router.get('/getUser/:username', verifyUser, usersController.getUser);
router.get('/followers/:username', verifyUser, usersController.getFollowers);
router.get('/following/:username', verifyUser, usersController.getFollowing);

router.put('/follow', verifyUser, usersController.followUser);

module.exports = router;
