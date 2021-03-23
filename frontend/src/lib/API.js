import axios from 'axios';

// TODO: Add support for multiple markets/exchanges, optimize (cache, only update prices and pivot state)

// Fetch symbols list from Binance Futures (excluding symbols with _ in the name)
export function apiFetchBinanceFuturesList() {
	const url = 'https://fapi.binance.com/fapi/v1/ticker/price';
	return new Promise((resolve, reject) => {
		axios
			.get(url)
			.then(({ data }) => {
				if (Array.isArray(data)) {
					const list = data.filter((q) => !q.symbol.includes('_')).map((q) => q.symbol);
					resolve(list);
				} else reject(new Error("ticker/price didn't return an array"));
			})
			.catch((error) => {
				reject(error);
			});
	});
}

// Get candlesticks for a symbol (currently only binance futures)
export function apiFetchBinanceFuturesCandles(symbol) {
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
