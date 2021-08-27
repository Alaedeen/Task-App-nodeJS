import express from 'express'
import { auth } from '../middleware/auth.js'
import {
  createUser,
  uploadUserAvatar,
  deleteUserAvatar,
  login,
  logout,
  logoutAll,
  getCurrentUser,
  getUserById,
  updateUser,
  deleteUser,
  getAvatarByUserId,
} from '../services/user-service.js'
import { avatarUploader, fileUploadErrorHanler } from '../utils/user-utils.js'

const userRouter = express.Router()

userRouter.post('/users', createUser)

userRouter.post(
  '/users/me/avatar',
  auth,
  avatarUploader.single('avatar'),
  uploadUserAvatar,
  fileUploadErrorHanler
)

userRouter.delete('/users/me/avatar', auth, deleteUserAvatar)

userRouter.post('/users/login', login)

userRouter.post('/users/logout', auth, logout)

userRouter.post('/users/logout/all', auth, logoutAll)

userRouter.get('/users/me', auth, getCurrentUser)

userRouter.get('/users/:id', getUserById)

userRouter.patch('/users/me', auth, updateUser)

userRouter.delete('/users/me', auth, deleteUser)

userRouter.get('/users/:id/avatar', getAvatarByUserId)

export { userRouter }
