import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export default (fastify: FastifyInstance, _: any, done: Function) => {
  fastify.post('/decode', async (request: FastifyRequest<{ Body: { data: string } }>, reply: FastifyReply) => {
    const pl = request.body.data
    return reply.send({
      data: pl,
    })
  })
  done()
}