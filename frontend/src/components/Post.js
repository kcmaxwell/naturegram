import { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import HTTP404 from './HTTP404';

export default function Post() {
	const { postId } = useParams();
	const [postDetails, setPostDetails] = useState(null);
	const [author, setAuthor] = useState('');
	const [notFoundError, setNotFoundError] = useState(null);
	const [userContext, setUserContext] = useContext(UserContext);

	const fetchPostDetails = useCallback(() => {
		fetch(process.env.REACT_APP_BACKEND + '/posts/get/' + postId, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userContext.token}`,
			},
		}).then(async (res) => {
			if (res.ok) {
				const data = await res.json();
				setPostDetails(data);
			} else {
				if (res.status === 404) {
					setNotFoundError(true);
				} else if (res.status !== 304) {
					// null the details, unless 304 Not Modified is returned
					setPostDetails(null);
				}
			}
		});
	}, [setPostDetails, setNotFoundError, postId, userContext.token]);

	const fetchPostAuthor = useCallback(() => {
		fetch(process.env.REACT_APP_BACKEND + '/posts/author/' + postId, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userContext.token}`,
			},
		}).then(async (res) => {
			if (res.ok) {
				const data = await res.json();
				setAuthor(data);
			}
		})
	}, [setAuthor, postId, userContext.token])

	useEffect(() => {
		if (!postDetails) {
			fetchPostDetails();
		}

		
	}, [fetchPostDetails, postDetails]);

	useEffect(() => {
		if (!author)
			fetchPostAuthor();
	}, [fetchPostAuthor, author])

	const likePost = async () => {
		await fetch(process.env.REACT_APP_BACKEND + '/posts/like/', {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userContext.token}`,
			},
			body: JSON.stringify({ postId }),
		}).then(async (res) => {
			if (res.ok) {
				fetchPostDetails();
			}
		});
	}

	const savePost = async () => {
		await fetch(process.env.REACT_APP_BACKEND + '/users/savePost', {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userContext.token}`,
			},
			body: JSON.stringify({ postId }),
		});
	}

	const transformTimestamp = () => {
		return 'TIMESTAMP';
	};

	return notFoundError ? (
		<>
			<HTTP404 />
		</>
	) : postDetails === null ? (
		<></>
	) : !postDetails ? (
		<></>
	) : (
		<>
			<h1>Post {postDetails.id}</h1>
			<img src={postDetails.imageUrl} data-cy="image" />
			{author && <p data-cy="author">Posted by {author.username}</p>}
			<p data-cy='description'>{postDetails.description}</p>
			<p data-cy="timestamp">{transformTimestamp()}</p>
			<button data-cy="likePost" onClick={likePost}>Like</button>
			<p data-cy="likes">{postDetails.likes.length}</p>
			<button data-cy='savePost' onClick={savePost}>Save</button>

			<p data-cy='commentList'>This is where comments would go...IF I HAD ANY</p>
		</>
	);
}
