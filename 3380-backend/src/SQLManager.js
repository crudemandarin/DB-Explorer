const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'pms',
});

const query = util.promisify(connection.query).bind(connection);

class SQLManager {
    static query(SQL) {
        console.log('SQLManager.query invoked! SQL =', SQL);
        return query(SQL);
    }

    static async getTables() {
        console.log('SQLManager.getTables invoked!');
        const SQL = 'SHOW TABLES';
        const output = await this.query(SQL);
        const tables = output.map((row) => row.Tables_in_pms);
        console.log('SQLManager.getTables: Tables = ', tables);
        return tables;
    }

    static async getTableFields(table) {
        console.log('SQLManager.getTableFields invoked! Table =', table);
        const SQL = `SHOW COLUMNS FROM ${table};`;
        const output = await this.query(SQL);
        const fields = output.map((row) => ({ name: row.Field, type: row.Type }));
        console.log('SQLManager.getTableFields: Fields = ', fields);
        return fields;
    }

    static async getSelectQuery(table, fields) {
        console.log(`SQLManager.getSelectQuery invoked! Table = ${table}, Fields =`, fields);
        let columns = [];
        fields.forEach((column) => columns.push(column)); 
        const SQL = `SELECT ${columns.toString()} FROM ${table}`;
        const output = await this.query(SQL);
        
        // Parse RowDataPackets into array of objects
        const result = Object.values(JSON.parse(JSON.stringify(output)));
        return result;
    }

    static async performInsert(table, fields) {
        let keys = [];
        let vals = [];
        fields.forEach((field) => { 
            keys.push(field.name);
            vals.push(field.value);
        });
        
        // Convert array into SQL string and wrap string values in quotes
        vals = vals.map(val => {
            if (typeof val === "string") {
                return `'${val}'`
            } else {
                return val;
            }
        }).join(',');
        const SQL = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${vals})`;
        console.log(`SQLManager.performInsert invoked! Table = ${table}, Fields =`, fields);
        const output = await this.query(SQL);
        return output;
    }

    static async performDelete(table, id) {

        
    }
}

module.exports = SQLManager;
