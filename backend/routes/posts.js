var express = require('express');
var router = express.Router();

const { verifyUser } = require('../authenticate');
const postsController = require('../controllers/postsController');

router.get('/get/:postId', verifyUser, postsController.getPost);

router.post('/createPost', verifyUser, postsController.createPost);

module.exports = router;