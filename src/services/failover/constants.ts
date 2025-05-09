// Defaults to 5 minutes
export const FAILOVER_TIMEOUT_MS = parseInt(
  process.env.FAILOVER_TIMEOUT_MS || '360000',
  10,
);

// Defaults to 50%
export const FAILOVER_THRESHOLD = parseInt(
  process.env.FAILOVER_THRESHOLD || '0.5',
  10,
);

// Defaults to 10 requests
export const FAILOVER_REQUESTS = parseInt(
  process.env.FAILOVER_REQUESTS || '10',
  10,
);
