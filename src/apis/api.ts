import { ResponseType } from '@/types/response';
import ApiClient from '@/apis/client';

const { VITE_BASE_URL } = import.meta.env;

const client = new ApiClient(VITE_BASE_URL);

export const getData = async <T = ResponseType>(): Promise<T> => {
  const { data } = await client.get('/data');
  return data;
};
