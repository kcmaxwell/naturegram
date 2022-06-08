import { useCallback, useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../context/UserContext';

export default function FollowerList({ username }) {
	const [userContext, setUserContext] = useContext(UserContext);
	const [followers, setFollowers] = useState(null);

	const fetchFollowers = useCallback(() => {
		fetch(process.env.REACT_APP_BACKEND + '/users/followers/' + username, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userContext.token}`,
			},
		}).then(async (res) => {
			if (res.ok) {
				const data = await res.json();
				setFollowers(data);
			}
		});
	}, [userContext, username, setFollowers]);

	useEffect(() => {
		if (userContext.details) {
			fetchFollowers();
		}
	}, [userContext, fetchFollowers]);

	return (
		<>
			<h1>Followers</h1>
			{followers &&
				(followers === undefined || followers.length === 0 ? (
					<></>
				) : (
					<ul>
						{followers.map((follower, i) => {
							return (
								<li key={i}>
									<a data-cy="follower" href={'/user/' + follower.username}>
										{follower.username}
									</a>
								</li>
							);
						})}
					</ul>
				))}
		</>
	);
}
