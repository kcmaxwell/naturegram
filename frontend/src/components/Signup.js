import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function Signup() {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [error, setError] = useState('');
	const [, setUserContext] = useContext(UserContext);

	const requestSignup = () => {
		const genericError = 'An error occurred. Please try again later.';
		setError('');

		fetch(process.env.REACT_APP_BACKEND + '/api/auth/signup', {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password, fullName: name }),
		})
			.then(async (res) => {
				if (res.status !== 201) {
					if (res.status === 409) {
						setError(
							'Username already exists, please choose another username.'
						);
					} else if (res.status === 400) {
						setError('Please fill all fields correctly.');
					} else {
						setError(genericError);
					}
				} else {
					const data = await res.json();
					setUserContext((oldValues) => {
						return { ...oldValues, token: data.token };
					});
                    navigate('/login');
				}
			})
			.catch((err) => {
				setError(genericError);
			});
	};

	return (
		<div className="form-page">
			<h1>Signup Page</h1>
			{error && <p data-cy="error">{error}</p>}
			<div>
				<label>Username:</label>
				<input
					type="text"
					name="username"
					data-cy="username"
					onChange={(e) => setUsername(e.target.value)}
				/>
			</div>
			<div>
				<label>Password:</label>
				<input
					type="text"
					name="password"
					data-cy="password"
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			<div>
				<label>Full Name:</label>
				<input
					type="text"
					name="fullname"
					data-cy="fullname"
					onChange={(e) => setName(e.target.value)}
				/>
			</div>
			<input
				type="submit"
				value="Submit"
				data-cy="submit"
				onClick={requestSignup}
			/>
		</div>
	);
}
