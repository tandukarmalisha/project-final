import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/blog/${id}`)
      .then((res) => res.json())
      .then((data) => setBlog(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!blog) return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;

  return (
    <div style={{
      maxWidth: "1000%",
      margin: "40px auto",
      padding: "2rem",
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "0 0 16px rgba(0, 0, 0, 0.05)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Top section with image + content side by side */}
      <div style={{ display: "flex", flexDirection: "row", gap: "2rem", flexWrap: "wrap" }}>
        {/* Image side */}
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

        {/* Content side */}
        <div style={{ flex: 2, minWidth: "300px" }}>
          <h1 style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>{blog.title}</h1>
          <div style={{ color: "#666", fontSize: "0.95rem", marginBottom: "1rem" }}>
            <strong>Author:</strong> {blog.author?.name || "Unknown"}<br />
            <strong>Category:</strong> {blog.categories?.join(", ") || "Uncategorized"}
          </div>
          <p style={{
            fontSize: "1.1rem",
            lineHeight: "1.7",
            whiteSpace: "pre-line"
          }}>
            {blog.content}
          </p>
        </div>
      </div>

      {/* Likes and Comments */}
      <div style={{ marginTop: "2.5rem", borderTop: "1px solid #eee", paddingTop: "1.5rem" }}>
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
            width:"20%",
          }}
        >
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>

        {/* Comment section */}
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
                  <p><strong>{comment.user?.name || "Anonymous"}:</strong> {comment.text}</p>
                  <small style={{ color: "#888" }}>
                    {comment.createdAt
                      ? new Date(comment.createdAt).toLocaleString()
                      : ""}
                  </small>
                </div>
              ))
            ) : (
              <p style={{ fontStyle: "italic", color: "#888" }}>No comments yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
