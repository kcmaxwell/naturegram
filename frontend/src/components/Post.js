import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate, useParams } from 'react-router-dom';
import HTTP404 from "./HTTP404";

export default function Post() {
    const { postId } = useParams();
    const [postDetails, setPostDetails] = useState(null);
    const [notFoundError, setNotFoundError] = useState(null);
    const [userContext, setUserContext] = useContext(UserContext);

    const fetchPostDetails = useCallback(() => {
        fetch(process.env.REACT_APP_BACKEND + '/posts/' + postId, {
            method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`,
          },
        }).then(async (res) => {
            if (res.ok) {
                const data = await res.json();
                setPostDetails(data);
            } else {
                if (res.status === 404) {
                    setNotFoundError(true);
                } else if (res.status !== 304) {
                    // null the details, unless 304 Not Modified is returned
                    setPostDetails(null);
                }
            }
        })
    }, [setPostDetails, setNotFoundError, postId, userContext.token])

    useEffect(() => {
        if (!postDetails) {
            fetchPostDetails();
        }
    }, [fetchPostDetails, postDetails])

    const transformTimestamp = () => {
        return '';
    }

    return notFoundError ? (
        <>
        <HTTP404 />
        </>
    ) : postDetails === null ? (
        <></>
    ) : !postDetails ? (
        <></>
    ) : (
        <>
            <h1>Post {postDetails.id}</h1>
            <img src={postDetails.imageUrl} data-cy='image' />
            <p data-cy='author'>Posted by {postDetails.author}</p>
            <p data-cy='timestamp'>{transformTimestamp}</p>
            <button data-cy='likePost'>Like</button>
            <p data-cy='likes'>{postDetails.likes.length}</p>
        </>
    )
}