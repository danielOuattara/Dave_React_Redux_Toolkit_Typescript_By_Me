import { useAppSelector } from "./../../hooks";
import PostsExcerpt from "./PostExcerpt";
import { selectPostIds, useGetPostsQuery } from "./postSlice";

export default function PostList() {
  const { isLoading, isSuccess, error } = useGetPostsQuery();
  const orderedPostIds = useAppSelector(selectPostIds);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isSuccess) {
    return (
      <section>
        {orderedPostIds.map((postId) => (
          <PostsExcerpt key={postId} postId={postId} />
        ))}
      </section>
    );
  }

  let errorMessage: string | undefined;

  if (error && "status" in error) {
    errorMessage = "Error: " + error.status;
    if (error.data && typeof error.data === "object") {
      errorMessage += " - " + JSON.stringify(error.data);
    }
  } else if (error && "message" in error) {
    errorMessage = error.message;
  } else {
    errorMessage = "Unknown error";
  }

  return <p>{errorMessage}</p>;
}
