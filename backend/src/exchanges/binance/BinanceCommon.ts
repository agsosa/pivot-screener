// TODO: Implement proxies to bypass binance api limits

export const BINANCE_API_LIMIT_PER_MIN = 1200;

export function binanceLimitToWeight(limit: number): number {
	if (limit <= 100) return 1;
	if (limit <= 500) return 2;
	if (limit <= 100) return 5;
	return 10;
}
