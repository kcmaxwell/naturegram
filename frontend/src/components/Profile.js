import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const navigate = useNavigate();
    const [userContext, setUserContext] = useContext(UserContext);
    const [error, setError] = useState('');

    return userContext.details === null ? (
        <></>
    ) : !userContext.details ? (
        <></>
    ) : (
        <>
            <h1>{userContext.details.username}'s Profile Page</h1>
        </>
    )
}