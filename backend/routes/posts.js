var express = require('express');
var router = express.Router();

const { verifyUser } = require('../authenticate');
const postsController = require('../controllers/postsController');

router.get('/get/:postId', verifyUser, postsController.getPost);
router.get('/author/:postId', verifyUser, postsController.getAuthor);

router.post('/createPost', verifyUser, postsController.createPost);

router.put('/like', verifyUser, postsController.likePost);

module.exports = router;