const cloudinary = require("../../config/cloudinary.config");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image provided" });

    const result = await cloudinary.uploader.upload_stream(
      { folder: "blog_images" },
      (error, result) => {
        if (error) return res.status(500).json({ message: error.message });

        res.json({ imageUrl: result.secure_url });
      }
    );

    // Pipe the buffer to the upload_stream
    const stream = cloudinary.uploader.upload_stream(
      { folder: "blog_images" },
      (error, result) => {
        if (error) return res.status(500).json({ message: error.message });
        res.json({ imageUrl: result.secure_url });
      }
    );
    stream.end(req.file.buffer);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
