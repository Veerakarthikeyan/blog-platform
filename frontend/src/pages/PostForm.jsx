import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { errMsg } from "../api";
import { useAuth } from "../AuthContext";

export default function PostForm() {
  const { id } = useParams();              // present only when editing
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/posts/${id}`)
      .then(({ data }) => {
        if (data.authorId !== user.id) {
          navigate("/");                    // not the owner
          return;
        }
        setForm({ title: data.title, content: data.content });
      })
      .catch((e) => setError(errMsg(e)));
  }, [id, user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = id ? await api.put(`/posts/${id}`, form) : await api.post("/posts", form);
      navigate(`/posts/${data.id}`);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form-card wide" onSubmit={handleSubmit}>
      <h1>{id ? "Edit post" : "New post"}</h1>
      {error && <p className="error">{error}</p>}
      <label>Title</label>
      <input name="title" value={form.title} onChange={handleChange} maxLength={200} required />
      <label>Content</label>
      <textarea name="content" rows={12} value={form.content} onChange={handleChange} required />
      <button className="btn" disabled={busy}>{busy ? "Saving…" : id ? "Save changes" : "Publish"}</button>
    </form>
  );
}
