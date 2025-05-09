import { VehicleValuation } from '@app/models/vehicle-valuation';
import {
  ValuationParams,
  VehicleValuationRequest,
} from '@app/routes/valuation/types/vehicle-valuation-request';
import { getValuationWithFailover } from '@app/services/valuation/valuation-with-failover';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const putValuationMiddleware = (fastify: FastifyInstance) => {
  return async (
    request: FastifyRequest<{
      Body: VehicleValuationRequest;
      Params: ValuationParams;
    }>,
    reply: FastifyReply,
  ) => {
    const valuationRepository = fastify.orm.getRepository(VehicleValuation);
    const { vrm } = request.params;
    const { mileage } = request.body;

    if (vrm.length > 7) {
      return reply
        .code(400)
        .send({ message: 'vrm must be 7 characters or less', statusCode: 400 });
    }

    if (mileage == null || mileage <= 0) {
      return reply.code(400).send({
        message: 'mileage must be a positive number',
        statusCode: 400,
      });
    }

    // Check if the valuation already exists in the database
    const existingValuation = await valuationRepository.findOneBy({ vrm });
    if (existingValuation) {
      fastify.log.info('Existing valuation: ', existingValuation);
      return existingValuation;
    }

    // If not, fetch the valuation from the provider
    let valuation: VehicleValuation;
    try {
      ({ valuation } = await getValuationWithFailover(vrm, mileage));
    } catch (error) {
      return reply
        .code(503)
        .send({ message: 'All valuation providers failed' });
    }

    // Save to DB, ignore duplicate key errors
    await valuationRepository.insert(valuation).catch((err) => {
      if (err.code !== 'SQLITE_CONSTRAINT') {
        throw err;
      }
    });

    fastify.log.info('Valuation created: ', valuation);

    return valuation;
  };
};
