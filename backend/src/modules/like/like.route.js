const express = require("express");
const router = express.Router();
const likeController = require("./like.controller");
const verifyToken = require("../../middleware/auth.middleware");

// Route: PATCH /api/like/:id
router.patch("/:id", verifyToken, likeController.toggleLike);

module.exports = router;
