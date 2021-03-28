import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Skeleton } from 'antd';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { useMst } from '../../../../models/Root';
import './Table.css';
import CPRStats from '../CPRStats';
import FiltersMenu from './FiltersMenu';
import { exchangeRenderer, symbolRenderer, CustomLoadingOverlay } from './CommonTableComponents';
import {
	situationCellStyle,
	situationGetter,
	magnetSideCellStyle,
	magnetSideGetter,
	cprStatusCellStyle,
	cprStatusCellRenderer,
	cprStatusGetter,
	cprWidthGetter,
	cprWidthRenderer,
	distanceFormatter,
	distanceGetter,
} from './CPRTableComponents';

// TODO: Implementar tooltip en las distancias de pivote para mostrar precio del pivote

const CPRTable = ({ screenerType, timeframe, market, futureMode }) => {
	const [gridApi, setGridApi] = useState(null);

	const { tickers } = useMst((store) => ({
		tickers: store.tickers,
	}));

	// Update grid row data on tickers update
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

	// Destroy grid on component unmount
	useEffect(
		() => () => {
			if (gridApi) {
				gridApi.destroy();
			}
		},
		[]
	);

	// Remove current grid data on market prop change
	useEffect(() => {
		if (gridApi) {
			gridApi.setRowData([]);
		}
	}, [market]);

	// Initialize grid state
	const onGridReady = (params) => {
		setGridApi(params.api);

		if (tickers) {
			params.api.setRowData(tickers);
		} else params.api.showLoadingOverlay();
	};

	const onFirstDataRendered = (params) => {
		params.api.hideOverlay();
	};

	const InfoRenderer = () => (
		<div className='info'>
			<ul>
				<li>
					The percentage shown above the <i>Untested</i> label is the closest approximation to the CPR. <i>Example:</i> Untested <sup>0.1%</sup> means that there was a candle that came within 0.1% of
					the CPR.
				</li>
				<li>P Distance is the distance between the current price and the pivot level.</li>
				<li>TC Distance is the distance between the current price and the top pivot level.</li>
				<li>BC Distance is the distance between the current price and the bottom pivot level.</li>
			</ul>
		</div>
	);

	return (
		<div>
			<CPRStats timeframe={timeframe} futureMode={futureMode} />
			{gridApi && <FiltersMenu screenerType={screenerType} gridApi={gridApi} timeframe={timeframe} market={market} tickersCount={tickers.length} />}

			<div className='ag-theme-material ag-main'>
				<AgGridReact
					onGridReady={onGridReady}
					animateRows
					onFirstDataRendered={onFirstDataRendered}
					immutableData
					tooltipShowDelay={0}
					frameworkComponents={{
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
					noRowsOverlayComponent='customLoadingOverlay'
					enableBrowserTooltips
					getRowNodeId={(data) => data.symbol}>
					<AgGridColumn width={150} headerName='Symbol' field='symbol' cellRenderer={symbolRenderer} />

					<AgGridColumn width={150} headerName='Exchange' field='exchange' cellRenderer={exchangeRenderer} />

					<AgGridColumn width={150} headerName='Price' field='price' filter='agNumberColumnFilter' />

					<AgGridColumn
						width={185}
						cellStyle={cprStatusCellStyle}
						cellRenderer={(params) => cprStatusCellRenderer(params, timeframe, futureMode)}
						headerName='CPR Status'
						valueGetter={(params) => cprStatusGetter(params, timeframe, futureMode)}
					/>

					<AgGridColumn width={150} headerName='Magnet Side' valueGetter={(params) => magnetSideGetter(params, timeframe, futureMode)} cellStyle={magnetSideCellStyle} />

					<AgGridColumn width={150} headerName='Situation' valueGetter={(params) => situationGetter(params, timeframe, futureMode)} cellStyle={situationCellStyle} />

					{['p', 'tc', 'bc'].map((q) => (
						<AgGridColumn
							key={q}
							width={150}
							headerName={`${q.toUpperCase()} Distance`}
							valueFormatter={distanceFormatter}
							valueGetter={(params) => distanceGetter(params, q, timeframe, futureMode)}
							filter='agNumberColumnFilter'
						/>
					))}

					<AgGridColumn width={150} headerName='CPR Width' cellRenderer={cprWidthRenderer} valueGetter={(params) => cprWidthGetter(params, timeframe, futureMode)} />
				</AgGridReact>
			</div>

			{!tickers || tickers.length === 0 ? <Skeleton /> : <InfoRenderer />}
		</div>
	);
};

CPRTable.propTypes = {
	futureMode: PropTypes.bool.isRequired,
	market: PropTypes.string.isRequired,
	timeframe: PropTypes.string.isRequired,
	screenerType: PropTypes.string.isRequired,
};

export default observer(CPRTable);
