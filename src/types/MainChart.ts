export interface SeriesType {
  name: string;
  type: 'column' | 'area';
  data: number[];
}

export interface MainDataType {
  labels: string[];
  bar: number[];
  area: number[];
}
