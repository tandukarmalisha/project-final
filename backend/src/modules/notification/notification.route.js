// const express = require("express");
// const router = express.Router();
// const Notification = require("./notification.model"); // ✅ import model
// const { getNotifications } = require("./notification.controller");

// // Get notifications for a user
// router.get("/:userId", getNotifications);

// // Mark all notifications as read for a user
// router.post("/mark-read/:userId", async (req, res) => {
//   const userId = req.params.userId;
//   try {
//     await Notification.updateMany(
//       { receiver: userId, read: false },
//       { $set: { read: true } }
//     );
//     res.status(200).json({ message: "Notifications marked as read" });
//   } catch (err) {
//     console.error("Error marking notifications as read:", err);
//     res.status(500).json({ message: "Error marking notifications as read", error: err });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Notification = require("./notification.model"); // ✅ import model
const { getNotifications } = require("./notification.controller");

// Get notifications for a user
router.get("/:userId", getNotifications);

// Mark all notifications as read for a user
router.post("/mark-read/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    await Notification.updateMany(
      { receiver: userId, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ message: "Notifications marked as read" });
  } catch (err) {
    console.error("Error marking notifications as read:", err);
    res.status(500).json({ message: "Error marking notifications as read", error: err });
  }
});

// Create a notification for a comment
router.post("/comment", async (req, res) => {
  const { receiver, sender, commentId, blogId } = req.body;
  try {
    const newNotification = new Notification({
      receiver,
      sender,
      type: "comment",
      commentId,
      blogId,
      read: false,
      createdAt: new Date(),
    });
    await newNotification.save();
    res.status(201).json({ message: "Comment notification created", notification: newNotification });
  } catch (err) {
    console.error("Error creating comment notification:", err);
    res.status(500).json({ message: "Error creating comment notification", error: err });
  }
});

module.exports = router;