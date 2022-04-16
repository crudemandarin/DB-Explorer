import React, { useMemo } from 'react';

import { InputText } from 'primereact/inputtext';

function ControlFieldInput({ name, tableForm, setTableForm, setResetFlag }) {
  const onChange = (e) => {
    const { value } = e.target;
    const form = { ...tableForm };
    form[name].value = value;
    setTableForm(form);
    setResetFlag(true);
  };

  const value = name in tableForm ? tableForm[name].value : '';
  const [inputClassName, errorMsg] = useMemo(() => {
    const baseClassName = 'p-inputtext-sm';
    if (name in tableForm) {
      const { isInvalid, error } = tableForm[name];
      if (isInvalid) return [`${baseClassName} p-invalid`, error];
    }
    return [baseClassName, ""];
  }, [name, tableForm]);

  const errorMsgId = `${name}-help`;

  return (
    <div style={{ margin: '12px 10px' }}>
      <span className="p-float-label">
        <InputText id={name} aria-describedby={errorMsgId} className={inputClassName} value={value} onChange={onChange} />
        <label htmlFor={name}>{name}</label>
      </span>
      { errorMsg ? <small id={errorMsgId} className="p-error block">{errorMsg}</small> : <></> }
    </div>
  );
}

export default ControlFieldInput;
