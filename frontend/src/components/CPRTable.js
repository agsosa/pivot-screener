import React, {useState, useEffect, useRef} from 'react';
import { useMst } from '../models/Root';
import { observer } from "mobx-react-lite"
import { Button } from 'antd';
import { autorun, reaction } from "mobx"

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
  };

  const clearData = () => {
    gridApi.setRowData([]);
  };


  autorun(() => {
    if (gridApi) {
      console.log("autorun: "+tickers[0].price)
      gridApi.setRowData(tickers);
    }
  })


  /*reaction(
    () => tickers.slice(),
    newstate => {
      console.log("reaction: "+JSON.stringify(newstate));
    }
  )*/

  function test() {
    console.log("hola");
    //addItems(0);
      // refresh the grid
      //gridApi.setRowData(tickers);
    //gridApi.refreshView();
    gridApi.showLoadingOverlay()
  }

  return (
    <div className="ag-theme-material" style={{ height: 700, width: "100%" }}>
      <Button onClick={test}>test</Button>
        <AgGridReact
        onGridReady={onGridReady}
        animateRows
        immutableData={true}
        getRowNodeId={(data) => {
          return data.symbol;
        }}
        rowData={tickers}>
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