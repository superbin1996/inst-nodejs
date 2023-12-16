const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-api");
const User = require("../models/User");

const register = async (req, res) => {
  const user = await User.create(req.body);
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { username: user.username }, token });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new CustomAPIError("Please provide username and password", StatusCodes.BAD_REQUEST);
  }
  const user = await User.findOne({ username });
  if (!user) {
    throw new CustomAPIError("Wrong Username", StatusCodes.UNAUTHORIZED);
  }
  // Compare submitted password and user password in database
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomAPIError("Wrong Password", StatusCodes.UNAUTHORIZED);
  }
  const token = user.createJWT();


  res.status(StatusCodes.ACCEPTED).json({ "user": { "username": user.username }, token});
};

module.exports = { register, login };
