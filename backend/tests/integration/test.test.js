const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { seedDB } = require('../utils/request');
const User = require('../../models/user');
const Post = require('../../models/post');

describe('Test route', () => {
	let mongoServer;

	beforeAll(async () => {
		await mongoose.disconnect();
		mongoServer = await MongoMemoryServer.create();
		await mongoose.connect(mongoServer.getUri(), { dbName: 'testTest' });
	});
    
    beforeEach(async () => {
        await User.deleteMany();
        await Post.deleteMany();
    })

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoServer.stop();
	});

	describe('POST seed DB', () => {
		it('should return 200 OK', async () => {
			const response = await seedDB();
			expect(response.status).toBe(200);
		});

		it('should seed the users collection', async () => {
			await seedDB();

			const user = await User.findOne({ username: 'user' });
			expect(user).toBeTruthy();
		});

		it('should seed the posts collection', async () => {
			await seedDB();

			const post = await Post.findOne({ _id: 'VBg2buHoQJXl' });
			expect(post).toBeTruthy();
		});
	});
});
