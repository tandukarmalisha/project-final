// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaBell } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { socket } from "../utils/socket"; // your socket.js file

// const NotificationDropdown = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [toast, setToast] = useState(null); // For real-time popup
//   const currentUser = JSON.parse(localStorage.getItem("user"));
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   // count only unread follow notifications
//   const unreadCount = notifications.filter(
//     (n) => n.type === "follow" && !n.read
//   ).length;

//   const fetchNotifications = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:8000/api/notification/${currentUser.id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       // only follow notifications & reset isNew flag
//       const normalized = (res.data.notifications || [])
//         .filter((n) => n.type === "follow")
//         .map((n) => ({ ...n, isNew: false }));
//       setNotifications(normalized);
//     } catch (err) {
//       console.error("Error fetching notifications", err);
//     }
//   };

//   useEffect(() => {
//     if (token && currentUser?.id) fetchNotifications();

//     // Join socket room
//     socket.emit("joinRoom", currentUser?.id);

//     // Listen for new follow notifications
//     socket.on("newNotification", (notification) => {
//       if (notification.type === "follow") {
//         setNotifications((prev) => [
//           { ...notification, isNew: true },
//           ...prev,
//         ]);
//         setToast(notification); // show popup
//         setTimeout(() => setToast(null), 4000);
//       }
//     });

//     return () => socket.off("newNotification");
//   }, []);

//   const handleBellClick = async () => {
//     setOpen(!open);

//     if (!open) {
//       // Clear NEW flags when dropdown is opened
//       setNotifications((prev) =>
//         prev.map((n) => ({ ...n, isNew: false }))
//       );
//     }

//     // Mark all as read in DB
//     if (unreadCount > 0) {
//       try {
//         await axios.post(
//           `http://localhost:8000/api/notification/mark-read/${currentUser.id}`,
//           {},
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setNotifications((prev) =>
//           prev.map((n) => ({ ...n, read: true }))
//         );
//       } catch (err) {
//         console.error("Error marking notifications as read", err);
//       }
//     }
//   };

//   const goToSenderProfile = (senderId) => {
//     navigate(`/user/${senderId}`);
//     setOpen(false);
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       {/* Bell Icon */}
//       <div
//         onClick={handleBellClick}
//         style={{ position: "relative", cursor: "pointer" }}
//       >
//         <FaBell size={28} style={{ color: "#facc15" }} />
//         {unreadCount > 0 && (
//           <span
//             style={{
//               position: "absolute",
//               top: -5,
//               right: -5,
//               backgroundColor: "red",
//               color: "white",
//               borderRadius: "50%",
//               padding: "3px 7px",
//               fontSize: "12px",
//               fontWeight: "bold",
//             }}
//           >
//             {unreadCount}
//           </span>
//         )}
//       </div>

//       {/* Dropdown */}
//       {open && (
//         <div
//           style={{
//             position: "absolute",
//             top: "35px",
//             right: 0,
//             width: "300px",
//             backgroundColor: "#fff",
//             boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
//             borderRadius: "12px",
//             zIndex: 100,
//             padding: "10px 0",
//             maxHeight: "400px",
//             overflowY: "auto",
//           }}
//         >
//           <h4
//             style={{
//               fontSize: "16px",
//               fontWeight: "600",
//               padding: "0 15px",
//               marginBottom: 10,
//             }}
//           >
//             Follow Notifications
//           </h4>

//           {notifications.length === 0 ? (
//             <p
//               style={{
//                 fontSize: "14px",
//                 color: "#888",
//                 padding: "0 15px",
//               }}
//             >
//               No new followers
//             </p>
//           ) : (
//             notifications
//               .slice(0, 5) // show only latest 5
//               .map((n) => (
//                 <div
//                   key={n._id}
//                   onClick={() => goToSenderProfile(n.sender._id)}
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     padding: "10px 15px",
//                     margin: "0 10px 5px 10px",
//                     borderRadius: "10px",
//                     backgroundColor: n.read ? "#f3f4f6" : "#e0f2fe",
//                     cursor: "pointer",
//                     transition: "background 0.2s",
//                   }}
//                 >
//                   <span>
//                     <strong style={{ color: "#2563eb" }}>
//                       {n.sender?.name}
//                     </strong>{" "}
//                     followed you{" "}
//                     {n.isNew && (
//                       <span
//                         style={{
//                           background: "yellow",
//                           color: "black",
//                           fontSize: "11px",
//                           padding: "2px 5px",
//                           borderRadius: "5px",
//                           marginLeft: "6px",
//                         }}
//                       >
//                         NEW
//                       </span>
//                     )}
//                   </span>
//                   <span style={{ fontSize: "12px", color: "#888" }}>
//                     {new Date(n.createdAt).toLocaleTimeString()}
//                   </span>
//                 </div>
//               ))
//           )}
//         </div>
//       )}

//       {/* Toast */}
//       {toast && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: 20,
//             right: 20,
//             backgroundColor: "#2563eb",
//             color: "#fff",
//             padding: "15px 20px",
//             borderRadius: "12px",
//             boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
//             zIndex: 9999,
//             animation: "fadeInOut 4s forwards",
//           }}
//         >
//           <strong>{toast.sender?.name}</strong> followed you
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationDropdown;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaBell } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { socket } from "../utils/socket"; // your socket.js file

