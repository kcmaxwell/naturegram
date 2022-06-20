const mongoose = require('mongoose');

exports.connectDB = async () => {
	const url =
	process.env.NODE_ENV === 'test'
		? process.env.MONGODB_TEST
		: process.env.MONGODB_PROD;

	if (process.env.NODE_ENV !== 'jest') {
		const connect = await mongoose.connect(url);
		console.log('connected to db');
		// connect
		// 	.then((db) => {
		// 		console.log('connected to db');
		// 	})
		// 	.catch((err) => {
		// 		console.log(err);
		// 	});
	}
}