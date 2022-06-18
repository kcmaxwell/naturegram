const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const User = require('../../models/user');
const Post = require('../../models/post');

const {
	signup,
	login,
	getPost,
	postPost,
	getAuthor,
	likePost,
	getUser,
} = require('../utils/request');

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
		beforeEach(async () => {
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

		it('should return 404 Not Found if there is no post with that id', async () => {
			await Post.deleteMany();

			const post = await getPost(postId, loginResponse);
			expect(post.status).toBe(404);
		});
	});

	describe('GET post author', () => {
		let postId;
		beforeAll(async () => {
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

		it("should return 200 OK and the post's author", async () => {
			const response = await getAuthor(postId, loginResponse);
			expect(response.status).toBe(200);
			expect(response.body.username).toStrictEqual(signupUser.username);
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

			const foundPost = await Post.findById(response.body.id);
			expect(foundPost).toBeTruthy();
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

	describe('PUT like post', () => {
		let postId;
		beforeAll(async () => {
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

		beforeEach(async () => {
			await Post.findOneAndUpdate({ _id: postId }, { likes: [] });
		});

		it("should return 200 OK and add the user's id to the likes array", async () => {
			const userResponse = await getUser(signupUser.username, loginResponse);

			const response = await likePost(postId, loginResponse);
			expect(response.status).toBe(200);

			const foundPost = await Post.findOne({ _id: postId });
			expect(foundPost.likes.length).toStrictEqual(1);
			expect(foundPost.likes[0]).toBe(userResponse.body._id);
		});

		it("should return 200 OK and remove the user's id if the post was already liked", async () => {
			const response = await likePost(postId, loginResponse);
			expect(response.status).toBe(200);
			const secondResponse = await likePost(postId, loginResponse);
			expect(secondResponse.status).toBe(200);

			const foundPost = await Post.findOne({ _id: postId });
			expect(foundPost.likes.length).toStrictEqual(0);
		});
	});
});
