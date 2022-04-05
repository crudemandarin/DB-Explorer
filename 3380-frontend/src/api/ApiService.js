import axios from 'axios';

const SERVICE_URL = 'https://qjisgkaetc.execute-api.us-east-1.amazonaws.com/dev';

class ApiService {
  static async ping() {
    console.log('ApiService.ping:', SERVICE_URL);
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
}

export default ApiService;
