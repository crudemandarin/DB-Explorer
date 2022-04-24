const { v4: uuidv4 } = require('uuid');

class Utils {
    static getTableID() {
        return uuidv4().substring(0, 64);
    }

    static getProtectedFields(table) {
        if (table === 'task') {
            return ['ID', 'CreatedBy', 'UpdatedBy', 'CreatedAt', 'LastUpdated', 'TimeClosed'];
        }

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
}

module.exports = Utils;
