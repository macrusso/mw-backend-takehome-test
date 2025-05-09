import { VehicleValuation } from '@app/models/vehicle-valuation';
import { ValuationParams } from '@app/routes/valuation/types/vehicle-valuation-request';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const getValuationMiddleware = (fastify: FastifyInstance) => {
  return async (
    request: FastifyRequest<{ Params: ValuationParams }>,
    reply: FastifyReply,
  ) => {
    const valuationRepository = fastify.orm.getRepository(VehicleValuation);
    const { vrm } = request.params;

    if (!vrm || vrm.length > 7) {
      return reply
        .code(400)
        .send({ message: 'vrm must be 7 characters or less', statusCode: 400 });
    }

    const result = await valuationRepository.findOneBy({ vrm });

    if (!result) {
      return reply.code(404).send({
        message: `Valuation for VRM ${vrm} not found`,
        statusCode: 404,
      });
    }

    return result;
  };
};
