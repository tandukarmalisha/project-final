import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [recommendedBlogs, setRecommendedBlogs] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBlog();
    fetchRecommendedBlogs();
    fetchLatestBlogs();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/blog/${id}`);
      setBlog(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecommendedBlogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/blog/${id}/recommendations`);
      setRecommendedBlogs(res.data);
    } catch (error) {
      console.error("Recommendation error:", error);
    }
  };

  const fetchLatestBlogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/blog/latest`);
      setLatestBlogs(res.data);
    } catch (error) {
      console.error("Latest blogs error:", error);
    }
  };

  const likedByUser = blog?.likes?.some((like) =>
    typeof like === "string" ? like === user?._id : like?._id === user?._id
  );

  const handleLike = async () => {
    if (!token) {
      toast.info("Please register or login to like the blog.");
      navigate("/register");
      return;
    }
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/blog/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlog((prev) => ({ ...prev, likes: res.data.likes }));
    } catch (error) {
      if (error.response?.status === 401) {
        toast.info("Session expired. Please login again.");
        navigate("/register");
      } else {
        console.error("Like error:", error.response?.data || error.message);
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!token) {
      toast.info("Please register or login to comment.");
      navigate("/register");
      return;
    }

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/blog/${id}/comment`,
        { comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBlog((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), res.data.comment],
      }));
      setNewComment("");
      setShowComments(true);
      setShowCommentInput(false);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.info("Session expired. Please login again.");
        navigate("/register");
      } else {
        console.error("Comment error:", error.response?.data || error.message);
      }
    }
  };

  if (!blog)
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;

  return (
    <div
      style={{
        maxWidth: "1000px",
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
        <button
          onClick={handleLike}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.1rem",
            color: likedByUser ? "red" : "#444",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
          title={likedByUser ? "Unlike" : "Like"}
        >
          ❤️ Like ({blog.likes?.length || 0})
        </button>

        <br />

        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            width:"200px",
            // background: "#4f46e5",
            // color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
            marginRight: "1rem",
          }}
        >
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>

        <button
          onClick={() => setShowCommentInput((prev) => !prev)}
          style={{
            width:"200px",
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          {showCommentInput ? "Cancel" : "Add Comment"}
        </button>

        {showCommentInput && (
          <form
            onSubmit={handleCommentSubmit}
            style={{
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              maxWidth: "500px",
            }}
          >
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "1rem",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 14px",
                borderRadius: "6px",
                backgroundColor: "#4f46e5",
                color: "#fff",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                width: "fit-content",
              }}
            >
              Post Comment
            </button>
          </form>
        )}

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
                    {comment.createdAt
                      ? new Date(comment.createdAt).toLocaleString()
                      : ""}
                  </small>
                </div>
              ))
            ) : (
              <p style={{  fontStyle: "italic", color: "#888" }}>No comments yet.</p>
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
