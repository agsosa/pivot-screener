import Exchange from './base/Exchange';
import ExchangeEnum from './base/ExchangeEnum';
import MarketEnum from './base/MarketEnum';
import DataManager from './../data/DataManager';
import axios from 'axios';
import { BINANCE_API_LIMIT_PER_MIN, binanceLimitToWeight } from './BinanceCommon';

export default class BinanceFutures extends Exchange {
	MARKET: MarketEnum = MarketEnum.CRYPTOCURRENCY;
	EXCHANGE: ExchangeEnum = ExchangeEnum.BINANCE_FUTURES;

	constructor(dataManager: DataManager) {
		super(dataManager);
	}

	fetchTickersList(): Promise<void> {
		const prom = new Promise<void>(async (resolve, reject) => {
			const url = 'https://fapi.binance.com/fapi/v1/ticker/price';
			axios
				.get(url)
				.then(({ data }) => {
					if (Array.isArray(data)) {
						const list: string[] = data.map((q) => q.symbol);
						// Create base ITicker and add to dataManager
						list.map((q) => !q.includes('_') && this.dataManager.addTicker({ symbol: q, market: this.MARKET, exchange: this.EXCHANGE, candlesticks: {} }));
						resolve();
					} else reject(new Error("ticker/price didn't return an array"));
				})
				.catch((error) => {
					console.log(`Fetch symbol list error: ${error}`);
					throw error;
				});
		}).catch((error) => {
			console.log('fetchTickersList() Promise Error: ' + error);
		});

		return prom;
	}

	fetchTickersData(): Promise<void> {
		const prom = new Promise<void>(async (resolve, reject) => {
			const promises: Promise<void>[] = [];

			const tickersList = this.dataManager.getTickersListByMarketExchange(this.MARKET, this.EXCHANGE);

			for (const tickerObj of tickersList) {
				tickerObj.candlesticks = {};

				// For every timeframe grab candlesticks for each ticker
				this.timeframes.forEach((timeframe) => {
					const url = `https://fapi.binance.com/fapi/v1/klines?symbol=${tickerObj.symbol}&interval=${timeframe.interval}&limit=${timeframe.limit}`;

					promises.push(
						axios
							.get(url)
							.then((res) => {
								const { data } = res;

								if (!data || !Array.isArray(data) || data.length === 0) {
									throw new Error(`Invalid data from URL: ${url}`);
								}

								const formattedCandles: Record<string, any>[] = [];

								// Add OHLC objects to formattedCandles
								data.forEach((c) => {
									formattedCandles.push({
										open: parseFloat(c[1]),
										high: parseFloat(c[2]),
										low: parseFloat(c[3]),
										close: parseFloat(c[4]),
										timestamp: parseInt(c[6], 10),
									});
								});

								tickerObj.candlesticks[`${timeframe.name}Candles`] = formattedCandles; // TODO: Refactor
							})
							.catch((error) => {
								console.log(`Fetch symbol data error: ${error} - url: ${url}`);
								reject(error);
							})
					);
				});
			}

			await Promise.all(promises);

			this.dataManager.emitUpdateEvent(); // TODO: Refactor
			resolve();
		}).catch((error) => {
			console.log('fetchTickersData() Promise Error: ' + error);
		});

		return prom;
	}

	initialize(): Promise<void> {
		const prom = new Promise<void>((resolve) => {
			this.fetchTickersList().then(async () => {
				// Calculate the maximum fetch interval time possible to prevent rate limiting (BINANCE_API_LIMIT_PER_MIN)
				const totalTickers = this.dataManager.tickersList.length;
				const weightPerTicker = this.timeframes.reduce((a, b) => a + (binanceLimitToWeight(b.limit) || 0), 0); // Every ticker will request data for every this.timeframes, and the weight added will depend on the limit parameter
				const weightTotal = totalTickers * weightPerTicker;
				const maxFetchPerMinute = BINANCE_API_LIMIT_PER_MIN / weightTotal;
				const fetchInterval = 60 / maxFetchPerMinute;
				const EXTRA_SECONDS = 3; // Safeguard

				this.fetchDataInterval = fetchInterval + EXTRA_SECONDS;

				console.log(`[BINANCE] Calculated fetch interval: ${this.fetchDataInterval} (total weight per fetch: ${weightTotal}, free weight: ${BINANCE_API_LIMIT_PER_MIN - weightTotal})`);

				resolve();
			});
		}).catch((error) => {
			console.log('initialize() Promise Error: ' + error);
		});

		return prom;
	}
}
