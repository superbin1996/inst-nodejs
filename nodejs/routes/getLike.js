const express = require('express')
const { getLike } = require('../controllers/likes')
const router = express.Router()


router.route('/:postId').get(getLike)

module.exports = router