// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [blogs, setBlogs] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/blog");
        setBlogs(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUserId(user?._id || "");

    fetchBlogs();
  }, []);

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: "0 20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#222",
      }}
    >
      <h1 style={{ fontWeight: "700", marginBottom: 8 }}>
        Welcome{user?.name ? `, ${user.name}` : ""}
      </h1>

      <h2
        style={{
          fontWeight: "600",
          marginBottom: 24,
          borderBottom: "2px solid #4f46e5",
          paddingBottom: 6,
          color: "#4f46e5",
        }}
      >
        Latest Blogs
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
        }}
      >
        {blogs.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "#666" }}>
            No blogs available.
          </p>
        ) : (
          blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} currentUserId={currentUserId} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
