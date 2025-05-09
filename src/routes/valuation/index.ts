import { FastifyInstance } from 'fastify';
import { getValuationMiddleware } from '@app/middlewares/valuation/get';
import { putValuationMiddleware } from '@app/middlewares/valuation/put';

export function valuationRoutes(fastify: FastifyInstance) {
  fastify.get('/valuations/:vrm', getValuationMiddleware(fastify));

  fastify.put('/valuations/:vrm', putValuationMiddleware(fastify));
}
