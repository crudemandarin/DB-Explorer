import data from './data.json';

class ApiService {
  static async getTables() {
    const { tables } = data;
    return tables;
  }

  static async getTableFields(table) {
    const fields = data['table-fields'][table];
    return fields;
  }

  static async query(params) {
    const { table } = params;
    console.log(data, table);
    const res = data[table];
    return res;
  }
}

export default ApiService;
