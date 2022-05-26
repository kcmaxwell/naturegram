var express = require('express');
var router = express.Router();

const authRouter = require('./auth')
const usersRouter = require('./users');

router.use('/auth', authRouter);
router.use('/users', usersRouter);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
