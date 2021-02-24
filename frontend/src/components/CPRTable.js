import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { Badge, Result, Skeleton, Space, Spin, Button, message } from "antd";
import { autorun } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useMst } from "../models/Root";
import { capitalizeFirstLetter, getPairObject } from "../utils/Helpers";
import "./AGGridOverrides.css";
import CPRStats from "./CPRStats";
import SocketStatus from "./SocketStatus";

// TODO: Implementar tooltip en las distancias de pivote para mostrar precio del pivote
// TODO: Merge with CamTable

const CPRTable = observer((props) => {
	const { timeframe } = props;

	let dispose;

	const [gridApi, setGridApi] = useState(null);
	const [gridColumnApi, setGridColumnApi] = useState(null);
	const [filtersEnabled, setFiltersEnabled] = useState(false);

	/*const [width, setWidth] = useState(window.innerWidth);

	function handleWindowSizeChange() {
		setWidth(window.innerWidth);
	}*/

	const { tickers, cprTableFilters, setCprTableFilters } = useMst((store) => ({
		tickers: store.tickers,
		cprTableFilters: store.cprTableFilters,
		setCprTableFilters: store.setCprTableFilters,
	}));

	dispose = autorun(() => {
		if (gridApi) {
			if (tickers && tickers.length > 0) {
				gridApi.setRowData(tickers);
			}
		}
	});

	useEffect(() => {
		//window.addEventListener("resize", handleWindowSizeChange);

		return () => {
			//window.removeEventListener("resize", handleWindowSizeChange);
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

	function CustomLoadingOverlay(props) {
		return <Spin tip="Loading..." />;
	}

	function CustomNoRowsOverlay(props) {
		return <Result status="warning" title="No data found. Please try reloading the page." />;
	}

	const distanceGetter = (data, objectStr) => {
		const dist = data.getCPR(timeframe).distance;
		if (dist && dist[objectStr]) {
			return dist[objectStr];
		}
	};

	const distanceFormatter = (value) => {
		if (value) return value.toFixed(2) + "%";
	};

	const CPRWidthGetter = (data) => {
		const value = data.getCPR(timeframe).width;

		if (value) return value;
	};

	const CPRWidthRenderer = (value) => {
		if (value) {
			let str = "";
			let font = "";

			if (value <= 1) {
				font = "<font color='#DF4294'>";
				str = "</font>";
			} else {
				font = "<font color='#2196F3'>";
				str = "</font>";
			}

			return font + value + "% " + str;
		}
	};

	const cprStatusGetter = (data) => {
		const value = data.getCPR(timeframe).isTested;

		if (value !== undefined) return value ? "Tested" : "Untested";
	};

	const cprStatusCellRenderer = (params) => {
		if (params.value) {
			const approximation = params.data.getCPR(timeframe).closestApproximation.toFixed(2);

			return params.value === "Tested" ? "✔️ Tested" : "🧲 Untested <sup><font color='gray'>" + approximation + "%</font></sup>";
		}
	};

	const cprStatusCellStyle = (params) => {
		if (params && params.value) {
			const extra = { fontSize: "15px" };
			return params.value === "Untested" ? { ...extra, backgroundColor: "rgba(255, 0, 0, 0.1)" } : { ...extra, backgroundColor: "rgba(0, 255, 0, 0.1)" };
		}
	};

	const magnetSideGetter = (data) => {
		const cpr = data.getCPR(timeframe);
		if (cpr) {
			const tested = cpr.isTested;
			if (tested !== undefined) {
				if (tested) return "None";

				const isAboveCPR = cpr.price_position === "above";
				if (isAboveCPR !== undefined) return isAboveCPR ? "Short" : "Long";
			}
		}
	};

	const magnetSideCellStyle = (params) => {
		if (params && params.value) {
			const extra = { fontSize: "15px" };
			return params.value === "Short" ? { ...extra, color: "rgba(255, 0, 0, 1)" } : params.value === "Long" ? { ...extra, color: "#4BAA4E" } : { ...extra, color: "#858585" };
		}
	};

	const situationGetter = (data) => {
		const cpr = data.getCPR(timeframe);

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

	const situationCellStyle = (params) => {
		if (params && params.value) {
			const extra = { fontSize: "15px" };
			return params.value === "Below CPR"
				? { ...extra, backgroundColor: "rgba(255, 0, 0, 0.1)" }
				: params.value === "Above CPR"
				? { ...extra, backgroundColor: "rgba(0, 255, 0, 0.1)" }
				: { ...extra, backgroundColor: "rgb(103, 124, 135, 0.1)" };
		}
	};

	const saveFilters = () => {
		if (gridApi) {
			const filterModel = gridApi.getFilterModel();
			setCprTableFilters(filterModel);
			message.success("Filters saved");
		} else {
			message.success("The table is not ready");
		}
	};

	const loadFilters = () => {
		if (gridApi) {
			if (cprTableFilters) {
				gridApi.setFilterModel(cprTableFilters);
				message.success("Filters applied");
			} else {
				message.error("No saved filters found");
			}
		} else {
			message.success("The table is not ready");
		}
	};

	const clearFilters = () => {
		if (gridApi) {
			gridApi.setFilterModel(null);
		} else {
			message.success("The table is not ready");
		}
	};

	const onFilterChanged = () => {
		if (gridApi) {
			setFiltersEnabled(gridApi.isAnyFilterPresent());
		}
	};

	const symbolRenderer = (params) => {
		const pair = getPairObject(params.value);
		return `<font size=3>${pair.primary}</font> <font color='gray'>${pair.secondary}</font>`;
	};

	return (
		<div>
			<CPRStats timeframe={timeframe} />
			<Space style={{ padding: 1 }}>
				<h1>
					{capitalizeFirstLetter(props.market)} / {capitalizeFirstLetter(timeframe)}
				</h1>{" "}
				<Badge style={{ backgroundColor: "#2196F3", marginBottom: 7 }} count={tickers.length} />
				<SocketStatus style={{ marginBottom: 5 }} />
			</Space>

			<p style={{ marginTop: -5 }}>You can filter, sort and move any column. The data is updated automatically.</p>
			<Space>
				<Button onClick={saveFilters}>Save Filters</Button>
				<Button onClick={loadFilters}>Load Saved Filters</Button>
				<Button onClick={clearFilters}>Clear Filters</Button>
			</Space>

			{filtersEnabled ? (
				<p style={{ marginTop: 10, color: "red" }}>
					<b>* Using Filters *</b>
				</p>
			) : null}

			<div className="ag-theme-material" style={{ height: 700, width: "100%" }}>
				{/*<Button onClick={test}>test</Button>*/}
				<AgGridReact
					onGridReady={onGridReady}
					animateRows
					onFilterChanged={onFilterChanged}
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
						//flex: width <= 768 ? 0 : 1,
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
					<AgGridColumn width={150} headerName="Symbol" field="symbol" cellRenderer={symbolRenderer}></AgGridColumn>

					<AgGridColumn width={150} headerName="Exchange" field="exchange"></AgGridColumn>

					<AgGridColumn width={150} headerName="Price" field="price" filter="agNumberColumnFilter"></AgGridColumn>

					<AgGridColumn width={170} cellStyle={cprStatusCellStyle} cellRenderer={cprStatusCellRenderer} headerName="CPR Status" valueGetter={(params) => cprStatusGetter(params.data)}></AgGridColumn>

					<AgGridColumn width={150} headerName="Magnet Side" valueGetter={(params) => magnetSideGetter(params.data)} cellStyle={magnetSideCellStyle}></AgGridColumn>

					<AgGridColumn width={150} headerName="Situation" valueGetter={(params) => situationGetter(params.data)} cellStyle={situationCellStyle}></AgGridColumn>

					{["p", "tc", "bc"].map((q) => {
						return (
							<AgGridColumn
								width={150}
								headerName={q.toUpperCase() + " Distance"}
								valueFormatter={(params) => distanceFormatter(params.value)}
								valueGetter={(params) => distanceGetter(params.data, q)}
								filter="agNumberColumnFilter"></AgGridColumn>
						);
					})}

					<AgGridColumn width={150} headerName="CPR Width" cellRenderer={(params) => CPRWidthRenderer(params.value)} valueGetter={(params) => CPRWidthGetter(params.data)}></AgGridColumn>
				</AgGridReact>
			</div>
			{!tickers || tickers.length === 0 ? (
				<Skeleton />
			) : (
				<div style={{ textAlign: "left", marginTop: 30 }}>
					<ul>
						<li>
							The percentage shown above the <i>Untested</i> label is the closest approximation to the CPR. <i>Example:</i> Untested <sup>0.1%</sup> means that there was a candle that came within 0.1%
							of the CPR.
						</li>
						<li>P Distance is the distance between the current price and the pivot level.</li>
						<li>TC Distance is the distance between the current price and the top pivot level.</li>
						<li>BC Distance is the distance between the current price and the bottom pivot level.</li>
					</ul>
				</div>
			)}
		</div>
	);
});

export default CPRTable;
