

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

    // You can get user id from token or backend. Here we assume it's in localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUserId(user?._id || "");

    fetchBlogs();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h1>Welcome {user?.name}</h1>
      <h2>Latest Blogs</h2>
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} currentUserId={currentUserId} />
      ))}
    </div>
  );
};

export default Home;



