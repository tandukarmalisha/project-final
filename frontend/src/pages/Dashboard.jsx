// src/pages/Dashboard.jsx
import React from "react";
import BlogForm from "../components/BlogForm";

const Dashboard = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2 className="text-2xl font-semibold mb-4">Add New Blog</h2>
      <BlogForm />
    </div>
  );
};

export default Dashboard;
