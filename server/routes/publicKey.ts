import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export default (fastify: FastifyInstance, _: any, done: Function) => {
  fastify.get('/public-key', async (_: FastifyRequest, reply: FastifyReply) => {
    return { data: 'hola' }
  })
  done()
}