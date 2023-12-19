const express = require('express')
const router = express.Router()

const {register, login, getUsers} = require('../controllers/auth')

router.route('/register').post(register)
router.post('/login', login)
router.get('/users', getUsers)

module.exports = router