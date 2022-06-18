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
	const token = getToken({ _id: req.user._id });
	const refreshToken = getRefreshToken({ _id: req.user._id });
	const user = await User.findById(req.user._id);
	user.refreshToken.push({ refreshToken });
	await user.save();

	res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
	res.send({ success: true, token });
};

exports.signup = async function (req, res, next) {
	const user = await User.findOne({ username: req.body.username });
	if (user) {
		// send 409 Conflict if the username is taken
		res.sendStatus(409);
	} else {
		await User.register(
			new User({ username: req.body.username, fullName: req.body.fullName }),
			req.body.password
		);
		res.sendStatus(201);
	}
};

exports.logout = async function (req, res, next) {
	const { signedCookies } = req;
	const { refreshToken } = signedCookies;
	if (!refreshToken) {
		res.sendStatus(500);
		return;
	}
	const user = await User.findById(req.user._id);
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

	await user.save();
	res.clearCookie('refreshToken', COOKIE_OPTIONS);
	res.clearCookie('session-id', COOKIE_OPTIONS);
	res.send({ success: true });
};

exports.refreshToken = async function (req, res, next) {
	const { signedCookies } = req;
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
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const s3 = new aws.S3();
	const fileType = req.query.fileType;
	const fileKey =
		req.user.username + '_' + Date.now() + '.' + req.query.fileExt;
	const s3Params = {
		Bucket: process.env.S3_BUCKET,
		Key: fileKey,
		Expires: 60,
		ContentType: fileType,
		ACL: 'public-read',
	};

	const data = s3.getSignedUrl('putObject', s3Params);
	const returnData = {
		signedRequest: data,
		url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${fileKey}`,
	};

	res.send(JSON.stringify(returnData));
};
