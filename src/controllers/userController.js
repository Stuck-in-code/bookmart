import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate token function
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

export const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // Making checks for the request inputs

    if (!userName || !email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be at least 6 characters" });
    }

    // Checking if user already axist

    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(400).json({ message: "usename already existed" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "email already existed" });
    }

    // CREATING A NEW USER
    // getting a random avator
    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`;

    const user = new User({
      userName,
      email,
      password,
      profileImage,
    });

    await user.save();

    // generate and token and send it to the user

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.userName,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log("error in the register route", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    //check if password is correct
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.userName,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log("error in login controller", error);
    res.status(500).json({ message: "internal server error" });
  }
};
