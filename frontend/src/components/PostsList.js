import { useCallback, useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import PostThumbnail from './PostThumbnail';

export default function PostsList({ username }) {
	const [userContext, setUserContext] = useContext(UserContext);
	const [posts, setPosts] = useState(null);

	const fetchPosts = useCallback(() => {
		fetch(process.env.REACT_APP_BACKEND + '/users/posts/' + username, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userContext.token}`,
			},
		}).then(async (res) => {
			if (res.ok) {
				const data = await res.json();
				setPosts(data);
			}
		});
	}, [userContext, username, setPosts]);

	useEffect(() => {
		if (userContext.details) {
			fetchPosts();
		}
	}, [userContext, fetchPosts]);

	return (
		<>
			{posts &&
				(posts === undefined || posts.length === 0 ? (
					<>
						<h1>POSTS IS EMPTY</h1>
					</>
				) : (
					<div className="postsContainer">
						{posts.map((post, i) => {
							return <PostThumbnail post={post} />;
						})}
					</div>
				))}
		</>
	);
}
