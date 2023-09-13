import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiClient {
  client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({ baseURL });
  }

  get(endPoint: string, config?: AxiosRequestConfig) {
    return this.client.get(endPoint, config);
  }
}

export default ApiClient;
