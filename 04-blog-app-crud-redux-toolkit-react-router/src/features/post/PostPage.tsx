import { findPostById } from "./postSlice";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import PostButtonsReaction from "./PostButtonsReaction";
import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../../hooks";

export default function PostPage() {
  // retrieve postId
  const { postId } = useParams();

  const post = useAppSelector((state) => findPostById(state, Number(postId)));

  if (!post) {
    return (
      <section>
        <h2>Post not found</h2>
      </section>
    );
  } else {
    return (
      <article>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
        <p className="postCredit">
          <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
          <PostAuthor userId={post.userId} />
          <TimeAgo timestamp={post.date} />
        </p>
        <PostButtonsReaction post={post} />
      </article>
    );
  }
}
