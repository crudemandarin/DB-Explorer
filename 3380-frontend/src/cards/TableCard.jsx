import React, { useRef, useMemo } from 'react';

import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import '../styles/TableCard.css';

function TableCard({ result, onRemove }) {
  const dt = useRef(null);

  const onRemoveClick = () => {
    onRemove(result.id);
  };

  const onExportClick = () => {
    dt.current.exportCSV();
  };

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

  const fieldsIsValid = Array.isArray(result.fields) && result.fields.length !== 0;

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

      <div>
        <Button label="Modify" className="p-button-warning" style={{ marginRight: '10px' }} />
        <Button label="Delete" className="p-button-danger" style={{ marginRight: '10px' }} />
        <Button onClick={onExportClick} label="Export" />
      </div>

      <div className="spacer" />

      <DataTable ref={dt} value={result.rows} responsiveLayout="scroll">
        {fieldsIsValid ? (
          result.fields.map((field) => (
            <Column field={field.name} header={field.name} key={field.name} />
          ))
        ) : (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <></>
        )}
      </DataTable>
    </div>
  );
}

export default TableCard;
