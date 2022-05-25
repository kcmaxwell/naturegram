import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const navigate = useNavigate();
    const [userContext, setUserContext] = useContext(UserContext);
    const [error, setError] = useState('');

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
        if (!userContext.details) {
          fetchUserDetails();
        }
      }, [userContext.details, fetchUserDetails]);

    return userContext.details === null ? (
        <></>
    ) : !userContext.details ? (
        <></>
    ) : (
        <>
            <h1>{userContext.details.username}'s Profile Page</h1>
            <button data-cy='followingList'>Following</button>
            <button data-cy='followersList'>Followers</button>
            <button data-cy='posts'>Posts</button>
            <button data-cy='savedPosts'>Saved Posts</button>
        </>
    )
}