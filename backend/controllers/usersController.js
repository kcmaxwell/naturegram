const User = require('../models/user');
const Post = require('../models/post');

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

exports.getFollowers = async function (req, res, next) {
	User.findOne({username: req.params.username }).populate('followers').exec((err, user) => {
		if (err) throw err;
		if (!user) {
			res.sendStatus(400);
		} else {
			res.status(200);
			res.send(user.followers);
		}
	})
}

exports.getFollowing = async function (req, res, next) {
	User.findOne({username: req.params.username }).populate('following').exec((err, user) => {
		if (err) throw err;
		if (!user) {
			res.sendStatus(400);
		} else {
			res.status(200);
			res.send(user.following);
		}
	})
}

exports.getPosts = async function (req, res, next) {
	User.findOne({username: req.params.username}).populate('posts').exec((err, user) => {
		if (err) throw err;
		if (!user) {
			res.sendStatus(400);
		} else {
			res.status(200);
			res.send(user.posts);
		}
	})
}

exports.getSavedPosts = async function (req, res, next) {
	User.findOne({username: req.user.username}).populate('savedPosts').exec((err, user) => {
		if (err) throw err;
		if (!user) {
			res.sendStatus(400);
		} else {
			res.status(200);
			res.send(user.savedPosts);
		}
	})
}

exports.followUser = async function (req, res, next) {
	// find if both users exist, then update their respective follow arrays
	// User.findOne({ username: req.body.username }, async (err, followedUser) => {
	// 	if (err) throw err;
	// 	if (!followedUser) res.sendStatus(404);
	// 	else {
	// 		User.findOne({username: req.user.username}, async (err, followingUser) => {
	// 			if (err) throw err;
	// 			if (!followingUser) res.sendStatus(404);
	// 			else {
	// 				followingUser.following.push(followedUser);
	// 				followingUser.save((err, doc) => {
	// 					if (err) {
	// 						res.status(400);
	// 						res.send(err);
	// 					}
	// 				});
	// 				followedUser.followers.push(followingUser);
	// 				followedUser.save((err, doc) => {
	// 					if (err) {
	// 						res.status(400);
	// 						res.send(err);
	// 					} else {
	// 						res.sendStatus(200);
	// 					}
	// 				});
	// 			}
	// 		});
	// 	}
	// });

	User.findOne({ username: req.body.username }, async (err, followedUser) => {
		if (err) throw err;
		if (!followedUser) res.sendStatus(404);
		else {
			User.findOne(
				{ username: req.user.username },
				async (err, followingUser) => {
					if (err) throw err;
					if (!followingUser) res.sendStatus(404);
					else {
						// check if the user follows the other already
						if (
							followedUser.followers.indexOf(followingUser._id) !== -1 ||
							followingUser.following.indexOf(followedUser._id) !== -1
						) {
							res.sendStatus(409);
						} else {
							followingUser.following.push(followedUser);
							followingUser.save((err, doc) => {
								if (err) {
									res.status(400);
									res.send(err);
								} else {
									followedUser.followers.push(followingUser);
									followedUser.save((err, doc) => {
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
					}
				}
			);
		}
	});

	// let followedUserId;
	// User.findOne({ username: req.body.username }, async (err, followedUser) => {
	// 	if (err) throw err;
	// 	if (!followedUser) res.sendStatus(404);
	// 	else {
	// 		followedUserId = followedUser._id;
	// 		followedUser.followers.push(req.user._id);
	// 		followedUser.save((err, doc) => {
	// 			if (err) {
	// 				res.status(400);
	// 				res.send(err);
	// 			}
	// 		});
	// 	}
	// });
	// User.findById(req.user._id, async (err, followingUser) => {
	// 	if (err) throw err;
	// 	if (!followingUser) res.sendStatus(404);
	// 	else {
	// 		followingUser.following.push(followedUserId);
	// 		followingUser.save((err, doc) => {
	// 			if (err) {
	// 				res.status(400);
	// 				res.send(err);
	// 			} else {
	// 				res.sendStatus(200);
	// 			}
	// 		})
	// 	}
	// })
};

exports.savePost = async (req, res, next) => {
	// Post.find({_id: req.params.postId}, async (err, post) => {
	// })
	User.findOne({username: req.user.username}, async (err, user) => {
		if (err) throw err;
		if (!user) {
			res.sendStatus(400);
		} else {
			user.savedPosts.push(req.body.postId);
			user.save((err, saved) => {
				if (err) throw err;
				if (!saved) {
					res.sendStatus(400);
				} else {
					res.sendStatus(200);
				}
			})
		}
	})
}