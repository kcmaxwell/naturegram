const { nanoid } = require('nanoid');

const generateShortId = () => nanoid(12);

module.exports = generateShortId;