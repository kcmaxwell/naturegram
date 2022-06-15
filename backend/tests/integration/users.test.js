const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const User = require('../../models/user');
const {
	signup,
	login,
	getUser,
	getFollowers,
	getFollowing,
	getPosts,
	getSavedPosts,
	putFollow,
	postPost,
	savePost,
} = require('../utils/request');

const { loginTest, signupTest } = require('../utils/common');

describe('Users', () => {
	let mongoServer;
	let loginResponse;
	const signupUser = {
		username: 'username',
		password: 'password',
		fullName: 'John Doe',
	};
	const secondUser = {
		username: 'userNumber2',
		password: 'password',
		fullName: 'Jane Doe',
	};

	beforeAll(async () => {
		await mongoose.disconnect();
		mongoServer = await MongoMemoryServer.create();
		//await mongoose.connect(process.env.MONGODB_TEST, { dbName: 'authTest' })
		await mongoose.connect(mongoServer.getUri(), { dbName: 'authTest' });

		// const firstSignup = await signup(signupUser);
		// const secondSignup = await signup(secondUser);
		// expect(firstSignup.status).toBe(201);
		// expect(secondSignup.status).toBe(201);
		await signupTest(signupUser);
		await signupTest(secondUser);

		// await request(app)
		//     .post('/auth/signup')
		//     .send(signupUser)
		//     .expect(201);

		//     await request(app)
		//     .post('/auth/signup')
		//     .send(secondUser)
		//     .expect(201);

		// loginResponse = await login(signupUser);
		// expect(loginResponse.status).toBe(200);
		loginResponse = await loginTest(signupUser);
	});

	// beforeEach(async() => {
	//     await User.deleteMany();
	//     // const collections = await mongoose.connection.db.collections();

	// 	// for (let collection of collections) {
	// 	// 	await collection.deleteMany();
	// 	// }
	// });

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoServer.stop();
	});

	describe('GET user', () => {
		it('should return the requested user with a 200 OK', async () => {
			const response = await getUser(signupUser.username, loginResponse);
			expect(response.status).toBe(200);
		});

		it('should return 404 Not Found if the user does not exist', async () => {
			const response = await getUser('notAUser', loginResponse);
			expect(response.status).toBe(404);
		});
	});

	describe('GET followers', () => {
		beforeEach(async () => {
			await User.findOneAndUpdate(signupUser, { followers: [], following: [] });
			await User.findOneAndUpdate(secondUser, { followers: [], following: [] });
		});

		it('should return 200 OK and the list of followers', async () => {
			const followRes = await putFollow(secondUser.username, loginResponse);
			expect(followRes.status).toBe(200);

			const response = await getFollowers(secondUser.username, loginResponse);
			expect(response.status).toBe(200);
			expect(response.body.length).toStrictEqual(1);
		});

		it('should return 200 OK and an empty array if there is no followers', async () => {
			const response = await getFollowers(secondUser.username, loginResponse);
			expect(response.status).toBe(200);
			expect(response.body).toStrictEqual([]);
		});
	});

	describe('GET following', () => {
		beforeEach(async () => {
			await User.findOneAndUpdate(signupUser, { followers: [], following: [] });
			await User.findOneAndUpdate(secondUser, { followers: [], following: [] });
		});

		it('should return 200 OK and the list of followers', async () => {
			const followRes = await putFollow(secondUser.username, loginResponse);
			expect(followRes.status).toBe(200);

			const response = await getFollowing(signupUser.username, loginResponse);
			expect(response.status).toBe(200);
			expect(response.body.length).toStrictEqual(1);
		});

		it('should return 200 OK and an empty array if there is no followers', async () => {
			const response = await getFollowing(signupUser.username, loginResponse);
			expect(response.status).toBe(200);
			expect(response.body).toStrictEqual([]);
		});
	});

	describe('GET posts', () => {
		beforeEach(async () => {
			await User.findOneAndUpdate(signupUser, { posts: [] });
		});

		it('should return 200 OK and the list of posts', async () => {
			const post = {
				description: 'Description of the picture',
				imageUrl:
					'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
				timestamp: Date.now(),
			};
			const postResponse = await postPost(post, loginResponse);
			expect(postResponse.status).toBe(201);
			expect(postResponse.body.id).toBeTruthy();

			const response = await getPosts(signupUser.username, loginResponse);
			expect(response.status).toBe(200);
			expect(response.body.length).toStrictEqual(1);
			expect(response.body[0].imageUrl).toStrictEqual(post.imageUrl);
		});

		it('should return 200 OK and an empty array if there are no posts', async () => {
			const response = await getPosts(signupUser.username, loginResponse);
			expect(response.status).toBe(200);
			expect(response.body).toStrictEqual([]);
		});
	});

	describe('GET saved posts', () => {
		let postId;
		beforeAll(async () => {
			const secondUserLogin = await login(secondUser);
			expect(secondUserLogin.status).toBe(200);

			const post = {
				description: 'Description of the picture',
				imageUrl:
					'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
				timestamp: Date.now(),
			};
			const postResponse = await postPost(post, loginResponse);
			expect(postResponse.status).toBe(201);
			expect(postResponse.body.id).toBeTruthy();
			postId = postResponse.body.id;
		});

		beforeEach(async () => {
			await User.findOneAndUpdate(signupUser, { savedPosts: [] });
		});

		it('should return 200 OK and the list of saved posts', async () => {
			const saveResponse = await savePost(postId, loginResponse);
			expect(saveResponse.status).toBe(200);

			const response = await getSavedPosts(loginResponse);
			expect(response.status).toBe(200);
			expect(response.body.length).toStrictEqual(1);
		});

		it('should return 200 OK and an empty array if there are no saved posts', async () => {
			const response = await getSavedPosts(loginResponse);
			expect(response.status).toBe(200);
			expect(response.body).toStrictEqual([]);
		});
	});

	describe('PUT follow', () => {
		beforeEach(async () => {
			await User.findOneAndUpdate(signupUser, { followers: [], following: [] });
			await User.findOneAndUpdate(secondUser, { followers: [], following: [] });
		});

		it("should update both user's lists and return 200 OK", async () => {
			const followRes = await putFollow(secondUser.username, loginResponse);
			expect(followRes.status).toBe(200);

			const first = await User.findOne({ username: signupUser.username });
			const second = await User.findOne({ username: secondUser.username });

			expect(first.following).toContainEqual(second._id);
			expect(second.followers).toContainEqual(first._id);
		});

		it('should return 404 Not Found if the user to follow does not exist', async () => {
			const followRes = await putFollow('notAUser', loginResponse);
			expect(followRes.status).toBe(404);
		});

		it('should return 409 Conflict if the user already follows the other user', async () => {
			const followRes = await putFollow(secondUser.username, loginResponse);
			expect(followRes.status).toBe(200);

			const secondFollowRes = await putFollow(
				secondUser.username,
				loginResponse
			);
			expect(secondFollowRes.status).toBe(409);
		});
	});

	describe('PUT save post', () => {
		let postId;
		beforeAll(async () => {
			const secondUserLogin = await login(secondUser);
			expect(secondUserLogin.status).toBe(200);

			const post = {
				description: 'Description of the picture',
				imageUrl:
					'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
				timestamp: Date.now(),
			};
			const postResponse = await postPost(post, loginResponse);
			expect(postResponse.status).toBe(201);
			expect(postResponse.body.id).toBeTruthy();
			postId = postResponse.body.id;
		});

		it('should return 200 OK', async () => {
			const response = await savePost(postId, loginResponse);
			expect(response.status).toBe(200);
		});
	});
});
