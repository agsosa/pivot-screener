import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { useMst } from 'models/Root';
import './Table.css';
import CamStats from 'components/stats/CamStats';
import FiltersMenu from 'components/tables/FiltersMenu';
import { exchangeRenderer, symbolRenderer, CustomLoadingOverlay } from 'components/tables/CommonTableComponents';
import {
  distanceCellStyle,
  distanceGetter,
  nearestLevelGetter,
  distanceFormatter,
  situationCellStyle,
  situationGetter,
} from 'components/tables/CamTableComponents';
import { makeStyles } from '@material-ui/core/styles';
import MultilineSkeleton from 'components/misc/MultilineSkeleton';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    gap: theme.spacing(1),
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const CamTable = ({ screenerType, futureMode, market, timeframe }) => {
  const classes = useStyles();
  const [gridApi, setGridApi] = useState(null);
  const [loading, setLoading] = useState(false);

  const { tickers } = useMst((store) => ({
    tickers: store.tickers,
  }));

  const isValidTickers = () => tickers && tickers.length > 0 && tickers[0].market.toLowerCase() === market;

  // Update grid row data on tickers update
  useEffect(() => {
    const dispose = autorun(() => {
      if (gridApi && isValidTickers()) {
        gridApi.setRowData(tickers);
        setLoading(false);
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
      setLoading(true);
      gridApi.setRowData([]);
    }
  }, [market]);

  // Initialize grid state
  const onGridReady = (params) => {
    setGridApi(params.api);

    if (isValidTickers()) {
      params.api.setRowData(tickers);
    } else params.api.showLoadingOverlay();
  };

  const onFirstDataRendered = (params) => {
    params.api.hideOverlay();
  };

  return (
    <div className={classes.root}>
      {!gridApi || loading || tickers.length === 0 ? (
        <MultilineSkeleton lines={5} style={{ width: '100%', height: 20 }} />
      ) : (
        <CamStats timeframe={timeframe} futureMode={futureMode} />
      )}

      {gridApi && (
        <FiltersMenu
          gridApi={gridApi}
          screenerType={screenerType}
          timeframe={timeframe}
          market={market}
          tickersCount={tickers.length}
        />
      )}

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

          <AgGridColumn width={140} headerName='Exchange' field='exchange' cellRenderer={exchangeRenderer} />

          <AgGridColumn width={120} headerName='Price' field='price' filter='agNumberColumnFilter' />

          <AgGridColumn
            width={120}
            headerName='Nearest'
            valueGetter={(params) => nearestLevelGetter(params, timeframe, futureMode)}
          />

          <AgGridColumn
            width={160}
            headerName='Situation'
            valueGetter={(params) => situationGetter(params, timeframe, futureMode)}
            cellStyle={situationCellStyle}
          />

          {['h3', 'h4', 'h5', 'h6', 'l3', 'l4', 'l5', 'l6'].map((q) => (
            <AgGridColumn
              key={q}
              width={115}
              headerName={`${q.toUpperCase()} Distance`}
              valueFormatter={(params) => distanceFormatter(params)}
              valueGetter={(params) => distanceGetter(params, q, timeframe, futureMode)}
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
  screenerType: PropTypes.string.isRequired,
};

export default observer(CamTable);
