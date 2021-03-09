const Binance = require('node-binance-api');
const axios = require('axios');
const fetch = require('node-fetch');
const datamanager = require('./data_manager');

const binance = new Binance().options({
	APIKEY: '<key>',
	APISECRET: '<secret>',
});

const MARKET = 'Cryptocurrency';
const EXCHANGE = 'Binance Futures';

const timeframes = [
	{ interval: '1d', objectName: 'daily', limit: 2 },
	{ interval: '1w', objectName: 'weekly', limit: 2 },
	{ interval: '1M', objectName: 'monthly', limit: 2 },
	// { interval: '1h', objectName: 'hourly', limit: 500},
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
	return new Promise(async (resolve, reject) => {
		const res = await binance.futuresPrices();
		const list = [...Object.keys(res)];
		list.map((q) => !q.includes('_') && datamanager.addTicker({ symbol: q, market: MARKET, exchange: EXCHANGE, candlesticks: {} }));

		resolve();
	});
}

function fetchTickersData() {
	return new Promise(async (resolve, reject) => {
		const candlesticksObjQueue = [];
		const promises = [];

		// For each ticker in tickerList initialize data object and push to data.tickersData
		const tickersList = datamanager.getTickersListByMarketExchange(MARKET, EXCHANGE);

		for (let i = 0; i < tickersList.length; i++) {
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
							if (!data || data.length == 0) {
								throw new Error(`Invalid data URL: ${url}`);
							}

							const formattedCandles = [];

							data.forEach((c) => {
								formattedCandles.push({
									open: parseFloat(c[1]),
									high: parseFloat(c[2]),
									low: parseFloat(c[3]),
									close: parseFloat(c[4]),
									timestamp: parseInt(c[6]),
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

		/* tickersList.forEach(q => {
            if (!q.candlesticks["dailyCandles"]) console.log(`symbol: ${q.symbol} - dailycandles not found`);
        }) */

		resolve();
	});
}

async function initialize() {
	return new Promise((resolve, reject) => {
		fetchTickersList().then(async () => {
			// Calculate fetch interval time
			const total_tickers = datamanager.data.tickersList.length;
			const calculated_weight_per_ticker = timeframes.reduce((a, b) => a + (binanceLimitToWeight(b.limit) || 0), 0);
			const calculated_weight_total = total_tickers * calculated_weight_per_ticker;
			const max_fetch_per_minute = 2400 / calculated_weight_total;
			const calculated_fetch_interval = 60 / max_fetch_per_minute;
			const EXTRA_SECONDS = 3; // Safeguard

			/* console.log(total_tickers);
            console.log(calculated_weight_per_ticker);
            console.log(calculated_weight_total);
            console.log(max_fetch_per_minute);
            console.log(calculated_fetch_interval) */

			fetchTickerDataInterval = calculated_fetch_interval + EXTRA_SECONDS;
			initialized = true;
			console.log(`Calculated fetch interval: ${fetchTickerDataInterval} (total weight per fetch: ${calculated_weight_total})`);

			resolve();
		});
	});
}

function loop() {
	if (initialized) {
		fetchTickersData().then(() => {
			// console.log("loop() done. Next interval in "+loop_interval+" seconds");

			if (!datamanager.data.isReady) datamanager.data.isReady = true;

			datamanager.emitDataUpdatedEvent();

			setTimeout(() => {
				loop();
			}, 1000 * fetchTickerDataInterval);
		});
	} else {
		initialize().then(() => loop());
	}
}

loop();
