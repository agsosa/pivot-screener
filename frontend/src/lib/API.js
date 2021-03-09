import axios from 'axios';
import jsonpack from 'jsonpack';
import { isDev } from './Helpers';

const BASE_URL = isDev() ? 'http://localhost:4000/api/' : 'https://pivotscreener.herokuapp.com/api/';

export function apiFetchTickers(timeframes = 'daily,weekly,monthly,hourly', symbols = '') {
	// TODO: Eliminar
	// TODO: Agregar market query
	const timeFramesQuery = timeframes ? `timeframes=${timeframes.replaceAll(' ', '')}&` : '';
	const symbolsQuery = symbols ? `symbols=${symbols.replaceAll(' ', '')}&` : ``;

	const QUERY = `candlesticks?${timeFramesQuery}${symbolsQuery}`;

	return new Promise((resolve, reject) => {
		axios
			.get(BASE_URL + QUERY)
			.then((res) => {
				resolve(jsonpack.unpack(res.data));
			})
			.catch((error) => reject(new Error(error.toString())));
	});
}

export function apiFetchSymbolsList(markets = undefined) {
	// TODO: IMPLEMENTAR RETRY
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

export function apiFetchCandlesticksLocally(symbol) {
	// TODO: Add support for markets, make shared function with backend
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
			const url = `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${t.interval}&limit=${t.limit}`;
			const axiosPromise = axios
				.get(url)
				.then((res) => {
					if (!res || !res.data || res.data.length === 0 || res.data.code !== undefined) reject(new Error(`Invalid data received from Binance ${res}`));
					const klines = [];

					res.data.forEach((c) => {
						klines.push({
							open: parseFloat(c[1]),
							high: parseFloat(c[2]),
							low: parseFloat(c[3]),
							close: parseFloat(c[4]),
							timestamp: parseInt(c[6], 10),
						});
					});

					candlesticks[`${t.objectName}Candles`] = klines;
				})
				.catch((error) => console.log(error.toString()));

			proms.push(axiosPromise);
		});

		await Promise.allSettled(proms);

		resolve({ candlesticks, symbol });
	});
}