// const NotificationDropdown = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [toast, setToast] = useState(null); // For real-time popup
//   const currentUser = JSON.parse(localStorage.getItem("user"));
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   // Count only unread notifications
//   const unreadCount = notifications.filter((n) => !n.read).length;

//   const fetchNotifications = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:8000/api/notification/${currentUser.id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       // Normalize notifications
//       const normalized = (res.data.notifications || []).map((n) => ({
//         ...n,
//         isNew: false,
//       }));
//       setNotifications(normalized);
//     } catch (err) {
//       console.error("Error fetching notifications", err);
//     }
//   };

//   useEffect(() => {
//     if (token && currentUser?.id) fetchNotifications();

//     // Join socket room
//     socket.emit("joinRoom", currentUser?.id);

//     // Listen for new notifications
//     socket.on("newNotification", (notification) => {
//       setNotifications((prev) => [{ ...notification, isNew: true }, ...prev]);
//       setToast(notification); // Show popup
//       setTimeout(() => setToast(null), 4000);
//     });

//     return () => socket.off("newNotification");
//   }, []);

//   const handleBellClick = async () => {
//     setOpen(!open);

//     if (!open) {
//       // Clear NEW flags when dropdown is opened
//       setNotifications((prev) =>
//         prev.map((n) => ({ ...n, isNew: false }))
//       );
//     }

