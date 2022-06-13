import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from 'react-router-dom';

export default function S3Test() {
    const [userContext, setUserContext] = useContext(UserContext);
    //const [image, setImage] = useState('');
    const [error, setError] = useState('');
    const image = 'https://naturegram-heroku-kcmaxwell.s3.amazonaws.com/user_1654114017001.jpg'

    const fetchUserDetails = useCallback(() => {
        fetch(process.env.REACT_APP_BACKEND + '/api/auth/userInfo', {
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

    return UserContext.details === null ? (
        <></>
    ) : !userContext.details ? (
        <><h1>Loading...</h1></>
    ) : (
        <>
            <input type='file' data-cy='fileInput' />
            <img id='preview' src={image} />
        </>
    )
}