import { useAppSelector, useAppDispatch } from "./../../hooks";
import { useEffect } from "react";
import { fetchPosts } from "./postExtraActions";
import PostsExcerpt from "./PostExcerpt";

export default function PostList() {
  const dispatch = useAppDispatch();
  const { posts, status, error } = useAppSelector((state) => state.posts);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [dispatch, status]);

  if (status === "loading") {
    return <p>Loading...</p>;
  } else if (status === "succeeded") {
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));
    return (
      <section>
        <h2>Posts</h2>
        {orderedPosts.map((post) => (
          <PostsExcerpt key={post.id} post={post} />
        ))}
      </section>
    );
  } else {
    return <p>{error}</p>;
  }
}
