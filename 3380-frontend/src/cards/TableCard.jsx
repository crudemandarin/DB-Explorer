import React, { useMemo } from 'react';

import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function TableCard({ result, fields, onRemove }) {
  
  const onRemoveClick = () => {
    onRemove(result.id);
  }

  const title = useMemo(() => {
    let output = `Table ${result.table}`;
    if (Array.isArray(result.formParams) && result.formParams.length > 0) {
      let suffix = '';
      result.formParams.forEach(param => {
        suffix += `, ${param.name}=${param.value}`
      })
      output += suffix;
    }
    return output;
  }, [result]);

  return (
    <div className="card" style={{ width: '100%', marginTop: '1rem' }}>

      <div className='flex space-between'>
        <div className='truncated' style={{ maxWidth: '80%' }}>
          <span className='h600'>Query {result.id} {" | "}</span>
          <span className='p400'>{title}</span>
        </div>

        <Button onClick={onRemoveClick} icon="pi pi-times" className="p-button-rounded p-button-secondary p-button-outlined" />
      </div>

      <div>
        <Button label="Modify" className="p-button-warning" style={{ marginRight: '10px' }} />
        <Button label="Delete" className="p-button-danger" style={{ marginRight: '10px' }} />
        <Button label="Export" />
      </div>

      <div className="spacer" />

      <DataTable value={result.rows}>
        {Array.isArray(fields) ? (
          fields.map((field) => <Column field={field.name} header={field.name} key={field.name} />)
        ) : (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <></>
        )}
      </DataTable>
    </div>
  );
}

export default TableCard;
