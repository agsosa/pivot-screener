// TODO: Implement proxies to bypass binance api limits

const BINANCE_API_LIMIT_PER_MIN = 1200;

function binanceLimitToWeight(limit) {
  if (limit <= 100) return 1;
  if (limit <= 500) return 2;
  if (limit <= 100) return 5;
  return 10;
}

function getResolutionByTimeframe(timeframe) {
  switch (timeframe.string) {
    case 'daily':
      return '1d';
    case 'weekly':
      return '1w';
    case 'monthly':
      return '1M';
    default:
      return '';
  }
}


export default {
  getResolutionByTimeframe,
  binanceLimitToWeight,
  BINANCE_API_LIMIT_PER_MIN
}