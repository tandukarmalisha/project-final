import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  // Simulate auth state from localStorage
  const isLoggedIn = !!localStorage.getItem("token"); // Replace 'token' with your actual key

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    navigate("/login"); // Redirect to login
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        IdeaFlux
      </Link>

      <input type="text" placeholder="Search blogs..." style={styles.search} />

      <div style={styles.links}>
        {!isLoggedIn ? (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        ) : (
          <>
            <Link to="/add-blog" style={styles.link}>Add Blog</Link>
            <Link to="/profile" style={styles.link}>Profile</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    background: "#4f46e5",
    color: "#fff",
  },
  logo: {
    fontSize: "1.5rem",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  search: {
    padding: "0.5rem",
    width: "40%",
    borderRadius: "4px",
    border: "none",
  },
  links: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1rem",
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid white",
    color: "#fff",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default Navbar;
