import { useCallback, useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../context/UserContext';

export default function FollowingList({ username }) {
	const [userContext, setUserContext] = useContext(UserContext);
	const [following, setFollowing] = useState(null);

	const fetchFollowing = useCallback(() => {
		fetch(process.env.REACT_APP_BACKEND + '/api/users/following/' + username, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userContext.token}`,
			},
		}).then(async (res) => {
			if (res.ok) {
				const data = await res.json();
				setFollowing(data);
			}
		});
	}, [userContext, username, setFollowing]);

	useEffect(() => {
		if (userContext.details) {
			fetchFollowing();
		}
	}, [userContext, fetchFollowing]);

	return (
		<>
			<h1>Following</h1>
			{following &&
				(following === undefined || following.length === 0 ? (
					<></>
				) : (
					<ul>
						{following.map((user, i) => {
							return (
								<li key={i}>
									<a data-cy="following" href={'/user/' + user.username}>
										{user.username}
									</a>
								</li>
							);
						})}
					</ul>
				))}
		</>
	);
}
