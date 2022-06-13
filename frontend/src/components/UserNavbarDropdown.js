import { useCallback, useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../context/UserContext';

export default function UserNavbarDropdown({username}) {
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

    return (
        <ul>
            <li><a href={'/user/' + username}>Profile</a></li>
            <li><a onClick={logout}>Logout</a></li>
        </ul>
    )
}