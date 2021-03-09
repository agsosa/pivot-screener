import axios from 'axios';
import { isDev } from './Helpers';

const BASE_URL = isDev() ? 'http://localhost:4000/api/' : 'https://pivotscreener.herokuapp.com/api/';

// TODO: Multiple markets/exchanges not supported yet!!! Only binance futures implemented atm

// Get supported list from the backend
// TODO: Add retry
// TODO: Add market/exchange support
export function apiFetchSymbolsList(markets = undefined) {
	const marketsQuery = markets ? `markets=${markets.replaceAll(' ', '')}` : ``;

	const QUERY = `symbols-list?${marketsQuery}`;

	return new Promise((resolve, reject) => {
		axios
			.get(BASE_URL + QUERY)
			.then((res) => {
				resolve(res.data);
			})
			.catch((error) => reject(new Error(error.toString())));
	});
}

// Get candlesticks for a symbol (currently only binance futures)
// TODO: Add support for multiple markets/exchanges, optimize (cache, only update prices and pivot state)
export function apiFetchBinanceCandlesticksLocally(symbol) {
	const timeframes = [
		{ interval: '1d', objectName: 'daily', limit: 2 },
		{ interval: '1w', objectName: 'weekly', limit: 2 },
		{ interval: '1M', objectName: 'monthly', limit: 2 },
		{ interval: '1h', objectName: 'hourly', limit: 500 },
	];

	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve, reject) => {
		const candlesticks = {};
		const proms = [];

		timeframes.forEach((t) => {
			// Consume binance public API
			const url = `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${t.interval}&limit=${t.limit}`;
			const axiosPromise = axios
				.get(url)
				.then((res) => {
					if (!res || !res.data || res.data.length === 0 || res.data.code !== undefined) reject(new Error(`Invalid data received from Binance ${res}`));
					const klines = [];

					// Convert binance OHLC array to OHLC object
					res.data.forEach((c) => {
						klines.push({
							open: parseFloat(c[1]),
							high: parseFloat(c[2]),
							low: parseFloat(c[3]),
							close: parseFloat(c[4]),
							timestamp: parseInt(c[6], 10),
						});
					});

					// Assign the timeframe Candles object to candlesticks
					candlesticks[`${t.objectName}Candles`] = klines;
				})
				.catch((error) => console.log(error.toString()));

			proms.push(axiosPromise);
		});

		await Promise.allSettled(proms); // Wait for all timeframes to resolve

		resolve({ candlesticks, symbol });
	});
}
