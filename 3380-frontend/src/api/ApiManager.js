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

  static async select(params) {
    console.log('ApiManager.select invoked! params =', params);
    try {
      const response = await ApiService.select(params);
      const { rows } = response.data;
      console.log('ApiManager.select: Successful! Rows =', rows);
      return this.getFormattedRows(rows);
    } catch (err) {
      console.error('ApiManager.select: Could not load data. Error =', err);
      return [];
    }
  }

  static async insert(params) {
    console.log('ApiManager.insert invoked! params =', params);
    try {
      const response = await ApiService.insert(params);
      const result = response.data;
      console.log('ApiManager.insert: Successful! Result =', result);
      return result;
    } catch (err) {
      const error = err?.response?.data;
      console.error('ApiManager.insert: Could not insert. Error =', error);
      return error;
    }
  }

  static async delete(params) {
    console.log('ApiManager.delete invoked! params =', params);
    try {
      const response = await ApiService.delete(params);
      const result = response.data;
      console.log('ApiManager.delete: Successful! Result =', result);
      return result;
    } catch (err) {
      const error = err?.response?.data;
      console.error('ApiManager.delete: Could not delete. Error =', error);
      return error;
    }
  }

  static async update(params) {
    console.log('ApiManager.update invoked! params =', params);
    try {
      const response = await ApiService.update(params);
      const result = response.data;
      console.log('ApiManager.update: Successful! Result =', result);
      return result;
    } catch (err) {
      const error = err?.response?.data;
      console.error('ApiManager.update: Could not update. Error =', error);
      return error;
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
