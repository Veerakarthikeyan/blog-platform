import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errMsg } from "../api";
import PostCard from "../components/PostCard";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/posts/mine")
      .then((res) => setPosts(res.data.content))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h1>My posts</h1>
      {error && <p className="error">{error}</p>}
      {loading && <p className="empty">Loading…</p>}
      {!loading && posts.length === 0 && (
        <p className="empty">You haven't written anything yet. <Link to="/posts/new">Write your first post</Link></p>
      )}
      <div className="grid">
        {posts.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
    </>
  );
}
