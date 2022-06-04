import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate, useParams } from 'react-router-dom';
import HTTP404 from "./HTTP404";

export default function Post() {
    const [postDetails, setPostDetails] = useState(null);
    const [notFoundError, setNotFoundError] = useState(null);

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