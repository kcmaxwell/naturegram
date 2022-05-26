const request = require('supertest');
const mongoose = require("mongoose");
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const User = require('../../models/user');

describe('Users', () => {
    let mongoServer;
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
    })

    beforeEach(async() => {
        await User.deleteMany();
        // const collections = await mongoose.connection.db.collections();

		// for (let collection of collections) {
		// 	await collection.deleteMany();
		// }
    });

    afterAll(async () => {
        await mongoose.disconnect();
		await mongoServer.stop();
    });

    describe('GET user', () => {
        let response;
        beforeEach(async () => {
            await request(app)
                .post('/auth/signup')
                .send(signupUser)
                .expect(201);

            response = await request(app)
                .post('/auth/login')
                .send(signupUser);
                expect(response.status).toBe(200);
        });

        it('should return the requested user with a 200 OK', async () => {
            const { header } = response;

            await request(app)
                .get('/users/username')
                .set({
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${response.body.token}`,
                })
                .set('Cookie', [...header['set-cookie']])
                .expect(200);
        })

        it('should return 404 Not Found if the user does not exist', async () => {
            const { header } = response;

            await request(app)
                .get('/users/notAUser')
                .set({
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${response.body.token}`,
                })
                .set('Cookie', [...header['set-cookie']])
                .expect(404);
        })
    });

    describe('PUT follow', () => {
        let response;
        beforeEach(async () => {
            await request(app)
            .post('/auth/signup')
            .send(signupUser)
            .expect(201);

            await request(app)
            .post('/auth/signup')
            .send(secondUser)
            .expect(201);

            response = await request(app)
                .post('/auth/login')
                .send(signupUser);

                expect(response.status).toBe(200);
        })

        it('should update both user\'s lists and return 200 OK', async () => {
            

            const { header } = response;

            await request(app)
                .put('/users/follow')
                .set({
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${response.body.token}`,
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
            const { header } = response;

            await request(app)
                .put('/users/follow')
                .set({
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${response.body.token}`,
                })
                .set('Cookie', [...header['set-cookie']])
                .send({username: 'notAUser'})
                .expect(404);
        })
    });
})