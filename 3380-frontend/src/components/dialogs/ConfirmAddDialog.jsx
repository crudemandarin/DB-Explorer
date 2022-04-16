import React, { useMemo, useState } from 'react';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import ApiManager from '../../api/ApiManager';
import Utils from '../../util/Utils';

import ResultsDialog from './ResultsDialog';

function ConfirmAddDialog({ isVisible, setIsVisible, table, tableForm, fields }) {
  const [results, setResults] = useState(undefined);
  const [resultsIsVisible, setResultsIsVisible] = useState(false);

  const add = (formParams) => {
    console.log('HomeGroup.add invoked! formParams =', formParams);
    const params = { table, fields: formParams };
    return ApiManager.insert(params);
  };

  const onHide = () => {
    setIsVisible(false);
    setResults(undefined);
    setResultsIsVisible(false);
  };

  const handleAddClick = async () => {
    const formParams = Utils.getFormParams(tableForm);
    const data = await add(formParams);
    setResults(data);
    setResultsIsVisible(true);
  };

  const renderedTable = useMemo(() => {
    if (!isVisible) return null;
    const row = {};
    fields.forEach((field) => {
      row[field.name] = tableForm[field.name].value;
    });
    const rows = [row];
    const render = (
      <DataTable value={rows} responsiveLayout="scroll">
        {fields.map((field) => (
          <Column field={field.name} header={field.name} key={field.name} />
        ))}
      </DataTable>
    );
    return render;
  }, [isVisible, fields, tableForm]);

  const footer = (
    <div>
      <Button label="Cancel" icon="pi pi-times" className="p-button-secondary" onClick={onHide} />
      <Button label="Add" icon="pi pi-plus" onClick={handleAddClick} />
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
        header={`Add to ${table} table`}
        footer={footer}
        visible={isVisible}
        style={{ width: '50vw' }}
        modal
        onHide={onHide}
      >
        {renderedTable}
      </Dialog>
      <ResultsDialog {...resultsDialogProps} />
    </>
  );
}

export default ConfirmAddDialog;
