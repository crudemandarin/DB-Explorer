import React, { useState, useEffect } from 'react';

import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';

import Utils from '../util/Utils';

import ControlFieldInput from '../components/ControlFieldInput';
import { useGlobal } from '../util/GlobalContext';

function QueryControlCard({ table, setTable, fields, onNewResult }) {
  const { user, tables } = useGlobal();
  const [tableOptions, setTableOptions] = useState([]); // Option[]
  const [tableValue, setTableValue] = useState(undefined); // Option
  const [tableForm, setTableForm] = useState({});
  const [resetFlag, setResetFlag] = useState(false);

  useEffect(() => {
    const options = tables.map((el) => ({ name: el }));
    setTableOptions(options);
  }, [tables]);

  useEffect(() => {
    setTableForm(Utils.getEmptyForm(table, fields));
    setResetFlag(false);
  }, [table, fields, setTableForm, setResetFlag]);

  const query = async (formParams) => {
    console.log('HomeGroup.query invoked. Form Params =', formParams);
    const id = Utils.getNewID();
    const requestedBy = `${user.FirstName} ${user.LastName}`;
    const params = { userId: user.ID, table, select: [], where: formParams };
    const result = { id, requestedBy, table, params, fields, type: 'table' };
    onNewResult(result);
  };

  const searchTable = () => {
    let filteredTables = [...tables];
    if (tableValue && tableValue.name)
      filteredTables = tables.filter((el) =>
        el.toLowerCase().includes(tableValue.name.trim().toLowerCase())
      );
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
    const [validatedForm, isValid] = Utils.validateForm(tableForm, 'query');
    setTableForm(validatedForm);
    if (isValid) {
      const formParams = Utils.getFieldsParam(tableForm);
      query(formParams);
    }
  };

  const handleResetClick = () => {
    setTableForm(Utils.getEmptyForm(table, fields));
    setResetFlag(false);
  };

  const renderStatusMessage = () => {
    if (table)
      return (
        <div className="p400">
          Showing controls for <span className="p600">{table}</span> table
        </div>
      );
    return <div className="p400">Welcome. Select a table to query.</div>;
  };

  const renderControlFieldForm = () => {
    if (!Array.isArray(fields) || !fields.length) return null;
    return (
      <>
        <div className="flex-wrap">
          {fields.map((field) => {
            const props = { name: field.name, tableForm, setTableForm, setResetFlag };
            return <ControlFieldInput {...props} key={field.name} />;
          })}
        </div>
        <div className="spacer" />
      </>
    );
  };

  return (
    <div className="card" style={{ width: '100%' }}>
      <div className="flex-wrap" style={{ alignItems: 'center' }}>
        <AutoComplete
          dropdown
          className="p-inputtext-sm"
          value={tableValue}
          suggestions={tableOptions}
          field="name"
          onChange={handleTableInputChange}
          completeMethod={searchTable}
          placeholder="Search for a table"
        />

        <div className="spacer" />

        {renderStatusMessage()}
      </div>

      <div className="spacer" />

      {renderControlFieldForm()}

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
