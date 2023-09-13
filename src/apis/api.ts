import { ResponseType } from '@/types/response';
import ApiClient from '@/apis/client';

const client = new ApiClient('https://pre-onboarding-4rd-server.vercel.app/api');

export const getData = async <T = ResponseType>(): Promise<T> => {
  const { data } = await client.get('/data');
  return data;
};
