export type Provider = 'SuperCar' | 'PremiumCar';

export interface ProviderStats {
  total: number;
  failures: number;
  inFailover: boolean;
  lastFailoverTime?: number;
}
