import { useAppSelector, useAppDispatch } from "./../../hooks";
import { useEffect } from "react";
import { fetchPosts } from "./postExtraActions";
import PostsExcerpt from "./PostExcerpt";
import { selectPostIds } from "./postSlice";

export default function PostList() {
  const dispatch = useAppDispatch();
  const orderedPostIds = useAppSelector(selectPostIds);
  const { status, error } = useAppSelector((state) => state.posts);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [dispatch, status]);

  if (status === "loading") {
    return <p>Loading...</p>;
  } else if (status === "succeeded") {
    return (
      <section>
        {orderedPostIds.map((postId) => (
          <PostsExcerpt key={postId} postId={postId} />
        ))}
      </section>
    );
  } else {
    return <p>{error}</p>;
  }
}
