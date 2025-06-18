const express = require('express');
const router = express.Router();

// ✅ Import controller
const blogController = require('./blog.controller');

// ✅ Import middleware
const verifyToken = require('../../middleware/auth.middleware');

// ✅ Routes
router.post('/', verifyToken, blogController.createBlog);
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.patch('/:id', verifyToken, blogController.updateBlog);
router.delete('/:id', verifyToken, blogController.deleteBlog);
router.patch('/:id/like', verifyToken, blogController.toggleLike);
router.patch('/:id/comment', verifyToken, blogController.addComment);
router.get('/user/:userId', verifyToken, blogController.getBlogsByUser);



module.exports = router;
