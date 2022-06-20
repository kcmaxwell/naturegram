const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const User = require('../../models/user');
const {
	seedDB,
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
	const seededUser = {
		username: 'user',
		password: 'pass'
	}
	const secondSeededUser = {
		username: 'user2',
		password: 'pass'
	}
	const noPostsUser = {
		username: 'following',
		password: 'pass'
	}
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
		await mongoose.connect(mongoServer.getUri(), { dbName: 'authTest' });

		await seedDB();
		loginResponse = await loginTest(seededUser);
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoServer.stop();
	});

	describe('GET user', () => {
		it('should return the requested user with a 200 OK', async () => {
			const response = await getUser(seededUser.username, loginResponse);
			expect(response.status).toBe(200);
		});

		it('should return 404 Not Found if the user does not exist', async () => {
			const response = await getUser('notAUser', loginResponse);
			expect(response.status).toBe(404);
		});
	});

	describe('GET followers', () => {
		beforeEach(async () => {
			await User.findOneAndUpdate(seededUser, { followers: [], following: [] });
			await User.findOneAndUpdate(secondSeededUser, { followers: [], following: [] });
		});

		it('should return 200 OK and the list of followers', async () => {
			const followRes = await putFollow(secondSeededUser.username, loginResponse);
			expect(followRes.status).toBe(200);

			const response = await getFollowers(secondSeededUser.username, loginResponse);
			expect(response.status).toBe(200);
			expect(response.body.length).toStrictEqual(1);
		});

		it('should return 200 OK and an empty array if there is no followers', async () => {
			const response = await getFollowers(secondSeededUser.username, loginResponse);
			expect(response.status).toBe(200);
			expect(response.body).toStrictEqual([]);
		});

		it('should return 400 for a bad username', async() => {
			const response = await getFollowers('notAUsername', loginResponse);
			expect(response.status).toBe(400);
		})
	});

	describe('GET following', () => {
		beforeEach(async () => {
			await User.findOneAndUpdate(seededUser, { followers: [], following: [] });
			await User.findOneAndUpdate(secondSeededUser, { followers: [], following: [] });
		});

		it('should return 200 OK and the list of followers', async () => {
			const followRes = await putFollow(secondSeededUser.username, loginResponse);
			expect(followRes.status).toBe(200);

			const response = await getFollowing(seededUser.username, loginResponse);
			expect(response.status).toBe(200);
			expect(response.body.length).toStrictEqual(1);
		});

		it('should return 200 OK and an empty array if there is no followers', async () => {
			const response = await getFollowing(seededUser.username, loginResponse);
			expect(response.status).toBe(200);
			expect(response.body).toStrictEqual([]);
		});

		it('should return 400 for a bad username', async() => {
			const response = await getFollowing('notAUsername', loginResponse);
			expect(response.status).toBe(400);
		})
	});

	describe('GET posts', () => {
		beforeEach(async () => {
			await User.findOneAndUpdate(noPostsUser, { posts: [] });
		});

		it('should return 200 OK and the list of posts', async () => {
			const noPostsLogin = await login(noPostsUser);

			const post = {
				description: 'Description of the picture',
				imageUrl:
					'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
				timestamp: Date.now(),
			};
			const postResponse = await postPost(post, noPostsLogin);
			expect(postResponse.status).toBe(201);
			expect(postResponse.body.id).toBeTruthy();

			const response = await getPosts(noPostsUser.username, noPostsLogin);
			expect(response.status).toBe(200);
			expect(response.body.length).toStrictEqual(1);
			expect(response.body[0].imageUrl).toStrictEqual(post.imageUrl);
		});

		it('should return 200 OK and an empty array if there are no posts', async () => {
			const response = await getPosts(noPostsUser.username, loginResponse);
			expect(response.status).toBe(200);
			expect(response.body).toStrictEqual([]);
		});
		
		it('should return 400 for a bad username', async() => {
			const response = await getPosts('notAUsername', loginResponse);
			expect(response.status).toBe(400);
		})
	});

	describe('GET saved posts', () => {
		let postId;
		beforeAll(async () => {
			const secondUserLogin = await login(secondSeededUser);
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
			await User.findOneAndUpdate(seededUser, { savedPosts: [] });
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
			await User.findOneAndUpdate(seededUser, { followers: [], following: [] });
			await User.findOneAndUpdate(secondSeededUser, { followers: [], following: [] });
		});

		it("should update both user's lists and return 200 OK", async () => {
			const followRes = await putFollow(secondSeededUser.username, loginResponse);
			expect(followRes.status).toBe(200);

			const first = await User.findOne({ username: seededUser.username });
			const second = await User.findOne({ username: secondSeededUser.username });

			expect(first.following).toContainEqual(second._id);
			expect(second.followers).toContainEqual(first._id);
		});

		it('should return 404 Not Found if the user to follow does not exist', async () => {
			const followRes = await putFollow('notAUser', loginResponse);
			expect(followRes.status).toBe(404);
		});

		it('should return 409 Conflict if the user already follows the other user', async () => {
			const followRes = await putFollow(secondSeededUser.username, loginResponse);
			expect(followRes.status).toBe(200);

			const secondFollowRes = await putFollow(
				secondSeededUser.username,
				loginResponse
			);
			expect(secondFollowRes.status).toBe(409);
		});
	});

	describe('PUT save post', () => {
		let postId;
		beforeAll(async () => {
			const secondUserLogin = await login(secondSeededUser);
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
