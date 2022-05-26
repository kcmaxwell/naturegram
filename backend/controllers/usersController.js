const User = require('../models/user');

exports.getUser = async function (req, res, next) {
	User.findOne({ username: req.params.username }, async (err, user) => {
		if (err) throw err;
		if (!user) {
			res.sendStatus(404);
		} else {
			res.status(200);
			res.send(user);
		}
	});
};

exports.followUser = async function (req, res, next) {
	// find if both users exist, then update their respective follow arrays
	User.findOne({ username: req.body.username }, async (err, followedUser) => {
		if (err) throw err;
		if (!followedUser) res.sendStatus(404);
		else {
			User.findById(req.user._id, async (err, followingUser) => {
				if (err) throw err;
				if (!followingUser) res.sendStatus(404);
				else {
					followingUser.following.push(followedUser._id);
					followingUser.save((err) => {
						if (err) {
							res.status(400);
							res.send(err);
						} else {
							followedUser.followers.push(followingUser._id);
							followedUser.save((err) => {
								if (err) {
									res.status(400);
									res.send(err);
								} else {
									res.sendStatus(200);
								}
							});
						}
					});
				}
			});
		}
	});
};
