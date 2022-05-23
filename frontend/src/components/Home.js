import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

export default function Home() {
    const [userContext, setUserContext] = useContext(UserContext);
    const [error, setError] = useState('');

    const verifyUser = useCallback(() => {
        fetch(process.env.REACT_APP_BACKEND + "/auth/refreshToken", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }).then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            setUserContext((oldValues) => {
              return { ...oldValues, token: data.token };
            });
          } else {
            setUserContext((oldValues) => {
              return { ...oldValues, token: null };
            });
          }
          // call refreshToken every 5 minutes to renew the authentication token.
          setTimeout(verifyUser, 5 * 60 * 1000);
        });
      }, [setUserContext]);
    
      useEffect(() => {
        verifyUser();
      }, [verifyUser]);

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
                return { ...oldValues, token: null };
              });
              window.localStorage.setItem("logout", Date.now());
            } else {
              setError('Error logging out.');
            }
          });
    }

    return userContext.token === null ? (
      <>
        {error && <h1>{error}</h1>}
        <h1>Please login first.</h1>
      </>
    ) : userContext.token ? (
        <>
        {error && <h1>{error}</h1>}
        <h1>Welcome to Naturegram!</h1>
        <button cy-data='logout' onClick={logout}>Logout</button>
        </>
    ) : (
        <></>
    )
}