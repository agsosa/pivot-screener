import React, {useState, useEffect, useRef} from 'react';
import { useMst } from '../models/Root';
import { observer } from "mobx-react-lite"
import { Button, Spin, Result,Space, Badge, Alert, Skeleton } from 'antd';
import { autorun, reaction } from "mobx"
import { capitalizeFirstLetter } from '../utils/Helpers'

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

  const CPRWidthGetter = (data) => {
    const value = data.getCPR(props.timeframe).width

    if (value) return value;
  }

  const CPRWidthRenderer = (value) => {
    if (value) {
      let str = "";
      let font = "";
    
      if (value >= 0.5) { font="<font color='#DF4294'>"; str = "Sideways</font>"; }
      if (value >= 0.75) { font="<font color='#DF4294'>"; str = "Sideways+</font>"; }
      if (value <= 0.5) { font="<font color='#2196F3'>"; str = "Trending</font>"; }
      if (value <= 0.25) { font="<font color='#2196F3'>"; str = "Trending+</font>"; }
  
      return font + value + "% " + str;
    }
  }

  const CPRStatusGetter = (data) => {
    const value = data.getIsTestedCPR(props.timeframe)

    if (value !== undefined) return value ? "Tested" : "Untested";
  }

  const cprStatusCellRenderer = (params) => {
    if (params.value) {
      return params.value === "Tested" ? "✔️ Tested" : "🧲 Untested <sup><font color='gray'>25%</font></sup>";
    }  
  }

  const cprStatusCellStyle = (params) => {
    if (params && params.value) {
      const extra = { fontSize: '15px' }
      return params.value==='Untested' ? { ...extra, backgroundColor: 'rgba(255, 0, 0, 0.1)'} : { ...extra, backgroundColor: 'rgba(0, 255, 0, 0.1)'}
    }
  }

  const MagnetSideGetter = (data) => {
    const tested = data.getIsTestedCPR(props.timeframe);
    if (tested !== undefined && tested) return "None";

    const isAboveCPR = data.getIsAboveCPR(props.timeframe);
    if (isAboveCPR !== undefined) return (isAboveCPR ? "Short" : "Long");
  }

  const MagnetSideCellStyle = (params) => {
    if (params && params.value) {
      const extra = { fontSize:'15px' }
      return params.value==='Short' ? { ...extra, color: 'rgba(255, 0, 0, 1)'} : params.value==='Long' ? { ...extra, color: '#4BAA4E'} : { ...extra, color:'#858585'}
    }
  } 

  const pivotDistanceGetter = (data) => {
    const dist = data.getCPRDistancePct(props.timeframe);
    if (dist && dist.p) {
      return dist.p
    }
  }

  const pivotDistanceFormatter = (value) => {
    if (value) return value.toFixed(2)+"%";
  }

  const tcDistanceGetter = (data) => {
    const dist = data.getCPRDistancePct(props.timeframe);
    if (dist && dist.p) {
      return dist.tc
    }
  }

  const tcDistanceFormatter = (value) => {
    if (value) return value.toFixed(2)+"%";
  }

  const bcDistanceGetter = (data) => {
    const dist = data.getCPRDistancePct(props.timeframe);
    if (dist && dist.p) {
      return dist.bc
    }
  }

  const bcDistanceFormatter = (value) => {
    if (value) return value.toFixed(2)+"%";
  }

  const symbolRenderer = params => {
    return "<font size=3>" + params.value.replace("USDT", "</font> <font color='gray'>USDT</font>");
  }

  return (
    <>
      <Space style={{padding:5, }}><h1>{capitalizeFirstLetter(props.market)} / {capitalizeFirstLetter(props.timeframe)}</h1> <Badge style={{backgroundColor:'#2196F3', marginBottom:7}} count={tickers.length} /></Space>

    <div className="ag-theme-material" style={{ height: 700, width: "100%" }}>
      {/*<Button onClick={test}>test</Button>*/}
        <AgGridReact
        onGridReady={onGridReady}
        animateRows
        immutableData={true}
        tooltipShowDelay={0}
        frameworkComponents={{
          customNoRowsOverlay: CustomNoRowsOverlay,
          customLoadingOverlay: CustomLoadingOverlay,
        }}
        loadingOverlayComponent={'customLoadingOverlay'}
        noRowsOverlayComponent={'customNoRowsOverlay'}
        rowData={null}
        enableBrowserTooltips={true}
        getRowNodeId={(data) => {
          return data.symbol;
        }}
        >
            <AgGridColumn enableCellChangeFlash width={130} headerName="Symbol" field="symbol" cellRenderer={symbolRenderer} sortable filter resizable></AgGridColumn>

            <AgGridColumn enableCellChangeFlash headerName="Exchange" field="exchange" cellRenderer={symbolRenderer} sortable filter resizable></AgGridColumn>

            <AgGridColumn enableCellChangeFlash headerName="Price" field="price" sortable filter="agNumberColumnFilter" resizable></AgGridColumn>

            <AgGridColumn enableCellChangeFlash cellStyle={cprStatusCellStyle} cellRenderer={cprStatusCellRenderer} headerName="CPR Status" valueGetter={(params) => CPRStatusGetter(params.data)} sortable filter resizable></AgGridColumn>

            <AgGridColumn enableCellChangeFlash headerName="Magnet Side" valueGetter={(params) => MagnetSideGetter(params.data)} cellStyle={MagnetSideCellStyle} sortable filter resizable></AgGridColumn>
            
            <AgGridColumn enableCellChangeFlash headerName="Distance Pivot" 
            valueFormatter={(params) => pivotDistanceFormatter(params.value)} 
            valueGetter={(params) => pivotDistanceGetter(params.data)} 
            sortable filter="agNumberColumnFilter" resizable></AgGridColumn>

            <AgGridColumn enableCellChangeFlash headerName="Distance TC"
            valueFormatter={(params) => tcDistanceFormatter(params.value)} 
            valueGetter={(params) => tcDistanceGetter(params.data)} 
            sortable filter="agNumberColumnFilter" resizable></AgGridColumn>

            <AgGridColumn enableCellChangeFlash headerName="Distance BC"
            valueFormatter={(params) => bcDistanceFormatter(params.value)} 
            valueGetter={(params) => bcDistanceGetter(params.data)} 
            sortable filter="agNumberColumnFilter" resizable></AgGridColumn>

          <AgGridColumn enableCellChangeFlash headerName="CPR Width"
              cellRenderer={(params) => CPRWidthRenderer(params.value)} 
              valueGetter={(params) => CPRWidthGetter(params.data)}  
              sortable filter resizable></AgGridColumn>
          </AgGridReact>
    </div>

      { !tickers || tickers.length === 0 ? <Skeleton /> :
        <>
          <p style={{marginTop:20, paddingTop:10}}>● The percentage shown above the <i>Untested</i> label is the closest approximation to the CPR. <i>Example:</i> Untested <sup>0.1%</sup> means that there was a candle that came within 0.1% of the CPR.
          <br/>● The Sideways/Trending label on the CPR Width column shouldn't be taken seriously, the parameters need to be adjusted.
        </p>
        </> 
      }
    </>
  )
});

export default CPRTable;