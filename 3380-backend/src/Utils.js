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
            const value = typeof field.value === 'string' ? `'${field.value}'` : `${field.value}`;
            return `${field.name}=${value}`;
        });
    }
}

module.exports = Utils;
