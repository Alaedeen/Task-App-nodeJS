import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { User } from '../../src/models/user.js'

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

const setupDatabase = async () => {
    await User.deleteMany()
    await new User(userOne).save()
  }

const disconnectFromDatabase = async () => {
    await mongoose.connection.close()
  }


  export {
      userOneId,
      userOne,
      setupDatabase,
      disconnectFromDatabase
  }