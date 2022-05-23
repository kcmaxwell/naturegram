import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

export default function Home() {
    const [userContext, setUserContext] = useContext(UserContext);

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
        fetch(process.env.REACT_APP_API_ENDPOINT + "users/logout", {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userContext.token}`,
            },
          }).then(async (response) => {
            setUserContext((oldValues) => {
              return { ...oldValues, details: undefined, token: null };
            });
            window.localStorage.setItem("logout", Date.now());
          });
    }

    return userContext.token === null ? (
        <h1>Please login first.</h1>
    ) : userContext.token ? (
        <>
        <h1>Welcome to Naturegram!</h1>
        <button cy-data='logout' onClick={logout}>Logout</button>
        </>
    ) : (
        <></>
    )
}