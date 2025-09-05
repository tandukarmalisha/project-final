import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./MainLayout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faPen,
  faStar,
  faUser,
  faRightFromBracket,
  faRightToBracket,
  faUserPlus,
  faBell,
  faChevronLeft,
  faChevronRight,
  faMagnifyingGlass, // added search icon
} from "@fortawesome/free-solid-svg-icons";

const MainLayout = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const iconStyle = { color: "#6366f1", transition: "color 0.3s", minWidth: "20px" };

  return (
    <div className="app-container">
      <Navbar />

      <div className="main-content-area" style={{ display: "flex" }}>
        {/* Sidebar */}
        <nav className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
          {/* Toggle Button */}
          <button
            className="toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
          </button>

          {isLoggedIn ? (
            <>
              <Link className="sidebar-link" to="/">
                <FontAwesomeIcon icon={faHome} style={iconStyle} />
                {!isCollapsed && <span>Home</span>}
              </Link>

              <Link className="sidebar-link" to="/add-blog">
                <FontAwesomeIcon icon={faPen} style={iconStyle} />
                {!isCollapsed && <span>Add Blog</span>}
              </Link>

              <Link className="sidebar-link" to="/recommend">
                <FontAwesomeIcon icon={faMagnifyingGlass} style={iconStyle} />
                {!isCollapsed && <span>Search Blog</span>}
              </Link>

              <Link className="sidebar-link" to="/notification-page">
                <FontAwesomeIcon icon={faBell} style={iconStyle} />
                {!isCollapsed && <span>Notifications</span>}
              </Link>

              <Link className="sidebar-link" to="/profile">
                <FontAwesomeIcon icon={faUser} style={iconStyle} />
                {!isCollapsed && <span>{user?.name || "Profile"}</span>}
              </Link>

              <button onClick={handleLogout} className="sidebar-link logout-btn">
                <FontAwesomeIcon icon={faRightFromBracket} style={iconStyle} />
                {!isCollapsed && <span>Logout</span>}
              </button>
            </>
          ) : (
            <>
              <Link className="sidebar-link" to="/login">
                <FontAwesomeIcon icon={faRightToBracket} style={iconStyle} />
                {!isCollapsed && <span>Login</span>}
              </Link>
              <Link className="sidebar-link" to="/register">
                <FontAwesomeIcon icon={faUserPlus} style={iconStyle} />
                {!isCollapsed && <span>Register</span>}
              </Link>
            </>
          )}
        </nav>

        {/* Main content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
