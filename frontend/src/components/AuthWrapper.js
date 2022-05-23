import React, { useContext, useCallback, useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const AuthWrapper = () => {
    const [userContext, setUserContext] = useContext(UserContext);
    const location = useLocation();

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
        <Navigate to="/login" replace state={{ from: location }} />
    ) : userContext.token ? (
        <Outlet />
    ) : (
        <></>
    )
}

export default AuthWrapper;