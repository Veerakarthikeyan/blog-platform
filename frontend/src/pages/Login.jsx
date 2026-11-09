import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { errMsg } from "../api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(form.username, form.password);
      navigate("/");
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h1>Login</h1>
      {error && <p className="error">{error}</p>}
      <label>Username</label>
      <input name="username" value={form.username} onChange={handleChange} required />
      <label>Password</label>
      <input name="password" type="password" value={form.password} onChange={handleChange} required />
      <button className="btn" disabled={busy}>{busy ? "Signing in…" : "Login"}</button>
      <p className="hint">No account? <Link to="/register">Sign up</Link></p>
    </form>
  );
}
