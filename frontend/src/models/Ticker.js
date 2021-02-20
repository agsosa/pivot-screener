import { types } from "mobx-state-tree";
import { inRange, percentDifference } from "../utils/Helpers";

// FIXME: A veces no se retornan los valores porque no se encuentra session

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
				let result = { p: undefined, bc: undefined, tc: undefined, width: undefined };
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

				return result;
			},
			getIsTestedCPR(timeframe) {
				const session = self.getCurrentSessionOHLC(timeframe);
				const cpr = self.getCPR(timeframe);
				if (!cpr.p || !session) return undefined;

				const tested = inRange(cpr.bc, session.low, session.high) || inRange(cpr.tc, session.low, session.high);

				return tested;
			},
			getIsAboveCPR(timeframe) {
				const session = self.getCurrentSessionOHLC("any");
				const cpr = self.getCPR(timeframe);
				if (!cpr.p || !session) return undefined;

				return session.close >= cpr.tc;
			},
			getIsBelowCPR(timeframe) {
				const session = self.getCurrentSessionOHLC("any");
				const cpr = self.getCPR(timeframe);
				if (!cpr.p || !session) return undefined;

				return session.close <= cpr.bc;
			},
			getIsNeutralCPR(timeframe) {
				const session = self.getCurrentSessionOHLC("any");
				const cpr = self.getCPR(timeframe);
				if (!cpr.p || !session) return undefined;

				return session.close >= cpr.bc && session.close <= cpr.tc;
			},
			getCPRDistancePct(timeframe) {
				const session = self.getCurrentSessionOHLC("any");
				const cpr = self.getCPR(timeframe);
				let result = { p: undefined, tc: undefined, bc: undefined };
				if (!cpr.p || !session) return result;

				result.p = percentDifference(session.close, cpr.p);
				result.bc = percentDifference(session.close, cpr.bc);
				result.tc = percentDifference(session.close, cpr.tc);

				return result;
			},

			// usar inrange para above etc
		};
	});
