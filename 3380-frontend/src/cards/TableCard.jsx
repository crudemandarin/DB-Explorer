import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';

import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import '../styles/TableCard.css';
import DeleteDialog from '../components/dialogs/DeleteDialog';
import ModifyDialog from '../components/dialogs/ModifyDialog';
import ViewSQLDialog from '../components/dialogs/ViewSQLDialog';
import ApiManager from '../api/ApiManager';

function TableCard({ result, onRemove }) {
  const { id, table, params, fields, requestedBy } = result;

  const [rows, setRows] = useState([]);
  const [SQL, setSQL] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [modifyIsVisible, setModifyIsVisible] = useState(false);
  const [deleteIsVisible, setDeleteIsVisible] = useState(false);
  const [viewSQLIsVisible, setViewSQLIsVisible] = useState(false);

  const dt = useRef(null);

  const getData = useCallback(
    async () => {
      ApiManager.select(params)
      .then(data => {
        const [rowData, SQLData] = data;
        setRows(rowData);
        setSQL(SQLData);
      })
      .catch(() => {});
    }, [params]
  );

  useEffect(() => {
    getData();
  }, [getData]);

  const onDialogComplete = () => {
    getData();
    setSelectedRows([]);
  }

  const onRemoveClick = () => {
    onRemove(id);
  };

  const onExportClick = () => {
    dt.current.exportCSV();
  };

  const handleModifyOnClick = () => {
    setModifyIsVisible(true);
  };

  const handleDeleteOnClick = () => {
    setDeleteIsVisible(true);
  };

  const handleViewSQLClick = () => {
    setViewSQLIsVisible(true);
  }

  const title = useMemo(() => {
    let output = `Table ${table}`;
    if (Array.isArray(params.where) && params.where.length > 0) {
      let suffix = '';
      params.where.forEach((param) => {
        suffix += `, ${param.name}=${param.value}`;
      });
      output += suffix;
    }
    return output;
  }, [table, params]);

  const renderedColumns = useMemo(() => {
    if (!(Array.isArray(fields) && fields.length !== 0)) return null;
    return fields.map((field) => (
      <Column field={field.name} header={field.name} key={field.name} />
    ));
  }, [fields]);

  const modifyDialogProps = {
    isVisible: modifyIsVisible,
    setIsVisible: setModifyIsVisible,
    table,
    fields,
    selectedRows,
    onComplete: onDialogComplete,
  };

  const deleteDialogProps = {
    isVisible: deleteIsVisible,
    setIsVisible: setDeleteIsVisible,
    table,
    fields,
    selectedRows,
    onComplete: onDialogComplete,
  };

  const viewSQLDialogProps = {
    isVisible: viewSQLIsVisible,
    setIsVisible: setViewSQLIsVisible,
    desc: title,
    SQL
  }

  return (
    <div className="card" style={{ width: '100%', maxHeight: '500px', marginTop: '1rem' }}>
      <div className="flex space-between">
        <div className="truncated" style={{ maxWidth: '80%' }}>
          <span className="h600">
            Query {id} {' | '}
          </span>
          <span className="p400">{title}</span>
        </div>

        <Button
          onClick={onRemoveClick}
          icon="pi pi-times"
          className="p-button-rounded p-button-secondary p-button-outlined"
        />
      </div>

      <div className='p400'>Requested by {requestedBy}</div>
      <div className='p400'>{rows.length} results found</div>

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
        <Button onClick={onExportClick} label="Export" style={{ marginRight: '10px' }} />
        <Button
          onClick={getData}
          label="Refresh"
          className="p-button-secondary"
        />
      </div>

      <div className="spacer" />

      <DataTable
        ref={dt}
        value={rows}
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
