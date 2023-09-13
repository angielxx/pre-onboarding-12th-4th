export interface SeriesType {
  name: string;
  type: 'column' | 'area';
  data: number[];
}

export interface MainDataType {
  id: string[];
  labels: string[];
  bar: number[];
  area: number[];
}

export type BarData = {
  x: string;
  y: number;
  fillColor?: string;
};
