import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { User } from '../../src/models/user.js'
import { Task } from '../../src/models/task.js'

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  name: 'Jon Snow',
  email: 'jon@snow.com',
  password: 'theKingInTheNorth2021!',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
  _id: userTwoId,
  name: 'Joey',
  email: 'joey@tribiani.com',
  password: 'HowYouDoin!20',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
}

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'First task',
  completed: false,
  owner: userOne._id,
}
const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Second task',
  completed: true,
  owner: userOne._id,
}
const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Third task',
  completed: true,
  owner: userTwo._id,
}

const setupDatabase = async () => {
  await User.deleteMany()
  await Task.deleteMany()
  await new User(userOne).save()
  await new User(userTwo).save()
  await new Task(taskOne).save()
  await new Task(taskTwo).save()
  await new Task(taskThree).save()
}

const disconnectFromDatabase = async () => {
  await mongoose.connection.close()
}

export {
  userOneId,
  userOne,
  setupDatabase,
  disconnectFromDatabase,
  taskOne,
  userTwo,
}
