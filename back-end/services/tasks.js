import { Tasks } from '../models/index.js'
import mongoose from 'mongoose'
import Joi from 'joi'

const taskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Title must be at least 3 characters long.',
    'string.max': 'Title can be at most 100 characters long.',
    'any.required': 'Title is required.',
    'string.empty': 'Title cannot be empty.'
  }),
  status: Joi.string()
    .valid('To Do', 'In Progress', 'Completed')
    .required()
    .messages({
      'any.required': 'Status is required.',
      'string.empty': 'Status cannot be empty.',
      'any.only': 'Status must be one of To Do, In Progress, Completed.'
    }),
  description: Joi.string().max(500).allow('').optional().messages({
    'string.max': 'Description can be at most 500 characters long.'
  })
})

const validateTask = (data) => taskSchema.validate(data, { abortEarly: false })

export const getAllTasks = async (request, reply) => {
  try {
    const { status } = request.query

    const query = status && status !== 'All' ? { status } : {}

    const tasks = await Tasks.find(query)
      .sort({ createdAt: -1 })
      .select('title status description')

    reply.code(200).send({
      status: 'success',
      message: 'Tasks fetched successfully.',
      tasks
    })
  } catch (error) {
    reply.code(500).send({
      status: 'error',
      message: 'Failed to fetch tasks.',
      error: error.message
    })
  }
}

export const newTask = async (request, reply) => {
  const { error } = validateTask(request.body)
  if (error) {
    const errorMessages = error.details.map((err) => err.message)
    return reply.code(400).send({
      status: 'error',
      message: 'Validation error.',
      errors: errorMessages
    })
  }

  try {
    const task = new Tasks(request.body)
    await task.save()
    reply.code(201).send({
      status: 'success',
      message: 'Task created successfully.',
      task
    })
  } catch (error) {
    reply.code(500).send({
      status: 'error',
      message: 'Failed to create task.',
      error: error.message
    })
  }
}

export const getTaskById = async (request, reply) => {
  const { taskId } = request.params

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return reply.code(400).send({
      status: 'error',
      message: 'Invalid taskId format.'
    })
  }

  try {
    const task = await Tasks.findById(taskId).select('title status description')

    if (!task) {
      return reply.code(404).send({
        status: 'error',
        message: 'Task not found.'
      })
    }

    reply.code(200).send({
      status: 'success',
      message: 'Task fetched successfully.',
      task
    })
  } catch (error) {
    reply.code(500).send({
      status: 'error',
      message: 'Failed to fetch task.',
      error: error.message
    })
  }
}

export const deleteTaskById = async (request, reply) => {
  const { taskId } = request.params

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return reply.code(400).send({
      status: 'error',
      message: 'Invalid taskId format.'
    })
  }

  try {
    const result = await Tasks.findByIdAndDelete(taskId)
    if (!result) {
      return reply.code(404).send({
        status: 'error',
        message: 'Task not found.'
      })
    }

    reply.code(200).send({
      status: 'success',
      message: 'Task deleted successfully.'
    })
  } catch (error) {
    reply.code(500).send({
      status: 'error',
      message: 'Failed to delete task.',
      error: error.message
    })
  }
}

export const updateTaskById = async (request, reply) => {
  const { taskId } = request.params

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return reply.code(400).send({
      status: 'error',
      message: 'Invalid taskId format.'
    })
  }

  const { error } = validateTask(request.body)
  if (error) {
    const errorMessages = error.details.map((err) => err.message)
    return reply.code(400).send({
      status: 'error',
      message: 'Validation error.',
      errors: errorMessages
    })
  }

  try {
    const updatedTask = await Tasks.findByIdAndUpdate(taskId, request.body, {
      new: true,
      runValidators: true
    })

    if (!updatedTask) {
      return reply.code(404).send({
        status: 'error',
        message: 'Task not found.'
      })
    }

    reply.code(200).send({
      status: 'success',
      message: 'Task updated successfully.',
      task: updatedTask
    })
  } catch (error) {
    reply.code(500).send({
      status: 'error',
      message: 'Failed to update task.',
      error: error.message
    })
  }
}

export const updateStatusById = async (request, reply) => {
  const { taskId } = request.params

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return reply.code(400).send({
      status: 'error',
      message: 'Invalid taskId format.'
    })
  }

  try {
    const updatedTask = await Tasks.findByIdAndUpdate(
      taskId,
      { status: request.body.status },
      {
        new: true,
        runValidators: true
      }
    )

    if (!updatedTask) {
      return reply.code(404).send({
        status: 'error',
        message: 'Task not found.'
      })
    }

    reply.code(200).send({
      status: 'success',
      message: 'Task status updated successfully.',
      task: updatedTask
    })
  } catch (error) {
    reply.code(500).send({
      status: 'error',
      message: 'Failed to update task status.',
      error: error.message
    })
  }
}
