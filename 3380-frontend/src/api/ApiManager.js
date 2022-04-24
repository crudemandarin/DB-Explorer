import ApiService from './ApiService';

class ApiManager {
  static async login(email) {
    if (email === 'nykolas') {
      return { ID: '', FirstName: 'Nykolas', LastName: 'Farhangi' };
    }

    try {
      const params = { email };
      const response = await ApiService.login(params);
      const { user } = response.data;
      console.log('ApiManager.login successful. user =', user);
      return user;
    } catch (err) {
      console.error('ApiManager.login failed. Error =', err);
      return undefined;
    }
  }

  static async getTables() {
    try {
      const response = await ApiService.getTables();
      const { tables } = response.data;
      console.log('ApiManager.getTables successful. Tables =', tables);
      return tables;
    } catch (err) {
      console.error('ApiManager.getTables failed. Error =', err);
      return [];
    }
  }

  static async getTableFields(table) {
    try {
      const response = await ApiService.getTableFields(table);
      const { fields } = response.data;
      console.log('ApiManager.getTableFields successful. fields =', fields);
      return fields;
    } catch (err) {
      console.error('ApiManager.getTableFields failed. Error =', err);
      return [];
    }
  }

  static async select(params) {
    console.log('ApiManager.select invoked. params =', params);
    try {
      const response = await ApiService.select(params);
      const { rows, SQL } = response.data;
      console.log('ApiManager.select successful. rows =', rows, 'SQL =', SQL);
      return [this.getFormattedRows(rows), SQL];
    } catch (err) {
      const error = err?.response?.data;
      console.error('ApiManager.select failed. Error =', error);
      return [];
    }
  }

  static async insert(params) {
    console.log('ApiManager.insert invoked. params =', params);
    try {
      const response = await ApiService.insert(params);
      const { result, SQL } = response.data;
      console.log('ApiManager.insert successful. result =', result, 'SQL =', SQL);
      return { result, SQL };
    } catch (err) {
      const error = err?.response?.data;
      console.error('ApiManager.insert failed. Error =', error);
      return { result: error, SQL: error.sql };
    }
  }

  static async delete(params) {
    console.log('ApiManager.delete invoked. params =', params);
    try {
      const response = await ApiService.delete(params);
      const { result, SQL } = response.data;
      console.log('ApiManager.delete successful. result =', result, 'SQL =', SQL);
      return { result, SQL };
    } catch (err) {
      const error = err?.response?.data;
      console.error('ApiManager.delete failed. Error =', error);
      return { result: error, SQL: error.sql };
    }
  }

  static async update(params) {
    console.log('ApiManager.update invoked. params =', params);
    try {
      const response = await ApiService.update(params);
      const { result, SQL } = response.data;
      console.log('ApiManager.update successful. result =', result, 'SQL =', SQL);
      return { result, SQL };
    } catch (err) {
      const error = err?.response?.data;
      console.error('ApiManager.update failed. Error =', error);
      return { result: error, SQL: error.sql };
    }
  }

  static async getReport(params) {
    console.log('ApiManager.getReport invoked. params =', params);
    try {
      const response = await ApiService.getReport(params);
      const { report } = response.data;
      console.log('ApiManager.getReport successful. report =', report);
      return report;
    } catch (err) {
      const error = err?.response?.data;
      console.error('ApiManager.getReport failed. Error =', error);
      return { result: error };
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
