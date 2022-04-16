import React, { useMemo, useState } from 'react';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

// import ApiManager from '../../api/ApiManager';
// import Utils from '../../util/Utils';

import ResultsDialog from './ResultsDialog';

function ModifyDialog({ isVisible, setIsVisible, table, fields, selectedRows }) {
  const [results, setResults] = useState(undefined);
  const [resultsIsVisible, setResultsIsVisible] = useState(false);

  //   const deleteRows = (formParams) => {
  //     console.log('HomeGroup.add invoked! formParams =', formParams);
  //     const params = { table, fields: formParams };
  //     return ApiManager.delete(params);
  //   };

  const onHide = () => {
    setIsVisible(false);
    setResults(undefined);
    setResultsIsVisible(false);
  };

  const handleDeleteClick = async () => {
    console.log('Delete Clicked!');
    onHide();
    // const data = await deleteRows();
    // setResults(data);
    // setResultsIsVisible(true);
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
        label="Modify"
        icon="pi pi-cog"
        className="p-button-warning"
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
        header={`Modify ${table} table`}
        footer={footer}
        visible={isVisible}
        style={{ width: '50vw' }}
        modal
        onHide={onHide}
      >
        {renderedTable}
        <div className="spacer" />
        <div>Are you sure you would like to modify the selected row(s)?</div>
      </Dialog>
      <ResultsDialog {...resultsDialogProps} />
    </>
  );
}

export default ModifyDialog;
