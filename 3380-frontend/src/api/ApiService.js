import axios from 'axios';

const SERVICE_URL = process.env.REACT_APP_SERVICE_URL;

class ApiService {
  static async ping() {
    return axios.get(SERVICE_URL);
  }

  static async login(params) {
    return axios.post(`${SERVICE_URL}/user/login`, params);
  }

  static async getTables() {
    return axios.get(`${SERVICE_URL}/interface/tables`);
  }

  static async getTableFields(table) {
    return axios.get(`${SERVICE_URL}/interface/fields?table=${table}`);
  }

  static async select(params) {
    return axios.post(`${SERVICE_URL}/interface/query`, params);
  }

  static async insert(params) {
    return axios.post(`${SERVICE_URL}/interface/query/data`, params);
  }

  static async delete(params) {
    return axios.delete(`${SERVICE_URL}/interface/query/data`, params);
  }

  static async update(params) {
    return axios.put(`${SERVICE_URL}/interface/query/data`, params);
  }

  static async getReport(params) {
    return axios.get(`${SERVICE_URL}/report`, params);
  }
}

export default ApiService;
