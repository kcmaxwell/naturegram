export default function PostThumbnail({postDetails, clickPost, ...props}) {
    return (
        <>
        <a onClick={() => clickPost(postDetails)} data-cy='post'>
            <img src={postDetails.imageUrl} className='post-thumbnail-image' />
        </a>
        </>
    )
}