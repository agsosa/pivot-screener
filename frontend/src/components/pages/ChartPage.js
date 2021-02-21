import { Content } from "antd/lib/layout/layout";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Breadcrumb from "./../Breadcrumb";
import { Chart } from "../Chart";
import { useMst } from "./../../models/Root";
import { observer } from "mobx-react-lite";
import SocketStatus from "./../SocketStatus";
import { Spin, Button, Space, Alert, message, Switch, AutoComplete } from "antd";
import { apiFetchSymbolsList, apiFetchCandlesticksLocally } from "../../utils/Api";

const SYMBOLS_LIST_FETCH_INTERVAL = 1000 * 15;

// TODO: Fix Chart.js rerendering on input

const ChartPage = observer((props) => {
	const [symbolInput, setSymbolInput] = useState("");
	const [symbol, setSymbol] = useState("BTCUSDT");
	const [symbolsList, setSymbolsList] = useState([]);

	let fetchTimeout = useRef(null);

	const { tickers, setTickers } = useMst((store) => ({
		tickers: store.tickers,
		setTickers: store.setTickers,
	}));

	async function fetchCandles() {
		console.log("fetchcandles with " + symbol);
		const result = await apiFetchCandlesticksLocally(symbol);
		if (symbol === result.symbol) setTickers([{ symbol: symbol, market: "", exchange: "", candlesticks: result.candlesticks }]);
		fetchTimeout.current = setTimeout(() => {
			fetchCandles();
		}, SYMBOLS_LIST_FETCH_INTERVAL);
	}

	function onChartLoadComplete() {}

	function cancelFetchCandles() {
		if (fetchTimeout.current) {
			console.log("clearing fetchTimeout");
			clearTimeout(fetchTimeout.current);
		}
	}

	function getSymbolsList() {
		apiFetchSymbolsList().then((data) => {
			if (data && Array.isArray(data)) {
				data = data.map((q) => {
					return { value: q };
				});
				setSymbolsList(data);
			}

			setTimeout(() => {
				getSymbolsList();
			}, SYMBOLS_LIST_FETCH_INTERVAL);
		});
	}

	useEffect(() => {
		cancelFetchCandles();
		fetchCandles();
	}, [symbol]);

	useEffect(() => {
		getSymbolsList();

		return () => {
			cancelFetchCandles();
		};
	}, []);

	function onChangeSymbolClick() {
		let input = symbolInput.toUpperCase();

		if (symbolsList.filter((q) => q.value === input).length !== 0) {
			setSymbol(input);
		} else message.error("Symbol name not found");
	}

	const onAutoCompleteInputChange = useCallback((value) => {
		setSymbolInput(value);
	}, []);

	return (
		<Content>
			<div className="site-layout-background" style={{ padding: 24, minHeight: 700, marginTop: 10, textAlign: "center" }}>
				<Breadcrumb items={["Home", "Chart"]} />
				<Space>
					<h2> CPR + Camarilla Pivots Chart</h2>
				</Space>
				<br />
				Displaying the latest 500 hours only. The data is updated automatically.
				<br />
				<Space direction="vertical" style={{ padding: 20 }}>
					<Space>
						<AutoComplete
							style={{ width: 200, marginBottom: 0 }}
							options={symbolsList}
							value={symbolInput}
							placeholder="BTCUSDT"
							onChange={(value) => onAutoCompleteInputChange(value)}
							filterOption={(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
						/>{" "}
						<Button type="primary" onClick={() => onChangeSymbolClick()}>
							Change Symbol
						</Button>
					</Space>
				</Space>
				{!tickers ||
					(tickers.length === 0 && (
						<div style={{ textAlign: "center", marginTop: 15 }}>
							{" "}
							<Spin tip="Loading Chart..." />
						</div>
					))}
				<br />
				<Chart onLoadComplete={onChartLoadComplete} symbol={symbol} />
			</div>
		</Content>
	);
});

export default ChartPage;
