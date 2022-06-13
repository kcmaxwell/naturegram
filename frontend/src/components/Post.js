import React, { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import HTTP404 from './HTTP404';

export default function Post({post, ...props}) {
	const { postId } = useParams();
	const [postDetails, setPostDetails] = useState(null);
	const [author, setAuthor] = useState('');
	const [notFoundError, setNotFoundError] = useState(null);
	const [userContext, setUserContext] = useContext(UserContext);
	const thisPostId = postId ? postId : post._id;

	const fetchPostDetails = useCallback(() => {
		fetch(process.env.REACT_APP_BACKEND + '/posts/get/' + thisPostId, {
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
	}, [setPostDetails, setNotFoundError, thisPostId, userContext.token]);

	const fetchPostAuthor = useCallback(() => {
		fetch(process.env.REACT_APP_BACKEND + '/posts/author/' + thisPostId, {
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
	}, [setAuthor, thisPostId, userContext.token])

	useEffect(() => {
		if (!postDetails) {
			fetchPostDetails();
		}

		
	}, [fetchPostDetails, postDetails]);

	// useEffect(() => {
	// 	if (!author)
	// 		fetchPostAuthor();
	// }, [fetchPostAuthor, author])

	const likePost = async () => {
		await fetch(process.env.REACT_APP_BACKEND + '/posts/like/', {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userContext.token}`,
			},
			body: JSON.stringify({ postId: thisPostId }),
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
			body: JSON.stringify({ postId: thisPostId }),
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
			{React.cloneElement(props.children, {postDetails, transformTimestamp, likePost, savePost})}
		</>
	);
}
