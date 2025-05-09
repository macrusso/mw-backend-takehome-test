import { VehicleValuation } from '@app/models/vehicle-valuation';
import {
  ValuationParams,
  VehicleValuationRequest,
} from '@app/routes/valuation/types/vehicle-valuation-request';
import { fetchValuationFromSuperCarValuation } from '@app/super-car/super-car-valuation';
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

    const valuation = await fetchValuationFromSuperCarValuation(vrm, mileage);

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
