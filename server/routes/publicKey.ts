import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { encriptAESkey } from '../utils/encript'

export default (fastify: FastifyInstance, _: any, done: Function) => {
  fastify.get('/public-key', async (_: FastifyRequest, reply: FastifyReply) => {
    return { data: 'hola' }
  })
  fastify.post('/public-key', async (request: FastifyRequest<{ Body: { public: string } }>, reply: FastifyReply) => {
    const aesKeyEncripted = encriptAESkey(request.body.public)

    return reply.send({
      encript: aesKeyEncripted,
    })
  })
  done()
}