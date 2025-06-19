import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!localStorage.getItem("token");

  const navStyle = {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.8rem 2rem",
    backgroundColor: "#111827", // Tailwind slate-900
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
    gap: "1.5rem",
  };

  const linkStyle = {
    fontSize: "1.1rem",
    textDecoration: "none",
    color: "#f3f4f6",
    fontWeight: 500,
    transition: "color 0.3s ease",
    cursor: "pointer",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav style={navStyle}>
      {/* Logo / Brand */}
      <Link to="/" style={brandStyle}>
        IdeaFlux
      </Link>

      <div style={linkContainerStyle}>
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              style={linkStyle}
              onMouseOver={(e) => (e.target.style.color = "#facc15")}
              onMouseOut={(e) => (e.target.style.color = "#f3f4f6")}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={linkStyle}
              onMouseOver={(e) => (e.target.style.color = "#facc15")}
              onMouseOut={(e) => (e.target.style.color = "#f3f4f6")}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/dashboard"
              style={linkStyle}
              onMouseOver={(e) => (e.target.style.color = "#38bdf8")} // sky-400
              onMouseOut={(e) => (e.target.style.color = "#f3f4f6")}
            >
              ➕ Add Blog
            </Link>

            {/* Search bar */}
            <input
              type="text"
              placeholder="Search blog..."
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
              onFocus={(e) => (e.target.style.width = "250px")}
              onBlur={(e) => (e.target.style.width = "180px")}
              onChange={(e) => {
                const value = e.target.value.trim();
                console.log("Search:", value);
              }}
            />

            {/* Profile display */}
            <div
              onClick={() => navigate("/profile")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                padding: "0.2rem 0.6rem",
                borderRadius: "9999px",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1e293b"; // slate-800
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
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
              onMouseOver={(e) => (e.target.style.color = "#f87171")} // red-400
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
