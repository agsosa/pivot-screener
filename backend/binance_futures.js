const Binance = require('node-binance-api'); // TODO: Remove
const axios = require('axios');
const datamanager = require('./data_manager');

const binanceClient = new Binance();

const MARKET = 'Cryptocurrency';
const EXCHANGE = 'Binance Futures';

const timeframes = [
	{ interval: '1d', objectName: 'daily', limit: 2 },
	{ interval: '1w', objectName: 'weekly', limit: 2 },
	{ interval: '1M', objectName: 'monthly', limit: 2 },
];

let fetchTickerDataInterval = 30 * 1000;
let initialized = false;

function binanceLimitToWeight(limit) {
	if (limit <= 100) return 1;
	if (limit <= 500) return 2;
	if (limit <= 100) return 5;
	return 10;
}

function fetchTickersList() {
	return new Promise(async (resolve) => {
		const res = await binanceClient.futuresPrices();
		const list = [...Object.keys(res)];
		list.map((q) => !q.includes('_') && datamanager.addTicker({ symbol: q, market: MARKET, exchange: EXCHANGE, candlesticks: {} }));

		resolve();
	});
}

function fetchTickersData() {
	return new Promise(async (resolve) => {
		const promises = [];

		// For each ticker in tickerList initialize data object and push to data.tickersData
		const tickersList = datamanager.getTickersListByMarketExchange(MARKET, EXCHANGE);

		for (let i = 0; i < tickersList.length; i += 1) {
			const tickerObj = tickersList[i];
			tickerObj.candlesticks = {};

			// For every timeframe grab candlesticks for each ticker
			timeframes.forEach((t) => {
				const url = `https://fapi.binance.com/fapi/v1/klines?symbol=${tickerObj.symbol}&interval=${t.interval}&limit=${t.limit}`;

				promises.push(
					axios
						.get(url)
						.then((res) => {
							const { data } = res;
							if (!data || data.length === 0) {
								throw new Error(`Invalid data URL: ${url}`);
							}

							const formattedCandles = [];

							data.forEach((c) => {
								formattedCandles.push({
									open: parseFloat(c[1]),
									high: parseFloat(c[2]),
									low: parseFloat(c[3]),
									close: parseFloat(c[4]),
									timestamp: parseInt(c[6], 10),
								});
							});

							tickerObj.candlesticks[`${t.objectName}Candles`] = formattedCandles;
						})
						.catch((error) => {
							console.log(`Fetch symbol data error: ${error}`);
							throw error;
						})
				);
			});
		}

		await Promise.allSettled(promises);
		resolve();
	});
}

async function initialize() {
	return new Promise((resolve) => {
		fetchTickersList().then(async () => {
			// Calculate fetch interval time for Binance API
			const totalTickers = datamanager.data.tickersList.length;
			const weightPerTicker = timeframes.reduce((a, b) => a + (binanceLimitToWeight(b.limit) || 0), 0);
			const weightTotal = totalTickers * weightPerTicker;
			const maxFetchPerMinute = 2400 / weightTotal;
			const fetchInterval = 60 / maxFetchPerMinute;
			const EXTRA_SECONDS = 3; // Safeguard

			fetchTickerDataInterval = fetchInterval + EXTRA_SECONDS;
			initialized = true;

			console.log(`Calculated fetch interval: ${fetchTickerDataInterval} (total weight per fetch: ${weightTotal})`);

			resolve();
		});
	});
}

function doUpdate() {
	if (initialized) {
		fetchTickersData().then(() => {
			if (!datamanager.data.isReady) datamanager.data.isReady = true;

			datamanager.emitDataUpdatedEvent();

			setTimeout(() => {
				doUpdate();
			}, 1000 * fetchTickerDataInterval);
		});
	} else {
		initialize().then(() => doUpdate());
	}
}

exports.doUpdate = doUpdate;
