
// import React from "react";
// import { Link, useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const navigate = useNavigate();

//   // Check if user is logged in and get user info from localStorage
//   const user = JSON.parse(localStorage.getItem("user"));
//   const isLoggedIn = !!localStorage.getItem("token");

//   const navStyle = {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "1rem 2rem",
//     backgroundColor: "#f9fafb",
//     borderBottom: "1px solid #ddd",
//     position: "sticky",
//     top: "0",
//     zIndex: "1000",
//     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//     fontFamily: "'Arial', sans-serif",
//     fontSize: "1.2rem",

//   };

//   const linkContainerStyle = {
//     display: "flex",
//     gap: "1.2rem",
//     alignItems: "center",
//   };

//   const linkStyle = {
//     fontSize: "1.2rem",
//     textDecoration: "none",
//     color: "#333",
//     fontWeight: "500",
//     cursor: "pointer",
//     width: "100px",
    
   
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/");
//     window.location.reload(); // Refresh navbar
//   };

//   return (
//     <nav style={navStyle}>
//       <div style={linkContainerStyle}>
//         <Link to="/" style={{ fontWeight: "bold" , fontSize:"3rem" , cursor: "pointer"}}>
//           IdeaFlux
//         </Link>
//       </div>

//       <div style={linkContainerStyle}>
//         {!isLoggedIn ? (
//           <>
//             <Link to="/login" style={linkStyle}>
//               Login
//             </Link>
//             <Link to="/register" style={linkStyle}>
//               Register
//             </Link>
//           </>
//         ) : (
//           <>
//             <Link to="/dashboard" style={linkStyle}>
//               Add Blog
//             </Link>
//             {/* <Link to="/profile" style={linkStyle}>
//               Profile
//             </Link> */}

//             {/* Show user name or profile picture */}
//             {user?.profilePic ? (
//               <img
//                 src={user.profilePic}
//                 alt="Profile"
//                 style={{ width: "32px", height: "32px", borderRadius: "50%" }}
//               />
//             ) : (
//               <span style={{ fontWeight: "bold", color:"red" , fontSize:"1.4rem" , cursor: "pointer"}}> {user?.name}</span>
//             )}

//             <button
//               onClick={handleLogout}
//               style={{
//                 ...linkStyle,
//                 background: "none",
//                 border: "none",
//                 padding: 0,
//               }}
//             >
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!localStorage.getItem("token");

  const navStyle = {
    position: "sticky",
    top: "0",
    zIndex: "1000",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#1f2937", // Dark background (Tailwind slate-800)
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    fontFamily: "Segoe UI, sans-serif",
  };

  const brandStyle = {
    fontSize: "2.2rem",
    fontWeight: "bold",
    color: "#facc15", // Yellow-400
    textDecoration: "none",
  };

  const linkContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  };

  const linkStyle = {
    fontSize: "1rem",
    textDecoration: "none",
    color: "#f3f4f6", // Gray-100
    fontWeight: "500",
    transition: "color 0.3s ease",
  };

  const linkHoverStyle = {
    ...linkStyle,
    color: "#facc15", // Yellow on hover
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload(); // Refresh navbar
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={brandStyle}>IdeaFlux</Link>

      <div style={linkContainerStyle}>
        {!isLoggedIn ? (
          <>
            <Link to="/login" style={linkStyle} onMouseOver={e => e.target.style.color = "#facc15"} onMouseOut={e => e.target.style.color = "#f3f4f6"}>
              Login
            </Link>
            <Link to="/register" style={linkStyle} onMouseOver={e => e.target.style.color = "#facc15"} onMouseOut={e => e.target.style.color = "#f3f4f6"}>
              Register
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" style={linkStyle} onMouseOver={e => e.target.style.color = "#facc15"} onMouseOut={e => e.target.style.color = "#f3f4f6"}>
              Add Blog
            </Link>

            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
            <div
            onClick={() => navigate("/profile")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.opacity = "1";
              }}
            >
              <div
                style={{
                  backgroundColor: "#facc15", // Yellow
                  color: "#1f2937",           // Dark text
                  borderRadius: "50%",
                  width: "45px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  textTransform: "uppercase",
                  transition: "background-color 0.3s ease",
                }}
                title={`Logged in as ${user?.name}`}
              >
                {user?.name?.charAt(0) || ""}
              </div>
              <span
                style={{
                  fontWeight: "bold",
                  color: "#facc15",
                  fontSize: "1.1rem",
                  transition: "color 0.3s ease",
                }}
              >
                {user?.name}
              </span>
            </div>


            )}

            <button
              onClick={handleLogout}
              style={{
                ...linkStyle,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontSize: "1rem",
              }}
              onMouseOver={e => e.target.style.color = "#f87171"} // Red-400
              onMouseOut={e => e.target.style.color = "#f3f4f6"}
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
