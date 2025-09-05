import React, { useEffect } from "react";

const NotificationToast = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification._id);
    }, 3000); // auto hide after 3 seconds
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  return (
    <div style={toastStyle}>
      <strong style={{ color: "#2563eb" }}>{notification.sender?.name}</strong>{" "}
      {notification.type === "follow" ? "followed you" : notification.message}
    </div>
  );
};

const toastStyle = {
  position: "fixed",
  top: "20px",
  right: "20px",
  backgroundColor: "#fff",
  padding: "10px 15px",
  borderRadius: "8px",
  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
  zIndex: 9999,
  fontSize: "14px",
  animation: "slideIn 0.5s ease",
};

export default NotificationToast;
