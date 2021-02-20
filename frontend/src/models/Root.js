import { flow, types } from "mobx-state-tree";
import moment from "moment";
import { createContext, useContext } from "react";
import { apiFetchTickers } from "../utils/Api";
import { randomInteger } from "../utils/Helpers";
import { Ticker } from "./Ticker";

// TODO: Optimize views/computeds (array filter) use cache or something

const RootModel = types
	.model({
		tickers: types.array(Ticker),
		state: types.enumeration("State", ["pending", "done", "error"]),
	})
	.actions((self) => ({
		fetchTickers: flow(function* _callFetchApi(timeframes, symbols) {
			// <- note the star, this a generator function!
			//self.tickers.clear();
			self.state = "pending";
			try {
				let result = yield apiFetchTickers(timeframes, symbols);
				self.tickers = result;
				self.state = "done";
			} catch (error) {
				console.error("Failed to fetch projects", error);
				self.state = "error";
			}
		}),
	}))
	.views((self) => {
		return {
			get remainingCloseTime() {
				// TODO: Not working
				if (self.tickers.length > 0) {
					let fTicker = self.tickers[0];
					if (!fTicker.candlesticks || !fTicker.latestOHLC) return 0;

					let time = new Date(fTicker.latestOHLC.timestamp);

					if (time) {
						console.log(time);
						var ms = moment(time, "DD/MM/YYYY HH:mm:ss").diff(moment(new Date(), "DD/MM/YYYY HH:mm:ss"));
						var d = moment.duration(ms);
						var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");

						return s;
					}
				}

				return null;
			},
			cprUntestedCount(timeframe) {
				return self.tickers.filter((q) => q.getCPR(timeframe).isTested === undefined ? false : !q.getCPR(timeframe).isTested).length;
			},
			cprNeutralCount(timeframe) {
				return self.tickers.filter((q) => q.getCPR(timeframe).price_position === "neutral").length;
			},
			cprBelowCount(timeframe) {
				return self.tickers.filter((q) => q.getCPR(timeframe).price_position === "below").length;
			},
			cprAboveCount(timeframe) {
				return self.tickers.filter((q) => q.getCPR(timeframe).price_position === "above").length;
			},
			/*sidewaysCount(timeframe) {
				return self.tickers.filter((q) => !q.getCPR(timeframe)).length;
			},
			trendingCount(timeframe) {
				return self.tickers.filter((q) => !q.getCPR(timeframe)).length;
			},*/
		};
	});

let initialState = RootModel.create({
	state: "pending",
});

/*
const data = localStorage.getItem('rootState');

if (data) {
    const json = JSON.parse(data);
    if (RootModel.is(json)) {
        initialState = RootModel.create(json);
    }
}*/

export const rootStore = initialState;

/*
onSnapshot(rootStore, snapshot => {
    localStorage.setItem('rootState', JSON.stringify(snapshot));
});*/

const MSTContext = createContext(null);

// eslint-disable-next-line prefer-destructuring
export const Provider = MSTContext.Provider;

export function useMst(mapStateToProps) {
	const store = useContext(MSTContext);

	if (typeof mapStateToProps !== "undefined") {
		return mapStateToProps(store);
	}

	return store;
}
