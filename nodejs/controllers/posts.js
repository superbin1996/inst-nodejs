const { StatusCodes } = require("http-status-codes");
const Post = require("../models/Post");
const CustomAPIError = require("../errors/custom-api");

const getAllPosts = async (req, res) => {
  let queryObject = {}
  
  const sort = req.query.sort || '-updatedAt'
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  let result = await Post.find(queryObject).sort(sort).skip(skip).limit(limit)
  
  const totalPosts = await Post.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalPosts / limit);

  res.status(StatusCodes.OK).json({ posts:result, totalPosts, numOfPages });
};

const getPost = async (req, res) => {
  const {
    user: { userId },
    params: { id: postId },
  } = req;

  const post = await Post.findOne({
    _id: postId,
    user: userId,
  });
  if (!post) {
    throw new CustomAPIError(
      `No post with id ${postId}`,
      StatusCodes.NOT_FOUND
    );
  }
  res.status(StatusCodes.OK).json({ post });
};

const createPost = async (req, res) => {
  req.body.user = req.user.userId;
  const post = await Post.create(req.body);
  res.status(StatusCodes.CREATED).json({ post });
};

const updatePost = async (req, res) => {
  const {
    body: { status },
    user: { userId },
    params: { id: postId },
  } = req;

  const post = await Post.findByIdAndUpdate(
    { _id: postId, user: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!post) {
    throw new CustomAPIError(
      `No post with id ${postId}`,
      StatusCodes.NOT_FOUND
    );
  }
  res.status(StatusCodes.OK).json({ post });
};

const deletePost = async (req, res) => {
  const {
    user: { userId },
    params: { id: postId },
  } = req;

  const post = await Post.findOneAndDelete({
    _id: postId,
    user: userId,
  });
  if (!post) {
    throw new CustomAPIError(
      `No post with id ${postId}`,
      StatusCodes.NOT_FOUND
    );
  }
  res.status(StatusCodes.OK).send(`postId: ${postId} has been deleted`);
};

module.exports = { getAllPosts, getPost, createPost, updatePost, deletePost };
