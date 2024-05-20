/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiService {
  get: <T>(url: string, params?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  delete: <T>(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
}

const apiClient = axios.create({
  baseURL: 'https://localhost:7291/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiService: ApiService = {
  get: (url, params, config) => apiClient.get(url, { params, ...config }),
  post: (url, data, config) => apiClient.post(url, data, { ...config }),
  put: (url, data, config) => apiClient.put(url, data, { ...config }),
  delete: (url, config) => apiClient.delete(url, { ...config }),
};

export default apiService;
