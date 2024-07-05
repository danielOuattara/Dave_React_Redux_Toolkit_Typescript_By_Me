type ReactionType = "thumbsUp" | "wow" | "heart" | "rocket" | "coffee";

interface Post {
  id: string;
  title: string;
  content: string;
  userId?: string;
  date: string;
  reactions: Record<ReactionType, number>;
}
