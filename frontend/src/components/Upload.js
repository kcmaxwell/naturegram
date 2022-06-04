import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function Upload() {
	const [userContext, setUserContext] = useContext(UserContext);
	const [image, setImage] = useState(null);
	const [error, setError] = useState('');
	const [imageUrl, setImageUrl] = useState('');

	const uploadFile = () => {
		setError('');

		fetch(
			process.env.REACT_APP_BACKEND +
				'/auth/signS3?' +
				new URLSearchParams({ fileType: image.type,
                fileExt: image.name.split('.').pop() }),
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
                        setImageUrl(data.url);
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
			<button onClick={uploadFile}>Submit</button>
			<img id="preview" src={imageUrl} />
		</>
	);
}
