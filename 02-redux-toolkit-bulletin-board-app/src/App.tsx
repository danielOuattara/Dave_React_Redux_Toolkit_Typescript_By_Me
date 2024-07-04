import AddPostForm from "./redux/features/post/AddPostForm";
import PostList from "./redux/features/post/PostList";

export default function App() {
  return (
    <main className="App">
      <AddPostForm />
      <PostList />
    </main>
  );
}
