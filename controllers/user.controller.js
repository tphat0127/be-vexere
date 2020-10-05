const express = require('express')
const { authenticate, authorize } = require('../midleware/auth')
const {uploadImage} = require('../midleware/images')
const {getUser, getUserById, createUser, replaceUser, deleteUser, login, updatePassword, getMe, uploadAvatar} = require('../services/user.service')
const {validateCreateUser} = require('../validation/user/create-user.validation')
const {validateUpdateUser} = require('../validation/user/update-user.validation')
const {validateLogin} = require('../validation/user/login.validation')

const router = express.Router()

router.get('/users', getUser)
router.get('/me', authenticate, authorize(["Admin", "Member"]), getMe)
router.get('/users/:userId', getUserById)
router.post('/users', validateCreateUser, createUser)
router.put('/users/:userId', authenticate, authorize(["Admin"]), replaceUser)
router.delete('/users/:userId', deleteUser)
router.post('/users/login', validateLogin, login)
router.patch('/users/update-pwd', updatePassword)
router.post('/users/upload-avatar', authenticate, authorize(["Admin"]), uploadImage("avatar"), uploadAvatar)
module.exports = router