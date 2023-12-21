const { StatusCodes } = require("http-status-codes");
const Comment = require("../models/Comment");

const getPostComments = async (req, res) => {
  // No time for pagination get
  let queryObject = { post: req.params.postId };
  const sort = "-updatedAt";

  const comments = await Comment.find(queryObject).sort(sort).exec();

  res.status(StatusCodes.OK).json({ comments });
};

const getUserCommentsOnPost = async (req, res) => {
  // No time for pagination get
  let queryObject = { post: req.params.postId, user: req.user.userId };
  const sort = "-updatedAt";

  const comments = await Comment.find(queryObject)
    .sort(sort)
    // .populate({ path: "user", select: "username" });

  res.status(StatusCodes.OK).json({ comments });
};

const comment = async (req, res) => {
  req.body.user = req.user.userId;
  const comment = await Comment.create(req.body);
  res.status(StatusCodes.CREATED).json({ comment });
};

const updateComment = async (req, res) => {
  const {
    body: { content },
    user: { userId },
    query: { commentId },
  } = req;

  const comment = await Comment.findByIdAndUpdate(
    { _id: commentId, user: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!comment) {
    throw new CustomAPIError(
      `No comment with id ${commentId}`,
      StatusCodes.NOT_FOUND
    );
  }
  res.status(StatusCodes.OK).json({ comment });
};

const deleteComment = async (req, res) => {
  const {
    user: { userId },
    query: { commentId },
  } = req;

  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    user: userId,
  });
  if (!comment) {
    throw new CustomAPIError(
      `No comment with id ${commentId}`,
      StatusCodes.NOT_FOUND
    );
  }
  res.status(StatusCodes.OK).send(`commentId: ${commentId} has been deleted`);
};

module.exports = {
  getPostComments,
  getUserCommentsOnPost,
  comment,
  updateComment,
  deleteComment,
};
