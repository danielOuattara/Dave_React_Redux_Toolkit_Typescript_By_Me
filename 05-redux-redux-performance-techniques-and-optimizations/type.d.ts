type ReactionType = "thumbsUp" | "wow" | "heart" | "rocket" | "coffee";

interface Post {
  id: string;
  title: string;
  body: string;
  userId: string;
  date: string;
  reactions: Record<ReactionType, number>;
}

interface IPostInitialState {
  posts: Post[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  counter: number;
}

interface ICreatePost {
  title: string;
  body: string;
  userId: number;
}

interface IUpdatePost {
  id: string;
  title: string;
  body: string;
  userId: number;
  reactions: Record<ReactionType, number>;
}

interface IDeletePost {
  id: number;
}

interface IUsersInitialState {
  id: number;
  name: string;
}
