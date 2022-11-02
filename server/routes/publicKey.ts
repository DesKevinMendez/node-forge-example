import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { encriptedAESkey } from '../utils/encripted'

export default (fastify: FastifyInstance, _: any, done: Function) => {
  fastify.get('/public-key', async (_: FastifyRequest, reply: FastifyReply) => {
    return { data: 'hola' }
  })
  fastify.post('/public-key', async (request: FastifyRequest<{ Body: { public: string } }>, reply: FastifyReply) => {

    const pl = request.body.public
      .replace("-----BEGIN PUBLIC KEY-----\r\n", '')
      .replace("\r\n-----END PUBLIC KEY-----\r\n", '')

    return reply.send({
      data: pl,
      aes: await encriptedAESkey(),
      iv: process.env.IV_ENCRIPT
    })
  })
  done()
}