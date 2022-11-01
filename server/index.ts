import { FastifyError } from 'fastify'
import keysRoutes from './routes/publicKey'

const fastify = require('fastify')()

fastify.register(require('@fastify/cors'), {})
fastify.register(keysRoutes, { prefix: 'api/v1' })
fastify.listen({ port: 3000 }, (err: FastifyError) => { console.log(err); })