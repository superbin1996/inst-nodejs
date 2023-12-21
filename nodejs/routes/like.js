const express = require('express')
const { like, getAllLikes } = require('../controllers/like')
const router = express.Router()

// baseURL = 'like/'
router.route('/').patch(like).get(getAllLikes)

module.exports = router