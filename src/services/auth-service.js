import axios from 'axios';
import { SESSION_AUTHENTICATED } from 'src/contexts/auth-context';
const USER_API_BASE_URL = 'https://fractal-api-qgxrdisfsq-uc.a.run.app/api/';

export const STORAGE_USERINFO = 'userinfo';

class AuthService {
  login(u, p, pr) {
    return new Promise((resolve, reject) => {
      return axios
        .post(USER_API_BASE_URL + 'auth/login', {
          email: u,
          password: p,
        })
        .then(function (r) {
          localStorage.setItem(STORAGE_USERINFO, JSON.stringify(r.data));
          resolve(true, pr);
        })
        .catch(function (e) {
          reject();
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
        Authorization: 'Bearer ' + user?.access_token,
        contentType: 'application/json',
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

  async getData(d) {
    return axios
      .get(USER_API_BASE_URL + d, {
        headers: this.getAuthHeader(),
      })
      .then(function (r) {
        return r.data;
      })
      .catch(function (e) {
        if (
          e.response !== undefined &&
          (e.response.status === 401 || e.response.status === 400) &&
          typeof window !== 'undefined'
        ) {
          localStorage.removeItem(STORAGE_USERINFO);
          window.sessionStorage.removeItem(SESSION_AUTHENTICATED);
        }
      });
  }

  async putData(d, p) {
    try {
      const r = await axios({
        url: USER_API_BASE_URL + d,
        method: 'put',
        data: p,
        headers: this.getAuthHeader(),
      });
      return r.data;
    } catch (e) {
      if (e.response.status === 401 || e.response.status === 400) {
        localStorage.removeItem(STORAGE_USERINFO);
        window.sessionStorage.removeItem(SESSION_AUTHENTICATED);
      }
      return false;
    }
  }

  postData(d, p, s) {
    return axios({
      url: USER_API_BASE_URL + d,
      method: 'post',
      data: p,
      headers: this.getAuthHeader(),
    })
      .then(function (r) {
        return r.data;
      })
      .catch(function (e) {
        if (
          (e.response.status === 401 || e.response.status === 400) &&
          typeof window !== 'undefined'
        ) {
          localStorage.removeItem(STORAGE_USERINFO);
        }
        throw new Error(e);
      });
  }

  UploadImage(d) {
    return axios({
      url: 'http://tohsoft.mx/api/wsupload/request.php?action=upload',
      method: 'post',
      data: d,
      contentType: false,
      processData: false,
    })
      .then(function (r) {
        return r.data.data.mediaLink;
      })
      .catch(function (e) {
        return false;
      });
  }
}
const authService = new AuthService();
export default authService;
