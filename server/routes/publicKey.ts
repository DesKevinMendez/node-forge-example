import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { random, util } from 'node-forge';
import { encriptAESkey } from '../utils/encript'

export default (fastify: FastifyInstance, _: any, done: Function) => {
  fastify.get('/public-key', async (_: FastifyRequest, reply: FastifyReply) => {
    const key = random.getBytesSync(32);
    let iv = random.getBytesSync(16);

    return { BASE_64_KEY_ENCRIPT: util.bytesToHex(key), IV_ENCRIPT: util.bytesToHex(iv) }
  })
  fastify.post('/public-key', async (request: FastifyRequest<{ Body: { public: string } }>, reply: FastifyReply) => {
    const aesKeyEncripted = encriptAESkey(request.body.public)

    return reply.send({
      encript: aesKeyEncripted,
    })
  })
  done()
}