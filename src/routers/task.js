import express from 'express'
import { auth } from '..//middleware/auth.js'
import {
  addTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../services/task-service.js'

const taskRouter = express.Router()

taskRouter.post('/tasks', auth, addTask)

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
//GET /tasks?sortBy=createdAt:desc
taskRouter.get('/tasks', auth, getTasks)

taskRouter.get('/tasks/:id', auth, getTaskById)

taskRouter.patch('/tasks/:id', auth, updateTask)

taskRouter.delete('/tasks/:id', auth, deleteTask)

export { taskRouter }
