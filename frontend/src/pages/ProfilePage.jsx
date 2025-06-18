// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userBlogs, setUserBlogs] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    setUser(userData);

    const fetchUserBlogs = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/blogs/user/${userData._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setUserBlogs(data.blogs || []);
      } catch (err) {
        console.error("Failed to fetch user blogs:", err);
      }
    };

    fetchUserBlogs();
  }, [navigate]);

  return (
    <>
     

      <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              backgroundColor: "#4f46e5",
              color: "white",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "1.2rem",
              textTransform: "uppercase",
            }}
          >
            {user?.name?.charAt(0)}
          </div>
          <h2>{user?.name}'s Profile</h2>
        </div>

        <hr style={{ margin: "1rem 0" }} />

        <h3>Your Posts:</h3>

        {Array.isArray(userBlogs) && userBlogs.length === 0 ? (
          <p style={{ marginTop: "1rem" }}>You haven't posted any blogs yet.</p>
        ) : (
          Array.isArray(userBlogs) &&
          userBlogs.map((blog) => (
            <div
              key={blog._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/blog/${blog._id}`)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "none")
              }
            >
              <h4>{blog.title}</h4>
              <p style={{ color: "#555" }}>
                {blog.content.substring(0, 120)}...
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ProfilePage;
