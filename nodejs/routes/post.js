const express = require('express')
const { getPost } = require('../controllers/posts')
const router = express.Router()

// baseUrl = '/post'
router.route('/:postId').get(getPost)

module.exports = router