const express = require('express')
const { toggleFollow, getAllFollows } = require('../controllers/follow')
const router = express.Router()

router.route('/:profileName').patch(toggleFollow)
router.route('/').get(getAllFollows)

module.exports = router