const { check, validationResult } = require('express-validator');

exports.loginValidate = [
    check('username').isAscii().trim().escape(),
    check('password').isAscii().trim().escape(),
];

exports.signupValidate = [
    check('username').isAscii().trim().escape(),
    check('password').isAscii().trim().escape(),
    check('fullName').isAlphanumeric().trim().escape(),
]