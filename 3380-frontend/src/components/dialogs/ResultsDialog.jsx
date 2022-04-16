import React, { useMemo } from 'react';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

function ResultsDialog({ isVisible, setIsVisible, setParentIsVisible, results, table }) {
  const onHide = () => {
    setIsVisible(false);
    setParentIsVisible(false);
  };

  const footer = (
    <div>
      <Button label="Close" icon="pi pi-times" className="p-button-secondary" onClick={onHide} />
    </div>
  );

  const [header, body] = useMemo(() => {
    if (!isVisible || !results) return [null, null];

    let headerText = '';
    let bodyJsx = null;

    if ('code' in results) {
      headerText = 'Action Failed';
      bodyJsx = (
        <>
          <div className="p400" style={{ marginBottom: '0.5rem' }}>
            Message
          </div>
          <div className="textbox">{results.message}</div>
          <div className="spacer" />
          <div className="p400" style={{ marginBottom: '0.5rem' }}>
            SQL
          </div>
          <div className="textbox">{results.sql}</div>
          <div className="spacer" />
          <div className="p400">Code {results.code}</div>
        </>
      );
    } else if ('rows' in results) {
      headerText = 'Action Successful';
      bodyJsx = (
        <div className="p400">{`${results.rows.affectedRows} row(s) affected in ${table} table`}</div>
      );
    } else {
      console.error('Unrecognized results schema');
      headerText = 'Error';
      bodyJsx = <div className="p400">Error</div>;
    }

    return [headerText, bodyJsx];
  }, [isVisible, results, table]);

  return (
    <Dialog
      header={header}
      footer={footer}
      visible={isVisible}
      style={{ width: '70vw' }}
      modal
      onHide={onHide}
    >
      {body}
    </Dialog>
  );
}

export default ResultsDialog;
