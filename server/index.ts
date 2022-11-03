import { FastifyError, FastifyRequest, FastifyReply } from 'fastify'
import keysRoutes from './routes/publicKey'
import decrypt from './routes/decrypt'
import dotenv from 'dotenv';

const fastify = require('fastify')()
const path = require('path')

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, '../public/'),
})
fastify.get('/', async (req: FastifyRequest, res: any) => {
  return res.sendFile('index.html') // serving path.join(__dirname, 'public', 'myHtml.html') directly
})

dotenv.config();

fastify.register(require('@fastify/cors'), {})
fastify.register(keysRoutes, { prefix: 'api/v1' })
fastify.register(decrypt, { prefix: 'api/v1' })
fastify.listen({ port: 3000 }, (err: FastifyError) => { console.log(err); })