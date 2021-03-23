import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Result, Skeleton, Spin, message } from 'antd';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { useMst } from '../../models/Root';
import { getPairObject } from '../../lib/Helpers';
import './Table.css';
import CPRStats from '../pages/cpr-screener/CPRStats';
import FiltersMenu from './FiltersMenu';

// TODO: Implementar tooltip en las distancias de pivote para mostrar precio del pivote
// TODO: Merge with CamTable

const CPRTable = ({ timeframe, market, futureMode }) => {
	const [gridApi, setGridApi] = useState(null);
	// const [gridColumnApi, setGridColumnApi] = useState(null);
	const [filtersEnabled, setFiltersEnabled] = useState(false);

	const { tickers, cprTableFilters, setCprTableFilters } = useMst((store) => ({
		tickers: store.tickers,
		cprTableFilters: store.cprTableFilters,
		setCprTableFilters: store.setCprTableFilters,
	}));

	useEffect(() => {
		const dispose = autorun(() => {
			if (gridApi && tickers && tickers.length > 0) {
				gridApi.setRowData(tickers);
			}
		});

		return () => {
			dispose();
		};
	});

	useEffect(
		() => () => {
			if (gridApi) {
				gridApi.destroy();
			}
		},
		[]
	);

	const onGridReady = (params) => {
		setGridApi(params.api);
		// setGridColumnApi(params.columnApi);

		if (tickers) {
			params.api.setRowData(tickers);
		} else params.api.showLoadingOverlay();
	};

	const onFirstDataRendered = (params) => {
		params.api.hideOverlay();
	};

	function CustomLoadingOverlay() {
		return <Spin tip='Loading...' />;
	}

	function CustomNoRowsOverlay() {
		return <Result status='warning' title='No data found. Please try reloading the page.' />;
	}

	const distanceGetter = (data, objectStr) => {
		const dist = data.getCPR(timeframe, futureMode).distance;
		if (dist && dist[objectStr]) {
			return dist[objectStr];
		}
		return undefined;
	};

	const distanceFormatter = (value) => {
		if (value) return `${value.toFixed(2)}%`;
		return undefined;
	};

	const CPRWidthGetter = (data) => {
		const value = data.getCPR(timeframe, futureMode).width;

		if (value) return value;
		return undefined;
	};

	const CPRWidthRenderer = (value) => {
		if (value) {
			let str = '';
			let font = '';

			if (value <= 1) {
				font = "<font color='#DF4294'>";
				str = '</font>';
			} else {
				font = "<font color='#2196F3'>";
				str = '</font>';
			}

			return `${font + value}% ${str}`;
		}

		return undefined;
	};

	const cprStatusGetter = (data) => {
		const value = data.getCPR(timeframe, futureMode).isTested;

		if (value !== undefined) return value ? 'Tested' : 'Untested';

		return undefined;
	};

	const cprStatusCellRenderer = (params) => {
		if (params.value) {
			const approximation = params.data.getCPR(timeframe, futureMode).closestApproximation.toFixed(2);
			const apString = approximation > 0 ? `<sup><font color='gray'>${approximation}%</font></sup>` : '';

			return params.value === 'Tested' ? '✔️ Tested' : `🧲 Untested ${apString}`;
		}

		return undefined;
	};

	const cprStatusCellStyle = (params) => {
		if (params && params.value) {
			const extra = { fontSize: '15px' };
			return params.value === 'Untested' ? { ...extra, backgroundColor: 'rgba(255, 0, 0, 0.1)' } : { ...extra, backgroundColor: 'rgba(0, 255, 0, 0.1)' };
		}

		return undefined;
	};

	const magnetSideGetter = (data) => {
		const cpr = data.getCPR(timeframe, futureMode);
		if (cpr) {
			const tested = cpr.isTested;
			if (tested !== undefined) {
				if (tested) return 'None';

				const isAboveCPR = cpr.price_position === 'above';
				if (isAboveCPR !== undefined) return isAboveCPR ? 'Short' : 'Long';
			}
		}

		return undefined;
	};

	const magnetSideCellStyle = (params) => {
		if (params && params.value) {
			const extra = { fontSize: '15px' };

			let result = { ...extra, color: '#858585' };
			if (params.value === 'Short') result = { ...extra, color: 'rgba(255, 0, 0, 1)' };
			else if (params.value === 'Long') result = { ...extra, color: '#4BAA4E' };

			return result;
		}

		return undefined;
	};

	const situationGetter = (data) => {
		const cpr = data.getCPR(timeframe, futureMode);

		if (cpr) {
			if (cpr.price_position !== undefined) {
				const neutral = cpr.price_position === 'neutral';
				if (neutral !== undefined && neutral) return 'Neutral';

				const above = cpr.price_position === 'above';
				if (above !== undefined && above) return 'Above CPR';
				return 'Below CPR';
			}
		}

		return undefined;
	};

	const situationCellStyle = (params) => {
		if (params && params.value) {
			const extra = { fontSize: '15px' };

			let result = { ...extra, backgroundColor: 'rgb(103, 124, 135, 0.1)' };
			if (params.value === 'Below CPR') result = { ...extra, backgroundColor: 'rgba(255, 0, 0, 0.1)' };
			else if (params.value === 'Above CPR') result = { ...extra, backgroundColor: 'rgba(0, 255, 0, 0.1)' };

			return result;
		}

		return undefined;
	};

	const saveFilters = () => {
		if (gridApi) {
			const filterModel = gridApi.getFilterModel();
			setCprTableFilters(filterModel);
			message.success('Filters saved');
		} else {
			message.success('The table is not ready');
		}
	};

	const loadFilters = () => {
		if (gridApi) {
			if (cprTableFilters) {
				gridApi.setFilterModel(cprTableFilters);
				message.success('Filters applied');
			} else {
				message.error('No saved filters found');
			}
		} else {
			message.success('The table is not ready');
		}
	};

	const clearFilters = () => {
		if (gridApi) {
			gridApi.setFilterModel(null);
		} else {
			message.success('The table is not ready');
		}
	};

	const onFilterChanged = () => {
		if (gridApi) {
			setFiltersEnabled(gridApi.isAnyFilterPresent());
		}
	};

	const symbolRenderer = (params) => {
		const { data, value } = params;

		const pair = getPairObject(value);
		const tv = data.tradingViewTicker;
		return `<a href="https://www.tradingview.com/chart?symbol=${tv}" target="_blank" class="external"><font size=3 color='black'>${pair.primary}</font> <font color='gray'>${pair.secondary}</font></a>`;
	};

	const exchangeRenderer = (params) => {
		const { data, value } = params;
		let url;
		switch (data.exchange) {
			case 'Binance Futures':
				url = `https://www.binance.com/en/futures/${data.symbol}`;
				break;
			default:
				url = '';
				break;
		}
		return url ? `<a href=${url} target="_blank" class="external">${value}</a>` : value;
	};

	return (
		<div>
			<CPRStats timeframe={timeframe} futureMode={futureMode} />
			<FiltersMenu onSaveFilters={saveFilters} onLoadFilters={loadFilters} onClearFilters={clearFilters} timeframe={timeframe} market={market} tickersCount={tickers.length} />
			{filtersEnabled && <p className='using-filters'>* Using Filters *</p>}

			<div className='ag-theme-material ag-main'>
				{/* <Button onClick={test}>test</Button> */}
				<AgGridReact
					onGridReady={onGridReady}
					animateRows
					onFilterChanged={onFilterChanged}
					onFirstDataRendered={onFirstDataRendered}
					immutableData
					tooltipShowDelay={0}
					frameworkComponents={{
						customNoRowsOverlay: CustomNoRowsOverlay,
						customLoadingOverlay: CustomLoadingOverlay,
					}}
					defaultColDef={{
						enableCellChangeFlash: true,
						editable: false,
						sortable: true,
						// flex: width <= 768 ? 0 : 1,
						filter: true,
						resizable: true,
					}}
					loadingOverlayComponent='customLoadingOverlay'
					noRowsOverlayComponent='customNoRowsOverlay'
					rowData={null}
					enableBrowserTooltips
					getRowNodeId={(data) => data.symbol}>
					<AgGridColumn width={150} headerName='Symbol' field='symbol' cellRenderer={symbolRenderer} />

					<AgGridColumn width={150} headerName='Exchange' field='exchange' cellRenderer={exchangeRenderer} />

					<AgGridColumn width={150} headerName='Price' field='price' filter='agNumberColumnFilter' />

					<AgGridColumn width={185} cellStyle={cprStatusCellStyle} cellRenderer={cprStatusCellRenderer} headerName='CPR Status' valueGetter={(params) => cprStatusGetter(params.data)} />

					<AgGridColumn width={150} headerName='Magnet Side' valueGetter={(params) => magnetSideGetter(params.data)} cellStyle={magnetSideCellStyle} />

					<AgGridColumn width={150} headerName='Situation' valueGetter={(params) => situationGetter(params.data)} cellStyle={situationCellStyle} />

					{['p', 'tc', 'bc'].map((q) => (
						<AgGridColumn
							key={q}
							width={150}
							headerName={`${q.toUpperCase()} Distance`}
							valueFormatter={(params) => distanceFormatter(params.value)}
							valueGetter={(params) => distanceGetter(params.data, q)}
							filter='agNumberColumnFilter'
						/>
					))}

					<AgGridColumn width={150} headerName='CPR Width' cellRenderer={(params) => CPRWidthRenderer(params.value)} valueGetter={(params) => CPRWidthGetter(params.data)} />
				</AgGridReact>
			</div>
			{!tickers || tickers.length === 0 ? (
				<Skeleton />
			) : (
				<div className='info'>
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
};

CPRTable.propTypes = {
	futureMode: PropTypes.bool.isRequired,
	market: PropTypes.string.isRequired,
	timeframe: PropTypes.string.isRequired,
};

export default observer(CPRTable);
