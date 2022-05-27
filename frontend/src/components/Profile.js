import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate, useParams } from 'react-router-dom';
import HTTP404 from "./HTTP404";

export default function Profile() {
    const navigate = useNavigate();
    const { username } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [userContext, setUserContext] = useContext(UserContext);
    const [notFoundError, setNotFoundError] = useState(null);
    const [error, setError] = useState('');

    const getUserInfo = useCallback(() => {
        fetch(process.env.REACT_APP_BACKEND + '/users/' + username, {
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
          body: JSON.stringify({username: username}),
        }).then(async (res) => {
          if (res.ok) {
            getUserInfo();
          } else if (res.status === 409) {
            setError('You already follow this user.');
          } else {
            setError('Error following user.');
          }
        })
      });

    return notFoundError ? (
      <><HTTP404 /></>
    ) : userInfo === null ? (
        <></>
    ) : !userInfo ? (
        <></>
    ) : (
        <>
            {error && <h1>{error}</h1>}
            <h1>{userInfo.username}'s Profile Page</h1>
            {userContext.details.username !== username && <button data-cy='follow' onClick={followUser}>Follow</button>}
            <button data-cy='followingList'>Following</button>
            <button data-cy='followersList'>Followers</button>
            <button data-cy='posts'>Posts</button>
            {userContext.details.username === username && <button data-cy='savedPosts'>Saved Posts</button>}
        </>
    )
}