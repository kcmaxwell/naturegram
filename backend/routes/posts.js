var express = require('express');
var router = express.Router();

const { verifyUser } = require('../authenticate');
const postsController = require('../controllers/postsController');

router.get('/:postId', verifyUser, postsController.getPost);

module.exports = router;