const express = require('express')
const { getLike } = require('../controllers/like')
const router = express.Router()

// baseUrl = 'getLike'
router.route('/:postId').get(getLike)

module.exports = router