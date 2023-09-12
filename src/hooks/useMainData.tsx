import { MainDataType } from '@/types/MainChart';
import { FetchAndDefineMainData } from '@/utils/QueryFn/mainData';
import { useQuery } from '@tanstack/react-query';

const DEFAULT_STALE_TIME = 1000 * 60 * 60;

interface ReturnType {
  data: MainDataType;
  error: unknown;
}

export const useMainData = () => {
  const { data, error } = useQuery(['data'], FetchAndDefineMainData, {
    suspense: true,
    staleTime: DEFAULT_STALE_TIME,
  });

  return { data, error };
};
