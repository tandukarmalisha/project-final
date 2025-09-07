const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Comment schema
const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog', // Reference to the Blog model
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Comment model
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;