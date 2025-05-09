import { fastify } from '~root/test/fastify';
import { VehicleValuation } from '@app/models/vehicle-valuation';

describe('ValuationController (e2e)', () => {
  beforeEach(async () => {
    await fastify.orm.getRepository(VehicleValuation).clear();
  });

  describe('GET /valuations/', () => {
    it('should return 400 if VRM is 8 characters or more', async () => {
      const res = await fastify.inject({
        url: '/valuations/12345678',
        method: 'GET',
      });

      expect(res.statusCode).toStrictEqual(400);
      expect(res.json()).toEqual({
        message: 'vrm must be 7 characters or less',
        statusCode: 400,
      });
    });

    it('should return 404 if there is no valuation', async () => {
      const res = await fastify.inject({
        url: '/valuations/ABC123',
        method: 'GET',
      });

      expect(res.statusCode).toStrictEqual(404);
      expect(res.json()).toEqual({
        message: 'Valuation for VRM ABC123 not found',
        statusCode: 404,
      });
    });

    it('should return 200 with valid request', async () => {
      const repo = fastify.orm.getRepository(VehicleValuation);

      await repo.insert({
        vrm: 'ABC123',
        lowestValue: 1000,
        highestValue: 2000,
      });

      const res = await fastify.inject({
        url: '/valuations/ABC123',
        method: 'GET',
      });

      expect(res.statusCode).toStrictEqual(200);
      expect(res.json()).toEqual({
        vrm: 'ABC123',
        lowestValue: 1000,
        highestValue: 2000,
      });
    });
  });
});
