import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
let tokenGetter = () => null;

const instance = axios.create({ baseURL });
instance.interceptors.request.use((config) => {
  const token = tokenGetter();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default {
  setTokenGetter(fn) { tokenGetter = fn; },
  get: (url, config) => instance.get(url, config),
  post: (url, data, config) => instance.post(url, data, config),
};
