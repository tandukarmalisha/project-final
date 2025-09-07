const express = require('express');
const { addComment } = require('./comment.controller');
const { authenticate } = require('../../middleware/auth.middleware'); // Assuming you have an authentication middleware

const router = express.Router();

// Route to add a comment
router.post('/add', authenticate, addComment);

module.exports = router;