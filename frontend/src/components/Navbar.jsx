import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NotificationsDropdown from "./NotificationDropdown";
import SearchUser from "./SearchUser";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const navStyle = {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.8rem 2rem",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    fontFamily: "Segoe UI, sans-serif",
  };

  const brandStyle = {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#4f46e5",
    textDecoration: "none",
    letterSpacing: "1px",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  };

  const linkContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  };

  const profileStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
    padding: "0.2rem 0.6rem",
    borderRadius: "9999px",
    transition: "background 0.2s",
  };

  const avatarStyle = {
    backgroundColor: "#4f46e5",
    color: "#fff",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "1rem",
    textTransform: "uppercase",
  };

  return (
    <nav style={navStyle}>
      {/* Brand */}
      <Link to="/" style={brandStyle}>
        <img src="/favicon.ico" alt="Logo" style={{ width: "40px", height: "40px" }} />
        IdeaFlux
      </Link>

      {/* Center: Search */}
      {isLoggedIn && <SearchUser />}

      {/* Right Links / Profile */}
      <div style={linkContainerStyle}>
        {isLoggedIn ? (
          <>
            <NotificationsDropdown />
            <div
              onClick={() => navigate("/profile")}
              style={profileStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              title={`Logged in as ${user?.name}`}
            >
              <div style={avatarStyle}>{user?.name?.charAt(0) || "U"}</div>
              <span style={{ fontWeight: "600", fontSize: "1rem", color: "#4f46e5" }}>
                {user?.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: "#d50707ff",
                border:"none",
                fontWeight: 500,
                fontSize: "1rem",
                color: "white",
                cursor: "pointer",
                transition: "color 0.2s",
                borderRadius:"50px",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f25757ff")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#d50707ff")}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "#4f46e5", fontWeight: 500, textDecoration: "none" }}>Login</Link>
            <Link to="/register" style={{ color: "#4f46e5", fontWeight: 500, textDecoration: "none" }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
