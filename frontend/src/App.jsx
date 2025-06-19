import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ActivateAccount from "./pages/ActivateAccount";
import Home from "./pages/Home"; // This is your landing blog page
import Dashboard from "./pages/Dashboard";
import AddBlog from "./pages/AddBlog";
import ProfilePage from "./pages/ProfilePage";
import BlogDetail from "./pages/BlogDetail";
import UpdateBlogPage from "./pages/UpdateBlogPage";
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
      <Navbar />
      
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} /> {/* Landing page */}
        <Route path= "/dashboard" element= {<Dashboard/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/activate/:token" element={<ActivateAccount />} />
        <Route path = "/dashboard" element={<Dashboard />} />
        <Route path = "/add-blog" element={<AddBlog />} />
        <Route path = "/profile" element = {<ProfilePage/>}/>
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/update-blog/:id" element={<UpdateBlogPage />} />
        <Route path="*" element={<div>Page Not Found</div>} />

      </Routes>
    </Router>
  );
}

export default App;
