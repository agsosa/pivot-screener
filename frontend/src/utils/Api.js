import axios from "axios";
import jsonpack from "jsonpack";

const BASE_URL = "http://localhost:4000/api/";

export function apiFetchTickers(timeframes = "daily,weekly,monthly,hourly", symbols = "") {
	// TODO: Eliminar
	// TODO: Agregar market query
	const timeframes_query = timeframes ? "timeframes=" + timeframes.replaceAll(" ", "") + "&" : "";
	const symbols_query = symbols ? "symbols=" + symbols.replaceAll(" ", "") + "&" : ``;

	const QUERY = `candlesticks?${timeframes_query}${symbols_query}`;

	return new Promise((resolve, reject) => {
		axios
			.get(BASE_URL + QUERY)
			.then((res) => {
				resolve(jsonpack.unpack(res.data));
			})
			.catch((error) => console.log(error.toString()));
	});
}

export function apiFetchSymbolsList(markets = undefined) {
	// TODO: IMPLEMENTAR RETRY
	const markets_query = markets ? "markets=" + markets.replaceAll(" ", "") : ``;

	const QUERY = `symbols-list?${markets_query}`;

	return new Promise((resolve, reject) => {
		axios
			.get(BASE_URL + QUERY)
			.then((res) => {
				console.log("symbols list = " + res.data);
				console.log("es array = " + Array.isArray(res.data));
				resolve(res.data);
			})
			.catch((error) => console.log(error.toString()));
	});
}
