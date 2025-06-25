const express = require('express');
const router = express.Router();
const blogController = require('./blog.controller');
const verifyToken = require('../../middleware/auth.middleware');
const Blog = require('./blog.model');

// 🔍 Public Routes FIRST
router.get('/all', async (req, res) => {
  try {
    const blogs = await Blog.find({}, '_id title content');
    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch blogs', err });
  }
});

router.get('/trending', blogController.getTrendingBlogs);
router.get('/category/:category', blogController.getBlogsByCategory);
router.get('/recommend-content/:title', blogController.getContentRecommendations);

// General list — must be before dynamic `/:id`
router.get('/', blogController.getAllBlogs);

// 🔒 User-specific & protected routes
router.get('/user/:userId', verifyToken, blogController.getBlogsByUser);
router.get('/user/recommendations', verifyToken, blogController.getUserRecommendations);

// POST, PATCH, DELETE
router.post('/', verifyToken, blogController.createBlog);
router.patch('/:id', verifyToken, blogController.updateBlog);
router.delete('/:id', verifyToken, blogController.deleteBlog);
router.patch('/:id/like', verifyToken, blogController.toggleLike);
router.patch('/:id/comment', verifyToken, blogController.addComment);
router.delete('/:blogId/comment/:commentId', verifyToken, blogController.deleteComment);

// 👇 LAST — dynamic route to avoid catching everything before
router.get('/:id', blogController.getBlogById);

module.exports = router;
