import { VehicleValuation } from '@app/models/vehicle-valuation';
import { Provider } from '@app/services/failover/types';
import {
  shouldUseFallback,
  trackProviderResult,
} from '@app/services/failover/failover';
import { fetchValuationFromPremiumCarValuation } from '@app/services/premium-car/premium-car-valuation';
import { fetchValuationFromSuperCarValuation } from '@app/services/super-car/super-car-valuation';

export async function getValuationWithFailover(
  vrm: string,
  mileage: number,
): Promise<{ valuation: VehicleValuation; provider: Provider }> {
  let valuation: VehicleValuation;
  let providerUsed: Provider = 'SuperCar';
  let success = false;

  try {
    if (shouldUseFallback()) {
      valuation = await fetchValuationFromPremiumCarValuation(vrm);
      providerUsed = 'PremiumCar';
    } else {
      valuation = await fetchValuationFromSuperCarValuation(vrm, mileage);
      providerUsed = 'SuperCar';
    }
    success = true;
  } catch (error) {
    trackProviderResult(providerUsed ?? 'SuperCar', false);

    if (providerUsed === 'SuperCar') {
      try {
        valuation = await fetchValuationFromPremiumCarValuation(vrm);
        providerUsed = 'PremiumCar';
        success = true;
      } catch (err) {
        trackProviderResult('PremiumCar', false);
        throw new Error('All valuation providers failed');
      }
    } else {
      throw new Error('All valuation providers failed');
    }
  }

  trackProviderResult(providerUsed, success);
  valuation.vrm = vrm;
  valuation.provider = providerUsed;

  return { valuation, provider: providerUsed };
}
