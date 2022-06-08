export default function PostThumbnail({post}) {
    return (
        <a href={'/post/' + post._id}>
        <img src={post.imageUrl} width="500" height="500" />
        </a>
    )
}