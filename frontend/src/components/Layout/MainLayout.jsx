// import React from "react";
// import { Link, Outlet, useNavigate } from "react-router-dom";
// import Navbar from "../Navbar"; // ✅ Your original navbar with full logic
// import "./MainLayout.css";
// import SearchUser from "../SearchUser"; // ✅ Import your SearchUser componen
// import NotificationsDropdown from "../NotificationDropdown"; // ✅ Import your NotificationsDropdown component
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faHome,
//   faPen,
//   faStar,
//   faUser,
//   faRightFromBracket,
//   faRightToBracket,
//   faUserPlus,
//   faBell, 
// } from "@fortawesome/free-solid-svg-icons";


// const MainLayout = () => {
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem("user"));
//   const isLoggedIn = !!localStorage.getItem("token");

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/");
//     window.location.reload();
//   };

//   return (
//     <div>
//       <Navbar />

//       <div className="main-content-area" style={{ display: "flex" }}>
//         {/* Sidebar */}
//         <nav
//           className="sidebar"
          
//         >
//           {isLoggedIn ? (
//             <>
//               <SearchUser />
//               <Link to="/">
//                 <FontAwesomeIcon icon={faHome} /> Home
//               </Link>
//               <Link to="/add-blog">
//                 <FontAwesomeIcon icon={faPen} /> Add Blog
//               </Link>
//               <Link to="/recommend">
//                 <FontAwesomeIcon icon={faStar} /> Search Blog
//               </Link>
//               <Link to="/notifications">
//                 <FontAwesomeIcon icon={faBell} /> Notifications
//               </Link>
//               <Link to="/profile">
//                 <FontAwesomeIcon icon={faUser} /> {user?.name}
//               </Link>
//               <button onClick={handleLogout}>
//                 <FontAwesomeIcon icon={faRightFromBracket} /> Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login">
//                 <FontAwesomeIcon icon={faRightToBracket} /> Login
//               </Link>
//               <Link to="/register">
//                 <FontAwesomeIcon icon={faUserPlus} /> Register
//               </Link>
//             </>
//           )}

//         </nav>

//         {/* Main content */}
//         <main className="page-content" style={{ flex: 1, padding: "1rem" }}>
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default MainLayout;

import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./MainLayout.css";
import SearchUser from "../SearchUser";
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
                <FontAwesomeIcon icon={faHome}style={{ color: "#6366f1", transition: "color 0.3s" }}/>
                {!isCollapsed && <span>Home</span>}
              </Link>

              <Link className="sidebar-link" to="/add-blog">
                <FontAwesomeIcon icon={faPen} style={{ color: "#6366f1", transition: "color 0.3s" }} />
                {!isCollapsed && <span>Add Blog</span>}
              </Link>

              <Link className="sidebar-link" to="/recommend">
                <FontAwesomeIcon icon={faStar} style={{ color: "#6366f1", transition: "color 0.3s" }}/>
                {!isCollapsed && <span>Search Blog</span>}
              </Link>

              <Link className="sidebar-link" to="/notification-page">
                <FontAwesomeIcon icon={faBell} style={{ color: "#6366f1", transition: "color 0.3s" }} />
                {!isCollapsed && <span>Notifications</span>}
              </Link>

              <Link className="sidebar-link" to="/profile">
                <FontAwesomeIcon icon={faUser} style={{ color: "#6366f1", transition: "color 0.3s" }} />
                {!isCollapsed && <span>{user?.name || "Profile"}</span>}
              </Link>

              <button onClick={handleLogout} className="sidebar-link logout-btn">
                <FontAwesomeIcon icon={faRightFromBracket} />
                {!isCollapsed && <span>Logout</span>}
              </button>
            </>
          ) : (
            <>
              <Link className="sidebar-link" to="/login">
                <FontAwesomeIcon icon={faRightToBracket} />
                {!isCollapsed && <span>Login</span>}
              </Link>
              <Link className="sidebar-link" to="/register">
                <FontAwesomeIcon icon={faUserPlus} />
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
