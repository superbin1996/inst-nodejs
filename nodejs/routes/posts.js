const express = require('express')
const {getAllPosts, getPost, createPost, updatePost, deletePost} = require('../controllers/posts')
const router = express.Router()

router.route('/:id').get(getPost).delete(deletePost).patch(updatePost)
router.route('/').post(createPost).get(getAllPosts)

module.exports = router