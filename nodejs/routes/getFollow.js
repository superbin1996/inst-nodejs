const express = require('express')
const { getFollow } = require('../controllers/follow')
const router = express.Router()

// baseUrl = '/getFollow'
router.get('/:profileName', getFollow)

module.exports = router