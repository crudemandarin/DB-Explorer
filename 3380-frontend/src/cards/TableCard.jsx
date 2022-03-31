import React from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function TableCard({ data, fields }) {
  return (
    <div className="card" style={{ width: '100%' }}>
      <DataTable value={data}>
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
