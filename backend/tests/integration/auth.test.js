const request = require('supertest');
const mongoose = require("mongoose");
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const User = require('../../models/user');

const { seedDB, signup, login, logout, getCurrentUser, signS3 } = require('../utils/request');
const { signupTest, loginTest } = require('../utils/common');

describe('Authentication', () => {
    let mongoServer;
    const seededUser = {
        username: 'user',
        password: 'pass',
    }
    const loginUser = {
        username: 'username',
        password: 'password',
    }
    const signupUser = {
        username: 'username',
        password: 'password',
        fullName: 'John Doe',
    }
    
    beforeAll(async () => {
        await mongoose.disconnect();
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri(), { dbName: 'authTest'})
    })

    afterAll(async () => {
        await mongoose.disconnect();
		await mongoServer.stop();
    });

    describe('POST login', () => {
        beforeEach(async() => {
            await seedDB();
        });

        it('should return 200 OK with good input', async() => {
            const response = await login(seededUser);
            expect(response.status).toBe(200);
        });

        it('should return 400 Bad Request with invalid input', async() => {
            const response = await login({username: '', password: 'password'});
            expect(response.status).toBe(400);
        });

        it('should return 401 Unauthorized with non existing username', async() => {
            const response = await login({username: 'notAUsername', password: seededUser.password })
            expect(response.status).toBe(401);
        });

        it('should return 401 Unauthorized with incorrect password', async() => {
            const response = await login({username: seededUser.username, password: 'notAPassword' })
            expect(response.status).toBe(401);
        });
    });
    
    describe('POST signup', () => {
        beforeEach(async() => {
            await seedDB();
        });

        it('should return 201 Created with good input', async() => {
            const response = await signup(signupUser);
            expect(response.status).toBe(201);

            const user = await User.findOne({username: signupUser.username})
            expect(user).toBeTruthy();
            expect(user.username).toEqual(signupUser.username);
        });

        it ('should return 409 Conflict if username already exists', async() => {
            const response = await signup(signupUser);
            expect(response.status).toBe(201);
            
            const badResponse = await signup(signupUser);
            expect(badResponse.status).toBe(409);
        });

        it('should return 400 Bad Request with invalid input', async() => {
            const response = await signup({username: 'username', password: 'password', fullName: ''});
            expect(response.status).toBe(400);
        });
    });

    describe('POST logout', () => {
        beforeEach(async() => {
            await seedDB();
        });

        it('should return 200 OK if logged in', async () => {
            const loginResponse = await login(seededUser);

            const logoutResponse = await logout(loginResponse);
            expect(logoutResponse.status).toBe(200);
        });

        it('should return 401 Unauthorized if not logged in', async () => {
            await request(app)
                .post('/api/auth/logout')
                .expect(401);
        });

    })

    describe('GET user info', () => {
        beforeEach(async() => {
            await seedDB();
        });

        it('should return 200 OK and the current user', async () => {
            const loginResponse = await login(seededUser);

            const userResponse = await getCurrentUser(loginResponse);
            expect(userResponse.status).toBe(200);
            expect(userResponse.body).toBeTruthy();
            expect(userResponse.body.username).toStrictEqual(seededUser.username);
        })
    });

    describe('GET signed S3 url', () => {
        let loginResponse;
        beforeAll(async () => {
            await seedDB();
            loginResponse = await login(seededUser);
        })

        it('should return 200 OK when provided a valid file type and extension', async () => {
            const response = await signS3('image', 'png', loginResponse);
            expect(response.status).toBe(200);
        })

        it('should return 400 when given invalid input', async () => {
            const response = await signS3('', '', loginResponse);
            expect(response.status).toBe(400);
        })
    });
})
