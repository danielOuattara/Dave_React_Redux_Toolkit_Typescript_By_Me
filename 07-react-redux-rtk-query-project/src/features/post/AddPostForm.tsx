import { useState } from "react";
import { useAppSelector } from "./../../hooks";
import { useAddNewPostMutation } from "./postSlice";
import { useNavigate } from "react-router-dom";

export default function AddPostForm() {
  const [addNewPost, { isLoading }] = useAddNewPostMutation();
  const navigate = useNavigate();
  const users = useAppSelector((state) => state.users);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [userId, setUserId] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setBody(e.target.value);
  const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setUserId(e.target.value);

  const canSave = [title, body, userId].every(Boolean) && !isLoading;

  const savePost = async () => {
    if (canSave) {
      try {
        await addNewPost({
          title,
          body,
          userId,
        }).unwrap();
        setTitle("");
        setBody("");
        setUserId("");
        navigate("/");
      } catch (error) {
        console.error("Failed to save the post: ", error);
      }
    }
  };

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={(e) => handleTitleChange(e)}
        />

        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={handleAuthorChange}>
          <option value="">-- Select an author --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={body}
          onChange={handleBodyChange}
        />
        <button type="button" onClick={savePost} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
}
