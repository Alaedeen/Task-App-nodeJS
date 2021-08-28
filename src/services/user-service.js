import { User } from '../models/user.js'
import { sendWelcomeEmail, sendAcountDeleteEmail } from '../emails/account.js'

import sharp from 'sharp'

const createUser = async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (error) {
    res.status(400).send(error)
  }
}

const uploadUserAvatar = async (req, res) => {
  const buffer = await sharp(req.file.buffer)
    .resize({ width: 350, height: 350 })
    .png()
    .toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  res.send()
}

const deleteUserAvatar = async (req, res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.send()
}

const login = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (error) {
    res.status(400).send(error)
  }
}

const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    )

    await req.user.save()
    res.send()
  } catch (error) {
    res.status(500).send(error)
  }
}

const logoutAll = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token === req.token
    )

    await req.user.save()
    res.send()
  } catch (error) {
    res.status(500).send(error)
  }
}

const getCurrentUser = async (req, res) => {
  res.send(req.user)
}

const getUserById = async (req, res) => {
  const _id = req.params.id

  try {
    const user = await User.findById(_id)
    if (!user) {
      return res.status(404).send()
    }
    res.send(user)
  } catch (error) {
    res.status(500).send(error)
  }
}

const updateUser = async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  )

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]))
    await req.user.save()

    res.send(req.user)
  } catch (error) {
    res.status(400).send(error)
  }
}

const deleteUser = async (req, res) => {
  const _id = req.user._id

  try {
    await req.user.remove()
    sendAcountDeleteEmail(req.user.email, req.user.name)
    res.send(req.user)
  } catch (error) {
    res.status(500).send(error)
  }
}

const getAvatarByUserId = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user || !user.avatar) {
      throw new Error()
    }
    res.set('content-type', 'image/png')
    res.send(user.avatar)
  } catch (error) {}
}

export {
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
}
