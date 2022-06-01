const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CommentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true, maxlength: 2200 },
    timestamp: { type: DataTransfer, required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    topComment: { type: Schema.Types.ObjectId, ref: 'Comment' },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = mongoose.model('Comment', CommentSchema);