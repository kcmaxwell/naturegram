var express = require('express');
var router = express.Router();
const passport = require('passport');

const { verifyUser } = require('../authenticate');
const {loginValidate, signupValidate} = require('../utils/validators');
const authController = require('../controllers/authController');

router.post('/login', loginValidate, passport.authenticate('local'), authController.login);

router.post('/logout', verifyUser, authController.logout);

router.post('/signup', signupValidate, authController.signup);

router.post('/refreshToken', authController.refreshToken);

module.exports = router;
