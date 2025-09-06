// const { io } = require("../../config/express.config");

// const Notification = require("./notification.model");

// exports.sendFollowNotification = async (senderId, receiverId) => {
//   const notification = await Notification.create({
//     sender: senderId,
//     receiver: receiverId,
//     type: "follow",
//     message: "followed you",
//   });

//   // Emit to the receiver in real-time
//   io.to(receiverId.toString()).emit("newNotification", notification);
// };

//  exports.getNotifications = async (req, res) => {
//   const userId = req.params.userId;

//   try {
//     const notifications = await Notification.find({ receiver: userId })
//       .populate("sender", "name")
//       .sort({ createdAt: -1 }); // newest first

//     res.json({ notifications });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch notifications", error });
//   }
// };
const { io } = require("../../config/express.config");
const Notification = require("./notification.model");

exports.sendFollowNotification = async (senderId, receiverId) => {
  const notification = await Notification.create({
    sender: senderId,
    receiver: receiverId,
    type: "follow",
    message: "followed you",
  });

  // Emit to the receiver in real-time
  io.to(receiverId.toString()).emit("newNotification", notification);
};

exports.sendLikeNotification = async (senderId, receiverId, blogId) => {
  const notification = await Notification.create({
    sender: senderId,
    receiver: receiverId,
    type: "like",
    message: "liked your post",
    blogId, // Include the blogId
  });

  // Emit to the receiver in real-time
  io.to(receiverId.toString()).emit("newNotification", notification);
};

exports.sendCommentNotification = async (senderId, receiverId, blogId) => {
  const notification = await Notification.create({
    sender: senderId,
    receiver: receiverId,
    type: "comment",
    message: "commented on your post",
    blogId, // Include the blogId
  });

  // Emit to the receiver in real-time
  io.to(receiverId.toString()).emit("newNotification", notification);
};

exports.getNotifications = async (req, res) => {
  const userId = req.params.userId;

  try {
    const notifications = await Notification.find({ receiver: userId })
      .populate("sender", "name")
      .sort({ createdAt: -1 }); // newest first

    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications", error });
  }
};
const fetchNotifications = async () => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/notification/${currentUser.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Fetched notifications:", res.data.notifications); // Debug log
    const normalized = (res.data.notifications || []).map((n) => ({
      ...n,
      isNew: false,
    }));
    setNotifications(normalized);
  } catch (err) {
    console.error("Error fetching notifications", err);
  }
};