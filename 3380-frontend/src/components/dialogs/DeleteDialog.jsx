import React, { useMemo, useState } from 'react';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import ApiManager from '../../api/ApiManager';
import Utils from '../../util/Utils';

import ResultsDialog from './ResultsDialog';

function DeleteDialog({ isVisible, setIsVisible, table, fields, selectedRows }) {
  const [results, setResults] = useState(undefined);
  const [resultsIsVisible, setResultsIsVisible] = useState(false);

  const deleteRows = (rowParams) => {
    const params = { table, rowParams };
    return ApiManager.delete(params);
  };

  const onHide = () => {
    setIsVisible(false);
    setResults(undefined);
    setResultsIsVisible(false);
  };

  const handleDeleteClick = async () => {
    console.log('Delete Clicked!');
    const whereParams = Utils.getWhereParams(selectedRows, fields);
    const data = await deleteRows(whereParams);
    console.log(data);
    setResults(data);
    setResultsIsVisible(true);
  };

  const renderedTable = useMemo(() => {
    if (!isVisible) return null;
    const render = (
      <DataTable value={selectedRows} responsiveLayout="scroll">
        {fields.map((field) => (
          <Column field={field.name} header={field.name} key={field.name} />
        ))}
      </DataTable>
    );
    return render;
  }, [isVisible, fields, selectedRows]);

  const footer = (
    <div>
      <Button label="Cancel" icon="pi pi-times" className="p-button-secondary" onClick={onHide} />
      <Button
        label="Delete"
        icon="pi pi-trash"
        className="p-button-danger"
        onClick={handleDeleteClick}
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
        header={`Delete from "${table}" table`}
        footer={footer}
        visible={isVisible}
        style={{ width: '50vw' }}
        modal
        onHide={onHide}
      >
        {renderedTable}
        <div className="spacer" />
        <div>Are you sure you would like to delete the selected row(s)?</div>
      </Dialog>
      <ResultsDialog {...resultsDialogProps} />
    </>
  );
}

export default DeleteDialog;
