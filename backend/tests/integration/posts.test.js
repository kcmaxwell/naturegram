const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const User = require('../../models/user');
const Post = require('../../models/post');

const { signup, login, getPost, postPost } = require('../utils/request');

describe('Posts', () => {
	let mongoServer;
	let loginResponse;
	let userId;
	const signupUser = {
		username: 'username',
		password: 'password',
		fullName: 'John Doe',
	};

	beforeAll(async () => {
		await mongoose.disconnect();
		mongoServer = await MongoMemoryServer.create();
		//await mongoose.connect(process.env.MONGODB_TEST, { dbName: 'authTest' })
		await mongoose.connect(mongoServer.getUri(), { dbName: 'authTest' });

		const signupRes = await signup(signupUser);
		expect(signupRes.status).toBe(201);

		loginResponse = await login(signupUser);
		expect(loginResponse.status).toBe(200);

		// User.find({ username: signupUser.username }, (err, user) => {
		// 	if (err) throw err;
		// 	userId = user._id;
		// });
	});

	beforeEach(async () => {
		//await User.deleteMany();
		// const collections = await mongoose.connection.db.collections();
		// for (let collection of collections) {
		// 	await collection.deleteMany();
		// }
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoServer.stop();
	});

	describe('GET post', () => {
		let postId;
		beforeAll(async () => {
			// let post = new Post({
			// 	author: userId,
			// 	description: 'A post',
			// 	imageUrl:
			// 		'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
			// 	timestamp: Date.now(),
			// });
			// post.save((err, newPost) => {
			// 	if (err) throw err;
			// 	postId = newPost._id;
			// });

			let post = {
				description: 'A post',
				imageUrl:
					'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
				timestamp: Date.now(),
			};
			const response = await postPost(post, loginResponse);
			expect(response.status).toBe(201);
			postId = response.body.id;
		});

		it('should return 200 OK and the requested post', async () => {
			const post = await getPost(postId, loginResponse);
			expect(post.status).toBe(200);
		});

		it('should return 404 Not Found if the post id is invalid', async () => {
			const post = await getPost('notAPost', loginResponse);
			expect(post.status).toBe(404);
		});
	});

	describe('POST new post', () => {
		it('should return 200 OK and the id of the post', async () => {
			const post = {
				description: 'Description of the picture',
				imageUrl:
					'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
				timestamp: Date.now(),
			};

			const response = await postPost(post, loginResponse);

			expect(response.status).toBe(201);
			expect(response.body.id).toBeTruthy();
			// await Post.findById(response.body.id, (err, foundPost) => {
			//     expect(foundPost).toBeTruthy();
			// })
		});

		it('should return 400 Bad Request with invalid input', async () => {
			const post = {
				description: 'Description of the picture',
				imageUrl:
					'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
			};

			const response = await postPost(post, loginResponse);
			expect(response.status).toBe(400);
		});
	});
});
