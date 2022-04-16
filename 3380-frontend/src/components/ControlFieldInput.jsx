import React, { useMemo } from 'react';

import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';

function ControlFieldInput({ name, tableForm, setTableForm, setResetFlag }) {
  const formData = useMemo(() => {
    if (name in tableForm) return tableForm[name];
    return null;
  }, [name, tableForm])

  if (!formData) return null;

  const onChange = (e) => {
    const { value } = e.target;
    const form = { ...tableForm };
    form[name].value = value;
    setTableForm(form);
    setResetFlag(true);
  };

  const renderInput = () => {
    const isDatetime = formData.type.toLowerCase().includes('datetime');
    if (isDatetime) {
      return (
        <span className="p-float-label">
          <Calendar
            id={`${name}-input`}
            value={formData.value}
            onChange={onChange}
            className='p-inputtext-sm'
            style={{width: '175px', height: '45px'}}
            showIcon 
          />
          <label htmlFor={name}>{name}</label>
        </span>
      )
    }

    let inputClassName = 'p-inputtext-sm';
    let renderedError = null;

    const { isInvalid, error } = formData;
    if (isInvalid) {
      inputClassName = `${inputClassName} p-invalid`;
      renderedError = (
        <small id={`${name}-help`} className="p-error block">
          {error}
        </small>
      );
    }

    return (
      <>
        <span className="p-float-label">
          <InputText
            id={`${name}-input`}
            aria-describedby={`${name}-help`}
            className={inputClassName}
            value={formData.value}
            onChange={onChange}
            style={{width: '175px', height: '45px'}}
          />
          <label htmlFor={name}>{name}</label>
        </span>
        {renderedError}
      </>
    )
  }

  return (
    <div style={{ margin: '12px 10px' }}>
      {renderInput()}
    </div>
  );
}

export default ControlFieldInput;