//     // Mark all as read in DB
//     if (unreadCount > 0) {
//       try {
//         await axios.post(
//           `http://localhost:8000/api/notification/mark-read/${currentUser.id}`,
//           {},
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setNotifications((prev) =>
//           prev.map((n) => ({ ...n, read: true }))
//         );
//       } catch (err) {
//         console.error("Error marking notifications as read", err);
//       }
//     }
//   };

//   const goToSenderProfile = (senderId) => {
//     navigate(`/user/${senderId}`);
//     setOpen(false);
//   };

//   const renderNotificationMessage = (notification) => {
//     switch (notification.type) {
//       case "follow":
//         return `${notification.sender?.name} followed you`;
//       case "like":
//         return `${notification.sender?.name} liked your post`;
//       case "comment":
//         return `${notification.sender?.name} commented on your post`;
//       default:
//         return "You have a new notification";
//     }
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       {/* Bell Icon */}
//       <div
//         onClick={handleBellClick}
//         style={{ position: "relative", cursor: "pointer" }}
//       >
//         <FaBell size={28} style={{ color: "#facc15" }} />
//         {unreadCount > 0 && (
//           <span
//             style={{
//               position: "absolute",
//               top: -5,
//               right: -5,
//               backgroundColor: "red",
//               color: "white",
//               borderRadius: "50%",
//               padding: "3px 7px",
//               fontSize: "12px",
//               fontWeight: "bold",
//             }}
//           >
//             {unreadCount}
//           </span>
//         )}
//       </div>

//       {/* Dropdown */}
//       {open && (
//         <div
//           style={{
//             position: "absolute",
//             top: "35px",
//             right: 0,
//             width: "300px",
//             backgroundColor: "#fff",
//             boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
//             borderRadius: "12px",
//             zIndex: 100,
//             padding: "10px 0",
//             maxHeight: "400px",
//             overflowY: "auto",
//           }}
//         >
//           <h4
//             style={{
//               fontSize: "16px",
//               fontWeight: "600",
//               padding: "0 15px",
//               marginBottom: 10,
//             }}
//           >
//             Notifications
//           </h4>

//           {notifications.length === 0 ? (
//             <p
//               style={{
//                 fontSize: "14px",
//                 color: "#888",
//                 padding: "0 15px",
//               }}
//             >
//               No new notifications
//             </p>
//           ) : (
//             notifications
//               .slice(0, 5) // show only latest 5
//               .map((n) => (
//                 <div
//                   key={n._id}
//                   onClick={() => goToSenderProfile(n.sender._id)}
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     padding: "10px 15px",
//                     margin: "0 10px 5px 10px",
//                     borderRadius: "10px",
//                     backgroundColor: n.read ? "#f3f4f6" : "#e0f2fe",
//                     cursor: "pointer",
//                     transition: "background 0.2s",
//                   }}
//                 >
//                   <span>
//                     <strong style={{ color: "#2563eb" }}>
//                       {renderNotificationMessage(n)}
//                     </strong>
//                     {n.isNew && (
//                       <span
//                         style={{
//                           background: "yellow",
//                           color: "black",
//                           fontSize: "11px",
//                           padding: "2px 5px",
//                           borderRadius: "5px",
//                           marginLeft: "6px",
//                         }}
//                       >
//                         NEW
//                       </span>
//                     )}
//                   </span>
//                   <span style={{ fontSize: "12px", color: "#888" }}>
//                     {new Date(n.createdAt).toLocaleTimeString()}
//                   </span>
//                 </div>
//               ))
//           )}
//         </div>
//       )}

//       {/* Toast */}
//       {toast && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: 20,
//             right: 20,
//             backgroundColor: "#2563eb",
//             color: "#fff",
//             padding: "15px 20px",
//             borderRadius: "12px",
//             boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
//             zIndex: 9999,
//             animation: "fadeInOut 4s forwards",
//           }}
//         >
//           <strong>{toast.sender?.name}</strong> {renderNotificationMessage(toast)}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationDropdown;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { socket } from "../utils/socket"; // your socket.js file

// const NotificationDropdown = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [toast, setToast] = useState(null); // For real-time popup
//   const currentUser = JSON.parse(localStorage.getItem("user"));
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   // Count only unread notifications
//   const unreadCount = notifications.filter((n) => !n.read).length;

//   const fetchNotifications = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:8000/api/notification/${currentUser.id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       console.log("Fetched notifications:", res.data.notifications); // Debug log
//       // Normalize notifications
//       const normalized = (res.data.notifications || []).map((n) => ({
//         ...n,
//         isNew: false,
//       }));
//       setNotifications(normalized);
//     } catch (err) {
//       console.error("Error fetching notifications", err);
//     }
//   };

//   useEffect(() => {
//     if (token && currentUser?.id) fetchNotifications();

//     // Join socket room
//     socket.emit("joinRoom", currentUser?.id);

//     // Listen for new notifications
//     socket.on("newNotification", (notification) => {
//       setNotifications((prev) => [{ ...notification, isNew: true }, ...prev]);
//       setToast(notification); // Show popup
//       setTimeout(() => setToast(null), 4000);
//     });

//     return () => socket.off("newNotification");
//   }, []);

//   const handleBellClick = async () => {
//     setOpen(!open);

//     if (!open) {
//       // Clear NEW flags when dropdown is opened
//       setNotifications((prev) =>
//         prev.map((n) => ({ ...n, isNew: false }))
//       );
//     }

//     // Mark all as read in DB
//     if (unreadCount > 0) {
//       try {
//         await axios.post(
//           `http://localhost:8000/api/notification/mark-read/${currentUser.id}`,
//           {},
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setNotifications((prev) =>
//           prev.map((n) => ({ ...n, read: true }))
//         );
//       } catch (err) {
//         console.error("Error marking notifications as read", err);
//       }
//     }
//   };
//before change
  // const handleNotificationClick = (notification) => {
  //   switch (notification.type) {
  //     case "follow":
  //       navigate(`/user/${notification.sender._id}`);
  //       break;
  //     case "like":
  //     case "comment":
  //       navigate(`/post/${notification.blogId}`);
  //       break;
  //     default:
  //       console.warn("Unknown notification type");
  //   }
  //   setOpen(false);
  // };

//   const handleNotificationClick = (notification) => {
//     switch (notification.type) {
//       case "follow":
//         navigate(`/user/${notification.sender._id}`);
//         break;
//       case "like":
//       case "comment":
//         if (notification.blogId) { // Use blogId for navigation
//           navigate(`/post/${notification.blogId}`);
//         } else {
//           console.error("Blog ID is missing for this notification:", notification);
//           alert("The post for this notification could not be found.");
//         }
//         break;
//       default:
//         console.warn("Unknown notification type");
//     }
//     setOpen(false);
//   };

//   const renderNotificationMessage = (notification) => {
//     switch (notification.type) {
//       case "follow":
//         return `${notification.sender?.name} followed you`;
//       case "like":
//         return `${notification.sender?.name} liked your post`;
//       case "comment":
//         return `${notification.sender?.name} commented on your post`;
//       default:
//         return "You have a new notification";
//     }
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       {/* Bell Icon */}
//       <div
//         onClick={handleBellClick}
//         style={{ position: "relative", cursor: "pointer" }}
//       >
//         <FaBell size={28} style={{ color: "#facc15" }} />
//         {unreadCount > 0 && (
//           <span
//             style={{
//               position: "absolute",
//               top: -5,
//               right: -5,
//               backgroundColor: "red",
//               color: "white",
//               borderRadius: "50%",
//               padding: "3px 7px",
//               fontSize: "12px",
//               fontWeight: "bold",
//             }}
//           >
//             {unreadCount}
//           </span>
//         )}
//       </div>

//       {/* Dropdown */}
//       {open && (
//         <div
//           style={{
//             position: "absolute",
//             top: "35px",
//             right: 0,
//             width: "300px",
//             backgroundColor: "#fff",
//             boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
//             borderRadius: "12px",
//             zIndex: 100,
//             padding: "10px 0",
//             maxHeight: "400px",
//             overflowY: "auto",
//           }}
//         >
//           <h4
//             style={{
//               fontSize: "16px",
//               fontWeight: "600",
//               padding: "0 15px",
//               marginBottom: 10,
//             }}
//           >
//             Notifications
//           </h4>

//           {notifications.length === 0 ? (
//             <p
//               style={{
//                 fontSize: "14px",
//                 color: "#888",
//                 padding: "0 15px",
//               }}
//             >
//               No new notifications
//             </p>
//           ) : (
//             notifications
//               .slice(0, 5) // show only latest 5
//               .map((n) => (
//                 <div
//                   key={n._id}
//                   onClick={() => handleNotificationClick(n)}
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     padding: "10px 15px",
//                     margin: "0 10px 5px 10px",
//                     borderRadius: "10px",
//                     backgroundColor: n.read ? "#f3f4f6" : "#e0f2fe",
//                     cursor: "pointer",
//                     transition: "background 0.2s",
//                   }}
//                 >
//                   <span>
//                     <strong style={{ color: "#2563eb" }}>
//                       {renderNotificationMessage(n)}
//                     </strong>
//                     {n.isNew && (
//                       <span
//                         style={{
//                           background: "yellow",
//                           color: "black",
//                           fontSize: "11px",
//                           padding: "2px 5px",
//                           borderRadius: "5px",
//                           marginLeft: "6px",
//                         }}
//                       >
//                         NEW
//                       </span>
//                     )}
//                   </span>
//                   <span style={{ fontSize: "12px", color: "#888" }}>
//                     {new Date(n.createdAt).toLocaleTimeString()}
//                   </span>
//                 </div>
//               ))
//           )}
//         </div>
//       )}

//       {/* Toast */}
//       {toast && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: 20,
//             right: 20,
//             backgroundColor: "#2563eb",
//             color: "#fff",
//             padding: "15px 20px",
//             borderRadius: "12px",
//             boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
//             zIndex: 9999,
//             animation: "fadeInOut 4s forwards",
//           }}
//         >
//           <strong>{toast.sender?.name}</strong> {renderNotificationMessage(toast)}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationDropdown;
const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/notification/${currentUser.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  useEffect(() => {
    if (token && currentUser?.id) fetchNotifications();

    socket.emit("joinRoom", currentUser?.id);

    socket.on("newNotification", (notification) => {
      console.log("New notification received:", notification);
      setNotifications((prev) => [{ ...notification, isNew: true }, ...prev]);
      setToast(notification);
      setTimeout(() => setToast(null), 4000);
    });

    return () => socket.off("newNotification");
  }, []);

  const handleNotificationClick = (notification) => {
    if ((notification.type === "like" || notification.type === "comment") && notification.blogId) {
      navigate(`/blog/${notification.blogId}`);
    } else if (notification.type === "follow") {
      navigate(`/user/${notification.sender._id}`);
    } else {
      console.error("Invalid notification type or missing blogId:", notification);
      alert("Unable to navigate to the notification target.");
    }
    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Bell Icon */}
      <div
        onClick={() => setOpen(!open)}
        style={{ position: "relative", cursor: "pointer" }}
      >
        <FaBell size={28} style={{ color: "#facc15" }} />
        {notifications.filter((n) => !n.read).length > 0 && (
          <span
            style={{
              position: "absolute",
              top: -5,
              right: -5,
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              padding: "3px 7px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "35px",
            right: 0,
            width: "300px",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
            borderRadius: "12px",
            zIndex: 100,
            padding: "10px 0",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <h4
            style={{
              fontSize: "16px",
              fontWeight: "600",
              padding: "0 15px",
              marginBottom: 10,
            }}
          >
            Notifications
          </h4>
          {notifications.length === 0 ? (
            <p
              style={{
                fontSize: "14px",
                color: "#888",
                padding: "0 15px",
              }}
            >
              No new notifications
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleNotificationClick(n)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "10px 15px",
                  margin: "0 10px 5px 10px",
                  borderRadius: "10px",
                  backgroundColor: n.read ? "#f3f4f6" : "#e0f2fe",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                <span>
                  <strong
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/user/${n.sender._id}`);
                    }}
                    style={{
                      color: "#2563eb",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {n.sender?.name}
                  </strong>{" "}
                  <span style={{ color: "#374151" }}>
                    {n.type === "follow" ? "followed you" : n.message}
                  </span>
                </span>
                <span style={{ fontSize: "12px", color: "#888" }}>
                  {new Date(n.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;