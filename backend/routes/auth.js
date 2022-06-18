var express = require('express');
var router = express.Router();
const passport = require('passport');

const { verifyUser } = require('../authenticate');
const {loginValidate, signupValidate, signS3Validate} = require('../utils/validators');
const authController = require('../controllers/authController');
const { checkValidation } = require('../middleware/checkValidation');

router.post('/login', loginValidate, checkValidation, passport.authenticate('local'), authController.login);

router.post('/logout', verifyUser, authController.logout);

router.post('/signup', signupValidate, checkValidation, authController.signup);

router.post('/refreshToken', authController.refreshToken);

router.get('/userInfo', verifyUser, authController.userInfo);

router.get('/signS3', signS3Validate, verifyUser, authController.signS3);

module.exports = router;
