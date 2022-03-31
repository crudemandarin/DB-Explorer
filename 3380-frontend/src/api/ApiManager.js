import ApiService from './ApiService';

class ApiManager {
  static async getTables() {
    try {
      const tables = await ApiService.getTables();
      console.log('ApiManager.getTables: Successful! Tables =', tables);
      return tables;
    } catch (err) {
      console.error('ApiManager.getTables: Could not load tables. Error =', err);
      return [];
    }
  }

  static async getTableFields(table) {
    try {
      const fields = await ApiService.getTableFields(table);
      console.log('ApiManager.getTableFields: Successful! Fields =', fields);
      return fields;
    } catch (err) {
      console.error('ApiManager.getTableFields: Could not load fields. Error =', err);
      return [];
    }
  }

  static async query(params) {
    try {
      const data = await ApiService.query(params);
      console.log('ApiManager.query: Successful! Data =', data);
      return data;
    } catch (err) {
      console.error('ApiManager.query: Could not load data. Error =', err);
      return [];
    }
  }
}

export default ApiManager;
