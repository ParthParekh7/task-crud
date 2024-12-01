import Fastify from 'fastify'
import errorHandler from './middleware/errorHandler.js'
import fastifyHelmet from '@fastify/helmet'
import fastifyCors from '@fastify/cors'
import fastifyRateLimit from '@fastify/rate-limit'
import path from 'path'
import fastifyStatic from '@fastify/static'
import dotenv from 'dotenv'
import db from './config/connectDb.js'
import apiRoutes from './routes/apiRoutes.js'
import fastifyCookie from '@fastify/cookie'

const fastify = Fastify({ logger: true })

dotenv.config()
fastify.register(fastifyCookie)
fastify.register(db)
fastify.register(apiRoutes)

// Register security plugins with CSP
fastify.register(fastifyHelmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"]
    }
  }
})
fastify.register(fastifyCors, {
  origin: '*'
})
fastify.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '1 minute'
})

fastify.register(fastifyStatic, {
  root: path.join(process.cwd(), 'public'),
  prefix: '/'
})

fastify.setErrorHandler(errorHandler)

const start = async () => {
  try {
    await fastify.listen({
      port: process.env.PORT || 9001
    })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
