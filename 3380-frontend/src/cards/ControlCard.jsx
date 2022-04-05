import React, { useState, useEffect } from 'react';

import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';

import ControlFieldInput from '../components/ControlFieldInput';

import ApiManager from '../api/ApiManager';
import Utils from '../util/Utils';
import ConfirmAddDialog from '../components/ConfirmAddDialog';

function ControlCard({ table, setTable, tables, fields, onSelectQuery }) {
  const [tableOptions, setTableOptions] = useState([]); // Option[]
  const [tableValue, setTableValue] = useState(undefined); // Option
  const [tableForm, setTableForm] = useState({});
  const [resetFlag, setResetFlag] = useState(false);
  const [addIsVisible, setAddIsVisible] = useState(false);

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
      filteredTables = tables.filter((el) => el.toLowerCase().includes(tableValue.name));
    const filteredOptions = filteredTables.map((el) => ({ name: el }));
    setTableOptions(filteredOptions);
  };

  const handleTableInputChange = (e) => {
    let { value } = e;
    if (typeof value === 'string') value = value.toLowerCase().trim();
    if (typeof value !== 'string') value = value.name;
    setTableValue({ name: value });
    if (tables.includes(value)) setTable(value);
  };

  const handleQueryClick = async () => {
    const formParams = Utils.getFormParams(tableForm);
    console.log('ControlCard.handleQueryClick invoked. Form Params =', formParams);

    try {
      const params = { table, select: [], where: formParams };
      const rows = await ApiManager.select(params);
      const id = Utils.getNewQueryID();
      const result = { id, table, formParams, fields, rows };
      onSelectQuery(result);
    } catch (err) {
      console.error('ControlCard.handleQueryClick: select failed! Error =', err);
    }
  };

  const handleAddClick = () => {
    const [validatedForm, isValid] = Utils.validateForm(tableForm);
    setTableForm(validatedForm);
    if (isValid) setAddIsVisible(true);
  };

  const handleResetClick = () => {
    setTableForm(Utils.getEmptyForm(fields));
    setResetFlag(false);
  };

  const addDialogProps = { addIsVisible, setAddIsVisible, table, tableForm, fields };

  return (
    <div className="card" style={{ width: '100%' }}>
      <AutoComplete
        dropdown
        value={tableValue}
        suggestions={tableOptions}
        field="name"
        onChange={handleTableInputChange}
        completeMethod={searchTable}
      />

      <div className="spacer" />

      {table ? (
        <div className="p400" style={{ marginBottom: '15px' }}>
          Showing controls for <span className="p600">{table}</span> table
        </div>
      ) : (
        <div className="p400" style={{ margin: '0.5rem 0' }}>
          Welcome. Select a table from above.
        </div>
      )}

      {Array.isArray(fields) ? (
        <form className="flex-wrap">
          {fields.map((field) => {
            const props = { name: field.name, tableForm, setTableForm, setResetFlag };
            return <ControlFieldInput {...props} key={field.name} />;
          })}
        </form>
      ) : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <></>
      )}

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
          label="Add"
          onClick={handleAddClick}
          style={{ marginRight: '10px' }}
          disabled={!table}
        />
        <Button
          label="Reset"
          onClick={handleResetClick}
          className="p-button-secondary"
          style={{ marginRight: '10px' }}
          disabled={!resetFlag}
        />
      </div>

      <ConfirmAddDialog {...addDialogProps} />
    </div>
  );
}

export default ControlCard;
