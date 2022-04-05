import ApiService from './ApiService';

class ApiManager {
  static async getTables() {
    try {
      const response = await ApiService.getTables();
      const { tables } = response.data;
      console.log('ApiManager.getTables: Successful! Tables =', tables);
      return tables;
    } catch (err) {
      console.error('ApiManager.getTables: Could not load tables. Error =', err);
      return [];
    }
  }

  static async getTableFields(table) {
    try {
      const response = await ApiService.getTableFields(table);
      const { fields } = response.data;
      console.log('ApiManager.getTableFields: Successful! Fields =', fields);
      return fields;
    } catch (err) {
      console.error('ApiManager.getTableFields: Could not load fields. Error =', err);
      return [];
    }
  }

  static async getSelectQuery(params) {
    console.log('ApiManager.getSelectQuery invoked! params =', params);
    try {
      const response = await ApiService.getSelectQuery(params);
      const { rows } = response.data;
      console.log('ApiManager.getSelectQuery: Successful! Rows =', rows);
      return this.getFormattedRows(rows);
    } catch (err) {
      console.error('ApiManager.getSelectQuery: Could not load data. Error =', err);
      return [];
    }
  }

  static getFormattedRows(rows) {
    return rows.map((data) => {
      const ret = { ...data };
      if ('CreatedAt' in data) ret.CreatedAt = new Date(data.CreatedAt).toLocaleDateString();
      if ('LastUpdated' in data) ret.LastUpdated = new Date(data.LastUpdated).toLocaleDateString();
      return ret;
    });
  }
}

export default ApiManager;
