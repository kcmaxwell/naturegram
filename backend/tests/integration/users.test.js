const request = require('supertest');
const mongoose = require("mongoose");
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const User = require('../../models/user');

describe('Users', () => {
    let mongoServer;
    let loginResponse;
    const signupUser = {
        username: 'username',
        password: 'password',
        fullName: 'John Doe',
    }
    const secondUser = {
        username: 'userNumber2',
        password: 'password',
        fullName: 'Jane Doe',
    }

    beforeAll(async () => {
        await mongoose.disconnect();
        mongoServer = await MongoMemoryServer.create();
        //await mongoose.connect(process.env.MONGODB_TEST, { dbName: 'authTest' })
        await mongoose.connect(mongoServer.getUri(), { dbName: 'authTest'})

        await request(app)
            .post('/auth/signup')
            .send(signupUser)
            .expect(201);

            await request(app)
            .post('/auth/signup')
            .send(secondUser)
            .expect(201);

            loginResponse = await request(app)
                .post('/auth/login')
                .send(signupUser);

            expect(loginResponse.status).toBe(200);
    })

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
            const { header } = loginResponse;

            await request(app)
                .get('/users/username')
                .set({
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loginResponse.body.token}`,
                })
                .set('Cookie', [...header['set-cookie']])
                .expect(200);
        })

        it('should return 404 Not Found if the user does not exist', async () => {
            const { header } = loginResponse;

            await request(app)
                .get('/users/notAUser')
                .set({
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loginResponse.body.token}`,
                })
                .set('Cookie', [...header['set-cookie']])
                .expect(404);
        })
    });

    describe('PUT follow', () => {
        beforeEach(async () => {
            await User.findOneAndUpdate(signupUser, {followers: [], following: []});
            await User.findOneAndUpdate(secondUser, {followers: [], following: []});
        })

        it('should update both user\'s lists and return 200 OK', async () => {
            const { header } = loginResponse;

            await request(app)
                .put('/users/follow')
                .set({
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loginResponse.body.token}`,
                })
                .set('Cookie', [...header['set-cookie']])
                .send({username: secondUser.username})
                .expect(200);

            const first = await User.findOne({username: signupUser.username});
            const second = await User.findOne({username: secondUser.username});

            expect(first.following).toContainEqual(second._id);
            expect(second.followers).toContainEqual(first._id);
        });

        it('should return 404 Not Found if the user to follow does not exist', async () => {
            const { header } = loginResponse;

            await request(app)
                .put('/users/follow')
                .set({
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loginResponse.body.token}`,
                })
                .set('Cookie', [...header['set-cookie']])
                .send({username: 'notAUser'})
                .expect(404);
        });

        it('should return 409 Conflict if the user already follows the other user', async () => {
            const { header } = loginResponse;

            await request(app)
                .put('/users/follow')
                .set({
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loginResponse.body.token}`,
                })
                .set('Cookie', [...header['set-cookie']])
                .send({username: secondUser.username})
                .expect(200);

                await request(app)
                .put('/users/follow')
                .set({
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loginResponse.body.token}`,
                })
                .set('Cookie', [...header['set-cookie']])
                .send({username: secondUser.username})
                .expect(409);
        });
    });
})