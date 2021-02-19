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