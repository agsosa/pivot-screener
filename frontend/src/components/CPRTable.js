import React, {useState, useEffect, useRef} from 'react';
import { useMst } from '../models/Root';
import { observer } from "mobx-react-lite"
import { Button, Spin, Result,Space, Badge } from 'antd';
import { autorun, reaction } from "mobx"
import "./AGGridOverrides.css";

import { AgGridColumn, AgGridReact } from 'ag-grid-react';  
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

const CPRTable = observer((props) => {
  let dispose;

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

    dispose = autorun(() => {
        if (tickers && tickers.length > 0) {
          params.api.hideOverlay();
          params.api.setRowData(tickers);
        }
    })
  };

  useEffect(() => {


    return () => {
      if (dispose) dispose();
    }
  }, [])

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

  const CPRWidthFormatter = (data) => {
    let value = data.getCPR(props.timeframe).width

    if (value) {
      let str = "";
      if (value > 0.5) str = "Sideways";
      if (value > 0.75) str = "Sideways+";
      if (value < 0.5) str = "Trending";
      if (value < 0.25) str = "Trending+"
  
      return value + "% " + str;
    }
  }

  return (
    <>
      <Space style={{padding:5}}><h1>Cryptocurrency / Binance Futures / Daily</h1> <Badge style={{backgroundColor:'#2196F3', marginBottom:7}} count={tickers.length} /></Space>

    <div className="ag-theme-material" style={{ height: 700, width: "100%" }}>
      {/*<Button onClick={test}>test</Button>*/}
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
            <AgGridColumn enableCellChangeFlash headerName="Symbol" field="symbol" sortable filter resizable></AgGridColumn>
            <AgGridColumn enableCellChangeFlash headerName="Price" field="price" sortable filter resizable></AgGridColumn>
            <AgGridColumn enableCellChangeFlash field="CPR Status" sortable filter resizable></AgGridColumn>
            <AgGridColumn enableCellChangeFlash field="Magnet Side" sortable filter resizable></AgGridColumn>
            <AgGridColumn enableCellChangeFlash headerName="CPR Width" 
            valueGetter={(params) => CPRWidthFormatter(params.data)}  
            sortable filter resizable></AgGridColumn>
            <AgGridColumn enableCellChangeFlash field="Distance Pivot" sortable filter resizable></AgGridColumn>
            <AgGridColumn enableCellChangeFlash field="Distance TC" sortable filter resizable></AgGridColumn>
            <AgGridColumn enableCellChangeFlash field="Distance BC" sortable filter resizable></AgGridColumn>
            <AgGridColumn enableCellChangeFlash field="Closest approximation" sortable filter resizable></AgGridColumn>
        </AgGridReact>
    </div>
    </>
  )
});

export default CPRTable;