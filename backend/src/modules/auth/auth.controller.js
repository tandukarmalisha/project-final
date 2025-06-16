const userService = require("../user/user.service");
const jwtService = require("../../services/jwt.service");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, gender } = req.body;

    const user = await userService.registerUser({
      name,
      email,
      password,
      gender,
      
    });

    const token = jwtService.signToken({ id: user._id });

    res.status(201).json({
      success: true,
      message: "Registration successful",
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

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userService.loginUser({ email, password });

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
