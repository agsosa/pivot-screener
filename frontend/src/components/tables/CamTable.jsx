import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Result, Spin, message } from 'antd';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { useMst } from '../../models/Root';
import { getPairObject } from '../../lib/Helpers';
import './Table.css';
import CamStats from '../pages/cam-screener/CamStats';
import FiltersMenu from './FiltersMenu';

// TODO: Merge with CPRTable

const CamTable = ({ futureMode, market, timeframe }) => {
	const [gridApi, setGridApi] = useState(null);
	// const [gridColumnApi, setGridColumnApi] = useState(null);
	const [filtersEnabled, setFiltersEnabled] = useState(false);

	const { tickers, camTableFilters, setCamTableFilters } = useMst((store) => ({
		tickers: store.tickers,
		camTableFilters: store.camTableFilters,
		setCamTableFilters: store.setCamTableFilters,
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

		if (tickers && tickers.length > 0) {
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

	const situationGetter = (data) => {
		const cam = data.getCamarilla(timeframe, futureMode);

		if (cam) {
			return cam.situation;
		}

		return 'Unknown';
	};

	const situationCellStyle = (params) => {
		const extra = { fontSize: '15px' };
		const defaultStyle = { ...extra, backgroundColor: 'rgb(103, 124, 135, 0.3)' };

		if (params && params.value) {
			switch (params.value) {
				case 'Above H4':
					return { ...extra, backgroundColor: 'rgba(0, 255, 0, 0.3)' };
				case 'Above H3':
					return { ...extra, backgroundColor: 'rgba(249, 211, 101, 0.3)' };
				case 'Below L3':
					return { ...extra, backgroundColor: 'rgba(249, 211, 101, 0.3)' };
				case 'Below L4':
					return { ...extra, backgroundColor: 'rgba(255, 0, 0, 0.3)' };
				default:
					return defaultStyle;
			}
		}

		return defaultStyle;
	};

	const distanceCellStyle = (params, level) => {
		if (params && params.value && level && level.length >= 2) {
			const extra = { fontSize: '15px' };

			if (level[0] === 'h') return { ...extra, backgroundColor: 'rgba(33, 150, 243, 0.1)' }; // H4,H5,H3,H6
			if (level[0] === 'l') return { ...extra, backgroundColor: 'rgba(223, 66, 148, 0.1)' }; // L4,L5,L6,L3
		}

		return undefined;
	};

	const distanceGetter = (data, levelStr) => {
		const dist = data.getCamarilla(timeframe, futureMode).distance;
		if (dist && dist[levelStr]) {
			return dist[levelStr];
		}
		return undefined;
	};

	const distanceFormatter = (value) => {
		if (value) return `${value.toFixed(2)}%`;
		return undefined;
	};

	const nearestLevelGetter = (data) => {
		const { nearest } = data.getCamarilla(timeframe, futureMode);

		if (nearest) {
			return nearest.toUpperCase();
		}

		return 'Unknown';
	};

	const symbolRenderer = (params) => {
		const { data, value } = params;

		const pair = getPairObject(value);
		const tv = data.tradingViewTicker;
		return `<a href="https://www.tradingview.com/chart?symbol=${tv}" target="_blank" class="external"><font size=3 color='black'>${pair.primary}</font> <font color='gray'>${pair.secondary}</font></a>`;
	};

	const exchangeRenderer = (params) => {
		const { data, value } = params;
		return `<a href="https://www.binance.com/en/futures/${data.symbol}" target="_blank" class="external">${value}</a>`;
	};

	const saveFilters = () => {
		if (gridApi) {
			const filterModel = gridApi.getFilterModel();
			setCamTableFilters(filterModel);
			message.success('Filters saved');
		} else {
			message.success('The table is not ready');
		}
	};

	const loadFilters = () => {
		if (gridApi) {
			if (camTableFilters) {
				gridApi.setFilterModel(camTableFilters);
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

	return (
		<div>
			<CamStats timeframe={timeframe} futureMode={futureMode} />

			<FiltersMenu onSaveFilters={saveFilters} onLoadFilters={loadFilters} onClearFilters={clearFilters} timeframe={timeframe} market={market} tickersCount={tickers.length} />

			{filtersEnabled && <p className='using-filters'>* Using Filters *</p>}

			<div className='ag-theme-material ag-main'>
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
						filter: true,
						resizable: true,
					}}
					loadingOverlayComponent='customLoadingOverlay'
					noRowsOverlayComponent='customNoRowsOverlay'
					rowData={null}
					enableBrowserTooltips
					getRowNodeId={(data) => data.symbol}>
					<AgGridColumn width={150} headerName='Symbol' field='symbol' cellRenderer={symbolRenderer} />

					<AgGridColumn width={140} headerName='Exchange' field='exchange' cellRenderer={exchangeRenderer} />

					<AgGridColumn width={120} headerName='Price' field='price' filter='agNumberColumnFilter' />

					<AgGridColumn width={120} headerName='Nearest' valueGetter={(params) => nearestLevelGetter(params.data)} />

					<AgGridColumn width={160} headerName='Situation' valueGetter={(params) => situationGetter(params.data)} cellStyle={situationCellStyle} />

					{['h3', 'h4', 'h5', 'h6', 'l3', 'l4', 'l5', 'l6'].map((q) => (
						<AgGridColumn
							key={q}
							width={115}
							headerName={`${q.toUpperCase()} Distance`}
							valueFormatter={(params) => distanceFormatter(params.value)}
							valueGetter={(params) => distanceGetter(params.data, q)}
							cellStyle={(params) => distanceCellStyle(params, q)}
							filter='agNumberColumnFilter'
						/>
					))}
				</AgGridReact>
			</div>
		</div>
	);
};

CamTable.propTypes = {
	futureMode: PropTypes.bool.isRequired,
	market: PropTypes.string.isRequired,
	timeframe: PropTypes.string.isRequired,
};

export default observer(CamTable);
