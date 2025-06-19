const mongoose = require('mongoose');
const Blog = require('./blog.model');

// Create Blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content, categories, image } = req.body;
    const author = new mongoose.Types.ObjectId(req.user.id);

    const newBlog = await Blog.create({
      title,
      content,
      image,
      categories,
      author,
    });

    res.status(201).json({ message: "Blog created", blog: newBlog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Blogs
// exports.getAllBlogs = async (req, res) => {
//   try {
//     const blogs = await Blog.find()
//       .populate('author', 'username email')
//       .sort({ createdAt: -1 });

//     res.json(blogs);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get Single Blog by ID
// exports.getBlogById = async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id).populate('author', 'username');
//     if (!blog) return res.status(404).json({ message: "Blog not found" });
//     res.json(blog);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name") // populate only the 'name' field
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name"); // make sure author is populated here too

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// // Update Blog
// exports.updateBlog = async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) return res.status(404).json({ message: "Blog not found" });

//     if (blog.author.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json({ message: "Blog updated", blog: updated });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Delete Blog
// exports.deleteBlog = async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) return res.status(404).json({ message: "Blog not found" });

//     if (blog.author.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     await blog.deleteOne();
//     res.json({ message: "Blog deleted" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


exports.updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;  // assuming verifyToken middleware sets req.user
    const updateData = req.body;

    // Find blog by ID
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if current user is author
    if (blog.author.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to update this blog" });
    }

    // Update allowed fields only (title, content, categories, image)
    if (updateData.title !== undefined) blog.title = updateData.title;
    if (updateData.content !== undefined) blog.content = updateData.content;
    if (updateData.categories !== undefined) blog.categories = updateData.categories;
    if (updateData.image !== undefined) blog.image = updateData.image;

    await blog.save();

    res.json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete blog by ID - only author can delete
exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;

    // Find blog by ID
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if current user is author
    if (blog.author.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this blog" });
    }

    await blog.remove();

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Like / Unlike Blog
// exports.toggleLike = async (req, res) => {
//   try {
//     const blogId = req.params.id;
//     const userId = req.user.id;

//     if (!mongoose.Types.ObjectId.isValid(blogId)) {
//       return res.status(400).json({ success: false, message: "Invalid blog ID" });
//     }

//     const blog = await Blog.findById(blogId);
//     if (!blog) {
//       return res.status(404).json({ success: false, message: "Blog not found" });
//     }

//     const hasLiked = blog.likes.includes(userId);
//     if (hasLiked) {
//       blog.likes = blog.likes.filter(id => id.toString() !== userId);
//     } else {
//       blog.likes.push(userId);
//     }

//     await blog.save();

//     res.status(200).json({
//       success: true,
//       message: hasLiked ? "Unliked" : "Liked",
//       likes: blog.likes, // return updated likes array
//     });
//   } catch (err) {
//     console.error("Toggle like error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };
exports.toggleLike = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;

    // Check for valid Mongo ID
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ success: false, message: "Invalid blog ID" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Ensure all stored likes are stringified for comparison
    const userIdStr = userId.toString();
    const likesAsStrings = blog.likes.map(id => id.toString());

    if (likesAsStrings.includes(userIdStr)) {
      // Unlike
      blog.likes = blog.likes.filter(id => id.toString() !== userIdStr);
    } else {
      // Like
      blog.likes.push(userIdStr);
    }

    await blog.save();

    return res.status(200).json({
      success: true,
      message: likesAsStrings.includes(userIdStr) ? "Unliked" : "Liked",
      likes: blog.likes, // still ObjectIds or strings, your frontend should handle accordingly
    });
  } catch (err) {
    console.error("Toggle like error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// Add Comment
exports.addComment = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: "Comment text cannot be empty" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const newComment = {
      text: comment.trim(),
      user: {
        _id: req.user.id,
        name: req.user.name,
      },
      date: new Date(),
    };

    blog.comments.push(newComment);
    await blog.save();

    res.status(201).json({ comment: newComment }); // send structured comment for frontend
  } catch (error) {
    console.error("Comment error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const commentId = req.params.commentId;
    const userId = req.user.id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = blog.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user is the comment owner
    if (comment.user._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    comment.remove();
    await blog.save();

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete comment error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.getBlogsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });
    res.json({ blogs }); // ✅ wrap blogs in an object
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog); // blog should include image URL property if saved
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    console.log("🔥 Deleting blog...");

    const blogId = req.params.id;
    const userId = req.user.id;
    console.log("➡️ Blog ID:", blogId);
    console.log("➡️ Request by user ID:", userId);

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      console.log("❌ Invalid blog ID");
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      console.log("❌ Blog not found");
      return res.status(404).json({ message: "Blog not found" });
    }

    console.log("➡️ Blog Author:", blog.author.toString());

    if (blog.author.toString() !== userId) {
      console.log("❌ Unauthorized delete attempt");
      return res.status(403).json({ message: "You are not authorized to delete this blog" });
    }

    await Blog.findByIdAndDelete(blogId);
    console.log("✅ Blog deleted");
    return res.status(200).json({ message: "Blog deleted successfully" });

  } catch (err) {
    console.error("❗ Delete blog error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};





