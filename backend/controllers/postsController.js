const Post = require('../models/post');
const User = require('../models/user');
const mongoose = require('mongoose');

exports.getPost = async function (req, res, next) {
	if (mongoose.Types.ObjectId.isValid(req.params.postId)) {
		const post = await Post.findById(req.params.postId);
		if (post) {
			let postWithAuthor = await Post.findById(req.params.postId).populate(
				'author'
			);
			post.author = postWithAuthor.author;
			res.status(200);
			res.send(post);
		} else {
			res.sendStatus(404);
		}
	} else {
		res.sendStatus(404);
	}
};

exports.getAuthor = async function (req, res, next) {
	if (mongoose.Types.ObjectId.isValid(req.params.postId)) {
		const post = await Post.findById(req.params.postId).populate('author');
		if (!post) res.sendStatus(404);
		else {
			res.status(200);
			res.send(post.author);
		}
	} else {
		res.sendStatus(404);
	}
};

exports.createPost = async function (req, res, next) {
	let post = new Post({
		author: req.user._id,
		description: req.body.description,
		imageUrl: req.body.imageUrl,
		timestamp: req.body.timestamp,
	});

	try {
		const author = await User.findById(req.user._id);

		await post.save();

		author.posts.push(post._id);
		await author.save();

		res.status(201);
		res.send({ success: true, id: post._id });
	} catch (err) {
		res.sendStatus(400);
	}
};

exports.likePost = async function (req, res, next) {
	const post = await Post.findOne({ _id: req.body.postId });
	if (!post) res.sendStatus(400);
	else {
		const userIndex = post.likes.indexOf(req.user._id);
		if (userIndex !== -1) {
			post.likes.splice(userIndex, 1);
		} else {
			post.likes.push(req.user._id);
		}
		post.save();
		res.sendStatus(200);
	}
};
