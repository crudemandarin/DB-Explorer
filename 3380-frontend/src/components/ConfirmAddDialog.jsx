import React, { useMemo } from 'react';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import Utils from '../util/Utils';
import ApiManager from '../api/ApiManager';

function ConfirmAddDialog({ addIsVisible, setAddIsVisible, table, tableForm, fields }) {
    const onHide = () => {
        setAddIsVisible(false);
    }

    const handleAddClick = async () => {
        const formParams = Utils.getFormParams(tableForm);
        console.log('ConfirmAddDialog.handleAddClick invoked! formParams =', formParams);
        const params = { table, fields: formParams };
        await ApiManager.insert(params);
        onHide();
    }

    const rows = useMemo(() => {
        if (!addIsVisible) return [];
        const row = {};
        fields.forEach(field => { row[field.name] = tableForm[field.name].value; } )
        return [row];
    }, [addIsVisible, fields, tableForm]);

    const footer = (
        <div>
            <Button label="Cancel" icon="pi pi-times" className='p-button-secondary' onClick={onHide} />
            <Button label="Add" icon="pi pi-plus" onClick={handleAddClick} />
        </div>
    );

    return (
        <Dialog header={`Add to ${table} table`} footer={footer} visible={addIsVisible} style={{width: '50vw'}} modal onHide={onHide}>
            <DataTable value={rows} responsiveLayout="scroll">
                { fields.map(field => <Column field={field.name} header={field.name} key={field.name} />) }
            </DataTable>
        </Dialog>
    );
}

export default ConfirmAddDialog;
