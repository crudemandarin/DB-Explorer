import axios from 'axios';

const SERVICE_URL = 'http://localhost:5050';

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

  static async getSelectQuery(params) {
    return axios.post(`${SERVICE_URL}/interface/query/select`, params);
  }
}

export default ApiService;
