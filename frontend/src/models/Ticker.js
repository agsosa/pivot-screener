import { types } from "mobx-state-tree"

export const Ticker = types
    .model({
        symbol: types.string,
        market: types.string,
        candlesticks: types.optional(types.frozen()),
    })
    .actions(self => ({
        setSymbol(newSymbol) {
            self.symbol = newSymbol
        }
    }))
    .views(self => {
        return {
            get price() {
                if (!self.candlesticks || Object.keys(self.candlesticks).length === 0) return 0;

                const latestCandlestickData = self.candlesticks[Object.keys(self.candlesticks)[0]];
                const ohlc = latestCandlestickData[latestCandlestickData.length-1];

                return ohlc.close;
            },
            getCPR(timeframe, future = false) {
                let result = { p: undefined, bc: undefined, tc: undefined, width: undefined };
                if (!self.candlesticks || !Object.keys(self.candlesticks).includes(timeframe+"Candles")) return result;

                const candles = self.candlesticks[timeframe+"Candles"];

                if (candles.length < 2) return result;

                const session = candles[future ? candles.length-1 : candles.length-2];

                result.p = (session.high + session.low + session.close)/3.0;
                result.bc = (session.high + session.low) / 2.0;
                result.tc = result.p - result.bc + result.p;
                result.width = ((Math.abs(result.tc - result.bc) / result.p) * 100).toFixed(2);

                /*CPR Width > 0.5 - Sideways or Trading Range Day, 
                CPR Width > 0.75 - increases the likelihood of sideways trading behavior, 
                CPR Width < 0.5 - Trending type of day, 
                CPR Width < 0.25 - increases the likelihood of a trending market. 
                */

                return result;
            }
        }
    })