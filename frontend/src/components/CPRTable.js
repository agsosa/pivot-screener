import React, {useState, useEffect} from 'react';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';  
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

export default function CPRTable(props) {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
      fetch('https://www.ag-grid.com/example-assets/row-data.json')
      .then(result => result.json())
       .then(rowData => setRowData(rowData))
  }, []);

  return (
    <div className="ag-theme-material" style={{ height: 700, width: "100%" }}>
        <AgGridReact
        animateRows
        containerStyle={{backgroundColor:'red'}}
        rowData={rowData}>
            <AgGridColumn enableCellChangeFlash field="Symbol" sortable filter></AgGridColumn>
            <AgGridColumn enableCellChangeFlash field="Last Price" sortable filter></AgGridColumn>
            <AgGridColumn enableCellChangeFlash field="CPR Status" sortable filter></AgGridColumn>
            <AgGridColumn enableCellChangeFlash field="Magnet Side" sortable filter></AgGridColumn>
            <AgGridColumn enableCellChangeFlash field="Distance Pivot" sortable filter></AgGridColumn>
            <AgGridColumn enableCellChangeFlash field="Distance TC" sortable filter></AgGridColumn>
            <AgGridColumn enableCellChangeFlash field="Distance BC" sortable filter></AgGridColumn>
            <AgGridColumn enableCellChangeFlash field="Closest approximation" sortable filter></AgGridColumn>
        </AgGridReact>
    </div>
  )
}