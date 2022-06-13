export default function PostThumbnail({postDetails, clickPost, ...props}) {
    return (
        <>
        <a onClick={() => clickPost(postDetails)} data-cy='post'>
            <img src={postDetails.imageUrl} width="500" height="500" />
        </a>
        </>
    )
}