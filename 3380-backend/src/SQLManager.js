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
        const SQL = `SELECT * FROM ${table}`;
        const output = await this.query(SQL);
        const rows = output.map((row) => ({ name: row.Field, type: row.Type }));
        console.log('SQLManager.getSelectQuery: Rows = ', rows);
        return rows;
    }
}

module.exports = SQLManager;
