import { useAppSelector } from "../../hooks";
import { findUserById } from "./userSlice";
import { Link, useParams } from "react-router-dom";
import { useGetPostsByUserIdQuery } from "../post/postSlice";

export default function UserPage() {
  const { userId } = useParams();

  const user = useAppSelector((state) =>
    findUserById(state, userId as unknown as number),
  );

  const {
    data: userPosts,
    isLoading,
    isSuccess,
    error,
  } = useGetPostsByUserIdQuery(userId);

  if (isLoading) {
    return (
      <section>
        <h2>{user?.name}</h2>
        <p>Loading ...</p>
      </section>
    );
  }

  if (isSuccess) {
    const { ids, entities } = userPosts;
    return (
      <section>
        <h2>{user?.name}</h2>
        <ol>
          {ids.map((id) => (
            <li key={id}>
              <Link to={`/post/${id}`}>{entities[id].title}</Link>
            </li>
          ))}
        </ol>
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
