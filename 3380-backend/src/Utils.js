const { v4: uuidv4 } = require('uuid');

class Utils {
    static getTableID() {
        return uuidv4().substring(0, 64);
    }

    static getProtectedRows() {
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

    static nameValueArrToString(arr) {
        return arr.map((field) => {
            if (Array.isArray(field.value)) return `${field.name} IN (${field.value.join()})`;
            if (typeof field.value === 'string') return `${field.name} LIKE '%${field.value}%'`;
            return `${field.name}=${field.value}`;
        });
    }
}

module.exports = Utils;
