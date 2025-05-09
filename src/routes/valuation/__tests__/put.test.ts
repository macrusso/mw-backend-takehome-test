import { fastify } from '~root/test/fastify';
import nock from 'nock';
import { VehicleValuationRequest } from '../types/vehicle-valuation-request';
import { VehicleValuation } from '@app/models/vehicle-valuation';
import { SUPER_CAR_VALUATION_BASE_URL } from '@app/services/super-car/super-car-valuation';

describe('ValuationController (e2e)', () => {
  beforeEach(async () => {
    nock.cleanAll();
    await fastify.orm.getRepository(VehicleValuation).clear();
  });

  describe('PUT /valuations/', () => {
    it('should return 404 if VRM is missing', async () => {
      const requestBody: VehicleValuationRequest = {
        mileage: 10000,
      };

      const res = await fastify.inject({
        url: '/valuations',
        method: 'PUT',
        body: requestBody,
      });

      expect(res.statusCode).toStrictEqual(404);
      expect(res.json()).toEqual({
        error: 'Not Found',
        message: 'Route PUT:/valuations not found',
        statusCode: 404,
      });
    });

    it('should return 400 if VRM is 8 characters or more', async () => {
      const requestBody: VehicleValuationRequest = {
        mileage: 10000,
      };

      const res = await fastify.inject({
        url: '/valuations/12345678',
        body: requestBody,
        method: 'PUT',
      });

      expect(res.statusCode).toStrictEqual(400);
      expect(res.json()).toEqual({
        message: 'vrm must be 7 characters or less',
        statusCode: 400,
      });
    });

    it('should return 400 if mileage is missing', async () => {
      const requestBody: VehicleValuationRequest = {
        // @ts-expect-error intentionally malformed payload
        mileage: null,
      };

      const res = await fastify.inject({
        url: '/valuations/ABC123',
        body: requestBody,
        method: 'PUT',
      });

      expect(res.statusCode).toStrictEqual(400);
      expect(res.json()).toEqual({
        message: 'mileage must be a positive number',
        statusCode: 400,
      });
    });

    it('should return 400 if mileage is negative', async () => {
      const requestBody: VehicleValuationRequest = {
        mileage: -1,
      };

      const res = await fastify.inject({
        url: '/valuations/ABC123',
        body: requestBody,
        method: 'PUT',
      });

      expect(res.statusCode).toStrictEqual(400);
      expect(res.json()).toEqual({
        message: 'mileage must be a positive number',
        statusCode: 400,
      });
    });

    it('should return 200 with valid request', async () => {
      const vrm = 'ABC123';
      const mileage = 10000;

      const baseURL = SUPER_CAR_VALUATION_BASE_URL;
      const path = `/valuations/${vrm}?mileage=${mileage}`;

      nock(baseURL)
        .get(path)
        .reply(200, {
          vin: '2HSCNAPRX7C385251',
          registrationDate: '2012-06-14T00:00:00.0000000',
          plate: {
            year: 2012,
            month: 4,
          },
          valuation: {
            lowerValue: 22350,
            upperValue: 24750,
          },
        });

      const requestBody: VehicleValuationRequest = {
        mileage,
      };

      const res = await fastify.inject({
        url: `/valuations/${vrm}`,
        body: requestBody,
        method: 'PUT',
      });

      expect(res.statusCode).toStrictEqual(200);
      expect(res.json()).toEqual({
        vrm,
        lowestValue: 22350,
        highestValue: 24750,
        provider: 'SuperCar',
      });
    });
  });
});
