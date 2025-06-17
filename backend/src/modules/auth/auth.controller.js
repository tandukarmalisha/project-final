const userService = require("../user/user.service");
const jwtService = require("../../services/jwt.service");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// REGISTER
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, gender, bio } = req.body;

    const user = await userService.registerUser({ name, email, password, gender, bio });

    const activationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const activationLink = `${process.env.FRONTEND_URL}/activate/${activationToken}`;

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Fix for Gmail's self-signed cert error
      },
    });

    // Send activation email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: "Activate Your Account",
      html: `
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>Thank you for registering. Please activate your account by clicking the link below:</p>
        <p><a href="${activationLink}">${activationLink}</a></p>
        <p>This link will expire in 24 hours.</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email to activate your account.",
    });

  } catch (err) {
    next(err);
  }
};

// LOGIN
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userService.loginUser({ email, password });

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Please activate your account first via email.",
      });
    }

    const token = jwtService.signToken({ id: user._id });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};



exports.activateAccount = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "Token is missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await userService.activateUser(decoded.id); // You must define this in userService

    res.status(200).json({
      success: true,
      message: "Account activated successfully",
    });
  } catch (err) {
    next(err);
  }
};


