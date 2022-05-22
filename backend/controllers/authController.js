const passport = require("passport");
const jwt = require("jsonwebtoken");
const {
	getToken,
	COOKIE_OPTIONS,
	getRefreshToken,
} = require('../authenticate');
const { check, validationResult } = require('express-validator');


const User = require('../models/user');

exports.login = async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const token = getToken({ _id: req.user._id });
  const refreshToken = getRefreshToken({ _id: req.user._id });
  User.findById(req.user._id).then(
    (user) => {
      user.refreshToken.push({ refreshToken });
      user.save((err, user) => {
        if (err) {
          res.statusCode = 400;
          res.send(err);
        } else {
          res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
          res.send({ success: true, token });
        }
      });
    },
    (err) => next(err)
  );
}

exports.signup = async function (req, res, next) {
    // if (!req.body.fullName) {
    //     res.statusCode = 400;
    //     res.send({
    //       name: "FullNameError",
    //       message: "Full name is required",
    //     });
    //   } else {
    //     User.register(
    //       new User({ username: req.body.username, fullName: req.body.fullName }),
    //       req.body.password,
    //       (err, user) => {
    //         if (err) {
    //           res.statusCode = 400;
    //           res.send(err);
    //         } else {
    //           const token = getToken({ _id: user._id });
    //           const refreshToken = getRefreshToken({ _id: user._id });
    //           user.refreshToken.push({ refreshToken });
    //           user.save((err, user) => {
    //             if (err) {
    //               res.statusCode = 400;
    //               res.send(err);
    //             } else {
    //               res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    //               res.status(201);
    //               res.send({ success: true, token });
    //             }
    //           });
    //         }
    //       }
    //     );
    //   }

    User.findOne({
        username: req.body.username,
    }, async (err, user) => {
        if (err) throw err;
        if (user)
            res.sendStatus(409);
        else {
            User.register(new User({username: req.body.username, fullName: req.body.fullName}),
            req.body.password,
            (err, user) => {
                if (err) {
                    res.status(400);
                    res.send(err);
                } else {
                    const token = getToken({ _id: user._id });
					const refreshToken = getRefreshToken({ _id: user._id });
                    user.refreshToken.push({ refreshToken });
                    user.save((err, user) => {
                        if (err) {
                            res.status(400);
                            res.send(err);
                        } else {
                            res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
							res.status(201).send({ success: true, token: token });
                        }
                    })
                }
            })
        }
    })
}

exports.logout = async function (req, res, next) {
    res.sendStatus(501);
}

exports.refreshToken = async function (req, res, next) {
    res.sendStatus(501);
}