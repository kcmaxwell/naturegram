const { check, validationResult, param, query } = require('express-validator');

exports.loginValidate = [
	check('username').not().isEmpty().isAscii().trim().escape(),
	check('password').not().isEmpty().isAscii().trim().escape(),
];

exports.signupValidate = [
	check('username').not().isEmpty().isAscii().trim().escape(),
	check('password').not().isEmpty().isAscii().trim().escape(),
	check('fullName').not().isEmpty().isAscii().trim().escape(),
];

exports.signS3Validate = [
	query('fileType')
		.exists()
		.isString()
		.not()
		.isEmpty()
		.contains('image'),
	query('fileExt')
		.exists()
		.isString()
		.not()
		.isEmpty()
		.isIn(['jpg', 'jpeg', 'png', 'gif', 'bmp']),
];
