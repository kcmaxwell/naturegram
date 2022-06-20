const User = require('../models/user');
const Post = require('../models/post');

exports.getUser = async function (req, res, next) {
	const user = await User.findOne({ username: req.params.username });
	if (user) {
		res.status(200);
		res.send(user);
	} else {
		res.sendStatus(404);
	}
};

exports.getFollowers = async function (req, res, next) {
	const user = await User.findOne({ username: req.params.username }).populate(
		'followers'
	);
	if (user) {
		res.status(200);
		res.send(user.followers);
	} else {
		res.sendStatus(400);
	}
};

exports.getFollowing = async function (req, res, next) {
	const user = await User.findOne({ username: req.params.username }).populate(
		'following'
	);
	if (user) {
		res.status(200);
		res.send(user.following);
	} else {
		res.sendStatus(400);
	}
};

exports.getPosts = async function (req, res, next) {
	const user = await User.findOne({ username: req.params.username }).populate(
		'posts'
	);
	if (user) {
		res.status(200);
		res.send(user.posts);
	} else {
		res.sendStatus(400);
	}
};

exports.getSavedPosts = async function (req, res, next) {
	const user = await User.findOne({ username: req.user.username }).populate(
		'savedPosts'
	);
	res.status(200);
	res.send(user.savedPosts);
};

exports.followUser = async function (req, res, next) {
	const followedUser = await User.findOne({ username: req.body.username });
	const followingUser = await User.findOne({ username: req.user.username });

	if (!followedUser || !followingUser) {
		res.sendStatus(404);
	} else {
		if (
			followedUser.followers.indexOf(followingUser._id) !== -1 ||
			followingUser.following.indexOf(followedUser._id) !== -1
		) {
			res.sendStatus(409);
		} else {
			followingUser.following.push(followedUser);
			followedUser.followers.push(followingUser);

			await followingUser.save();
			await followedUser.save();

			res.sendStatus(200);
		}
	}
};

exports.savePost = async (req, res, next) => {
	const user = await User.findOne({ username: req.user.username });
	user.savedPosts.push(req.body.postId);
	await user.save();
	res.sendStatus(200);
};
