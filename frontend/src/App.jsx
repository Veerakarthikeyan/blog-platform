import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostDetail from "./pages/PostDetail";
import PostForm from "./pages/PostForm";
import MyPosts from "./pages/MyPosts";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/posts/new" element={<ProtectedRoute><PostForm /></ProtectedRoute>} />
          <Route path="/posts/:id/edit" element={<ProtectedRoute><PostForm /></ProtectedRoute>} />
          <Route path="/my-posts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
          <Route path="*" element={<p className="empty">Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}
