import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const categories = [
  "Technology", "Programming", "Lifestyle", "Entertainment", "Music",
  "Movies", "Sports", "Travel", "Food", "Nature", "Health",
  "Education", "Bollywood", "Fashion", "Personal", "News"
];

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!localStorage.getItem("token");

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = categories.filter((cat) =>
      cat.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredCategories(value ? filtered : []);
    setActiveIndex(0);
  };

  const handleCategorySelect = (category) => {
    setSearchTerm("");
    setFilteredCategories([]);
    navigate(`/category/${category.toLowerCase()}`);
  };

  const navStyle = {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.8rem 2rem",
    backgroundColor: "#111827",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    fontFamily: "Segoe UI, sans-serif",
  };

  const brandStyle = {
    fontSize: "2.2rem",
    fontWeight: "800",
    color: "#facc15",
    textDecoration: "none",
    letterSpacing: "1px",
  };

  const linkContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  };

  const linkStyle = {
    fontSize: "1rem",
    textDecoration: "none",
    color: "#f3f4f6",
    fontWeight: 500,
    transition: "color 0.3s ease",
    cursor: "pointer",
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={brandStyle}>
        IdeaFlux
      </Link>

      <div style={linkContainerStyle}>
        {!isLoggedIn ? (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" style={linkStyle}>Add Blog</Link>

            {/* Search bar with dropdown */}
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search category..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    setActiveIndex((prev) =>
                      Math.min(prev + 1, filteredCategories.length - 1)
                    );
                  } else if (e.key === "ArrowUp") {
                    setActiveIndex((prev) => Math.max(prev - 1, 0));
                  } else if (e.key === "Enter" && filteredCategories[activeIndex]) {
                    handleCategorySelect(filteredCategories[activeIndex]);
                  }
                }}
                onBlur={() => setTimeout(() => setFilteredCategories([]), 200)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "9999px",
                  border: "1px solid #d1d5db",
                  outline: "none",
                  fontSize: "1rem",
                  backgroundColor: "#f9fafb",
                  transition: "all 0.3s ease-in-out",
                  width: "180px",
                }}
              />

              {searchTerm && filteredCategories.length > 0 && (
                <ul
                  style={{
                    position: "absolute",
                    top: "110%",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    listStyle: "none",
                    padding: "0.5rem",
                    margin: 0,
                    border: "1px solid #ccc",
                    borderRadius: "0.5rem",
                    zIndex: 1000,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  {filteredCategories.map((category, index) => (
                    <li
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      style={{
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                        fontWeight: 500,
                        borderRadius: "0.25rem",
                        backgroundColor:
                          index === activeIndex ? "#f3f4f6" : "transparent",
                      }}
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Profile section */}
            <div
              onClick={() => navigate("/profile")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                padding: "0.2rem 0.6rem",
                borderRadius: "9999px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#facc15",
                  color: "#1f2937",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  textTransform: "uppercase",
                }}
                title={`Logged in as ${user?.name}`}
              >
                {user?.name?.charAt(0) || "U"}
              </div>
              <span
                style={{
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  color: "#facc15",
                }}
              >
                {user?.name}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                ...linkStyle,
                background: "none",
                border: "none",
                fontWeight: 500,
                fontSize: "1.1rem",
              }}
              onMouseOver={(e) => (e.target.style.color = "#f87171")}
              onMouseOut={(e) => (e.target.style.color = "#f3f4f6")}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
