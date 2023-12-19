const { StatusCodes } = require("http-status-codes");
const Like = require("../models/Like");

// AllowAny
const getLike = async (req, res) => {
  const { postId } = req.params;

  const likeSum = await Like.countDocuments({ post: postId, isLike:true });
  
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
  const { postId } = req.body.post;
  const { userId } = req.user;
  const queryObject = { post: postId, user: userId };
  const result = await Like.findOne(queryObject);
  req.body.user = userId;

  if (!result) {
    await Like.create(req.body);
    let {isLike} = req.body
    return res.status(StatusCodes.OK).json({isLike});
  }

  const newResult = await Like.findOneAndUpdate(queryObject, req.body, {new:true, runValidators:true});
  const likeSum = await Like.countDocuments({ post: postId, isLike:true });
  const isLike = newResult.isLike
  res.status(StatusCodes.OK).json({isLike, likeSum});
};

// For test
const getAllLikes = async(req,res)=>{
  const likes = await Like.find({})
  
  res.status(StatusCodes.OK).json({likes})
}

module.exports = { getLike, like, getAllLikes };
