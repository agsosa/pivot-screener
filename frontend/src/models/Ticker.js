import { types } from "mobx-state-tree";
import { inRange, percentDifference } from "../utils/Helpers";

// FIXME: A veces no se retornan los valores porque no se encuentra session
// TODO: Optimize views/computeds (array filter) use cache or something

export const Ticker = types
	.model({
		symbol: types.string,
		market: types.string,
		exchange: types.string,
		candlesticks: types.optional(types.frozen()),
	})
	.actions((self) => ({
		setSymbol(newSymbol) {
			self.symbol = newSymbol;
		},
	}))
	.views((self) => {
		return {
			get price() {
				const session = self.getCurrentSessionOHLC();
				return !session ? 0 : session.close;
			},
			getTimeframeCandlesticks(timeframe = "any") {
				if (!self.candlesticks || (timeframe !== "any" && !Object.keys(self.candlesticks).includes(timeframe + "Candles"))) return undefined;
				const candles = timeframe === "any" ? self.candlesticks[Object.keys(self.candlesticks)[0]] : self.candlesticks[timeframe + "Candles"];
				return candles;
			},
			getPreviousSessionOHLC(timeframe = "any") {
				const candles = self.getTimeframeCandlesticks(timeframe);
				if (!candles) return undefined;
				return candles.length < 2 ? undefined : candles[candles.length - 2];
			},
			getCurrentSessionOHLC(timeframe = "any") {
				const candles = self.getTimeframeCandlesticks(timeframe);
				if (!candles) return undefined;
				return candles.length < 1 ? undefined : candles[candles.length - 1];
			},
			getCPR(timeframe, future = false) {
				let result = {
					p: undefined,
					bc: undefined,
					tc: undefined,
					width: undefined,
					isTested: undefined,
					price_position: undefined,
					distance: { p: undefined, tc: undefined, bc: undefined },
					closestApproximation: undefined,
				};
				const session = future ? self.getCurrentSessionOHLC(timeframe) : self.getPreviousSessionOHLC(timeframe);

				if (!session) return result;

				result.p = (session.high + session.low + session.close) / 3.0;
				result.bc = (session.high + session.low) / 2.0;
				result.tc = result.p - result.bc + result.p;
				const width_result = ((Math.abs(result.tc - result.bc) / result.p) * 100).toFixed(2);
				result.width = width_result; //clamp(width_result, 0.01, 1.0);

				// TODO: Normalize or something width to improve accuracy
				/*
                    CPR Width > 0.5 - Sideways or Trading Range Day, 
                    CPR Width > 0.75 - increases the likelihood of sideways trading behavior, 
                    CPR Width < 0.5 - Trending type of day, 
                    CPR Width < 0.25 - increases the likelihood of a trending market. 
                */

				result.isTested = inRange(result.bc, session.low, session.high) || inRange(result.tc, session.low, session.high);
				result.price_position = session.close >= result.tc ? "above" : session.close <= result.bc ? "below" : "neutral";
				result.distance.p = percentDifference(session.close, result.p);
				result.distance.bc = percentDifference(session.close, result.bc);
				result.distance.tc = percentDifference(session.close, result.tc);
				result.closestApproximation = result.price_position === "above" ? percentDifference(session.close, result.tc) : percentDifference(session.close, result.bc);

				return result;
			},
		};
	});
