import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [blogs, setBlogs] = useState([]);
  const [recommendedBlogs, setRecommendedBlogs] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch all blogs
        const blogRes = await axios.get("http://localhost:8000/api/blog");
        setBlogs(blogRes.data);

        // Set user
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
        const userId = storedUser?._id || "";
        setCurrentUserId(userId);

        // Fetch recommended blogs only if user is logged in
        if (userId && token) {
          const recRes = await axios.get("http://localhost:8000/api/blog/user/recommendations", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setRecommendedBlogs(recRes.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchAllData();
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

      {/* Recommended Blogs */}
      {recommendedBlogs.length > 0 && (
        <>
          <h2
            style={{
              fontWeight: "600",
              marginBottom: 24,
              borderBottom: "2px solid #10b981",
              paddingBottom: 6,
              color: "#10b981",
            }}
          >
            🟢 Recommended for You
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
              marginBottom: "40px",
            }}
          >
            {recommendedBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} currentUserId={currentUserId} />
            ))}
          </div>
        </>
      )}

      {/* Latest Blogs */}
      <h2
        style={{
          fontWeight: "600",
          marginBottom: 24,
          borderBottom: "2px solid #4f46e5",
          paddingBottom: 6,
          color: "#4f46e5",
        }}
      >
        🔵 Latest Blogs
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
