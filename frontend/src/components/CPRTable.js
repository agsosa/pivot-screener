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
import CPRStats from "./CPRStats";

const CPRTable = observer((props) => {
	let dispose;

	const [gridApi, setGridApi] = useState(null);
	const [gridColumnApi, setGridColumnApi] = useState(null);

	const { tickers } = useMst((store) => ({
		tickers: store.tickers,
	}));

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

	useEffect(() => {
		return () => {
			if (dispose) dispose();
		};
	}, []);

	function CustomLoadingOverlay(props) {
		return <Spin tip="Loading..." />;
	}

	function CustomNoRowsOverlay(props) {
		return <Result status="warning" title="No data found. Please try reloading the page." />;
	}

	const CPRWidthGetter = (data) => {
		const value = data.getCPR(props.timeframe).width;

		if (value) return value;
	};

	const CPRWidthRenderer = (value) => {
		if (value) {
			let str = "";
			let font = "";

			if (value >= 0.5) {
				font = "<font color='#DF4294'>";
				str = "Sideways</font>";
			}
			if (value >= 0.75) {
				font = "<font color='#DF4294'>";
				str = "Sideways+</font>";
			}
			if (value <= 0.5) {
				font = "<font color='#2196F3'>";
				str = "Trending</font>";
			}
			if (value <= 0.25) {
				font = "<font color='#2196F3'>";
				str = "Trending+</font>";
			}

			return font + value + "% " + str;
		}
	};

	const CPRStatusGetter = (data) => {
		const value = data.getCPR(props.timeframe).isTested;

		if (value !== undefined) return value ? "Tested" : "Untested";
	};

	const cprStatusCellRenderer = (params) => {
		if (params.value) {
			const approximation = 0;

			return params.value === "Tested" ? "✔️ Tested" : "🧲 Untested <sup><font color='gray'0%</font></sup>";
		}
	};

	const cprStatusCellStyle = (params) => {
		if (params && params.value) {
			const extra = { fontSize: "15px" };
			return params.value === "Untested" ? { ...extra, backgroundColor: "rgba(255, 0, 0, 0.1)" } : { ...extra, backgroundColor: "rgba(0, 255, 0, 0.1)" };
		}
	};

	const MagnetSideGetter = (data) => {
		const cpr = data.getCPR(props.timeframe);
		if (cpr) {
			const tested = cpr.isTested;
			if (tested !== undefined) {
				if (tested) return "None";

				const isAboveCPR = cpr.price_position === "above";
				if (isAboveCPR !== undefined) return isAboveCPR ? "Short" : "Long";
			}
		}
	};

	const MagnetSideCellStyle = (params) => {
		if (params && params.value) {
			const extra = { fontSize: "15px" };
			return params.value === "Short" ? { ...extra, color: "rgba(255, 0, 0, 1)" } : params.value === "Long" ? { ...extra, color: "#4BAA4E" } : { ...extra, color: "#858585" };
		}
	};

	const SituationGetter = (data) => {
		const cpr = data.getCPR(props.timeframe);

		if (cpr) {
			if (cpr.price_position !== undefined) {
				const neutral = cpr.price_position === "neutral";
				if (neutral !== undefined && neutral) return "Neutral";

				const above = cpr.price_position === "above";
				if (above !== undefined && above) return "Above CPR";
				else return "Below CPR";
			}
		}
	};

	const SituationCellStyle = (params) => {
		if (params && params.value) {
			const extra = { fontSize: "15px" };
			return params.value === "Below CPR"
				? { ...extra, backgroundColor: "rgba(255, 0, 0, 0.1)" }
				: params.value === "Above CPR"
				? { ...extra, backgroundColor: "rgba(0, 255, 0, 0.1)" }
				: { ...extra, backgroundColor: "rgb(103, 124, 135, 0.1)" };
		}
	};

	const pivotDistanceGetter = (data) => {
		const dist = data.getCPR(props.timeframe).distance;
		if (dist && dist.p) {
			return dist.p;
		}
	};

	const pivotDistanceFormatter = (value) => {
		if (value) return value.toFixed(2) + "%";
	};

	const tcDistanceGetter = (data) => {
		const dist = data.getCPR(props.timeframe).distance;
		if (dist && dist.tc) {
			return dist.tc;
		}
	};

	const tcDistanceFormatter = (value) => {
		if (value) return value.toFixed(2) + "%";
	};

	const bcDistanceGetter = (data) => {
		const dist = data.getCPR(props.timeframe).distance;
		if (dist && dist.bc) {
			return dist.bc;
		}
	};

	const bcDistanceFormatter = (value) => {
		if (value) return value.toFixed(2) + "%";
	};

	const symbolRenderer = (params) => {
		return "<font size=3>" + params.value.replace("USDT", "</font> <font color='gray'>USDT</font>");
	};

	return (
		<p>
			<CPRStats timeframe={props.timeframe} />
			<Space style={{ padding: 1 }}>
				<h1>
					{capitalizeFirstLetter(props.market)} / {capitalizeFirstLetter(props.timeframe)}
				</h1>{" "}
				<Badge style={{ backgroundColor: "#2196F3", marginBottom: 7 }} count={tickers.length} />
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
						editable: true,
						sortable: true,
						flex: 1,
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

					<AgGridColumn cellStyle={cprStatusCellStyle} cellRenderer={cprStatusCellRenderer} headerName="CPR Status" valueGetter={(params) => CPRStatusGetter(params.data)}></AgGridColumn>

					<AgGridColumn headerName="Magnet Side" valueGetter={(params) => MagnetSideGetter(params.data)} cellStyle={MagnetSideCellStyle}></AgGridColumn>

					<AgGridColumn headerName="Situation" valueGetter={(params) => SituationGetter(params.data)} cellStyle={SituationCellStyle}></AgGridColumn>

					<AgGridColumn
						headerName="P Distance"
						valueFormatter={(params) => pivotDistanceFormatter(params.value)}
						valueGetter={(params) => pivotDistanceGetter(params.data)}
						filter="agNumberColumnFilter"></AgGridColumn>

					<AgGridColumn
						headerName="TC Distance"
						valueFormatter={(params) => tcDistanceFormatter(params.value)}
						valueGetter={(params) => tcDistanceGetter(params.data)}
						filter="agNumberColumnFilter"></AgGridColumn>

					<AgGridColumn
						headerName="BC Distance"
						valueFormatter={(params) => bcDistanceFormatter(params.value)}
						valueGetter={(params) => bcDistanceGetter(params.data)}
						filter="agNumberColumnFilter"></AgGridColumn>

					<AgGridColumn headerName="CPR Width" cellRenderer={(params) => CPRWidthRenderer(params.value)} valueGetter={(params) => CPRWidthGetter(params.data)}></AgGridColumn>
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
		</p>
	);
});

export default CPRTable;
