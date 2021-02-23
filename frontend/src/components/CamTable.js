import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { Badge, Result, Skeleton, Space, Spin } from "antd";
import { autorun } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useMst } from "../models/Root";
import { capitalizeFirstLetter } from "../utils/Helpers";
import "./AGGridOverrides.css";
import CamStats from "./CamStats";
import SocketStatus from "./SocketStatus";

// TODO: Merge with CPRTable

const CamTable = observer((props) => {
	let dispose;

	const [gridApi, setGridApi] = useState(null);
	const [gridColumnApi, setGridColumnApi] = useState(null);

	const { tickers } = useMst((store) => ({
		tickers: store.tickers,
	}));

	const [width, setWidth] = useState(window.innerWidth);

	function handleWindowSizeChange() {
		setWidth(window.innerWidth);
	}

	useEffect(() => {
		window.addEventListener("resize", handleWindowSizeChange);

		return () => {
			window.removeEventListener("resize", handleWindowSizeChange);
			if (dispose) dispose();
		};
	}, []);

	const onGridReady = (params) => {
		setGridApi(params.api);
		setGridColumnApi(params.columnApi);

		if (tickers && tickers.length > 0) {
			params.api.setRowData(tickers);
		} else params.api.showLoadingOverlay();
	};

	const onFirstDataRendered = (params) => {
		params.api.hideOverlay();
	};

	dispose = autorun(() => {
		if (gridApi) {
			if (tickers && tickers.length > 0) {
				gridApi.setRowData(tickers);
			}
		}
	});

	function CustomLoadingOverlay(props) {
		return <Spin tip="Loading..." />;
	}

	function CustomNoRowsOverlay(props) {
		return <Result status="warning" title="No data found. Please try reloading the page." />;
	}

	const situationGetter = (data) => {
		const cam = data.getCamarilla(props.timeframe);

		if (cam) {
			return cam.situation;
		}
	};

	const situationCellStyle = (params) => {
		if (params && params.value) {
			const extra = { fontSize: "15px" };

			switch (params.value) {
				case "Above H4":
					return { ...extra, backgroundColor: "rgba(0, 255, 0, 0.3)" };
				case "Above H3":
					return { ...extra, backgroundColor: "rgba(249, 211, 101, 0.3)" };
				case "Below L3":
					return { ...extra, backgroundColor: "rgba(249, 211, 101, 0.3)" };
				case "Below L4":
					return { ...extra, backgroundColor: "rgba(255, 0, 0, 0.3)" };
				default:
					return { ...extra, backgroundColor: "rgb(103, 124, 135, 0.3)" };
			}
		}
	};

	const distanceCellStyle = (params, level) => {
		if (params && params.value && level && level.length >= 2) {
			const extra = { fontSize: "15px" };

			if (level[0] === "h") return { ...extra, backgroundColor: "rgba(33, 150, 243, 0.1)" };
			// H4,H5,H3,H6
			else if (level[0] === "l") return { ...extra, backgroundColor: "rgba(223, 66, 148, 0.1)" }; // L4,L5,L6,L3
		}
	};

	const distanceGetter = (data, levelStr) => {
		const dist = data.getCamarilla(props.timeframe).distance;
		if (dist && dist[levelStr]) {
			return dist[levelStr];
		}
	};

	const distanceFormatter = (value) => {
		if (value) return value.toFixed(2) + "%";
	};

	const nearestLevelGetter = (data, levelStr) => {
		const nearest = data.getCamarilla(props.timeframe).nearest;
		if (nearest) {
			return nearest.toUpperCase();
		}
	};

	const symbolRenderer = (params) => {
		return "<font size=3>" + params.value.replace("USDT", "</font> <font color='gray'>USDT</font>"); // TODO: Use utils get pair object (to get separated symbol, quote)
	};

	return (
		<div>
			<CamStats timeframe={props.timeframe} />
			<Space style={{ padding: 1 }}>
				<h1>
					{capitalizeFirstLetter(props.market)} / {capitalizeFirstLetter(props.timeframe)}
				</h1>{" "}
				<Badge style={{ backgroundColor: "#2196F3", marginBottom: 7 }} count={tickers.length} />
				<SocketStatus style={{ marginBottom: 5 }} />
			</Space>
			<p style={{ marginTop: -5 }}>You can filter and sort any column. The data is updated automatically.</p>

			<div className="ag-theme-material" style={{ height: 700, width: "100%" }}>
				{/*<Button onClick={test}>test</Button>*/}
				<AgGridReact
					onGridReady={onGridReady}
					animateRows
					onFirstDataRendered={onFirstDataRendered}
					immutableData={true}
					tooltipShowDelay={0}
					frameworkComponents={{
						customNoRowsOverlay: CustomNoRowsOverlay,
						customLoadingOverlay: CustomLoadingOverlay,
					}}
					defaultColDef={{
						enableCellChangeFlash: true,
						editable: false,
						sortable: true,
						flex: width <= 768 ? 0 : 1,
						filter: true,
						resizable: true,
					}}
					loadingOverlayComponent={"customLoadingOverlay"}
					noRowsOverlayComponent={"customNoRowsOverlay"}
					rowData={null}
					enableBrowserTooltips={true}
					getRowNodeId={(data) => {
						return data.symbol;
					}}>
					<AgGridColumn headerName="Symbol" field="symbol" cellRenderer={symbolRenderer}></AgGridColumn>

					<AgGridColumn headerName="Exchange" field="exchange" cellRenderer={symbolRenderer}></AgGridColumn>

					<AgGridColumn headerName="Price" field="price" filter="agNumberColumnFilter"></AgGridColumn>

					<AgGridColumn headerName="Nearest" valueGetter={(params) => nearestLevelGetter(params.data)}></AgGridColumn>

					<AgGridColumn headerName="Situation" valueGetter={(params) => situationGetter(params.data)} cellStyle={situationCellStyle}></AgGridColumn>

					{["h3", "h4", "h5", "h6", "l3", "l4", "l5", "l6"].map((q) => {
						return (
							<AgGridColumn
								headerName={q.toUpperCase() + " Distance"}
								valueFormatter={(params) => distanceFormatter(params.value)}
								valueGetter={(params) => distanceGetter(params.data, q)}
								cellStyle={(params) => distanceCellStyle(params, q)}
								filter="agNumberColumnFilter"></AgGridColumn>
						);
					})}
				</AgGridReact>
			</div>
			{!tickers || tickers.length === 0 ? (
				<Skeleton />
			) : (
				<>
					<p style={{ marginTop: 20, paddingTop: 10 }}>
						● The percentage shown above the <i>Untested</i> label is the closest approximation to the CPR. <i>Example:</i> Untested <sup>0.1%</sup> means that there was a candle that came within 0.1%
						of the CPR.
						<br />● The Sideways/Trending label on the CPR Width column shouldn't be taken seriously, the parameters need to be adjusted.
						<br />● P Distance is the distance between the current price and the pivot level.
						<br />● TC Distance is the distance between the current price and the top pivot level.
						<br />● BC Distance is the distance between the current price and the bottom pivot level.
					</p>
				</>
			)}
		</div>
	);
});

export default CamTable;
