import React, { useMemo } from 'react';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

import Utils from '../../util/Utils';

function ResultsDialog({ isVisible, setIsVisible, setParentIsVisible, data, table }) {
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
    if (!isVisible || !data || !('result' in data)) return [null, null];
    
    const { result, SQL } = data;
    let headerText = '';
    let bodyJsx = null;

    const renderSQL = () => {
      if (!SQL) return null;
      return (
        <>
          <div className="p400" style={{ marginBottom: '0.5rem' }}>
            SQL
          </div>
          <div className="textbox">{Utils.getFormattedSQL(SQL)}</div>
          <div className="spacer" />
        </>
      )
    }

    if ('code' in result) {
      headerText = 'Action Failed';
      bodyJsx = (
        <>
          <div className="p400" style={{ marginBottom: '0.5rem' }}>
            Message
          </div>
          <div className="textbox">{result.message}</div>
          <div className="spacer" />
          {renderSQL()}
          <div className="p400">Code {result.code}</div>
        </>
      );
    } else if ('affectedRows' in result) {
      headerText = 'Action Successful';
      bodyJsx = (
        <>
          <div className="p400" style={{ marginBottom: '0.5rem' }}>{`${result.affectedRows} row(s) affected in ${table} table`}</div>
          <div className="p400" style={{ marginBottom: '0.5rem' }}>
            SQL
          </div>
          <div className="textbox">{Utils.getFormattedSQL(SQL)}</div>
        </>
      );
    } else {
      console.error('Unrecognized result schema');
      headerText = 'Error';
      bodyJsx = <div className="p400">Error</div>;
    }

    return [headerText, bodyJsx];
  }, [isVisible, data, table]);

  return (
    <Dialog
      header={header}
      footer={footer}
      visible={isVisible}
      style={{ width: '60vw' }}
      modal
      onHide={onHide}
    >
      {body}
    </Dialog>
  );
}

export default ResultsDialog;
