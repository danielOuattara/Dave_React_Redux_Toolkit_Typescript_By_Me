import { useAppDispatch } from "../../hooks";
import { postActions } from "./postSlice";

const reactionEmoji: Record<ReactionType, string> = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

export default function PostButtonsReaction({ post }: { post: Post }) {
  const dispatch = useAppDispatch();
  return (
    <div>
      {Object.entries(reactionEmoji).map(([name, emoji]) => (
        <button
          key={name}
          type="button"
          className="reactionButton"
          onClick={() =>
            dispatch(
              postActions.addReaction({
                postId: post.id,
                reaction: name as ReactionType,
              }),
            )
          }
        >
          {emoji} {post.reactions[name as ReactionType]}
        </button>
      ))}
    </div>
  );
}
