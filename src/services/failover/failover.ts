import {
  FAILOVER_TIMEOUT_MS,
  FAILOVER_REQUESTS,
  FAILOVER_THRESHOLD,
} from './constants';
import { Provider, ProviderStats } from './types';

const tracker: Record<Provider, ProviderStats> = {
  SuperCar: { total: 0, failures: 0, inFailover: false },
  PremiumCar: { total: 0, failures: 0, inFailover: false },
};

export const shouldUseFallback = (): boolean => {
  const now = Date.now();

  if (tracker.SuperCar.inFailover) {
    const elapsed = now - (tracker.SuperCar.lastFailoverTime ?? 0);

    // reset inFailover if elapsed > FAILOVER_TIMEOUT_MS
    if (elapsed > FAILOVER_TIMEOUT_MS) {
      tracker.SuperCar = { total: 0, failures: 0, inFailover: false };
      return false;
    }

    return true;
  }

  // check if in FAILOVER_REQUESTS over FAILOVER_THRESHOLD
  // if so, set inFailover to true and set lastFailoverTime to now
  // and return true
  if (
    tracker.SuperCar.total >= FAILOVER_REQUESTS &&
    tracker.SuperCar.failures / tracker.SuperCar.total > FAILOVER_THRESHOLD
  ) {
    tracker.SuperCar.inFailover = true;
    tracker.SuperCar.lastFailoverTime = now;
    return true;
  }

  return false;
};

export const trackProviderResult = (provider: Provider, success: boolean) => {
  const track = tracker[provider];
  track.total += 1;
  if (!success) track.failures += 1;
};
