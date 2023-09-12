import ApiClient from './client';

const { VITE_BASE_URL } = import.meta.env;

const client = new ApiClient(VITE_BASE_URL);

export const getData = async () => {
  return client.get('/data');
};
