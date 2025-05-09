import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { VehicleValuation } from '../../models/vehicle-valuation';
import { PremiumCarValuationResponse } from './types';

export const PREMIUM_CAR_VALUATION_BASE_URL =
  'https://run.mocky.io/v3/8ebd1750-55d4-4532-ab8d-58529e2cd2e5';

export async function fetchValuationFromPremiumCarValuation(
  vrm: string,
): Promise<VehicleValuation> {
  axios.defaults.baseURL = PREMIUM_CAR_VALUATION_BASE_URL;

  const response = await axios.get<string>(`valueCar?vrm=${vrm}`, {
    responseType: 'text',
  });

  const parser = new XMLParser();
  const data = parser.parse(response.data) as PremiumCarValuationResponse;

  const valuation = new VehicleValuation();

  valuation.vrm = vrm;
  valuation.lowestValue = Number(data.root.ValuationDealershipMinimum);
  valuation.highestValue = Number(data.root.ValuationDealershipMaximum);
  valuation.provider = 'PremiumCar';

  return valuation;
}
