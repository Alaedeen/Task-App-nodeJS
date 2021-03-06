import { Task } from '../models/task.js'
import { User } from '../models/user.js'

const addTask = async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  })

  try {
    await task.save()
    res.status(201).send(task)
  } catch (error) {
    res.status(400).send(error)
  }
}

const getTasks = async (req, res) => {
  const match = {}
  const sort = {}

  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    const user = await User.findById(req.user._id)
    await user
      .populate({
        path: 'tasks',
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate()
    res.send(user.tasks)
  } catch (error) {
    res.status(500).send(error)
  }
}

const getTaskById = async (req, res) => {
  const _id = req.params.id

  try {
    const task = await Task.findOne({ _id, owner: req.user._id })
    if (!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (error) {
    res.status(500).send(error)
  }
}

const updateTask = async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  )

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    })
    if (!task) {
      return res.status(404).send()
    }

    updates.forEach((update) => (task[update] = req.body[update]))
    await task.save()
    res.send(task)
  } catch (error) {
    res.status(400).send(error)
  }
}

const deleteTask = async (req, res) => {
  const _id = req.params.id

  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id })
    if (!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (error) {
    res.status(500).send(error)
  }
}

export { addTask, getTasks, getTaskById, updateTask, deleteTask }
