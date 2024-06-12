import axios from 'axios';
import { SESSION_AUTHENTICATED } from 'src/contexts/auth-context';
const USER_API_BASE_URL = 'http://localhost:3000/';

export const STORAGE_USERINFO = 'userinfo';

class AuthService {
  login(email, password, pr) {
    return new Promise((resolve, reject) => {
      return axios
        .post(USER_API_BASE_URL + 'signInUser', {
          email: email,
          password: password,
        })
        .then(function (response) {
          const userData = {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            token: response.data.token,
          };
          localStorage.setItem(STORAGE_USERINFO, JSON.stringify(userData));
          resolve(true, pr);
        })
        .catch(function (error) {
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
    if (user === null) {
      return { Authorization: 'Bearer ' };
    } else {
      return {
        Authorization: 'Bearer ' + user.token,
        'Content-Type': 'application/json',
      };
    }
  }

  logOut() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_USERINFO);
      window.sessionStorage.removeItem(SESSION_AUTHENTICATED);
      return ''; // axios.post(USER_API_BASE_URL + 'logout', {}, this.getAuthHeader());
    }
  }

  async getData(endpoint) {
    return axios
      .get(USER_API_BASE_URL + endpoint, {
        headers: this.getAuthHeader(),
      })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        if (
          error.response !== undefined &&
          (error.response.status === 401 || error.response.status === 400) &&
          typeof window !== 'undefined'
        ) {
          localStorage.removeItem(STORAGE_USERINFO);
          window.sessionStorage.removeItem(SESSION_AUTHENTICATED);
        }
      });
  }

  async putData(endpoint, payload) {
    try {
      const response = await axios({
        url: USER_API_BASE_URL + endpoint,
        method: 'put',
        data: payload,
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 400) {
        localStorage.removeItem(STORAGE_USERINFO);
        window.sessionStorage.removeItem(SESSION_AUTHENTICATED);
      }
      return false;
    }
  }

  postData(endpoint, payload, callback) {
    return axios({
      url: USER_API_BASE_URL + endpoint,
      method: 'post',
      data: payload,
      headers: this.getAuthHeader(),
    })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        if (
          (error.response.status === 401 || error.response.status === 400) &&
          typeof window !== 'undefined'
        ) {
          localStorage.removeItem(STORAGE_USERINFO);
        }
        throw new Error(error);
      });
  }

  UploadImage(data) {
    return axios({
      url: 'http://tohsoft.mx/api/wsupload/request.php?action=upload',
      method: 'post',
      data: data,
      contentType: false,
      processData: false,
    })
      .then(function (response) {
        return response.data.data.mediaLink;
      })
      .catch(function (error) {
        return false;
      });
  }
}
const authService = new AuthService();
export default authService;
