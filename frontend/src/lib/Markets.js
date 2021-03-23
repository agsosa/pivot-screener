export const markets = [
	{ market: 'Cryptocurrency', disabled: false },
	{ market: 'Forex', disabled: false },
	{ market: 'Commodities', disabled: false },
	{ market: 'Indices', disabled: false },
	{ market: 'Stocks', disabled: true },
];

export function isValidMarket(market) {
	return markets.find((q) => q.market.toLowerCase() === market.toLowerCase());
}
