import axios from 'axios';
import { ITimeframe } from '../Exchange';
import moment from 'moment';
import ICandlesticks from '../../data/ICandlesticks';

const FINNHUB_KEY = process.env.FINNHUB_KEY;
let waitTime: moment.Moment = moment(); // Used to rate limit

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

function ensureWaitTime() {
	return new Promise<void>((resolve, reject) => {
		function waitCond() {
			if (moment() > waitTime) {
				resolve();
			}
			setTimeout(waitCond, 1);
		}

		waitCond();
	});
}

export async function fetch(symbol: string, timeframe: ITimeframe): Promise<ICandlesticks[]> {
	let timeUnit: moment.unitOfTime.DurationConstructor;
	switch (timeframe.string) {
		case 'daily':
			timeUnit = 'day';
			break;
		case 'weekly':
			timeUnit = 'week';
			break;
		case 'monthly':
			timeUnit = 'month';
			break;
		default:
			timeUnit = 'day';
			break;
	}
	const from = moment().subtract(7, timeUnit).unix();
	const to = moment().add(2, timeUnit).unix();
	const res = getResolutionByTimeframe(timeframe);
	const url = `https://finnhub.io/api/v1/forex/candle?symbol=OANDA:${symbol}&resolution=${res}&from=${from}&to=${to}&token=${FINNHUB_KEY}`;

	const prom = new Promise<ICandlesticks[]>((resolve, reject) => {
		async function fetchUrl() {
			if (moment() < waitTime) {
				await ensureWaitTime();
			}

			axios
				.get(url)
				.then(({ data }: Record<string, any>) => {
					if (data.c && data.h && data.l && data.t) {
						const candles: ICandlesticks[] = [];
						for (let i = 0; i < data.c.length; i += 1) {
							candles.push({ close: data.c[i], high: data.h[i], low: data.l[i], open: data.o[i], timestamp: data.t[i] });
						}
						resolve(candles);
					} else reject(new Error('Received invalid data'));
				})
				.catch((error) => {
					if (error.message.includes('429')) {
						// Handle rate limit by finnhub
						waitTime = moment().add(10, 'seconds');
						fetchUrl();
					} else reject(error);
				});
		}
		fetchUrl();
	});

	return prom;
}

/*type TSymbols = Record<MarketEnum, string[]>;

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
}*/
