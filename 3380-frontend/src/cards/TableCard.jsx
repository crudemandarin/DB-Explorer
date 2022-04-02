import React from 'react';

import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function TableCard({ result, fields }) {
  return (
    <div className="card" style={{ width: '100%', marginTop: '1rem' }}>
      <div>
        <span className='h600'>Query {result.id}</span>
        <span className='h400'>{" | "}{result.table}</span>
      </div>
      <div className='spacer' />

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
