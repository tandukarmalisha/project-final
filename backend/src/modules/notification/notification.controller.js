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