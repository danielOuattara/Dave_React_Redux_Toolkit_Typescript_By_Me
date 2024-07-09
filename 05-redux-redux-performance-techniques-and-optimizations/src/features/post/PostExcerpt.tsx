// import PostAuthor from "./PostAuthor";
// import TimeAgo from "./TimeAgo";
// import PostButtonsReaction from "./PostButtonsReaction";
// import { Link } from "react-router-dom";

// export default function PostsExcerpt({ post }: { post: Post }) {
//   return (
//     <article>
//       <h2>{post.title}</h2>
//       <p className="excerpt">{post.body.substring(0, 75)}...</p>
//       <p className="postCredit">
//         <Link to={`/post/${post.id}`}>View Post</Link>
//         <PostAuthor userId={Number(post.userId)} />
//         <TimeAgo timestamp={post.date} />
//       </p>
//       <PostButtonsReaction post={post} />
//     </article>
//   );
// }

//--------------------------------------------------------- # Memo Solution 1

// import PostAuthor from "./PostAuthor";
// import TimeAgo from "./TimeAgo";
// import PostButtonsReaction from "./PostButtonsReaction";
// import { Link } from "react-router-dom";
// import React from "react";
// import { useAppSelector } from "../../hooks";
// import { selectPostById } from "./postSlice";

// const PostsExcerpt = ({ postId }: { postId: string }) => {
//   const post = useAppSelector((state) => selectPostById(state, postId));
//   return (
//     <article>
//       <h2>{post.title}</h2>
//       <p className="excerpt">{post.body.substring(0, 75)}...</p>
//       <p className="postCredit">
//         <Link to={`/post/${post.id}`}>View Post</Link>
//         <PostAuthor userId={Number(post.userId)} />
//         <TimeAgo timestamp={post.date} />
//       </p>
//       <PostButtonsReaction post={post} />
//     </article>
//   );
// };

// export default React.memo(PostsExcerpt);
//--------------------------------------------------------- # using state normalization

import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import PostButtonsReaction from "./PostButtonsReaction";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { selectPostById } from "./postSlice";

export default function PostsExcerpt({ postId }: { postId: string }) {
  const post = useAppSelector((state) => selectPostById(state, postId));
  return (
    <article>
      <h2>{post.title}</h2>
      <p className="excerpt">{post.body.substring(0, 75)}...</p>
      <p className="postCredit">
        <Link to={`/post/${post.id}`}>View Post</Link>
        <PostAuthor userId={Number(post.userId)} />
        <TimeAgo timestamp={post.date} />
      </p>
      <PostButtonsReaction post={post} />
    </article>
  );
}
