import React, { useMemo } from 'react';

import { InputText } from 'primereact/inputtext';

function ControlFieldInput({ name, tableForm, setTableForm, setResetFlag }) {
  const onChange = (e) => {
    let { value } = e.target;
    value = value.toLowerCase().trim();
    const form = { ...tableForm };
    form[name].value = value;
    setTableForm(form);
    setResetFlag(true);
  };

  const value = name in tableForm ? tableForm[name].value : '';
  const inputClassName = useMemo(() => {
    const isInvalid = name in tableForm ? tableForm[name].isInvalid : false;
    let className = 'p-inputtext-sm';
    if (isInvalid) className += ' p-invalid';
    return className;
  }, [name, tableForm]);

  return (
    <div style={{ margin: '12px 10px' }}>
      <span className="p-float-label">
        <InputText id={name} className={inputClassName} value={value} onChange={onChange} />
        <label htmlFor={name}>{name}</label>
      </span>
    </div>
  );
}

export default ControlFieldInput;
