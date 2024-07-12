import { useAppSelector } from "../../hooks";
import { Link } from "react-router-dom";

export default function PostAuthor({ userId }: { userId: number }) {
  const users = useAppSelector((state) => state.users);

  const author = users.find((user) => user.id === userId);

  return (
    <span>
      by{" "}
      {author ? (
        <Link to={`/user/${userId}`}>{author.name}</Link>
      ) : (
        "Unknown author"
      )}
    </span>
  );
}
