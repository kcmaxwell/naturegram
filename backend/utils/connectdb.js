const mongoose = require('mongoose');
const url =
	process.env.NODE_ENV === 'test'
		? process.env.MONGODB_TEST
		: process.env.MONGODB_PROD;

if (process.env.NODE_ENV !== 'jest') {
	const connect = mongoose.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	connect
		.then((db) => {
			console.log('connected to db');
		})
		.catch((err) => {
			console.log(err);
		});
}
