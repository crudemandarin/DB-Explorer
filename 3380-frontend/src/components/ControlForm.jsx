import React, { useEffect } from 'react';

import ControlFieldInput from './ControlFieldInput';

function ControlForm({ fields, tableForm, setTableForm }) {

    useEffect(() => {
        const form = fields.reduce(
            (obj, item) => (
                {
                    ...obj,
                    [item.name]: { type: item.type, value: '' }
                }
            ), {}
        );
        setTableForm(form);
    }, [fields, setTableForm]);

    if (!tableForm || !Object.keys(tableForm).length) {
        return (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <></>
        );
    }

    return (
        <form className="flex-wrap">
            {
                fields.map((field) => {
                const props = { name: field.name, tableForm, setTableForm };
                return <ControlFieldInput {...props} key={field.name} />;
                })
            }
        </form>
    );
}

export default ControlForm;
