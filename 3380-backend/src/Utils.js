const { v4: uuidv4 } = require('uuid');

class Utils {
    static getTableID() {
        return uuidv4().substring(0, 64);
    }

    static getProtectedFields() {
        return [
            'ID',
            'CreatedBy',
            'UpdatedBy',
            'CreatedAt',
            'LastUpdated',
            'ActualCost',
            'ActualEffort',
            'TimeClosed',
        ];
    }

    static getSQLFormattedString(value) {
        const output = value.replace("'", "''");
        return output;
    }

    static nameValueArrToString(arr) {
        return arr.map((field) => {
            if (typeof field.value === 'string')
                return `${field.name}='${Utils.getSQLFormattedString(field.value)}'`;
            if (Array.isArray(field.value)) return `${field.name} IN (${field.value.join(',')})`;
            return `${field.name}=${field.value}`;
        });
    }

    static getInsertFields(tableFields, fields) {
        return tableFields.reduce((previous, tableField) => {
            if (Utils.getProtectedFields().includes(tableField.name)) {
                if (tableField.isPrimaryKey)
                    return [...previous, { name: tableField.name, value: Utils.getTableID() }];
                if (['CreatedAt', 'UpdatedAt'].includes(tableField.name))
                    return [...previous, { name: tableField.name, value: Date.now() }];
            }
            const field = fields.find((obj) => obj.name === tableField.name);
            if (field) return [...previous, field];
            return previous;
        }, []);
    }
}

module.exports = Utils;
