import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

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

export interface ChartType extends ReactApexChart {
  chart: {
    updateOptions: (
      newOptions: ApexOptions | null,
      redrawPaths?: boolean,
      animate?: boolean,
      updateSyncedCharts?: boolean,
    ) => void;
  };
}
