const express = require("express");
const authRoutes = require("../modules/auth/auth.routes");
const userRoutes = require("../modules/user/user.routes"); 
const blogRoutes = require("../modules/blog/blog.route");
const uploadRoutes = require("../modules/upload/upload.route"); // Assuming you have an upload route defined

const router = express.Router();

router.use("/api/auth", authRoutes);
router.use("/api/user", userRoutes); 
router.use("/api/blog", blogRoutes);
router.use("/api/upload", uploadRoutes); // Assuming you have an uploadRoutes defined

module.exports = router;
