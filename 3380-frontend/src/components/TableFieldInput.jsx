import React, { useState } from 'react';

import '../App.css';

import { InputText } from 'primereact/inputtext';

function TableFieldInput({ field }) {
  const { name } = field;

  const [value, setValue] = useState('');

  return (
    <div style={{ margin: '0 10px' }}>
      <div className="p400">{name}</div>
      <InputText
        style={{ margin: '10px 0' }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

export default TableFieldInput;
