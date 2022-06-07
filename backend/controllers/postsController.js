const Post = require('../models/post');
const User = require('../models/user');
const mongoose = require('mongoose');

exports.getPost = async function (req, res, next) {
	if (mongoose.Types.ObjectId.isValid(req.params.postId)) {
		Post.findById(req.params.postId, async (err, post) => {
			if (err) throw err;
			if (!post) res.sendStatus(404);
			else {
				res.status(200);
				res.send(post);
			}
		});
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

	post.save((err, post) => {
		if (err) {
			res.status(400);
			res.send(err);
		} else {
			User.findById(req.user._id, (err, author) => {
				if (err) throw err;
				if (!author) res.sendStatus(400);
				else {
					author.posts.push(post._id);
					author.save((err, user) => {
						if (err) {
							res.status(400);
							res.send(err);
						} else {
							res.status(201);
							res.send({ success: true, id: post._id });
						}
					});
				}
			});
			// let author = User.findById(req.user._id);
			// if (author) {
			// 	author.posts.push(post);
			// 	author.save((err, user) => {
			// 		if (err) {
			// 			res.status(400);
			// 			res.send(err);
			// 		} else {
			// 			res.status(201);
			// 			res.send({ success: true, id: post._id });
			// 		}
			// 	});
		}
	});
};
