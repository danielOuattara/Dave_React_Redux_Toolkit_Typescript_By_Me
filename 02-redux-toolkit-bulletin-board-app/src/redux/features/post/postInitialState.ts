import { sub } from "date-fns";

export const postInitialState: Post[] = [
  {
    id: "1",
    title: "Learning Redux Toolkit",
    content: "I've heard good things.",
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions: {
      thumbsUp: 9,
      wow: 2,
      heart: 5,
      rocket: 2,
      coffee: 2,
    },
  },
  {
    id: "2",
    title: "Slices...",
    content: "The more I say slice, the more I want pizza.",
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    reactions: {
      thumbsUp: 12,
      wow: 3,
      heart: 3,
      rocket: 1,
      coffee: 3,
    },
  },
];
