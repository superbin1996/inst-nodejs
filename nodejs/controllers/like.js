const { StatusCodes } = require("http-status-codes");
const Like = require("../models/Like");
const CustomAPIError = require("../errors/custom-api");

// AllowAny
const getLike = async (req, res) => {
  const { postId } = req.params;

  const likeSum = await Like.countDocuments({ post: postId, isLike: true });

  if (!req.user) {
    return res.status(StatusCodes.OK).json({ isLike: false, likeSum });
  }
  let queryObject = { post: postId, user: req.user.userId };
  // const likes = await Like.find(queryObject)
  const result = await Like.findOne(queryObject);
  if (!result) {
    var isLike = false;
  } else {
    var isLike = result.isLike;
  }

  return res.status(StatusCodes.OK).json({ isLike, likeSum });
};

const like = async (req, res) => {
  const { post: postId } = req.body;
  const { userId } = req.user;

  // Add userId to body
  req.body.user = req.user.userId;

  const queryObject = { post: postId, user: userId };
  const result = await Like.findOne(queryObject);
  // if (!result) {
  //   await Like.create(req.body);
  //   let isLike = req.body.isLike || false
  //   const likeSum = await Like.countDocuments({ post: postId, isLike:true });
  //   return res.status(StatusCodes.OK).json({isLike, likeSum});
  // }

  const newResult = await Like.findOneAndUpdate(queryObject, req.body, {
    new: true,
    runValidators: true,
    upsert: true,
  });
  const likeSum = await Like.countDocuments({ post: postId, isLike: true });
  const isLike = newResult.isLike;
  res.status(StatusCodes.OK).json({ isLike, likeSum });
};

// For test
const getAllLikes = async (req, res) => {
  const likes = await Like.find({}).sort("-updatedAt");

  res.status(StatusCodes.OK).json({ likes });
};

module.exports = { getLike, like, getAllLikes };
