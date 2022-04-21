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
                value: row[key] || '',
                prevValue: row[key] || '',
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
  const [result, setResult] = useState(undefined);
  const [resultIsVisible, setResultIsVisible] = useState(false);

  useEffect(() => {
    console.log('form reset')
    setForm(ModifyDialogForm.getEmptyForm(selectedRows));
  }, [selectedRows]);

  const modifyRows = (rowParams) => {
    console.log('ModifyDialog.modifyRows invoked! rowParams =', rowParams);
    const params = { table, rowParams };
    return ApiManager.update(params);
  };

  const onHide = () => {
    setIsVisible(false);
    setResult(undefined);
    setResultIsVisible(false);
  };

  const handleModifyClick = async () => {
    console.log('Modify Clicked! form =', form);
    const rowParams = Object.keys(form).reduce(
      (prevParam, rowIndex) => {
        const update = form[rowIndex].reduce(
          (prev, field) => {
            if (field.prevValue === field.value) return prev;
            return [...prev, { name: field.key, value: field.value }];
          }, []
        );

        const where = Utils.getWhereParams([selectedRows[rowIndex]], fields)[0];

        if (!update.length || !where.length) return prevParam;

        return [...prevParam, { update, where }];
      }, []
    );

    if (rowParams.length) {
      const data = await modifyRows(rowParams);
      console.log(data)
      setResult(data);
      setResultIsVisible(true);
    } else onHide();
  };

  const onFormTextChange = (rowIndex, fieldIndex, value) => {
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
    isVisible: resultIsVisible,
    setIsVisible: setResultIsVisible,
    setParentIsVisible: setIsVisible,
    data: result,
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
