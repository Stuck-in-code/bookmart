import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const protectRoute = async (req, res, next) => {
  try {
    // get token
    const token = req.header("Authorization").replace("Bearer", "");
    if (!token)
      return res.status(401).json({ message: "unauthorized, access denied" });

    // veryfy token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user
    const user = await User.findById(decoded.userId.select("-password"));
    if (!user) return res.status(401).json({ message: "invalid token" });

    req.user = user;
    next();
  } catch (error) {
    console.log("authentication error", error.message);
    res.status(401).json({ message: "invalid token" });
  }
};

export default protectRoute;
