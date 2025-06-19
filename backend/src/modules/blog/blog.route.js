const express = require('express');
const router = express.Router();

const blogController = require('./blog.controller');
const verifyToken = require('../../middleware/auth.middleware');

// ⚠ Place more specific routes BEFORE dynamic `/:id` route
router.get('/user/:userId', verifyToken, blogController.getBlogsByUser); // ✅ move to top

router.post('/', verifyToken, blogController.createBlog);
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.patch('/:id', verifyToken, blogController.updateBlog);
router.delete('/:id', verifyToken, blogController.deleteBlog);
router.patch('/:id/like', verifyToken, blogController.toggleLike);
router.patch('/:id/comment', verifyToken, blogController.addComment);

module.exports = router;
