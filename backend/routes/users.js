var express = require('express');
var router = express.Router();

const { verifyUser } = require('../authenticate');
const usersController = require('../controllers/usersController');

router.get('/getUser/:username', verifyUser, usersController.getUser);
router.get('/followers/:username', verifyUser, usersController.getFollowers);
router.get('/following/:username', verifyUser, usersController.getFollowing);
router.get('/posts/:username', verifyUser, usersController.getPosts);
router.get('/savedPosts', verifyUser, usersController.getSavedPosts);

router.put('/follow', verifyUser, usersController.followUser);
router.put('/savePost', verifyUser, usersController.savePost);

module.exports = router;
