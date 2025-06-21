const mongoose = require("mongoose");
const Blog = require("../blog/blog.model");

// Toggle Like / Unlike
exports.toggleLike = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ success: false, message: "Invalid blog ID" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const userIdStr = userId.toString();
    const alreadyLiked = blog.likes.some((id) => id.toString() === userIdStr);

    if (alreadyLiked) {
      blog.likes = blog.likes.filter((id) => id.toString() !== userIdStr);
    } else {
      blog.likes.push(userIdStr);
    }

    await blog.save();

    return res.status(200).json({
      success: true,
      message: alreadyLiked ? "Unliked" : "Liked",
      likes: blog.likes,
    });
  } catch (err) {
    console.error("Toggle like error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
