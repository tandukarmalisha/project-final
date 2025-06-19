import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";

const BlogCard = ({ blog, currentUserId, onLikeToggle }) => {
  const [likes, setLikes] = useState(blog.likes || []);
  const [comments, setComments] = useState(blog.comments || []);
  const [newComment, setNewComment] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const navigate = useNavigate();

  const likedByUser =
    Array.isArray(likes) && currentUserId
      ? likes.some((id) => id?.toString() === currentUserId.toString())
      : false;

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
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
        onLikeToggle && onLikeToggle(blog._id, res.data.likes);
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
      const token = localStorage.getItem("token");
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

  const truncatedContent =
    blog.content.length > 250
      ? `${blog.content.substring(0, 250)}... `
      : blog.content;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        cursor: "pointer",
        transition: "box-shadow 0.2s ease-in-out",
      }}
      onClick={() => navigate(`/blog/${blog._id}`)}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)")
      }
    >
      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "#4f46e5",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            textTransform: "uppercase",
            fontSize: 18,
            marginRight: 10,
          }}
        >
          {blog.author?.name?.charAt(0) || "U"}
        </div>
        <strong>{blog.author?.name || "Unknown User"}</strong>
      </div>

      {/* Blog Content */}
      <h2>{blog.title}</h2>

      {blog.image && (
        <img
          src={blog.image}
          alt="Blog"
          style={{
            width: "100%",
            maxHeight: 300,
            objectFit: "cover",
            borderRadius: 6,
            marginBottom: 10,
          }}
        />
      )}

      <p style={{ marginTop: "1rem" }}>
        {truncatedContent}
        {blog.content.length > 250 && (
          <span
            style={{
              color: "#4f46e5",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation(); // prevent navigating twice
              navigate(`/blog/${blog._id}`);
            }}
          >
            Read more
          </span>
        )}
      </p>

      <p>
        <strong>Category:</strong> {blog.categories?.join(", ")}
      </p>

      {/* Like & Comment Buttons */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 16,
          alignItems: "center",
        }}
        onClick={(e) => e.stopPropagation()} // prevent card click
      >
        <button
          onClick={handleLike}
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: likedByUser ? "red" : "#444",
          }}
        >
          <FontAwesomeIcon
            icon={likedByUser ? solidHeart : regularHeart}
            style={{ color: likedByUser ? "red" : "#444" }}
          />
          Like ({likes.length})
        </button>

        <button
          onClick={() => setShowComments((prev) => !prev)}
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#444",
          }}
        >
          💬 Comments ({comments.length})
        </button>

        <button
          onClick={() => setShowCommentInput((prev) => !prev)}
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#444",
          }}
        >
          ✍️ Add Comment
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

      {/* Comments List */}
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
                  <small style={{ color: "#999" }}>
                    {new Date(c.date).toLocaleString()}
                  </small>
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
