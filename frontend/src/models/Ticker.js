import { types } from 'mobx-state-tree';
import { inRange, percentDifference } from '../utils/Helpers';

// TODO: Optimize

const Ticker = types
	.model({
		symbol: types.string, // Example: "BTCUSDT"
		market: types.string, // Example: "Cryptocurrency"
		exchange: types.string, // Example: "Binance"
		candlesticks: types.optional(types.frozen()), // Example: { dailyCandles: ohlc[], monthlyCandles: ohlc[] }
	})
	.actions((self) => ({
		// Change current symbol string
		setSymbol(newSymbol) {
			self.symbol = newSymbol;
		},
	}))
	.views((self) => ({
		// Returns a string to find this ticker in TradingView taking into account the exchange
		get tradingViewTicker() {
			let str;
			switch (self.exchange) {
				case 'Binance Futures':
					str = `BINANCE:${self.symbol.toUpperCase()}PERP`;
					break;
				default:
					str = `BINANCE:${self.symbol.toUpperCase()}`;
					break;
			}
			return str;
		},
		// Returns the current price for this ticker
		get price() {
			const session = self.getCurrentSessionOHLC();
			return !session ? 0 : session.close;
		},
		// Returns the current candlesticks object for a timeframe
		getTimeframeCandlesticks(timeframe = 'any') {
			if (!self.candlesticks || (timeframe !== 'any' && !Object.keys(self.candlesticks).includes(`${timeframe}Candles`))) return undefined;
			const candles = timeframe === 'any' ? self.candlesticks[Object.keys(self.candlesticks)[0]] : self.candlesticks[`${timeframe}Candles`];
			return candles;
		},
		// Returns the previous session OHLC
		getPreviousSessionOHLC(timeframe = 'any') {
			const candles = self.getTimeframeCandlesticks(timeframe);
			if (!candles) return undefined;
			return candles.length < 2 ? undefined : candles[candles.length - 2];
		},
		// Returns the actual session OHLC
		getCurrentSessionOHLC(timeframe = 'any') {
			const candles = self.getTimeframeCandlesticks(timeframe);
			if (!candles) return undefined;
			return candles.length < 1 ? undefined : candles[candles.length - 1];
		},
		// Returns a CPR object
		getCPR(timeframe, future = false) {
			const result = {
				p: undefined,
				bc: undefined,
				tc: undefined,
				width: undefined,
				isTested: undefined,
				price_position: undefined,
				distance: { p: undefined, tc: undefined, bc: undefined },
				closestApproximation: undefined,
			};

			// Get session OHLC object
			const currSession = self.getCurrentSessionOHLC(timeframe);
			const session = future ? currSession : self.getPreviousSessionOHLC(timeframe);

			if (!session) return result;

			// Calculate Central Pivot Range
			result.p = (session.high + session.low + session.close) / 3.0;
			result.bc = (session.high + session.low) / 2.0;
			result.tc = result.p - result.bc + result.p;

			// Swap bc and tc if bc is > tc
			if (result.bc > result.tc) [result.bc, result.tc] = [result.tc, result.bc];

			// Calculate CPR width
			const widthResult = ((Math.abs(result.tc - result.bc) / result.p) * 100).toFixed(2);
			result.width = widthResult;

			// Calculate CPR status (tested, untested)
			result.isTested = future ? false : inRange(result.bc, currSession.low, currSession.high) || inRange(result.tc, currSession.low, currSession.high);

			// Calculate price position relative to CPR
			if (currSession.close >= result.tc) result.price_position = 'above';
			else if (currSession.close <= result.bc) result.price_position = 'below';
			else result.price_position = 'neutral';

			// Calculate CPR distance from the current price
			result.distance.p = percentDifference(currSession.close, result.p);
			result.distance.bc = percentDifference(currSession.close, result.bc);
			result.distance.tc = percentDifference(currSession.close, result.tc);

			// Calculate closest approximation
			if (future) result.closestApproximation = 0;
			else if (result.price_position === 'above') result.closestApproximation = percentDifference(currSession.low, result.tc);
			else result.closestApproximation = percentDifference(currSession.high, result.bc);

			return result;
		},
		// Returns the camarilla object for this ticker
		getCamarilla(timeframe, future = false) {
			const result = {
				h3: undefined,
				h4: undefined,
				h5: undefined,
				h6: undefined,
				l3: undefined,
				l4: undefined,
				l5: undefined,
				l6: undefined,
				situation: undefined,
				distance: { h3: undefined, h4: undefined, h5: undefined, h6: undefined, l3: undefined, l4: undefined, l5: undefined, l6: undefined },
				nearest: undefined,
			};

			// Get the session OHLC object
			const currSession = self.getCurrentSessionOHLC(timeframe);
			const session = future ? currSession : self.getPreviousSessionOHLC(timeframe);

			if (!session) return result;

			// Calculate Camarilla Supports/Resistances
			const range = session.high - session.low;
			result.h4 = session.close + (range * 1.1) / 2;
			result.h3 = session.close + (range * 1.1) / 4;
			result.l3 = session.close - (range * 1.1) / 4;
			result.l4 = session.close - (range * 1.1) / 2;
			result.h6 = (session.high / session.low) * session.close;
			result.h5 = result.h4 + 1.168 * (result.h4 - result.h3);
			result.l5 = result.l4 - 1.168 * (result.l3 - result.l4);
			result.l6 = session.close - (result.h6 - session.close);

			// For each Camarilla level add result.level_priceStatus "above" if the current PRICE is above this level, "below" if it's below
			Object.keys(result).forEach((k) => {
				result[`${k}_priceStatus`] = self.price > result[k] ? 'above' : 'below';
			});

			// Set the situation string
			result.situation =
				(result.h4_priceStatus === 'above' && 'Above H4') ||
				(result.h3_priceStatus === 'above' && result.h4_priceStatus !== 'above' && 'Above H3') ||
				(result.l3_priceStatus === 'below' && result.l4_priceStatus !== 'below' && 'Below L3') ||
				(result.l4_priceStatus === 'below' && 'Below L4') ||
				(result.h3_priceStatus === 'below' && result.l3_priceStatus === 'above' && 'Between H3-L3');

			// Calculate distance percentage for every level in result.distance
			Object.keys(result.distance).forEach((k) => {
				result.distance[k] = percentDifference(currSession.close, result[k]);
			});

			/* Get the nearest level (h6,h5, h4, h3, l3, l4, l5, l6)
			 1) Object.keys(result.distance) to loop all the levels, result: array of our levels (string[])
			 2) for each key (level), map [level, distance of this level], result: array of [level, distance]
			 3) then apply reduce to the array of [level, distance] to get the minimum pair [level, distance] by the distance array member.

			 Example: 
			 	with result.distance: { h3: 5.51, h4: 1.7, h5: 2.3, h6: 25.0, l3: 10.05, l4: 5.7, l5: 7.2, l6: 6.52 }

				Object.keys(result.distance) = [ "h3", "h4", "h5", ....]
				after map: [["h3", 5.51], ["h4", 1.7], ["h5", 2.3], ....]
				after reduce: ["h4", 1.7]
				get only the level string of this reduce result
				result.nearest =
			*/
			// eslint-disable-next-line
			result.nearest = Object.keys(result.distance)
				.map((k) => [k, result.distance[k]])
				.reduce((a, b) => (b[1] < a[1] ? b : a))[0]; // Result will be an array: [level (string), distance], we just need the level

			return result;
		},
	}));

export default Ticker;
