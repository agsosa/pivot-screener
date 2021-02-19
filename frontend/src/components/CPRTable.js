import React, {useState, useEffect, useRef} from 'react';
import { useMst } from '../models/Root';
import { observer } from "mobx-react-lite"
import { Button, Spin, Result } from 'antd';
import { autorun, reaction } from "mobx"
import "./AGGridOverrides.css";

import { AgGridColumn, AgGridReact } from 'ag-grid-react';  
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

const CPRTable = observer((props) => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const { tickers } = useMst(store => ({
    tickers: store.tickers,
  }));

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);

    if (tickers && tickers.length > 0) {
      params.api.setRowData(tickers);
      params.api.hideOverlay();
    }
    else params.api.showLoadingOverlay();

    autorun(() => {
        if (tickers && tickers.length > 0) {
          params.api.hideOverlay();
          params.api.setRowData(tickers);
        }
    })
  };


  function test() {
    gridApi.showNoRowsOverlay()
  }

  function CustomLoadingOverlay(props) {
    return (
        <Spin tip="Loading..."/>
    )
  }

  function CustomNoRowsOverlay(props) {
    return (
      <Result
        status="warning"
        title="No data found. Please try reloading the page."
      />
    )
  }

  return (
    <div className="ag-theme-material" style={{ height: 700, width: "100%" }}>
      <Button onClick={test}>test</Button>
        <AgGridReact
        onGridReady={onGridReady}
        animateRows
        immutableData={true}
        frameworkComponents={{
          customNoRowsOverlay: CustomNoRowsOverlay,
          customLoadingOverlay: CustomLoadingOverlay,
        }}
        loadingOverlayComponent={'customLoadingOverlay'}
        noRowsOverlayComponent={'customNoRowsOverlay'}
        rowData={null}
        getRowNodeId={(data) => {
          return data.symbol;
        }}
        >
            <AgGridColumn enableCellChangeFlash field="symbol" sortable filter></AgGridColumn>
            <AgGridColumn enableCellChangeFlash field="price" sortable filter></AgGridColumn>
            <AgGridColumn enableCellChangeFlash field="CPR Status" sortable filter></AgGridColumn>
            <AgGridColumn enableCellChangeFlash field="Magnet Side" sortable filter></AgGridColumn>
            <AgGridColumn enableCellChangeFlash field="Distance Pivot" sortable filter></AgGridColumn>
            <AgGridColumn enableCellChangeFlash field="Distance TC" sortable filter></AgGridColumn>
            <AgGridColumn enableCellChangeFlash field="Distance BC" sortable filter></AgGridColumn>
            <AgGridColumn enableCellChangeFlash field="Closest approximation" sortable filter></AgGridColumn>
        </AgGridReact>
    </div>
  )
});

export default CPRTable;