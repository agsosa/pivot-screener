export const markets = [
	{ market: "Cryptocurrency", disabled: false },
	{ market: "Forex", disabled: true },
	{ market: "Commodities", disabled: true },
	{ market: "Indices", disabled: true },
	{ market: "Stocks", disabled: true },
];

export function isValidMarket(market) {
	return markets.find((q) => q.market.toLowerCase() === market.toLowerCase());
}
