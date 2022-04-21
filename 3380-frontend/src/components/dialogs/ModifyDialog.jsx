import React, { useState, useEffect } from 'react';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import ResultsDialog from './ResultsDialog';

import ApiManager from '../../api/ApiManager';
import Utils from '../../util/Utils';

import '../../styles/ModifyDialog.css';

class ModifyDialogForm {
  static getEmptyForm(selectedRows) {
    return selectedRows.reduce(
      (prev, row, index) => {
        const fields = [];
        Object.keys(row).forEach(
          key => {
            if (!Utils.getProtectedRows().includes(key)) {
              fields.push({
                key,
                value: row[key],
                prevValue: row[key]
              })
            };
          }
        )
        return { ...prev, [index]: fields };
      }, {}
    );
  }
}

function ModifyDialog({ isVisible, setIsVisible, table, fields, selectedRows }) {
  const [form, setForm] = useState({});
  const [results, setResults] = useState(undefined);
  const [resultsIsVisible, setResultsIsVisible] = useState(false);

  useEffect(() => {
    console.log('form reset')
    setForm(ModifyDialogForm.getEmptyForm(selectedRows));
  }, [selectedRows]);

  const modifyRows = (formParams) => {
    console.log('ModifyDialog.modifyRows invoked! formParams =', formParams);
    const params = { table, fields: formParams };
    return ApiManager.update(params);
  };

  const onHide = () => {
    setIsVisible(false);
    setResults(undefined);
    setResultsIsVisible(false);
  };

  const handleModifyClick = async () => {
    console.log('Modify Clicked!');
    const rowParams = Object.keys(form).map(
      rowIndex => {
        const update = form[rowIndex].map(field => ({ name: field.key, value: field.value }));
        const where = form[rowIndex].map(field => ({ name: field.key, value: field.oldValue }));
        return { update, where };
      }
    )
    const params = { rowParams };
    const data = await modifyRows(params);
    modifyRows(params);
    setResults(data);
    setResultsIsVisible(true);
  };

  const onFormTextChange = (rowIndex, fieldIndex, value) => {
    console.log(value, form[rowIndex]);
    const formData = {...form};
    formData[rowIndex][fieldIndex].value = value;
    setForm(formData);
  }

  const renderTable = () => {
    if (!isVisible) return null;

    const filteredFields = fields.filter(field => !Utils.getProtectedRows().includes(field.name));

    const renderHeaderRow = () => (
      <tr>
        {filteredFields.map(field => <th>{field.name}</th>)}
      </tr>
    );

    const renderRow = (rowIndex) => (
        <tr>
          {
            form[rowIndex].map(
              (field, fieldIndex) => (
                <td key={`${field.key}-modify-row`}>
                  <InputText
                    id={`${field.key}-modify-input`}
                    placeholder={field.key}
                    value={field.value}
                    className='p-inputtext-sm'
                    onChange={e => onFormTextChange(rowIndex, fieldIndex, e.target.value)}
                  />
                </td>
              )
            )
          }
        </tr>
    );
    
    const render = (
      <table>
        <thead>
          {renderHeaderRow()}
        </thead>
        <tbody>
          {Object.keys(form).map((index) => renderRow(index))}
        </tbody>
      </table>
    );

    return render;
  };

  const footer = (
    <div>
      <Button label="Cancel" icon="pi pi-times" className="p-button-secondary" onClick={onHide} />
      <Button
        label="Modify"
        icon="pi pi-cog"
        className="p-button-warning"
        onClick={handleModifyClick}
      />
    </div>
  );

  const resultsDialogProps = {
    isVisible: resultsIsVisible,
    setIsVisible: setResultsIsVisible,
    setParentIsVisible: setIsVisible,
    results,
    table,
  };

  return (
    <>
      <Dialog
        header={`Modify "${table}" table`}
        footer={footer}
        visible={isVisible}
        style={{ width: '50vw' }}
        modal
        onHide={onHide}
      >
        <div style={{ width: '100%', overflow: 'auto' }}>
          {renderTable()}
        </div>
        <div className="spacer" />
        <div>Are you sure you would like to modify the selected row(s)?</div>
      </Dialog>
      <ResultsDialog {...resultsDialogProps} />
    </>
  );
}

export default ModifyDialog;
