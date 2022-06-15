var express = require('express');
var router = express.Router();
const passport = require('passport');

const { verifyUser } = require('../authenticate');
const {loginValidate, signupValidate, signS3Validate} = require('../utils/validators');
const authController = require('../controllers/authController');

router.post('/login', loginValidate, passport.authenticate('local'), authController.login);

router.post('/logout', verifyUser, authController.logout);

router.post('/signup', signupValidate, authController.signup);

router.post('/refreshToken', authController.refreshToken);

router.get('/userInfo', verifyUser, authController.userInfo);

router.get('/signS3', signS3Validate, verifyUser, authController.signS3);

module.exports = router;
