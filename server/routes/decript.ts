import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { util } from 'node-forge'
import { decriptData } from '../utils/decript'

export default (fastify: FastifyInstance, _: any, done: Function) => {
  fastify.post('/decode', async (request: FastifyRequest<{
    Body: {
      data: {
        encrypted: string,
        tag: string
      }
    }
  }>, reply: FastifyReply) => {
    const { encrypted, tag } = request.body.data

    const rp = await decriptData(encrypted, util.hexToBytes(tag), process.env.IV_ENCRIPT as string)

    return reply.send({
      data: JSON.parse(rp.data),
    })
  })
  done()
}