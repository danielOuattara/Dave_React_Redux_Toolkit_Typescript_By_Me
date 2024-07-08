import { useAppSelector } from "./../../hooks";
import PostAuthor from "./PostAuthor";
import PostButtonsReaction from "./PostButtonsReaction";
import TimeAgo from "./TimeAgo";

export default function PostList() {
  const posts = useAppSelector((state) => state.posts);
  const orderedPosts = posts
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
  return (
    <section>
      <h2>Posts</h2>
      {orderedPosts.map((post) => (
        <article key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content.substring(0, 100)}</p>
          <p className="postCredit">
            <PostAuthor userId={post.userId} />
            <TimeAgo timestamp={post.date} />
          </p>
          <PostButtonsReaction post={post} />
        </article>
      ))}
    </section>
  );
}
