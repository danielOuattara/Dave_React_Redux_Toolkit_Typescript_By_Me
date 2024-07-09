import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { postActions } from "../features/post/postSlice";

export default function Header() {
  const { counter } = useAppSelector((state) => state.posts);
  const dispatch = useAppDispatch();

  return (
    <header className="Header">
      <h1>Redux Blog</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="post">Post</Link>
          </li>
          <li>
            <Link to="users">Users</Link>
          </li>
        </ul>
      </nav>
      <button onClick={() => dispatch(postActions.increaseCounter())}>
        click {counter}
      </button>
    </header>
  );
}
