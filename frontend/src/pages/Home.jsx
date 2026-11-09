import { useEffect, useState } from "react";
import api, { errMsg } from "../api";
import PostCard from "../components/PostCard";

export default function Home() {
  const [data, setData] = useState({ content: [], totalPages: 0 });
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/posts", { params: { page, size: 6, search: query } })
      .then((res) => { setData(res.data); setError(""); })
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, [page, query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setQuery(search);
  };

  return (
    <>
      <form className="search" onSubmit={handleSearch}>
        <input
          placeholder="Search posts by title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn">Search</button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p className="empty">Loading…</p>}
      {!loading && !error && data.content.length === 0 && (
        <p className="empty">No posts found. Be the first to write one!</p>
      )}

      <div className="grid">
        {data.content.map((p) => <PostCard key={p.id} post={p} />)}
      </div>

      {data.totalPages > 1 && (
        <div className="pagination">
          <button className="btn btn-outline" disabled={page === 0} onClick={() => setPage(page - 1)}>
            ← Prev
          </button>
          <span>Page {page + 1} of {data.totalPages}</span>
          <button
            className="btn btn-outline"
            disabled={page + 1 >= data.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
}
