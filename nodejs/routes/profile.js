const express = require('express')
const { getProfile, updateAvatar } = require('../controllers/profile')
const { uploadPostImage } = require('../controllers/uploadsController')
const router = express.Router()

// baseURL = `profile`
router.route('/:profileName').get(getProfile).patch(updateAvatar)
router.route("/uploads").post(uploadPostImage)

module.exports = router