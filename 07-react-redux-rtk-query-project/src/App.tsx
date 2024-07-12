import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AddPostForm from "./features/post/AddPostForm";
import PostList from "./features/post/PostList";
import Layout from "./components/Layout";
import PostPage from "./features/post/PostPage";
import EditPostForm from "./features/post/EditPostForm";
import UsersList from "./features/user/UserList";
import UserPage from "./features/user/UserPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <PostList /> },
      {
        path: "post",
        children: [
          { index: true, element: <AddPostForm /> },
          { path: ":postId", element: <PostPage /> },
          { path: "edit/:postId", element: <EditPostForm /> },
        ],
      },
      {
        path: "users",
        children: [
          { index: true, element: <UsersList /> },
          { path: ":userId", element: <UserPage /> },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
