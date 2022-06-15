const generateShortId = require('../../../utils/nanoid');

describe('Generate short id', () => {
	it('should return a string', () => {
        let id = generateShortId();
		expect(typeof id).toBe('string');
	});

	it('should have length same as length given', () => {
        let id = generateShortId();
		expect(id.length).toStrictEqual(12);
	});
});
