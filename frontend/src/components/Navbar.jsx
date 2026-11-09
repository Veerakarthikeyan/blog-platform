import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">✍️ BlogSpace</Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/posts/new">New Post</Link>
            <Link to="/my-posts">My Posts</Link>
            <span className="nav-user">Hi, {user.username}</span>
            <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
