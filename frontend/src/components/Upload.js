import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function Upload() {
	const navigate = useNavigate();
	const [userContext, setUserContext] = useContext(UserContext);
	const [image, setImage] = useState(null);
	const [error, setError] = useState('');
	const [description, setDescription] = useState('');
	const [imageUrl, setImageUrl] = useState('');

	const uploadFile = () => {
		setError('');

		fetch(
			process.env.REACT_APP_BACKEND +
				'/auth/signS3?' +
				new URLSearchParams({
					fileType: image.type,
					fileExt: image.name.split('.').pop(),
				}),
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userContext.token}`,
				},
			}
		).then(async (res) => {
			if (res.ok) {
				const data = await res.json();

				fetch(data.signedRequest, {
					method: 'PUT',
					body: image,
				}).then(async (res) => {
					if (!res.ok) {
						setError('S3 Upload Failed');
					} else {
						fetch(process.env.REACT_APP_BACKEND + '/posts/createPost', {
							method: 'POST',
							credentials: 'include',
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer ${userContext.token}`,
							},
							body: JSON.stringify({description, imageUrl: data.url, timestamp: Date.now()}),
						}).then(async (res) => {
							if (res.ok) {
								const data = await res.json();
								navigate('/post/' + data.id);
							}
						});
					}
				});
			}
		});
	};

	return (
		<>
			{error && <h1>{error}</h1>}
			<input
				type="file"
				data-cy="fileInput"
				onChange={(e) => setImage(e.target.files[0])}
			/>
			<input
				type="text"
				data-cy="description"
				onChange={(e) => setDescription(e.target.value)}
			/>
			<button onClick={uploadFile}>Submit</button>
		</>
	);
}
