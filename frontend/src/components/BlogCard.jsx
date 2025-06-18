


import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import navigate
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";

const BlogCard = ({ blog, currentUserId, onLikeToggle }) => {
  const [likes, setLikes] = useState(blog.likes || []);
  const [comments, setComments] = useState(blog.comments || []);
  const [newComment, setNewComment] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);

  const navigate = useNavigate(); // Initialize navigate

  const likedByUser =
    Array.isArray(likes) && currentUserId
      ? likes.some((id) => id?.toString() === currentUserId.toString())
      : false;

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.info("Please register or login to interact with blogs.");
        // No token means user is not logged in
        navigate("/register");
        return;
      }

      const res = await axios.patch(
        `http://localhost:8000/api/blog/${blog._id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data && Array.isArray(res.data.likes)) {
        setLikes(res.data.likes);
        onLikeToggle && onLikeToggle(blog._id, res.data.likes);
      } else {
        console.warn("Unexpected response format:", res.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // Unauthorized, redirect to register/login page
        toast.info("Session expired. Please login again.");
        navigate("/register");
      } else {
        console.error("Like error:", error.response?.data || error.message);
      }
    }
  };
//     e.preventDefault();
//     if (!newComment.trim()) return;

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/register");
//         return;
//       }

//       const res = await axios.patch(
//         `http://localhost:8000/api/blog/${blog._id}/comment`,
//         { comment: newComment },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (res.data && res.data.comment) {
//         setComments((prev) => [...prev, res.data.comment]);
//         setNewComment("");
//       }
//     } catch (err) {
//       if (err.response?.status === 401) {
//         navigate("/register");
//       } else {
//         console.error("Comment error:", err.response?.data || err.message);
//       }
//     }
//   };
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
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data && res.data.comment) {
      setComments((prev) => [...prev, res.data.comment]);
      setNewComment("");
    }
  } catch (err) {
    if (err.response?.status === 401) {
      navigate("/register");
    } else {
      console.error("Comment error:", err.response?.data || err.message);
    }
  }
};

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
      }}
    >
      <h2>{blog.title}</h2>

      {blog.image && (
        <img
          src={blog.image}
          alt="Blog"
          style={{ width: "100%", maxHeight: 300, objectFit: "cover" }}
        />
      )}

      <p>{blog.content}</p>
      <p>
        <strong>Category:</strong> {blog.categories?.join(", ")}
      </p>

      {/* Like and Comment Buttons */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 12,
          alignItems: "center",
        }}
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
          💬 Comment ({comments.length})
        </button>
      </div>

      {/* Comment Input */}
      {showCommentInput && (
        <form
          onSubmit={handleCommentSubmit}
          style={{
            marginTop: 12,
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{
              flexGrow: 1,
              padding: "8px 12px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: 14,
            }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 12px",
              borderRadius: "20px",
              cursor: "pointer",
              border: "none",
              backgroundColor: "#007bff",
              color: "white",
              fontWeight: "bold",
              fontSize: 14,
              whiteSpace: "nowrap",
            }}
          >
            Post
          </button>
        </form>
      )}

      {/* Comments List */}
      <div style={{ marginTop: 16 }}>
        {comments.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "#666" }}>No comments yet.</p>
        ) : (
          comments.map((c, i) => (
            <div
              key={i}
              style={{
                borderBottom: "1px solid #eee",
                padding: "8px 0",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  backgroundColor: "#007bff",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  flexShrink: 0,
                }}
              >
                {c.user?.name?.charAt(0) || "A"}
              </div>

              <div>
                <strong>{c.user?.name || "Anonymous"}</strong>: {c.text}
                <br />
                <small style={{ color: "#999" }}>
                  {new Date(c.date).toLocaleString()}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogCard;
