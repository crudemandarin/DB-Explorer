import React from 'react';

import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';

import '../App.css';
import TableFieldInput from '../components/TableFieldInput';
import ApiManager from '../api/ApiManager';

function ControlCard({ selectedTable, setSelectedTable, tables, fields, setQueryData }) {
  const handleTableInputChange = (e) => {
    console.log('ControlCard.handleTableInputChange Event =', e);
    setSelectedTable({ name: e.value });
  };

  const handleQueryClick = async () => {
    console.log('ControlCard.handleQueryClick Event');
    const params = { table: selectedTable.name };
    const data = await ApiManager.query(params);
    setQueryData(data);
  };

  return (
    <div className="card" style={{ width: '100%' }}>
      <div className="h600">Control Center</div>
      <div className="spacer" />
      <div className="p600">Table</div>
      <div className="spacer" />

      <AutoComplete
        dropdown
        value={selectedTable}
        suggestions={tables}
        field="name"
        onChange={handleTableInputChange}
      />

      <div className="spacer" />
      <div className="p600">Fields</div>
      <div className="spacer" />

      <div className="flex-wrap">
        {Array.isArray(fields) ? (
          fields.map((field) => <TableFieldInput field={field} key={field.name} />)
        ) : (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <></>
        )}
      </div>

      <div className="spacer" />
      <div className="p600">Actions</div>
      <div className="spacer" />

      <div>
        <Button
          label="Query"
          onClick={handleQueryClick}
          className="p-button-success"
          style={{ marginRight: '10px' }}
        />
        <Button label="Add" style={{ marginRight: '10px' }} />
        <Button label="Modify" className="p-button-warning" style={{ marginRight: '10px' }} />
        <Button label="Delete" className="p-button-danger" />
      </div>
    </div>
  );
}

export default ControlCard;
