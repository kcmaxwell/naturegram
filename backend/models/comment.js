const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {nanoid} = require('nanoid');

var CommentSchema = new Schema({
    _id: { type: String, default: () => nanoid(12) },
    user: { type: String, ref: 'User' },
    content: { type: String, required: true, maxlength: 2200 },
    timestamp: { type: Date, required: true },
    post: { type: String, ref: 'Post' },
    likes: [{ type: String, ref: 'User' }],
    topComment: { type: String, ref: 'Comment' },
    replies: [{ type: String, ref: 'Comment' }]
});

module.exports = mongoose.model('Comment', CommentSchema);