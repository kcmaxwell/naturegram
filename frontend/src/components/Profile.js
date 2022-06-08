import { useCallback, useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import HTTP404 from './HTTP404';
import { useDetectOutsideClick } from '../hooks/useDetectOutsideClick';
import Popup from './Popup';
import FollowerList from './FollowerList';
import FollowingList from './FollowingList';
import PostsList from './PostsList';
import SavedPostsList from './SavedPostsList';

export default function Profile() {
	const navigate = useNavigate();
	const { username } = useParams();
	const [userInfo, setUserInfo] = useState(null);
	const [userContext, setUserContext] = useContext(UserContext);
	const [notFoundError, setNotFoundError] = useState(null);
	const [error, setError] = useState('');

	const [isPostsVisible, setIsPostsVisible] = useState(true);
	const [isSavedPostsVisible, setIsSavedPostsVisible] = useState(false);

	const popupRef = useRef(null);
	const [isFollowingActive, setIsFollowingActive] = useDetectOutsideClick(
		popupRef,
		false
	);
	const [isFollowersActive, setIsFollowersActive] = useDetectOutsideClick(
		popupRef,
		false
	);

	const getUserInfo = useCallback(() => {
		fetch(process.env.REACT_APP_BACKEND + '/users/getUser/' + username, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userContext.token}`,
			},
		}).then(async (res) => {
			if (res.ok) {
				const data = await res.json();
				setUserInfo(data);
			} else {
				if (res.status === 401) {
					// if the token has expired
					//window.location.reload();
				} else if (res.status === 404) {
					// there is no user with the given username
					setNotFoundError(true);
				} else if (res.status !== 304) {
					// null the details, unless 304 Not Modified is returned
					setUserInfo(null);
				}
			}
		});
	}, [setUserInfo, userContext.token, username, setNotFoundError]);

	const fetchUserDetails = useCallback(() => {
		fetch(process.env.REACT_APP_BACKEND + '/auth/userInfo', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userContext.token}`,
			},
		}).then(async (res) => {
			if (res.ok) {
				const data = await res.json();
				setUserContext((oldValues) => {
					return { ...oldValues, details: data };
				});
			} else {
				if (res.status === 401) {
					// if the token has expired
					//window.location.reload();
				} else if (res.status !== 304) {
					// null the details, unless 304 Not Modified is returned
					setUserContext((oldValues) => {
						return { ...oldValues, details: null };
					});
				}
			}
		});
	}, [setUserContext, userContext.token]);

	useEffect(() => {
		if (!userInfo) {
			getUserInfo();
		}

		if (!userContext.details) {
			fetchUserDetails();
		}
	}, [userInfo, getUserInfo, userContext.details, fetchUserDetails]);

	const followUser = useCallback(() => {
		setError('');

		fetch(process.env.REACT_APP_BACKEND + '/users/follow', {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userContext.token}`,
			},
			body: JSON.stringify({ username: username }),
		}).then(async (res) => {
			if (res.ok) {
				getUserInfo();
			} else if (res.status === 409) {
				setError('You already follow this user.');
			} else {
				setError('Error following user.');
			}
		});
	}, [setError, getUserInfo, userContext, username]);

	const clickPosts = () => {
		setIsPostsVisible(true);
		setIsSavedPostsVisible(false);
	};

	const clickSavedPosts = () => {
		setIsPostsVisible(false);
		setIsSavedPostsVisible(true);
	};

	return notFoundError ? (
		<>
			<HTTP404 />
		</>
	) : userInfo === null ? (
		<></>
	) : !userInfo ? (
		<></>
	) : (
		<>
			{error && <h1>{error}</h1>}
			<h1>{userInfo.username}'s Profile Page</h1>
			{userContext.details.username !== username && (
				<button data-cy="follow" onClick={followUser}>
					Follow
				</button>
			)}
			<button
				data-cy="followingList"
				onClick={() => setIsFollowingActive(!isFollowingActive)}
			>
				Following
			</button>
			<button
				data-cy="followersList"
				onClick={() => setIsFollowersActive(!isFollowersActive)}
			>
				Followers
			</button>
			<button data-cy="posts" onClick={clickPosts}>
				Posts
			</button>
			{userContext.details.username === username && (
				<button data-cy="savedPosts" onClick={clickSavedPosts}>
					Saved Posts
				</button>
			)}

			{isPostsVisible && (
				<div>
					<h1>IS POSTS VISIBLE</h1>
					<PostsList username={username} />
				</div>
			)}

      {isSavedPostsVisible && (
        <SavedPostsList username={username} />
      )}

			{isFollowingActive && (
				<Popup innerRef={popupRef}>
					<FollowingList username={username} />
				</Popup>
			)}
			{isFollowersActive && (
				<Popup innerRef={popupRef}>
					<FollowerList username={username} />
				</Popup>
			)}
		</>
	);
}
