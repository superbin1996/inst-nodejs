const express = require('express')
const { getFollow } = require('../controllers/follow')
const router = express.Router()


router.get('/:profileName', getFollow)

module.exports = router