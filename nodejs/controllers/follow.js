const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-api");
const Follow = require("../models/Follow");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
  const { profileName } = req.params;
  const profile = await User.findOne({ username: profileName });
  if (!profile) {
    throw new CustomAPIError("NOT_FOUND", StatusCodes.NOT_FOUND);
  }
  const profileId = profile._id;

  // check follow or not
  let isFollow = await followCondition(userId, profileId);
  res.status(StatusCodes.OK).json({ isFollow });
};

// isAuthorized
const toggleFollow = async (req, res) => {
  const { profileName } = req.params;
  const {userId, username} = req.user;
  
  // Check if follow your own user
  if (username == profileName) {
    // console.log('follow your own');
    throw new CustomAPIError("CANNOT FOLLOW YOUR OWN", StatusCodes.BAD_REQUEST);
  }

  // get profileId from profileName
  const profile = await User.findOne({ username: profileName });
  if (!profile) {
    throw new CustomAPIError("NOT_FOUND", StatusCodes.NOT_FOUND);
  }
  const profileId = profile._id;

  let isFollow = await followCondition(userId, profileId);
  if (!isFollow) {
    await Follow.updateOne(
      { user: userId }, // the filter
      { $push: { following: profileId } }, // the update
      { new: true, runValidators: true, upsert: true }
    );
  } else {
    await Follow.updateOne(
      { user: userId }, // the filter
      { $pull: { following: profileId } }, // the update, 1 for last element, -1 for first element
      { new: true, runValidators: true, upsert: true } // the options
    );
  }

  res.status(StatusCodes.CREATED).json({ isFollow: !isFollow });
};

// For test only
const getAllFollows = async (req, res) => {
  const follows = await Follow.find({}).sort("-updatedAt");

  res.status(StatusCodes.OK).json({ follows });
};

module.exports = { followCondition, getFollow, toggleFollow, getAllFollows };
