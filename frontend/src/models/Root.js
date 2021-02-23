import { flow, types, unprotect } from "mobx-state-tree";
import moment from "moment";
import { createContext, useContext } from "react";
import { calcPercent } from "../utils/Helpers";
import { Ticker } from "./Ticker";
import localForage from "localforage";
import { persist } from "mst-persist";
import { io } from "socket.io-client";
import jsonpack from "jsonpack";
import { ChartOptions } from "./ChartOptions";

// TODO: Optimize views/computeds (array filter) use cache or something

const RootModel = types
	.model("RootModel", {
		tickers: types.array(Ticker),
		cprStatsPanelVisible: true,
		camStatsPanelVisible: true,
		symbolsList: types.array(types.string),
		socketConnected: false,
		chartOptions: ChartOptions,
	})
	.actions((self) => {
		let socket;

		let currentQuery = null;

		function afterCreate() {
			socket = io("http://localhost:4001/", {
				transports: ["websocket"],
				upgrade: true,
				autoConnect: false,
			});

			socket.on("connect", (data) => {
				self.setSocketConnected(true);
				console.log("socket connected");
				if (currentQuery != null) socket.emit("request_tickers", JSON.stringify(currentQuery));
			});

			socket.on("disconnect", (reason) => {
				self.setSocketConnected(false);
				console.log("disconnect reason: " + reason);
			});

			socket.on("connect_error", (err) => {
				console.log("Socket error: " + err);
			});

			socket.on("tickers_data", (data) => {
				self.setTickers(jsonpack.unpack(data));
			});
		}

		function beforeDestroy() {
			currentQuery = null;
			socket.close();
			socket = null;
		}

		const startReceivingData = function (timeframes = undefined, markets = undefined, symbols = undefined) {
			// TODO: Change to named arguments/object
			if (socket && !socket.connected) socket.connect();

			currentQuery = { timeframes: timeframes, markets: markets, symbols: symbols }; // Used on reconnection

			if (socket) {
				socket.emit("request_tickers", JSON.stringify(currentQuery));
			}
		};

		const stopReceivingData = function () {
			currentQuery = null;
			self.tickers.clear();
			socket.close();
		};

		function setTickers(data) {
			self.tickers = data;
		}

		function setSocketConnected(b) {
			self.socketConnected = b;
			console.log("setisSocketConnected " + self.socketConnected);
		}
		const toggleCPRStatsPanel = function () {
			self.cprStatsPanelVisible = !self.cprStatsPanelVisible;
		};

		const toggleCamStatsPanel = function () {
			self.camStatsPanelVisible = !self.camStatsPanelVisible;
		};

		return {
			afterCreate,
			beforeDestroy,
			toggleCPRStatsPanel,
			startReceivingData,
			stopReceivingData,
			setTickers,
			setSocketConnected,
			toggleCamStatsPanel,
		};
	})
	.views((self) => {
		return {
			cprStats(timeframe) {
				const result = { aboveCount: 0, belowCount: 0, neutralCount: 0, untestedCount: 0, bullsPercent: 0, bearsPercent: 0, wideCount: 0, tightCount: 0 };

				self.tickers.forEach((q) => {
					const cpr = q.getCPR(timeframe);

					result.aboveCount += cpr.price_position === "above" ? 1 : 0;
					result.belowCount += cpr.price_position === "below" ? 1 : 0;
					result.neutralCount += cpr.price_position === "neutral" ? 1 : 0;

					result.wideCount += cpr.width > 1 ? 1 : 0;
					result.tightCount += cpr.width <= 1 ? 1 : 0;

					// isTested will be undefined for new pairs with only 1 candle and should count this case as tested, otherwise just return isTested value.
					result.untestedCount += (cpr.isTested === undefined ? true : cpr.isTested) ? 1 : 0;
				});

				// Neutrals are ignored in bulls/bears percentage
				result.bullsPercent = calcPercent(result.aboveCount, result.aboveCount + result.belowCount);
				result.bearsPercent = calcPercent(result.belowCount, result.aboveCount + result.belowCount);

				return result;
			},
			camStats(timeframe) {
				const result = { aboveH4: 0, belowL4: 0, aboveH3: 0, belowL3: 0, betweenL3H3: 0, bullsPercent: 0, bearsPercent: 0 };
				self.tickers.forEach((q) => {
					const cam = q.getCamarilla(timeframe);

					/*result.aboveH4 += cam.h4_priceStatus === "above" ? 1 : 0;
					result.aboveH3 += cam.h3_priceStatus === "above" && cam.h4_priceStatus !== "above" ? 1 : 0;

					result.belowL3 += cam.l3_priceStatus === "below" && cam.l4_priceStatus !== "below" ? 1 : 0;
					result.belowL4 += cam.l4_priceStatus === "below" ? 1 : 0;

					result.betweenL3H3 += cam.h3_priceStatus === "below" && cam.l3_priceStatus === "above" ? 1 : 0;*/

					switch (cam.situation) {
						case "Above H4":
							result.aboveH4++;
							break;
						case "Above H3":
							result.aboveH3++;
							break;
						case "Below L3":
							result.belowL3++;
							break;
						case "Below L4":
							result.belowL4++;
							break;
						default:
							result.betwweenL3H3++;
					}
				});

				result.bullsPercent = calcPercent(result.aboveH4 + result.aboveH3, self.tickers.length - result.betweenL3H3);
				result.bearsPercent = calcPercent(result.belowL4 + result.belowL3, self.tickers.length - result.betweenL3H3);

				return result;
			},
		};
	});

let initialState = RootModel.create({
	cprStatsPanelVisible: true,
	camStatsPanelVisible: true,
	chartOptions: { dailyCPR: true, weeklyCPR: true, monthlyCPR: true, dailyCam: false, weeklyCam: true, monthlyCam: false, futureMode: false },
});

persist("PivotSC", initialState, {
	whitelist: ["cprStatsPanelVisible", "camStatsPanelVisible", "chartOptions"],
});

export const rootStore = initialState;

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
