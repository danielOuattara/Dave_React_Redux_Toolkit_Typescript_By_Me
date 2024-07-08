import { useState } from "react";
import { useAppDispatch, useAppSelector } from "./../../hooks";
import { addNewPost } from "./postExtraActions";

export default function AddPostForm() {
  const dispatch = useAppDispatch();

  const users = useAppSelector((state) => state.users);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [userId, setUserId] = useState("");
  const [addPostRequestStatus, setAddPostRequestStatus] = useState("idle");

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const onBodyChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setBody(e.target.value);
  const onAuthorChanged = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setUserId(e.target.value);

  const canSave =
    [title, body, userId].every(Boolean) && addPostRequestStatus === "idle";

  const savePost = () => {
    if (canSave) {
      try {
        setAddPostRequestStatus("pending");
        dispatch(
          addNewPost({ title, body, userId: parseInt(userId, 10) }),
        ).unwrap();
        // setTitle("");
        // setBody("");
        // setUserId("");
      } catch (error) {
        console.error("Failed to save the post: ", error);
      } finally {
        setAddPostRequestStatus("idle");
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
          onChange={(e) => onTitleChanged(e)}
        />

        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
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
          onChange={onBodyChanged}
        />
        <button type="button" onClick={savePost} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
}
