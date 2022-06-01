const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true, maxlength: 2200 },
    imageUrl: { type: String, required: true },
    timestamp: { type: Date, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Post', PostSchema);