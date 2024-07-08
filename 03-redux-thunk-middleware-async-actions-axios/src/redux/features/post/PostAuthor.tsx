import { useAppSelector } from "../../hooks";

export default function PostAuthor({ userId }: { userId: string }) {
  const users = useAppSelector((state) => state.users);

  const author = users.find((user) => user.id === userId);

  return <span>by {author ? author.name : "Unknown author"}</span>;
}
