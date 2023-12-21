const express = require("express");
const {
  getPostComments,
  getUserCommentsOnPost,
  comment,
  updateComment,
  deleteComment,
} = require("../controllers/comments");
const router = express.Router();

// baseURL: '/comments'
router
  .route("/:postId")
  .get(getPostComments)
  .patch(updateComment)
  .delete(deleteComment);
router.route('/userComments/:postId').get(getUserCommentsOnPost)
router.route('/').post(comment)
module.exports = router;
