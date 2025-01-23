const JWT = require("jsonwebtoken");
const User = require("../models/userModel");

const authentication = async (req, res, next) => {
  const header = req.headers?.authorization;

  const token = header.split(" ")[1];

  if (!token) {
    return res.status(400).json({ msg: "access denied!" });
  }

  try {
    const decoded = JWT.verify(token, process.env.SECRET_KEY);

    const user = await User.findOne({ _id: decoded._id }).select("-pin");

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ msg: "invalid token!" });
  }
};

module.exports = authentication;
