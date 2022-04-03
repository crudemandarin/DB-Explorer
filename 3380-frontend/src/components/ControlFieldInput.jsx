import React from 'react';

import { InputText } from 'primereact/inputtext';

function ControlFieldInput({ name, tableForm, setTableForm }) {
  const onChange = (e) => {
    let { value } = e.target;
    value = value.toLowerCase().trim();
    const form = {...tableForm};
    form[name].value = value;
    setTableForm(form);
  }

  const value = name in tableForm ? tableForm[name].value : '';

  return (
    <div style={{ margin: '12px 10px' }}>
      <span className="p-float-label">
          <InputText
            id={name}
            className="p-inputtext-sm"
            value={value}
            onChange={onChange}
          />
          <label htmlFor={name}>{name}</label>
      </span>
    </div>
  );
}

export default ControlFieldInput;
