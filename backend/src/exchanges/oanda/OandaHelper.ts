import axios from 'axios';
import { ITimeframe } from './../base/Exchange';
import moment from 'moment';
import ICandlesticks from '../../data/ICandlesticks';

const FINNHUB_KEY = process.env.FINNHUB_KEY;
const MAX_CALLS_PER_MIN = 60;
const MAX_CALLS_PER_SEC = 30;
let currentPromises: Promise<ICandlesticks[]>[] = [];
let time: moment.Moment | null = null; // Used to rate limit
let requests = 0; // Used to rate limit

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

function ensureRequestLimit() {
	return new Promise((resolve, reject) => {
		(function waitCondition() {
			if (moment().diff(time, 'seconds') >= 65) return resolve(true);
			setTimeout(waitCondition, 5);
		})();
	});
}

export async function fetch(symbol: string, timeframe: ITimeframe): Promise<ICandlesticks[]> {
	if (currentPromises.length >= MAX_CALLS_PER_SEC / 2) {
		console.log('Pre: Waiting MAX_CALLS_PER_SEC');
		await Promise.all(currentPromises);
		currentPromises = [];
		console.log('Pos: MAX_CALLS_PER_SEC waited');
	}

	if (requests >= MAX_CALLS_PER_MIN - 1) {
		console.log('Pre: Waiting MAX_CALLS_PER_MIN ' + requests);
		await ensureRequestLimit();
		requests = 0;
		time = moment();
		console.log('Pos: MAX_CALLS_PER_MIN waited');
	} else requests++;

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
			.catch((error) => reject(error));
	});

	currentPromises.push(prom);

	if (!time) time = moment();

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
