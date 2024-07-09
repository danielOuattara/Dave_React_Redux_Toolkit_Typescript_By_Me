import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks";

export default function UsersList() {
  const users = useAppSelector((state) => state.users);

  return (
    <section>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
