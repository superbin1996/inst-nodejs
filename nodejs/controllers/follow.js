const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-api");
const Follow = require("../models/Follow");
const jwt = require("jsonwebtoken");

// Pure func
const followCondition = async (userId, profileId) => {
  let isFollow;

  if (userId) {
    if (userId != profileId) {
      const data = await Follow.findOne({
        user: userId,
        following: profileId,
      });
      if (!data) {
        isFollow = false;
      } else {
        isFollow = true;
      }
    }
  } else {
    isFollow = false;
  }

  return isFollow;
};

// AllowAny
const getFollow = async (req, res) => {
  if (!req.user) {
    return res.status(StatusCodes.OK).json({ isFollow: false });
  }
  const { userId } = req.user;
  const { userId: profileId } = req.params;
  let isFollow = await followCondition(userId, profileId);
  res.status(StatusCodes.OK).json({ isFollow });
};

// isAuthorized
const follow = async (req, res) => {
  const userId = req.user.userId;

  const { userId: profileId } = req.params;
  let isFollow = await followCondition(userId, profileId);
  if (!isFollow) {
    await Follow.create({ user: userId, following: profileId });
  } else {
    await Follow.findOneAndDelete({ user: userId, following: profileId });
  }

  res.status(StatusCodes.CREATED).json({ isFollow: !isFollow });
};

module.exports = { getFollow, follow };
