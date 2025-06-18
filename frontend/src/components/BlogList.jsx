import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "./BlogCard";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/api/blog")
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(payload.id || payload._id);
    }
  }, []);

  const handleLikeToggle = (blogId, updatedLikes) => {
    setBlogs(prev =>
      prev.map(blog =>
        blog._id === blogId ? { ...blog, likes: updatedLikes } : blog
      )
    );
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <BlogCard
            key={blog._id}
            blog={blog}
            currentUserId={currentUserId}
            onLikeToggle={handleLikeToggle}
          />
        ))
      ) : (
        <p>No blogs found.</p>
      )}
    </div>
  );
};

export default BlogList;
