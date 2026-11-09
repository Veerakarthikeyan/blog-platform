import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { errMsg } from "../api";
import { useAuth } from "../AuthContext";

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [p, c] = await Promise.all([api.get(`/posts/${id}`), api.get(`/posts/${id}/comments`)]);
      setPost(p.data);
      setComments(c.data);
      setError("");
    } catch (e) {
      setError(errMsg(e));
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const addComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await api.post(`/posts/${id}/comments`, { content: text });
      setText("");
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comments/${commentId}`);
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const deletePost = async () => {
    if (!window.confirm("Delete this post and all its comments?")) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate("/");
    } catch (err) {
      setError(errMsg(err));
    }
  };

  if (error && !post) return <p className="error">{error}</p>;
  if (!post) return <p className="empty">Loading…</p>;

  const isOwner = user && user.id === post.authorId;

  return (
    <>
      <article className="card post-full">
        <h1>{post.title}</h1>
        <p className="meta">
          by <strong>{post.authorName}</strong> · {new Date(post.createdAt).toLocaleString()}
          {post.updatedAt !== post.createdAt && " · edited"}
        </p>
        <div className="post-body">{post.content}</div>
        {isOwner && (
          <div className="actions">
            <Link to={`/posts/${post.id}/edit`} className="btn btn-outline">Edit</Link>
            <button className="btn btn-danger" onClick={deletePost}>Delete</button>
          </div>
        )}
      </article>

      <section className="comments">
        <h3>Comments ({comments.length})</h3>
        {error && <p className="error">{error}</p>}

        {user ? (
          <form onSubmit={addComment} className="comment-form">
            <textarea
              rows={3}
              placeholder="Write a comment…"
              value={text}
              maxLength={2000}
              onChange={(e) => setText(e.target.value)}
            />
            <button className="btn">Post comment</button>
          </form>
        ) : (
          <p className="hint"><Link to="/login">Login</Link> to join the discussion.</p>
        )}

        {comments.length === 0 && <p className="empty">No comments yet.</p>}
        {comments.map((c) => (
          <div key={c.id} className="comment">
            <div className="comment-head">
              <strong>{c.authorName}</strong>
              <span className="meta">{new Date(c.createdAt).toLocaleString()}</span>
              {user && (user.id === c.authorId || isOwner) && (
                <button className="link-btn" onClick={() => deleteComment(c.id)}>Delete</button>
              )}
            </div>
            <p>{c.content}</p>
          </div>
        ))}
      </section>
    </>
  );
}
