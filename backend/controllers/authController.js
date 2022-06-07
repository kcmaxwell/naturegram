const passport = require('passport');
const jwt = require('jsonwebtoken');
const {
	getToken,
	COOKIE_OPTIONS,
	getRefreshToken,
} = require('../authenticate');
const { check, validationResult } = require('express-validator');
const aws = require('aws-sdk');

const User = require('../models/user');

exports.login = async function (req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
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
					res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
					res.send({ success: true, token });
				}
			});
		},
		(err) => next(err)
	);
};

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

	User.findOne(
		{
			username: req.body.username,
		},
		async (err, user) => {
			if (err) throw err;
			if (user) res.sendStatus(409);
			else {
				User.register(
					new User({
						username: req.body.username,
						fullName: req.body.fullName,
					}),
					req.body.password,
					(err, user) => {
						if (err) {
							res.status(400);
							res.send(err);
						} else {
							// const token = getToken({ _id: user._id });
							// const refreshToken = getRefreshToken({ _id: user._id });
							// user.refreshToken.push({ refreshToken });
							// user.save((err, user) => {
							// 	if (err) {
							// 		res.status(400);
							// 		res.send(err);
							// 	} else {
							// 		res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
							// 		res.status(201).send({ success: true, token: token });
							// 	}
							// });
							res.status(201).send({success: true});
						}
					}
				);
			}
		}
	);
};

exports.logout = async function (req, res, next) {
	const { signedCookies = {} } = req;
	const { refreshToken } = signedCookies;
	if (!refreshToken) {
		res.sendStatus(500);
		return;
	}

	User.findById(req.user._id).then(
		async (user) => {
			if (!user) {
				res.sendStatus(500);
				return;
			}

			const tokenIndex = user.refreshToken.findIndex(
				(item) => item.refreshToken === refreshToken
			);

			if (tokenIndex !== -1) {
				await user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
			}

			user.save((err, user) => {
				if (err) {
					res.statusCode = 500;
					res.send(err);
				} else {
					res.clearCookie('refreshToken', COOKIE_OPTIONS);
					res.clearCookie('session-id', COOKIE_OPTIONS);
					res.send({ success: true });
				}
			});
		},
		(err) => next(err)
	);
};

exports.refreshToken = async function (req, res, next) {
	const { signedCookies = {} } = req;
	const { refreshToken } = signedCookies;

	if (refreshToken) {
		try {
			const payload = jwt.verify(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET
			);
			const userId = payload._id;
			User.findOne({ _id: userId }).then(
				(user) => {
					if (user) {
						// Find the refresh token against the user record in database
						const tokenIndex = user.refreshToken.findIndex(
							(item) => item.refreshToken === refreshToken
						);

						if (tokenIndex === -1) {
							res.statusCode = 401;
							res.send('Unauthorized');
						} else {
							const token = getToken({ _id: userId });
							// If the refresh token exists, then create new one and replace it.
							const newRefreshToken = getRefreshToken({ _id: userId });
							user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };
							user.save((err, user) => {
								if (err) {
									res.statusCode = 500;
									res.send(err);
								} else {
									res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);
									res.send({ success: true, token });
								}
							});
						}
					} else {
						res.statusCode = 401;
						res.send('Unauthorized');
					}
				},
				(err) => next(err)
			);
		} catch (err) {
			res.statusCode = 401;
			res.send('Unauthorized');
		}
	} else {
		res.statusCode = 401;
		res.send('Unauthorized');
	}
};

exports.userInfo = async function (req, res, next) {
  res.send(req.user);
};

exports.signS3 = async function (req, res, next) {
	const s3 = new aws.S3();
	//const fileName = req.body.fileName;
	const fileType = req.query.fileType;
	const fileKey = req.user.username + '_' + Date.now() + '.' + req.query.fileExt;
	const s3Params = {
		Bucket: process.env.S3_BUCKET,
		//Key: fileName,
		Key: fileKey,
		Expires: 60,
		ContentType: fileType,
		ACL: 'public-read',
	};

	s3.getSignedUrl('putObject', s3Params, (err, data) => {
		if (err) {
			throw err;
		}

		const returnData = {
			signedRequest: data,
			url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${fileKey}`
		};

		res.send(JSON.stringify(returnData));
	});
}