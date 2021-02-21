import { Content } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import Breadcrumb from "./../Breadcrumb";
import { Chart } from "../Chart";
import { useMst } from "./../../models/Root";
import { observer } from "mobx-react-lite";
import SocketStatus from "./../SocketStatus";
import { Spin, Button, Space, Alert, message, Switch, AutoComplete } from "antd";
import { apiFetchSymbolsList } from "../../utils/Api";

const SYMBOLS_LIST_FETCH_INTERVAL = 1000 * 60;

const ChartPage = observer((props) => {
	const [symbolInput, setSymbolInput] = useState("");
	const [symbol, setSymbol] = useState("BTCUSDT");
	const [symbolsList, setSymbolsList] = useState([]);

	const { startReceivingData, stopReceivingData, tickers } = useMst((store) => ({
		startReceivingData: store.startReceivingData,
		stopReceivingData: store.stopReceivingData,
		tickers: store.tickers,
	}));

	function getSymbolsList() {
		apiFetchSymbolsList().then((data) => {
			console.log("chartpage");
			if (data && Array.isArray(data)) {
				data = data.map((q) => {
					return { value: q };
				});
				setSymbolsList(data);
				console.log("ok");
			}

			setTimeout(() => {
				getSymbolsList();
			}, SYMBOLS_LIST_FETCH_INTERVAL);
		});
	}

	useEffect(() => {
		getSymbolsList();

		startReceivingData("daily");

		return () => {
			stopReceivingData();
		};
	}, []);

	function onChangeSymbolClick() {
		let input = symbolInput.toUpperCase();

		if (symbolsList.filter((q) => q.value === input).length !== 0) {
			setSymbol(input);
		} else message.error("Symbol name not found");
	}

	return (
		<Content>
			<div className="site-layout-background" style={{ padding: 24, minHeight: 500, marginTop: 10, textAlign: "center" }}>
				<Breadcrumb items={["Home", "Chart"]} />
				<Space>
					<h2> CPR + Camarilla Chart</h2> <SocketStatus />
				</Space>
				<br />
				Displaying the last 500 hours only. The data is updated automatically.
				<br />
				<Space direction="vertical" style={{ padding: 20 }}>
					<Space>
						<AutoComplete
							style={{ width: 200, marginBottom: 0 }}
							options={symbolsList}
							value={symbolInput}
							placeholder="BTCUSDT"
							onChange={(value) => {
								setSymbolInput(value);
							}}
							filterOption={(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
						/>{" "}
						<Button type="primary" onClick={() => onChangeSymbolClick()}>
							Change Symbol
						</Button>
					</Space>
				</Space>
				{!tickers || tickers.length === 0 ? (
					<div style={{ textAlign: "center", marginTop: 15 }}>
						{" "}
						<Spin tip="Loading Chart..." />
					</div>
				) : (
					<Chart data={tickers[0]} />
				)}
			</div>
		</Content>
	);
});

export default ChartPage;
