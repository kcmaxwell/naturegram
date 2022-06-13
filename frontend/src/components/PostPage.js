export default function PostPage({postDetails, transformTimestamp, likePost, savePost}) {
    return (
        <>
            <h1>Post {postDetails.id}</h1>
            <img src={postDetails.imageUrl} data-cy="image" />
            <p data-cy="author">Posted by {postDetails.author.username}</p>
            <p data-cy='description'>{postDetails.description}</p>
            <p data-cy="timestamp">{transformTimestamp()}</p>
            <button data-cy="likePost" onClick={likePost}>Like</button>
            <p data-cy="likes">{postDetails.likes.length}</p>
            <button data-cy='savePost' onClick={savePost}>Save</button>

            <p data-cy='commentList'>This is where comments would go...IF I HAD ANY</p>
        </>
    )
}