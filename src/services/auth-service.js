import axios from 'axios';
import { SESSION_AUTHENTICATED } from 'src/contexts/auth-context';

const USER_API_BASE_URL = 'http://localhost:3000/';
export const STORAGE_USERINFO = 'userinfo';

class AuthService {
  login(email, password, pr) {
    return new Promise((resolve, reject) => {
      axios
        .post(USER_API_BASE_URL + 'signInUser', { email, password })
        .then((response) => {
          const userData = {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            token: response.data.token,
          };
          localStorage.setItem(STORAGE_USERINFO, JSON.stringify(userData));
          resolve(true, pr);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getUserInfo() {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem(STORAGE_USERINFO));
    }
  }

  getAuthHeader() {
    const user = this.getUserInfo();
    return user ? { Authorization: 'Bearer ' + user.token } : { Authorization: 'Bearer ' };
  }

  logOut() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_USERINFO);
      window.sessionStorage.removeItem(SESSION_AUTHENTICATED);
    }
  }

  async getData(endpoint) {
    try {
      const response = await axios.get(USER_API_BASE_URL + endpoint, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 400) {
        localStorage.removeItem(STORAGE_USERINFO);
        window.sessionStorage.removeItem(SESSION_AUTHENTICATED);
      }
      throw error;
    }
  }

  async postData(endpoint, payload) {
    try {
      const response = await axios.post(USER_API_BASE_URL + endpoint, payload, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 400) {
        localStorage.removeItem(STORAGE_USERINFO);
      }
      throw new Error(error);
    }
  }
}

const authService = new AuthService();
export default authService;
