import React, { useState, useEffect } from 'react';

import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';

import Utils from '../util/Utils';

import ControlFieldInput from '../components/ControlFieldInput';

function QueryControlCard({ table, setTable, tables, fields, query }) {
  const [tableOptions, setTableOptions] = useState([]); // Option[]
  const [tableValue, setTableValue] = useState(undefined); // Option
  const [tableForm, setTableForm] = useState({});
  const [resetFlag, setResetFlag] = useState(false);

  useEffect(() => {
    const options = tables.map((el) => ({ name: el }));
    setTableOptions(options);
  }, [tables]);

  useEffect(() => {
    setTableForm(Utils.getEmptyForm(fields));
    setResetFlag(false);
  }, [fields, setTableForm, setResetFlag]);

  const searchTable = () => {
    let filteredTables = [...tables];
    if (tableValue && tableValue.name)
      filteredTables = tables.filter((el) => el.toLowerCase().includes(tableValue.name.trim().toLowerCase()));
    const filteredOptions = filteredTables.map((el) => ({ name: el }));
    setTableOptions(filteredOptions);
  };

  const handleTableInputChange = (e) => {
    let { value } = e;
    if (typeof value !== 'string' && 'name' in value) value = value.name;
    setTableValue({ name: value });
    if (tables.includes(value)) setTable(value);
  };

  const handleQueryClick = async () => {
    const formParams = Utils.getFormParams(tableForm);
    query(formParams);
  };

  const handleResetClick = () => {
    setTableForm(Utils.getEmptyForm(fields));
    setResetFlag(false);
  };

  const renderStatusMessage = () => {
    if (table) return (
      <div className="p400">
          Showing controls for <span className="p600">{table}</span> table
        </div>
    )
    return (
      <div className="p400">
        Welcome. Select a table from above.
      </div>
    )
  };

  const renderControlFieldForm = () => {
    if (!Array.isArray(fields)) return null;
    return (
      <>
        <div className="spacer" />
        <div className="flex-wrap">
          {fields.map((field) => {
            const props = { name: field.name, tableForm, setTableForm, setResetFlag };
            return <ControlFieldInput {...props} key={field.name} />;
          })}
        </div>
      </>
    );
  };

  return (
    <div className="card" style={{ width: '100%' }}>
      <div className='h600'>Query Control</div>

      <div className="spacer" />

      <div className='flex-wrap' style={{ alignItems: 'center' }}>
        <AutoComplete
          dropdown
          value={tableValue}
          suggestions={tableOptions}
          field="name"
          onChange={handleTableInputChange}
          completeMethod={searchTable}
        />

        <div className="spacer" />

        {renderStatusMessage()}
      </div>

      {renderControlFieldForm()}

      <div className="spacer" />

      <div>
        <Button
          label="Query"
          onClick={handleQueryClick}
          disabled={!table}
          className="p-button-success"
          style={{ marginRight: '10px' }}
        />
        <Button
          label="Reset"
          onClick={handleResetClick}
          className="p-button-secondary"
          style={{ marginRight: '10px' }}
          disabled={!resetFlag}
        />
      </div>
    </div>
  );
}

export default QueryControlCard;
