import { useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import { findUserById, selectUserPosts } from "./userSlice";
import { Link, useParams } from "react-router-dom";

export default function UserPage() {
  const { userId } = useParams();
  const user = useAppSelector((state) =>
    findUserById(state, userId as unknown as number),
  );

  const userPosts = useAppSelector((state: RootState) =>
    selectUserPosts(state, userId as string),
  );
  return (
    <section>
      <h2>{user?.name}</h2>

      <ol>
        {userPosts.map((post) => (
          <li key={post.id}>
            <Link to={`/post/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
