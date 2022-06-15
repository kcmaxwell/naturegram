const { seedDB, login, signup } = require('./request');

exports.loginTest = async (user) => {
	const loginResponse = await login(user);
	expect(loginResponse.status).toBe(200);
	return loginResponse;
};

exports.signupTest = async (user) => {
	const response = await signup(user);
	expect(response.status).toBe(201);
};
