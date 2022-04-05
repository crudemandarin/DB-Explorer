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

    static async getSelectQuery(table, fieldsSelect, fieldsWhere) {
        console.log(`SQLManager.getSelectQuery invoked! Table = ${table}, Fields = ${fieldsSelect}, Where = ${fieldsWhere}`);
        // let values = fields.map(field => field.value);
        // If columns is empty SELECT * by default
        if (!fieldsSelect.length) {
            fieldsSelect.push('*');
        }

        let SQL = `SELECT ${fieldsSelect.toString()} FROM ${table}`;
        // Specify WHERE clause if applicable
        if (fieldsWhere.length) {
            let whereSQL = this.convertArrayToSQLConditional(fieldsWhere)
            SQL += ` WHERE ${whereSQL}`;
        }
        const output = await this.query(SQL);
        
        // Parse RowDataPackets into array of objects
        const result = Object.values(JSON.parse(JSON.stringify(output)));
        return result;
    }

    static async performInsert(table, fields) {
        // Check if fields is empty 
        if (!fields.length) {
            console.log("User tried to insert empty field!");
            return;
        }    

        let keys = fields.map(field => field.name);
        let vals = fields.map(field => field.value);
        
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
    
    static async performUpdate(table, fieldsUpdate, fieldsWhere) {
        // Stop if no fields specified to update or no WHERE clause
        if (!fieldsUpdate.length || !fieldsWhere.length) {
            return;
        }

        let whereSQL = this.convertArrayToSQLConditional(fieldsWhere);
        let setSQL = this.convertArrayToSQLEquals(fieldsUpdate);

        // Generate SQL code for SET clause
        // SQL for WHERE clause
        const SQL = `UPDATE ${table} SET ${setSQL} WHERE ${whereSQL}`;
        console.log(SQL);
        const output = await this.query(SQL);
        console.log(output);
        return output
        
    }

    static async performDelete(table, id) {

        
    }

    // Generate SQL code for SET clause
    static convertArrayToSQLEquals(arr) {
        let res = arr.map(field => {
            let updateField = `${field.name} = `;
            // Put quotes around string data types to be inserted
            if (typeof field.value === "string") {
                updateField += `'${field.value}'`;
            } else {
                updateField += `${field.value}`;
            }
            return updateField;
        }).join(',');
        return res;
    }

    // Generate SQL code for WHERE clause
    static convertArrayToSQLConditional(arr) {
        let res = arr.map(field => {
            let updateField = `${field.name} = `;
            // Put quotes around string data types to be inserted
            if (typeof field.value === "string") {
                updateField += `'${field.value}'`;
            } else {
                updateField += `${field.value}`;
            }
            return updateField;
        }).join(' AND ');
        return res;
    }
}

module.exports = SQLManager;
