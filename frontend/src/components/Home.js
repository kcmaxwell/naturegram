import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

export default function Home() {
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