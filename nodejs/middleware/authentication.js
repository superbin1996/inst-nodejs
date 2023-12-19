const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-api");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  // Check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new CustomAPIError(
      "Authentication Invalid",
      StatusCodes.UNAUTHORIZED
    );
  }
  
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, username: payload.username };
    next();
  } catch (error) {
    throw new CustomAPIError(
        "Authentication Invalid",
        StatusCodes.UNAUTHORIZED
      );
    }
};

module.exports = auth