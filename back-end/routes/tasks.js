import fastifyPlugin from 'fastify-plugin'
import {
  newTask,
  getAllTasks,
  getTaskById,
  deleteTaskById,
  updateTaskById,
  updateStatusById
} from '../services/tasks.js'

async function task(fastify, options) {
  fastify.get('/api/tasks', getAllTasks)
  fastify.get('/api/tasks/:taskId', getTaskById)
  fastify.post('/api/tasks', newTask)
  fastify.put('/api/tasks/:taskId', updateTaskById)
  fastify.delete('/api/tasks/:taskId', deleteTaskById)
  fastify.patch('/api/tasks/:taskId', updateStatusById)
}

export default fastifyPlugin(task)
