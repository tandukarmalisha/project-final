import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";

const BlogCard = ({ blog, currentUserId, onLikeToggle, compact = false }) => {
  const [likes, setLikes] = useState(blog.likes || []);
  const [comments, setComments] = useState(blog.comments || []);
  const [newComment, setNewComment] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const likedByUser =
    Array.isArray(likes) && currentUserId
      ? likes.some((id) =>
          typeof id === "string"
            ? id === currentUserId
            : id?._id?.toString() === currentUserId
        )
      : false;

  const handleLike = async () => {
    try {
      if (!token) {
        toast.info("Please register or login to interact with blogs.");
        navigate("/register");
        return;
      }

      const res = await axios.patch(
        `http://localhost:8000/api/blog/${blog._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && Array.isArray(res.data.likes)) {
        setLikes(res.data.likes);
        if (onLikeToggle) {
          onLikeToggle();
        }
      }
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

    try {
      if (!token) {
        navigate("/register");
        return;
      }

      const res = await axios.patch(
        `http://localhost:8000/api/blog/${blog._id}/comment`,
        { comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data.comment) {
        setComments((prev) => [...prev, res.data.comment]);
        setNewComment("");
        setShowComments(true);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/register");
      } else {
        console.error("Comment error:", err.response?.data || err.message);
      }
    }
  };

  const truncateLength = compact ? 70 : 250;
  const truncatedContent =
    blog.content.length > truncateLength
      ? `${blog.content.substring(0, truncateLength)}... `
      : blog.content;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        cursor: "pointer",
        transition: "box-shadow 0.2s ease-in-out",
        width: "100%",
        maxHeight: compact ? 280 : "none",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onClick={() => {
        if (!token) {
          toast.info("Please register or login to view blog details.");
          navigate("/register");
        } else {
          navigate(`/blog/${blog._id}`);
        }
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)")
      }
    >
      {/* Author Section */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            backgroundColor: "#4f46e5",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            textTransform: "uppercase",
            fontSize: 16,
            marginRight: 10,
          }}
        >
          {blog.author?.name?.charAt(0) || "U"}
        </div>

        {/* Stop click from going to blog detail */}
        <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", flexDirection: "column" }}>
          <Link
            to={`/user/${blog.author?._id}`}
            style={{
              fontSize: compact ? 14 : 16,
              fontWeight: "bold",
              color: "#4f46e5",
              textDecoration: "none",
            }}
          >
            {blog.author?.name || "Unknown User"}
          </Link>
          <small style={{ fontSize: 12, color: "#888" }}>View Profile</small>
        </div>
      </div>

      {/* Blog Title */}
      <h3 style={{ fontSize: compact ? 18 : 24, marginBottom: 10 }}>{blog.title}</h3>

      {/* Image */}
      {blog.image && (
        <img
          src={blog.image}
          alt="Blog"
          style={{
            width: "100%",
            maxHeight: compact ? 110 : 200,
            objectFit: "cover",
            borderRadius: 6,
            marginBottom: 10,
          }}
        />
      )}

      {/* Content Preview */}
      <p style={{ marginTop: "0.5rem", fontSize: compact ? 14 : 16, lineHeight: 1.3 }}>
        {truncatedContent}
        {blog.content.length > truncateLength && (
          <span
            style={{ color: "#4f46e5", fontWeight: "600", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              if (!token) {
                toast.info("Please register or login to view blog details.");
                navigate("/register");
              } else {
                navigate(`/blog/${blog._id}`);
              }
            }}
          >
            Read more
          </span>
        )}
      </p>

      <p style={{ fontSize: compact ? 13 : 15, color: "#555", fontStyle: "italic", marginTop: 6, marginBottom: 12 }}>
        <strong>Category:</strong> {blog.categories?.join(", ")}
      </p>

      {/* Like & Comment Buttons */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: "auto",
          alignItems: "center",
          fontSize: compact ? 14 : 16,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleLike}
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: likedByUser ? "red" : "#444",
          }}
        >
          <FontAwesomeIcon
            icon={likedByUser ? solidHeart : regularHeart}
            style={{
              color: likedByUser ? "red" : "#444",
              fontSize: compact ? 24 : 35,
              transition: "color 0.3s ease",
            }}
          />
          Like ({likes.length})
        </button>

        <button
          onClick={() => setShowComments((prev) => !prev)}
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#444",
          }}
        >
          Comments ({comments.length})
        </button>

        <button
          onClick={() => setShowCommentInput((prev) => !prev)}
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#444",
          }}
        >
          Add Comment
        </button>
      </div>

      {/* Comment Input */}
      {showCommentInput && (
        <form
          onSubmit={handleCommentSubmit}
          style={{
            marginTop: 16,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            backgroundColor: "#f9f9f9",
            padding: "1rem",
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              outline: "none",
              fontSize: 14,
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 14px",
              borderRadius: 6,
              backgroundColor: "#4f46e5",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              width: "fit-content",
              alignSelf: "flex-end",
              cursor: "pointer",
            }}
          >
            Post Comment
          </button>
        </form>
      )}

      {/* Comment Display */}
      {showComments && (
        <div style={{ marginTop: "1rem", maxHeight: "300px", overflowY: "auto" }}>
          {comments.length === 0 ? (
            <p style={{ fontStyle: "italic", color: "#666" }}>No comments yet.</p>
          ) : (
            comments.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "10px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "#4f46e5",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    fontSize: "14px",
                    flexShrink: 0,
                  }}
                >
                  {c.user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <strong>{c.user?.name || "Unknown user"}</strong>
                  <p style={{ margin: "4px 0" }}>{c.text}</p>
                  <small style={{ color: "#999" }}>{new Date(c.date).toLocaleString()}</small>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BlogCard;
