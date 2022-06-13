const request = require('supertest');
const app = require('../../app');

exports.signup = async (user) => {
	return await request(app).post('/api/auth/signup').send(user);
};

exports.login = async (user) => {
	return await request(app).post('/api/auth/login').send(user);
};

exports.getUser = async (username, loginResponse) => {
	const { header } = loginResponse;
	const token = loginResponse.body.token;

	return await request(app)
		.get('/api/users/getUser/' + username)
		.set({
			'Content-Type': 'application/json',
			Authorization: `Bearer ${loginResponse.body.token}`,
		})
		.set('Cookie', [...header['set-cookie']]);
};

exports.getFollowers = async (username, loginResponse) => {
	const { header } = loginResponse;

	return await request(app)
		.get('/api/users/followers/' + username)
		.set({
			'Content-Type': 'application/json',
			Authorization: `Bearer ${loginResponse.body.token}`,
		})
		.set('Cookie', [...header['set-cookie']]);
};

exports.getFollowing = async (username, loginResponse) => {
	const { header } = loginResponse;

	return await request(app)
		.get('/api/users/following/' + username)
		.set({
			'Content-Type': 'application/json',
			Authorization: `Bearer ${loginResponse.body.token}`,
		})
		.set('Cookie', [...header['set-cookie']]);
};

exports.getPosts = async (username, loginResponse) => {
	const { header } = loginResponse;

	return await request(app)
		.get('/api/users/posts/' + username)
		.set({
			'Content-Type': 'application/json',
			Authorization: `Bearer ${loginResponse.body.token}`,
		})
		.set('Cookie', [...header['set-cookie']]);
};

exports.getSavedPosts = async (loginResponse) => {
	const { header } = loginResponse;

	return await request(app)
		.get('/api/users/savedPosts')
		.set({
			'Content-Type': 'application/json',
			Authorization: `Bearer ${loginResponse.body.token}`,
		})
		.set('Cookie', [...header['set-cookie']]);
};

exports.putFollow = async (usernameToFollow, loginResponse) => {
	const { header } = loginResponse;

	return await request(app)
		.put('/api/users/follow')
		.set({
			'Content-Type': 'application/json',
			Authorization: `Bearer ${loginResponse.body.token}`,
		})
		.set('Cookie', [...header['set-cookie']])
		.send({ username: usernameToFollow });
};

exports.getPost = async (postId, loginResponse) => {
	const { header } = loginResponse;

	return await request(app)
		.get('/api/posts/get/' + postId)
		.set({
			'Content-Type': 'application/json',
			Authorization: `Bearer ${loginResponse.body.token}`,
		})
		.set('Cookie', [...header['set-cookie']]);
};

exports.getAuthor = async (postId, loginResponse) => {
	const { header } = loginResponse;

	return await request(app)
		.get('/api/posts/author/' + postId)
		.set({
			'Content-Type': 'application/json',
			Authorization: `Bearer ${loginResponse.body.token}`,
		})
		.set('Cookie', [...header['set-cookie']]);
}

exports.postPost = async (post, loginResponse) => {
	const { header } = loginResponse;

	return await request(app)
		.post('/api/posts/createPost')
		.set({
			'Content-Type': 'application/json',
			Authorization: `Bearer ${loginResponse.body.token}`,
		})
		.set('Cookie', [...header['set-cookie']])
		.send(post);
};

exports.likePost = async (postId, loginResponse) => {
	const { header } = loginResponse;

	return await request(app)
		.put('/api/posts/like')
		.set({
			'Content-Type': 'application/json',
			Authorization: `Bearer ${loginResponse.body.token}`,
		})
		.set('Cookie', [...header['set-cookie']])
		.send({ postId });
}

exports.savePost = async (postId, loginResponse) => {
	const { header } = loginResponse;

	return await request(app)
		.put('/api/users/savePost')
		.set({
			'Content-Type': 'application/json',
			Authorization: `Bearer ${loginResponse.body.token}`,
		})
		.set('Cookie', [...header['set-cookie']])
		.send({ postId });
};
