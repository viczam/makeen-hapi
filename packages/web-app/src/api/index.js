import axios from 'axios';
import { BASE_URL } from '../constants/api';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(config => {
  if (window.localStorage) {
    Object.assign(config, {
      headers: {
        ...(config.headers || {}),
        authorization: window.localStorage.getItem('authToken'),
      },
    });
  }

  return config;
});

export default api;
