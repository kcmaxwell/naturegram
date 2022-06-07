var express = require('express');
var router = express.Router();

const authRouter = require('./auth')
const usersRouter = require('./users');
const postsRouter = require('./posts');
const testRouter = require('./test');

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/posts', postsRouter);

if (process.env.NODE_ENV === 'test')
  router.use('/test', testRouter);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
