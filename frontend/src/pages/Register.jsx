import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { errMsg } from "../api";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await register(form.username, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h1>Create account</h1>
      {error && <p className="error">{error}</p>}
      <label>Username</label>
      <input name="username" value={form.username} onChange={handleChange} minLength={3} maxLength={30} required />
      <label>Email</label>
      <input name="email" type="email" value={form.email} onChange={handleChange} required />
      <label>Password</label>
      <input name="password" type="password" value={form.password} onChange={handleChange} minLength={6} required />
      <button className="btn" disabled={busy}>{busy ? "Creating…" : "Sign up"}</button>
      <p className="hint">Already registered? <Link to="/login">Login</Link></p>
    </form>
  );
}
