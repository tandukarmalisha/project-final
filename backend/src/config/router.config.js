const express = require("express");
const authRoutes = require("../modules/auth/auth.routes");
const userRoutes = require("../modules/user/user.routes"); // ✅ Add this

const router = express.Router();

router.use("/api/auth", authRoutes);
router.use("/api/user", userRoutes); // ✅ Add this

module.exports = router;
