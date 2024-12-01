import mongoose from 'mongoose'

mongoose

const db = async (fastify, options) => {
  const dbUri = process.env.LOCAL_DB_URI

  mongoose
    .connect(dbUri)
    .then(() => {
      fastify.log.info('MongoDB connected')
    })
    .catch((err) => {
      fastify.log.error(err)
    })
}

export default db
