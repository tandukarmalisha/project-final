const Comment = require('./comment.model'); // Assuming you have a Comment model
const Blog = require('../blog/blog.model'); // Assuming you have a Blog model
const Notification = require('../notification/notification.model'); // Assuming you have a Notification model

// Add a comment to a blog
const addComment = async (req, res) => {
  try {
    const { blogId, content } = req.body;

    // Validate input
    if (!blogId || !content) {
      return res.status(400).json({ message: 'Blog ID and content are required.' });
    }

    // Find the blog
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found.' });
    }

    // Create the comment
    const comment = await Comment.create({
      content,
      blog: blogId,
      author: req.user.id, // Assuming req.user contains the authenticated user
    });

    // Add the comment to the blog's comments array
    blog.comments.push(comment._id);
    await blog.save();

    // Create a notification for the blog author (if not commenting on own blog)
    if (String(blog.author) !== String(req.user.id)) {
      await Notification.create({
        type: 'comment',
        sender: req.user.id,
        receiver: blog.author,
        message: `${req.user.name} commented on your blog.`,
        blogId: blog._id,
      });
    }

    res.status(201).json({ message: 'Comment added successfully.', comment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Export the controller functions
module.exports = {
  addComment,
};