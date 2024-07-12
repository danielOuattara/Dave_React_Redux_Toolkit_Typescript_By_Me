import { useAddReactionMutation } from "./postSlice";

const reactionEmoji: Record<ReactionType, string> = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

export default function PostButtonsReaction({ post }: { post: IPost }) {
  const [addReaction] = useAddReactionMutation();
  return (
    <div>
      {Object.entries(reactionEmoji).map(([name, emoji]) => {
        const reactionName = name as ReactionType;
        return (
          <button
            key={reactionName}
            type="button"
            className="reactionButton"
            onClick={() => {
              const newValue: number = post.reactions[reactionName] + 1;
              addReaction({
                postId: post.id,
                reactions: { ...post.reactions, [name]: newValue },
              });
            }}
          >
            {emoji} {post.reactions[reactionName]}
          </button>
        );
      })}
    </div>
  );
}
