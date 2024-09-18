import jwt from "jsonwebtoken";
import User from "../models/User.mjs";

const getUserByToken = async (token) => {
  const decoded = jwt.verify(token, "nossosecret");

  const user = await User.findById(decoded.id);

  return user;
};

export default getUserByToken;
