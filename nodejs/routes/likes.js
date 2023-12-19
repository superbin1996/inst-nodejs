const express = require('express')
const { like, getAllLikes } = require('../controllers/likes')
const router = express.Router()

router.route('/').post(like).get(getAllLikes)

module.exports = router