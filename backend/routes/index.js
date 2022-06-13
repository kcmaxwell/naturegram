var express = require('express');
var router = express.Router();

const authRouter = require('./auth')
const usersRouter = require('./users');
const postsRouter = require('./posts');
const testRouter = require('./testRoute');

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/posts', postsRouter);

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'jest')
  router.use('/test', testRouter);

module.exports = router;
