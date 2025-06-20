import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [recommendedBlogs, setRecommendedBlogs] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]); // New state

  useEffect(() => {
    // Fetch current blog details
    fetch(`${import.meta.env.VITE_API_BASE_URL}/blog/${id}`)
      .then((res) => res.json())
      .then((data) => setBlog(data))
      .catch((err) => console.error(err));

    // Fetch recommended blogs for this blog
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/blog/${id}/recommendations`)
      .then((res) => setRecommendedBlogs(res.data))
      .catch((err) => console.error("Recommendation error:", err));

    // Fetch latest blogs
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/blog/latest`)
      .then((res) => setLatestBlogs(res.data))
      .catch((err) => console.error("Latest blogs error:", err));
  }, [id]);

  if (!blog)
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;

  return (
    <div
      style={{
        maxWidth: "1000%",
        margin: "40px auto",
        padding: "2rem",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 0 16px rgba(0, 0, 0, 0.05)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Top section */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        {blog.image && (
          <div style={{ flex: 1, minWidth: "300px" }}>
            <img
              src={blog.image}
              alt={blog.title}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "400px",
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />
          </div>
        )}

        <div style={{ flex: 2, minWidth: "300px" }}>
          <h1 style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>{blog.title}</h1>
          <div style={{ color: "#666", fontSize: "0.95rem", marginBottom: "1rem" }}>
            <strong>Author:</strong> {blog.author?.name || "Unknown"}
            <br />
            <strong>Category:</strong> {blog.categories?.join(", ") || "Uncategorized"}
          </div>
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: "1.7",
              whiteSpace: "pre-line",
            }}
          >
            {blog.content}
          </p>
        </div>
      </div>

      {/* Likes & Comments */}
      <div
        style={{
          marginTop: "2.5rem",
          borderTop: "1px solid #eee",
          paddingTop: "1.5rem",
        }}
      >
        <p style={{ fontSize: "1rem", color: "#333", marginBottom: "1rem" }}>
          ❤️ <strong>Likes:</strong> {blog.likes?.length || 0}
        </p>

        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
            width: "20%",
          }}
        >
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>

        {showComments && (
          <div style={{ marginTop: "2rem" }}>
            <h3>Comments</h3>
            {blog.comments && blog.comments.length > 0 ? (
              blog.comments.map((comment, index) => (
                <div
                  key={index}
                  style={{
                    padding: "1rem 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <p>
                    <strong>{comment.user?.name || "Anonymous"}:</strong> {comment.text}
                  </p>
                  <small style={{ color: "#888" }}>
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ""}
                  </small>
                </div>
              ))
            ) : (
              <p style={{ fontStyle: "italic", color: "#888" }}>No comments yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Recommendations Section */}
      {recommendedBlogs.length > 0 && (
        <div
          style={{
            marginTop: "3rem",
            paddingTop: "2rem",
            borderTop: "1px solid #ddd",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              color: "#4f46e5",
              marginBottom: "1rem",
            }}
          >
            🔍 You Might Also Like
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {recommendedBlogs.map((rec) => (
              <div
                key={rec._id}
                onClick={() => (window.location.href = `/blog/${rec._id}`)}
                style={{
                  border: "1px solid #ccc",
                  padding: "1rem",
                  borderRadius: "10px",
                  cursor: "pointer",
                  backgroundColor: "#f9fafb",
                  transition: "transform 0.2s ease-in-out",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <h3 style={{ marginBottom: "0.5rem", color: "#1f2937" }}>{rec.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                  {rec.content?.slice(0, 100)}...
                </p>
                <small style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                  Categories: {rec.categories?.join(", ") || "None"}
                </small>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Latest Blogs Section */}
      {latestBlogs.length > 0 && (
        <div
          style={{
            marginTop: "3rem",
            paddingTop: "2rem",
            borderTop: "1px solid #ddd",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              color: "#4f46e5",
              marginBottom: "1rem",
            }}
          >
            🆕 Latest Blogs
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {latestBlogs.map((latest) => (
              <div
                key={latest._id}
                onClick={() => (window.location.href = `/blog/${latest._id}`)}
                style={{
                  border: "1px solid #ccc",
                  padding: "1rem",
                  borderRadius: "10px",
                  cursor: "pointer",
                  backgroundColor: "#eef2ff",
                  transition: "transform 0.2s ease-in-out",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <h3 style={{ marginBottom: "0.5rem", color: "#1e40af" }}>{latest.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "#334155" }}>
                  {latest.content?.slice(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
