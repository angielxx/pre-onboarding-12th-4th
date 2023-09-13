import { getData } from '@/apis/api';
import { MainDataType } from '@/types/MainChart';

export const FetchAndDefineMainData: () => Promise<MainDataType> = async () => {
  const data = await getData();
  const labels: string[] = [];
  const bar: number[] = [];
  const area: number[] = [];
  const id: string[] = [];

  for (const [key, value] of Object.entries(data)) {
    id.push(value.id);
    labels.push(key);
    bar.push(value['value_bar']);
    area.push(value['value_area']);
  }
  return { labels, bar, area, id };
};
