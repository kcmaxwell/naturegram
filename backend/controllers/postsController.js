const Post = require('../models/post');

exports.getPost = async function (req, res, next) {
    Post.findById(req.body.postId, async (err, post) => {
        if (err) throw err;
        if (!post) res.sendStatus(404);
        else {
            res.status(200);
            res.send(post);
        }
    })
}

exports.createPost = async function (req, res, next) {
    
}