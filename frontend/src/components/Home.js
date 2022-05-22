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

    return userContext.token === null ? (
        <h1>Please login first.</h1>
    ) : (
        <h1>Welcome to Naturegram!</h1>
    )
}