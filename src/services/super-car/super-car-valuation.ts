import axios from 'axios';

import { VehicleValuation } from '../../models/vehicle-valuation';
import { SuperCarValuationResponse } from './types/super-car-valuation-response';

export const SUPER_CAR_VALUATION_BASE_URL =
  'https://run.mocky.io/v3/115b2045-7c0e-490a-a233-b928fd713f4c';

export async function fetchValuationFromSuperCarValuation(
  vrm: string,
  mileage: number,
): Promise<VehicleValuation> {
  axios.defaults.baseURL = SUPER_CAR_VALUATION_BASE_URL;
  const response = await axios.get<SuperCarValuationResponse>(
    `valuations/${vrm}?mileage=${mileage}`,
  );

  const valuation = new VehicleValuation();

  valuation.vrm = vrm;
  valuation.lowestValue = response.data.valuation.lowerValue;
  valuation.highestValue = response.data.valuation.upperValue;
  valuation.provider = 'SuperCar';

  return valuation;
}
