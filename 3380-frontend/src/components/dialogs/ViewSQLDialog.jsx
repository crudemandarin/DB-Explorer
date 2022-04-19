import React from 'react';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

import Utils from '../../util/Utils';

function ViewSQLDialog({ isVisible, setIsVisible, desc, SQL }) {
  const onHide = () => {
    setIsVisible(false);
  };

  const footer = (
    <div>
      <Button label="Close" icon="pi pi-times" className="p-button-secondary" onClick={onHide} />
    </div>
  );

  const header = `View SQL for "${desc}"`;

  return (
    <Dialog
      header={header}
      footer={footer}
      visible={isVisible}
      style={{ width: '60vw' }}
      modal
      onHide={onHide}
    >
        <div className="textbox">{Utils.getFormattedSQL(SQL)}</div>
    </Dialog>
  );
}

export default ViewSQLDialog;
