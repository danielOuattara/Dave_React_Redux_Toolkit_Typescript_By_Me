import { useState } from "react";
import { useAppSelector } from "./../../hooks";
import { useParams, useNavigate } from "react-router-dom";
import {
  selectPostById,
  useDeletePostMutation,
  useUpdatePostMutation,
} from "./postSlice";
import React from "react";

export default function EditPostForm() {
  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const navigate = useNavigate();
  const { postId } = useParams();

  const post = useAppSelector((state) =>
    selectPostById(state, postId as string),
  );

  const users = useAppSelector((state) => {
    return state.users;
  });

  const [title, setTitle] = useState(post?.title ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [userId, setUserId] = useState(post?.userId ?? "");

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setBody(e.target.value);
  const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setUserId(e.target.value);

  const canSave = [title, body, userId].every(Boolean) && !isLoading;

  const submitSavePost = async () => {
    if (canSave) {
      try {
        await updatePost({
          id: post.id,
          title,
          body: body,
          userId,
          reactions: post.reactions,
        }).unwrap();

        setTitle("");
        setBody("");
        setUserId("");
        navigate(`/post/${postId}`);
      } catch (err) {
        console.error("Failed to save the post", err);
      }
    }
  };

  const submitDeletePost = async () => {
    try {
      await deletePost({ id: post.id }).unwrap();
      setTitle("");
      setBody("");
      setUserId("");
      navigate("/");
    } catch (err) {
      console.error("Failed to delete the post", err);
    }
  };

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={handleTitleChange}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={handleAuthorChange}>
          <option value=""></option>
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
        <button type="button" onClick={submitSavePost} disabled={!canSave}>
          Update Post
        </button>
        <button
          className="deleteButton"
          type="button"
          onClick={submitDeletePost}
        >
          Delete Post
        </button>
      </form>
    </section>
  );
}
