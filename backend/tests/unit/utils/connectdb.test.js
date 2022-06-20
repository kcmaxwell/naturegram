const mongoose = require('mongoose');
const { connectDB } = require('../../../utils/connectdb');

describe('connectDB', () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
        mongoose.disconnect();

        jest.resetModules()
        process.env = { ...OLD_ENV };
      });
      

    it('should connect to the test DB on NODE_ENV=test', async () => {
        process.env = { ...OLD_ENV, NODE_ENV: 'test' };
        await connectDB();

        expect(mongoose.connection.readyState).toStrictEqual(1);
        expect(mongoose.connection.name).toStrictEqual(process.env.MONGODB_TEST.split('/').pop());
    })

    it('should connect to the production DB on NODE_ENV=production', async () => {
        process.env = { ...OLD_ENV, NODE_ENV: 'production' };
        await connectDB();
        
        expect(mongoose.connection.readyState).toStrictEqual(1);
        expect(mongoose.connection.name).toStrictEqual(process.env.MONGODB_PROD.split('/').pop());
    })
})