import React, { useState } from 'react';

import { InputText } from 'primereact/inputtext';

function TableFieldInput({ field }) {
  const { name } = field;

  const [value, setValue] = useState('');

  return (
    <div style={{ margin: '12px 10px' }}>
      <span className="p-float-label">
          <InputText
            id={name}
            className="p-inputtext-sm"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <label htmlFor={name}>{name}</label>
      </span>
    </div>
  );
}

export default TableFieldInput;
