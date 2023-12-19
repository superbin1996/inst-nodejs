const express = require('express')
const { follow } = require('../controllers/follow')
const router = express.Router()


router.post('/:userId', follow)

module.exports = router