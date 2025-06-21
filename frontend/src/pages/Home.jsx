import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [recommendedBlogs, setRecommendedBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [showAllBlogs, setShowAllBlogs] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchRecommendations = async () => {
    try {
      if (!token || !user?._id) return;
      const { data } = await axios.get(
        "http://localhost:8000/api/blog/user/recommendations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecommendedBlogs(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const fetchData = async () => {
    try {
      const { data: blogData } = await axios.get("http://localhost:8000/api/blog");

      // Sort latest blogs by publish date descending (newest first)
      const latestBlogs = blogData
        .slice() // copy array so original not mutated
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setBlogs(latestBlogs);

      // Sort trending blogs by likes descending
      const trending = blogData
        .slice()
        .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
        .slice(0, 6);

      setTrendingBlogs(trending);

      if (user?._id) setCurrentUserId(user._id);
      await fetchRecommendations();
    } catch (error) {
      console.error("Error loading blogs:", error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const visibleBlogs = showAllBlogs ? blogs : blogs.slice(0, 6);

  return (
    <div
      style={{
        maxWidth: 1300,
        margin: "40px auto",
        padding: "0 20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#222",
      }}
    >
      <h1 style={{ fontWeight: "700", marginBottom: 8 }}>
        Welcome{user?.name ? `, ${user.name}` : ""}
      </h1>

      {/* 🟢 Recommended Blogs */}
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
              <BlogCard
                key={blog._id}
                blog={blog}
                currentUserId={currentUserId}
                onLikeToggle={fetchRecommendations}
              />
            ))}
          </div>
        </>
      )}

      {/* 🟦 LATEST & 🔥 TRENDING */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "32px",
        }}
      >
        {/* 🔵 Latest Blogs - LEFT SIDE (70%) */}
        <div style={{ flex: "0 0 70%" }}>
          <h2
            style={{
              fontWeight: "600",
              marginBottom: 16,
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
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "20px",
            }}
          >
            {visibleBlogs.length === 0 ? (
              <p style={{ fontStyle: "italic", color: "#666" }}>No blogs available.</p>
            ) : (
              visibleBlogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  currentUserId={currentUserId}
                  onLikeToggle={fetchRecommendations}
                />
              ))
            )}
          </div>

          {blogs.length > 6 && (
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <button
                onClick={() => setShowAllBlogs(!showAllBlogs)}
                style={{
                  width: "200px",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: "bold",
                  background: "#4f46e5",
                  color: "#fff",
                }}
              >
                {showAllBlogs ? "Show Less" : "Read More"}
              </button>
            </div>
          )}
        </div>

        {/* 🔥 Top Trending Blogs - RIGHT SIDE (30%) */}
        <div style={{ flex: "0 0 30%" }}>
          <h2
            style={{
              fontWeight: "600",
              marginBottom: 16,
              borderBottom: "2px solid #ef4444",
              paddingBottom: 6,
              color: "#ef4444",
            }}
          >
            🔥 Top Trending
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              background: "#fff0f0",
              padding: "12px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            {trendingBlogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                currentUserId={currentUserId}
                onLikeToggle={fetchRecommendations}
                compact={true} // <-- here for smaller cards
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
