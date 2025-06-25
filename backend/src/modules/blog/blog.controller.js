


const mongoose = require('mongoose');
const Blog = require('./blog.model');

// Create Blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content, categories, image } = req.body;
    const author = new mongoose.Types.ObjectId(req.user.id);

    const normalizedCategories = Array.isArray(categories)
      ? categories.map(cat => cat.toLowerCase())
      : [];

    const newBlog = await Blog.create({
      title,
      content,
      image,
      categories: normalizedCategories,
      author,
    });

    res.status(201).json({ message: "Blog created", blog: newBlog });
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get All Blogs (latest first, public)
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Blog (only author)
exports.updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;
    const updateData = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this blog" });
    }

    // Update only allowed fields
    ['title', 'content', 'categories', 'image'].forEach(field => {
      if (updateData[field] !== undefined) blog[field] = updateData[field];
    });

    await blog.save();
    res.json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Blog (only author)
exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this blog" });
    }

    await blog.remove();
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Like / Unlike Blog
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
    const likesAsStrings = blog.likes.map(id => id.toString());

    if (likesAsStrings.includes(userIdStr)) {
      // Unlike
      blog.likes = blog.likes.filter(id => id.toString() !== userIdStr);
      await blog.save();
      return res.status(200).json({ success: true, message: "Unliked", likes: blog.likes });
    } else {
      // Like
      blog.likes.push(userIdStr);
      await blog.save();
      return res.status(200).json({ success: true, message: "Liked", likes: blog.likes });
    }
  } catch (err) {
    console.error("Toggle like error:", err);
    res.status(500).json({ success: false, message: "Server error" });
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
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const newComment = {
      text: comment.trim(),
      user: { _id: req.user.id, name: req.user.name },
      date: new Date(),
    };

    blog.comments.push(newComment);
    await blog.save();

    res.status(201).json({ comment: newComment });
  } catch (error) {
    console.error("Add comment error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Comment (only comment owner)
exports.deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const userId = req.user.id;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user._id.toString() !== userId) {
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

// Get blogs by user
exports.getBlogsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });
    res.json({ blogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Recommendations - top 7 liked blogs
exports.getUserRecommendations = async (req, res) => {
  try {
    // Get all blogs with likes count
    const blogs = await Blog.aggregate([
      {
        $addFields: {
          likeCount: { $size: { "$ifNull": ["$likes", []] } }
        }
      },
      { $sort: { likeCount: -1, createdAt: -1 } },
      { $limit: 7 }
    ]);

    // Populate author info manually (aggregate returns plain objects)
    const blogIds = blogs.map(b => b._id);
    const blogsWithAuthors = await Blog.find({ _id: { $in: blogIds } })
      .populate("author", "name")
      .lean();

    // Map blogsWithAuthors by _id for quick lookup
    const authorMap = new Map(blogsWithAuthors.map(blog => [blog._id.toString(), blog.author]));

    // Attach author and likeCount to response blogs
    const result = blogs.map(blog => ({
      ...blog,
      author: authorMap.get(blog._id.toString()) || null,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("GetUserRecommendations error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getTrendingBlogs = async (req, res) => {
  try {
    const topBlogs = await Blog.find()
      .lean()
      .populate("author", "name") // include author name
      .sort({ createdAt: -1 }); // fallback sort

    // manually sort by like count
    const sorted = topBlogs
      .map(blog => ({
        ...blog,
        likeCount: blog.likes.length || 0,
      }))
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 7); // top 7 only

    res.status(200).json(sorted);
  } catch (error) {
    console.error("Trending blog error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/blog/category/:category
exports.getBlogsByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const blogs = await Blog.find({
      categories: { $regex: new RegExp(`^${category}$`, "i") }, // case-insensitive match
    })
      .populate("author", "name email") // optional
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    res.status(500).json({ message: "Server error" });
  }
};
