module.exports = {
	setupFiles: ['dotenv/config'],
	collectCoverage: true,
	collectCoverageFrom: [
		'./controllers/**',
		'./models/**',
		'./middleware/**',
		'./routes/**',
		'./strategies/**',
		'./utils/**',
		'./app.js',
		'./authenticate.js',
	],
};
