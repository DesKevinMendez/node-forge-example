import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { random, util } from 'node-forge';
import { encryptAESkey } from '../utils/encrypt'

export default (fastify: FastifyInstance, _: any, done: Function) => {
  fastify.get('/public-key', async (_: FastifyRequest, reply: FastifyReply) => {
    const key = random.getBytesSync(32);
    let iv = random.getBytesSync(16);

    return { BASE_64_KEY_ENCRYPT: util.bytesToHex(key), IV_ENCRYPT: util.bytesToHex(iv) }
  })
  fastify.post('/public-key', async (request: FastifyRequest<{ Body: { public: string } }>, reply: FastifyReply) => {
    const aesKeyEncrypted = encryptAESkey(request.body.public)

    return reply.send({
      encrypt: aesKeyEncrypted,
    })
  })
  done()
}