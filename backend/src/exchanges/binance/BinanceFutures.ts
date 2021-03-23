import Exchange, { timeframes } from '../base/Exchange';
import ExchangeEnum from '../../data/ExchangeEnum';
import MarketEnum from '../../data/MarketEnum';
import axios from 'axios';
import * as BinanceHelper from './BinanceHelper';
import ICandlesticks from './../../data/ICandlesticks';
import { ITimeframe } from './../base/Exchange';

export default class BinanceFutures extends Exchange {
	MARKET: MarketEnum = MarketEnum.CRYPTOCURRENCY;
	EXCHANGE: ExchangeEnum = ExchangeEnum.BINANCE_FUTURES;

	fetchSymbolsList(): Promise<string[]> {
		const url = 'https://fapi.binance.com/fapi/v1/ticker/price';
		return new Promise<string[]>((resolve, reject) => {
			axios
				.get(url)
				.then(({ data }) => {
					if (Array.isArray(data)) {
						const list: string[] = data.filter((q) => !q.symbol.includes('_')).map((q) => q.symbol);
						resolve(list);
					} else reject(new Error("ticker/price didn't return an array"));
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	fetchSymbolCandles(symbol: string, timeframe: ITimeframe): Promise<ICandlesticks[]> {
		const url = `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${BinanceHelper.getResolutionByTimeframe(timeframe)}&limit=${timeframe.limit}`;

		return new Promise<ICandlesticks[]>((resolve, reject) => {
			axios
				.get(url)
				.then((res) => {
					const { data } = res;

					if (!data || !Array.isArray(data) || data.length === 0) {
						reject(new Error(`Invalid data from URL: ${url}`));
					}

					const candlesticks: ICandlesticks[] = [];

					// Parse binance candlesticks array
					data.forEach((c: any[]) => {
						candlesticks.push({
							open: parseFloat(c[1]),
							high: parseFloat(c[2]),
							low: parseFloat(c[3]),
							close: parseFloat(c[4]),
							timestamp: parseInt(c[6], 10),
						});
					});

					resolve(candlesticks);
				})
				.catch((error) => {
					console.log(`Fetch symbol data error: ${error} - url: ${url}`);
					reject(error);
				});
		});
	}

	async initialize(): Promise<void> {
		// Calculate the maximum fetch interval time possible to prevent rate limiting (BINANCE_API_LIMIT_PER_MIN)
		const totalTickers = this.dataManager.tickersList.length;
		const weightPerTicker = timeframes.reduce((a, b) => a + (BinanceHelper.binanceLimitToWeight(b.limit) || 0), 0); // Every ticker will request data for every this.timeframes, and the weight added will depend on the limit parameter
		const weightTotal = totalTickers * weightPerTicker;
		const maxFetchPerMinute = BinanceHelper.BINANCE_API_LIMIT_PER_MIN / weightTotal;
		const fetchInterval = 60 / maxFetchPerMinute;
		const EXTRA_SECONDS = 3; // Safeguard

		this.fetchDataInterval = fetchInterval + EXTRA_SECONDS;

		console.log(`[BINANCE] Calculated fetch interval: ${this.fetchDataInterval} (total weight per fetch: ${weightTotal}, free weight: ${BinanceHelper.BINANCE_API_LIMIT_PER_MIN - weightTotal})`);
	}
}
