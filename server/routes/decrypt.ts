import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { util } from 'node-forge'
import { decryptData } from '../utils/decrypt'

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

    const rp = await decryptData(encrypted, util.hexToBytes(tag), process.env.IV_ENCRYPT as string)

    return reply.send({
      data: JSON.parse(rp.data),
    })
  })
  done()
}