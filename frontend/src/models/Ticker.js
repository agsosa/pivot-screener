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
            }
            
        }
    })