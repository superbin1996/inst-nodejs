const express = require('express')
const { getPostComments, getUserCommentsOnPost, comment, updateComment, deleteComment } = require('../controllers/comments')
const router = express.Router()

router.route('/:postId').get(getPostComments).get(getUserCommentsOnPost).post(comment).patch(updateComment).delete(deleteComment)

module.exports = router