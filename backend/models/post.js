const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const generateShortId = require('../utils/nanoid')

const PostSchema = new Schema(
	{
		_id: { type: String, default: generateShortId },
		author: { type: String, ref: 'User' },
		description: { type: String, required: true, maxlength: 2200 },
		imageUrl: { type: String, required: true },
		timestamp: { type: String, required: true },
		comments: [{ type: String, ref: 'Comment' }],
		likes: [{ type: String, ref: 'User' }],
	},
	{ _id: false }
);

module.exports = mongoose.model('Post', PostSchema);;
