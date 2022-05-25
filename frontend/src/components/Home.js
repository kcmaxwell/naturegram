import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    const [userContext, setUserContext] = useContext(UserContext);
    const [error, setError] = useState('');

    const logout = () => {
        setError('');

        fetch(process.env.REACT_APP_BACKEND + '/auth/logout', {
            method: 'POST',
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userContext.token}`,
            },
          }).then(async (response) => {
            if (response.ok) {
              setUserContext((oldValues) => {
                return { ...oldValues, details: null, token: null };
              });
              window.localStorage.setItem("logout", Date.now());
            } else {
              setError('Error logging out.');
            }
          });
    }
  
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
      <>
        {error && <h1>{error}</h1>}
        <h1>Please login first.</h1>
      </>
    ) : userContext.details ? (
        <>
        {error && <h1>{error}</h1>}
        <h1>Welcome to Naturegram!</h1>
        <h2>{userContext.details.username}</h2>
        <button data-cy='profile'>Profile</button>
        <button data-cy='logout' onClick={logout}>Logout</button>
        </>
    ) : (
        <><h1>Loading...</h1></>
    )
}