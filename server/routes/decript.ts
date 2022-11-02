import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { decriptData } from '../utils/decript'

export default (fastify: FastifyInstance, _: any, done: Function) => {
  fastify.post('/decode', async (request: FastifyRequest<{
    Body: {
      data: {
        encrypted: string,
        tag: unknown,
        iv: unknown,
      }
    }
  }>, reply: FastifyReply) => {
    const { encrypted, tag } = request.body.data

    const rp = await decriptData(encrypted, tag, process.env.IV_ENCRIPT)

    return reply.send({
      data: JSON.parse(rp.data),
    })
  })
  done()
}