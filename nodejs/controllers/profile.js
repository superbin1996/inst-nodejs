const { StatusCodes } = require("http-status-codes");
const Follow = require("../models/Follow");
const { followCondition } = require("./follow");
const User = require("../models/User");
const CustomAPIError = require("../errors/custom-api");
const Post = require("../models/Post");

const getProfile = async (req, res) => {
  const { profileName } = req.params;

  // Get profileId
  const profileUser = await User.findOne({ username: profileName });
  const profileId = profileUser._id;
  if (!profileId) {
    throw new CustomAPIError("NOT_FOUND", StatusCodes.NOT_FOUND);
  }
  const { userId } = req.user;

  // Get number of people follow this profile
  const followers = await Follow.countDocuments({
    following: { $in: [profileId] },
  });

  // Get number of people this profile is following
  const followings = await Follow.countDocuments({ user: profileId });

  // Check if you are following this profile or not
  const isFollow = await followCondition(userId, profileId);

  // Get this profile information
  const profile = await User.findOne({ username: profileName }).select(
    "username info avatar"
  );

  let postQueryObject = { user: profileId };

  const sort = req.query.sort || "-updatedAt";
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Get Profile Posts
  const profilePosts = await Post.find(postQueryObject)
    .sort(sort)
    .skip(skip)
    .limit(limit).populate({path:'user',select:'username avatar'})
  const totalPosts = await Post.countDocuments(postQueryObject)
  const numOfPages = Math.ceil(totalPosts / limit);

  res.status(StatusCodes.OK).json({
    // keys follow in frontend
    profilePosts,
    followers,
    following:followings,
    isFollow,
    profileUser:profile,
    profilePosts,
    totalProfilePosts:totalPosts,
    numOfProfilePages:numOfPages,
  });
};

module.exports = { getProfile };
