const express = require("express");
const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getFollowingPosts,
} = require("../controllers/posts");
const { uploadPostImage } = require("../controllers/uploadsController");

const router = express.Router();

router.route("/uploads").post(uploadPostImage)
router.route("/").post(createPost).get(getAllPosts)
router.route('/followingPosts').get(getFollowingPosts);
router.route("/:id").get(getPost).delete(deletePost).patch(updatePost);

module.exports = router;
