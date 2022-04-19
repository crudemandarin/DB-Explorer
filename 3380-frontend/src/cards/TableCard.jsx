import React, { useState, useRef, useMemo } from 'react';

import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import '../styles/TableCard.css';
import DeleteDialog from '../components/dialogs/DeleteDialog';
import ModifyDialog from '../components/dialogs/ModifyDialog';
import ViewSQLDialog from '../components/dialogs/ViewSQLDialog';

function TableCard({ result, onRemove }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [modifyIsVisible, setModifyIsVisible] = useState(false);
  const [deleteIsVisible, setDeleteIsVisible] = useState(false);
  const [viewSQLIsVisible, setViewSQLIsVisible] = useState(false);

  const dt = useRef(null);

  const onRemoveClick = () => {
    onRemove(result.id);
  };

  const onExportClick = () => {
    dt.current.exportCSV();
  };

  const handleModifyOnClick = () => {
    console.log('Modify Clicked. Selected Rows =', selectedRows);
    setModifyIsVisible(true);
  };

  const handleDeleteOnClick = () => {
    console.log('Delete Clicked. Selected Rows =', selectedRows);
    setDeleteIsVisible(true);
  };

  const handleViewSQLClick = () => {
    console.log('Handle View SQL Click');
    setViewSQLIsVisible(true);
  }

  const title = useMemo(() => {
    let output = `Table ${result.table}`;
    if (Array.isArray(result.formParams) && result.formParams.length > 0) {
      let suffix = '';
      result.formParams.forEach((param) => {
        suffix += `, ${param.name}=${param.value}`;
      });
      output += suffix;
    }
    return output;
  }, [result]);

  const renderedColumns = useMemo(() => {
    if (!(Array.isArray(result.fields) && result.fields.length !== 0)) return null;
    return result.fields.map((field) => (
      <Column field={field.name} header={field.name} key={field.name} />
    ));
  }, [result]);

  const modifyDialogProps = {
    isVisible: modifyIsVisible,
    setIsVisible: setModifyIsVisible,
    table: result.table,
    fields: result.fields,
    selectedRows,
  };

  const deleteDialogProps = {
    isVisible: deleteIsVisible,
    setIsVisible: setDeleteIsVisible,
    table: result.table,
    fields: result.fields,
    selectedRows,
  };

  const viewSQLDialogProps = {
    isVisible: viewSQLIsVisible,
    setIsVisible: setViewSQLIsVisible,
    desc: title,
    SQL: result.SQL
  }

  return (
    <div className="card" style={{ width: '100%', maxHeight: '500px', marginTop: '1rem' }}>
      <div className="flex space-between">
        <div className="truncated" style={{ maxWidth: '80%' }}>
          <span className="h600">
            Query {result.id} {' | '}
          </span>
          <span className="p400">{title}</span>
        </div>

        <Button
          onClick={onRemoveClick}
          icon="pi pi-times"
          className="p-button-rounded p-button-secondary p-button-outlined"
        />
      </div>

      <div className='p400'>Requested by {result.requestedBy}</div>
      <div className='p400'>{result.rows.length} results found</div>

      <div className="spacer" />

      <div>
        <Button
          onClick={handleModifyOnClick}
          label="Modify"
          disabled={!selectedRows.length}
          className="p-button-secondary"
          style={{ marginRight: '10px' }}
        />
        <Button
          onClick={handleDeleteOnClick}
          label="Delete"
          disabled={!selectedRows.length}
          className="p-button-secondary"
          style={{ marginRight: '10px' }}
        />
        <Button
          onClick={handleViewSQLClick}
          label="View SQL"
          className="p-button-secondary"
          style={{ marginRight: '10px' }}
        />
        <Button onClick={onExportClick} label="Export" />
      </div>

      <div className="spacer" />

      <DataTable
        ref={dt}
        value={result.rows}
        responsiveLayout="scroll"
        selection={selectedRows}
        onSelectionChange={(e) => setSelectedRows(e.value)}
        emptyMessage="No records found."
      >
        <Column selectionMode="multiple" headerStyle={{ width: '2rem' }} />
        {renderedColumns}
      </DataTable>

      <ModifyDialog {...modifyDialogProps} />
      <DeleteDialog {...deleteDialogProps} />
      <ViewSQLDialog {...viewSQLDialogProps} />
    </div>
  );
}

export default TableCard;
