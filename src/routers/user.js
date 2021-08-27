const express = require('express')
const auth = require('../middleware/auth');
const {createUser,uploadUserAvatar, deleteUserAvatar, login,
     logout, logoutAll, getCurrentUser, getUserById,
     updateUser, deleteUser, getAvatarByUserId} = require('../services/user-service')
const {avatarUploader, fileUploadErrorHanler} = require('../utils/user-utils')

const router = express.Router();


router.post('/users', createUser)

router.post('/users/me/avatar', auth, avatarUploader.single('avatar'), uploadUserAvatar, fileUploadErrorHanler)

router.delete('/users/me/avatar', auth, deleteUserAvatar)

router.post('/users/login', login)

router.post('/users/logout', auth, logout)

router.post('/users/logout/all', auth, logoutAll)

router.get('/users/me', auth, getCurrentUser)

router.get('/users/:id', getUserById)

router.patch('/users/me', auth, updateUser)

router.delete('/users/me', auth, deleteUser)


router.get('/users/:id/avatar', getAvatarByUserId)

module.exports = router