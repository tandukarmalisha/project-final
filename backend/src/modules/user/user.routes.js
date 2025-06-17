// const User = require("./user.model");
// const verifyToken = require("../../middleware/auth.middleware");

// const router = express.Router();

// // ✅ GET /api/user/me → Protected route
// router.get("/me", verifyToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     res.json({ success: true, user });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });




const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../user/user.model");

router.get("/activate/:token", async (req, res, next) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.isActive) {
      return res.status(200).json({ success: true, message: "Account already activated" });
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({ success: true, message: "Account activated successfully" });
  } catch (err) {
    return res.status(400).json({ success: false, message: "Invalid or expired token" });
  }
});

module.exports = router;

