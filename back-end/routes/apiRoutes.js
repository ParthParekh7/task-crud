import fastifyPlugin from 'fastify-plugin'

import tasks from './tasks.js'

async function apiRoutes(fastify, options) {
  fastify.get('/api/', async (request, reply) => {
    reply.send({ message: 'Demo app is running on port 9000' })
  })
  fastify.register(tasks)
}

export default fastifyPlugin(apiRoutes)
