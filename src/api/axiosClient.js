import axios from 'axios';
import { API_BASE_URL } from './endpoints';
import { toApiError } from './apiError';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error))
);

export default axiosClient;
