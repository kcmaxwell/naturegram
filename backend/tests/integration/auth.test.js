const request = require('supertest');
const mongoose = require("mongoose");
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const User = require('../../models/user');

describe('Authentication', () => {
    let mongoServer;
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
    //    mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(process.env.MONGODB_TEST, { dbName: 'authTest' })
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
		//await mongoServer.stop();
    });

    describe('POST login', () => {
        beforeEach(async () => {
            await request(app)
                .post('/auth/signup')
                .send(signupUser)
                .expect(201);
        });

        it('should return 200 OK with good input', async() => {
            await request(app)
                .post('/auth/login')
                .send(loginUser)
                .expect(200);
        });

        it('should return 400 Bad Request with invalid input', async() => {
            await request(app)
            .post('/auth/login')
            .send({username: '', password: 456 })
            .expect(400);
        });

        it('should return 401 Unauthorized with non existing username', async() => {
            await request(app)
                .post('/auth/login')
                .send({username: 'notAUsername', password: loginUser.password })
                .expect(401);
        });

        it('should return 401 Unauthorized with incorrect password', async() => {
            await request(app)
            .post('/auth/login')
            .send({username: loginUser.username, password: 'notAPassword' })
            .expect(401);
        });
    });
    
    describe('POST signup', () => {
        it('should return 201 Created with good input', async() => {
            await request(app)
                .post('/auth/signup')
                .send(signupUser)
                .expect(201);

            const user = await User.findOne({username: signupUser.username})
            expect(user.username).toEqual(signupUser.username);
        });

        it ('should return 409 Conflict if username already exists', async() => {
            await request(app)
                .post('/auth/signup')
                .send(signupUser)
                .expect(201);
            
            await request(app)
                .post('/auth/signup')
                .send(signupUser)
                .expect(409);
        });

        it('should return 400 Bad Request with invalid input', async() => {
            await request(app)
                .post('/auth/signup')
                .send({username: 'username', password: 'password', fullName: ''})
                .expect(400);
        });
    });
})
