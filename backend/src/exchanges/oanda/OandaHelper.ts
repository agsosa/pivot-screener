import MarketEnum from '../base/MarketEnum';
import axios from 'axios';
import { ITimeframe } from './../base/Exchange';

export const FINNHUB_KEY = process.env.FINNHUB_KEY;

type TSymbols = Record<MarketEnum, string[]>;

let initialized: boolean = false;
let prom: Promise<TSymbols> | null = null; // Used to prevent concurrent getOandaSymbols() promises
const oandaSymbols: TSymbols = { Forex: [], Commodities: [], Indices: [], Cryptocurrency: [], Stocks: [] };

// Initialize oandaSymbols from Finnhub API or return it if it's already initialized
async function getOandaSymbols(): Promise<TSymbols> {
	if (prom) return prom;

	const url = 'https://finnhub.io/api/v1/forex/symbol?exchange=oanda&token=' + FINNHUB_KEY;

	prom = new Promise<TSymbols>((resolve, reject) => {
		if (initialized) resolve(oandaSymbols);
		else
			axios
				.get(url)
				.then((result) => {
					if (result && Array.isArray(result)) {
						console.log(result);
						initialized = true;
						oandaSymbols.Forex = ['TEST1', 'TEST2'];
						oandaSymbols.Commodities = ['TEST1', 'TEST2'];
						oandaSymbols.Indices = ['TEST1', 'TEST2'];
						resolve(oandaSymbols);
					} else throw new Error('Invalid response');
				})
				.catch((error) => {
					console.error('Finnhub API error: ' + error);
					reject(error);
				});
	});

	return prom;
}

export async function getOandaSymbolsByMarket(market: MarketEnum): Promise<string[]> {
	const symbols = await getOandaSymbols();
	return symbols[market];
}

export function getResolutionByTimeframe(timeframe: ITimeframe) {
	switch (timeframe.string) {
		case 'daily':
			return 'D';
		case 'weekly':
			return 'W';
		case 'monthly':
			return 'M';
		default:
			return '';
	}
}
