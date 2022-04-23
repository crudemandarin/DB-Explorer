
const mysql = require('mysql');
const util = require('util');
const Utils = require('../Utils');

const connection = mysql.createConnection({
    host: process.env.DB_SERVICE_URL,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const query = util.promisify(connection.query).bind(connection);

class SQLService {
    static query(SQL) {
        console.log('SQLService.query invoked! SQL =', SQL);
        return query(SQL);
    }

    static async getTables() {
        console.log('SQLService.getTables invoked!');
        const SQL = 'SHOW TABLES';
        const output = await SQLService.query(SQL);
        const tables = output.map((row) => row[`Tables_in_${process.env.DB_NAME}`]);
        // console.log('SQLService.getTables: Tables = ', tables);
        return tables;
    }

    static async getTableFields(table) {
        console.log('SQLService.getTableFields invoked! Table =', table);
        const SQL = `SHOW COLUMNS FROM ${table};`;
        const output = await SQLService.query(SQL);
        const fields = output.map((row) => ({
            name: row.Field,
            type: row.Type,
            nullable: row.Null === 'YES',
            isPrimaryKey: row.Key === 'PRI',
            isForeignKey: row.Key === 'MUL',
            default: row.Default ? row.Default : '',
        }));
        // console.log('SQLService.getTableFields: Fields = ', fields);
        return fields;
    }

    static async select(table, select, where, fromSql) {
        console.log(
            `SQLService.select invoked! Table = ${table}, Select = ${select}, Where =`,
            where,
            'fromSql =',
            fromSql
        );
        const selectParams = Array.isArray(select) && select.length !== 0 ? select.join(',') : '*';
        const whereParams = Array.isArray(where) && where.length !== 0 ? ` WHERE ${Utils.nameValueArrToString(where).join(' AND ')}` : '';
        const from = fromSql || table;
        const SQL = `SELECT ${selectParams} FROM ${from}${whereParams};`;
        const rows = await SQLService.query(SQL);
        // console.log('SQLService.select: rows =', rows);
        return [rows, SQL];
    }

    static async insert(table, fields) {
        console.log(`SQLService.insert invoked! Table = ${table}, Fields =`, fields);
        const keys = fields.map((field) => field.name).join(',');
        const values = fields
            .map((field) => field.value)
            .map((value) => (typeof value === 'string' ? `'${value}'` : value))
            .join(',');
        const SQL = `INSERT INTO ${table} (${keys}) VALUES (${values})`;
        const result = await SQLService.query(SQL);
        // console.log('SQLService.insert: result =', result);
        return [result, SQL];
    }

    static async update(table, rowParams) {
        console.log(`SQLService.update invoked! Table = ${table}, rowParams = ${rowParams}`);
        const result = { fieldCount: 0, affectedRows: 0, warningCount: 0, changedRows: 0 };
        const sqlStatements = [];
        rowParams.forEach(
            async (params) => {
                const { update, where } = params;
                const updateParams = Utils.nameValueArrToString(update).join(',');
                const whereParams = Utils.nameValueArrToString(where).join(' AND ');
                const SQL = `UPDATE ${table} SET ${updateParams} WHERE ${whereParams};`;
                const tempResult = await SQLService.query(SQL);
                result = {
                    fieldCount: result.fieldCount + tempResult.fieldCount,
                    affectedRows: result.affectedRows + tempResult.affectedRows,
                    warningCount: result.warningCount + tempResult.warningCount,
                    changedRows: result.changedRows + tempResult.changedRows,
                };
                sqlStatements.push(SQL);
            }
        );
        const SQL = sqlStatements.join('\n');
        // console.log('SQLService.update: result =', result);
        return [result, SQL];
    }

    static async delete(table, rowParams) {
        console.log(`SQLService.delete invoked! Table = ${table}, rowParams = ${rowParams}`);
        const whereParams = rowParams.map(params => Utils.nameValueArrToString(params)).join(' OR ');
        const SQL = `DELETE FROM ${table} WHERE ${whereParams}`;
        const result = await SQLService.query(SQL);
        return [result, SQL];
    }
}

module.exports = SQLService;
