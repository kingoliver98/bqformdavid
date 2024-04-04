import User from "../models/user.js";
import bcrypt from "bcrypt";
import generateToken from "../config/generateToken.js";

const signupUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  console.log(req.body);

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please provide a username, email and password",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await User.create({ ...req.body, password: hashedPassword });
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User created successfully!",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.profilePhoto,
      },
    });
  } catch (error) {
    next(error);
  }
};

const signinUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username.toLowerCase() });

  if (!user) {
    return res.status(400).json({ message: "No user with this username" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Password Incorrect" });
  }

  const token = generateToken(user._id);

  res.status(200).json({
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.profilePhoto,
    },
  });
};

const getUser = async (req, res) => {
  const { userId } = req.user;

  const user = await User.findOne({ _id: userId });

  res.status(200).json({
    message: "Authenticated",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.profilePhoto,
    },
  });
};

export default { signupUser, signinUser, getUser };
