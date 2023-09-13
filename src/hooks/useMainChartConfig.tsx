import { useCallback, useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';

import { MainDataType, SeriesType } from '@/types/chart';

interface Props {
  data: MainDataType | undefined;
  selectedId: string | null;
}

const DEFAULT_COLUMN_COLOR = '#008FFB';
const HIGHLIGHT_COLUMN_COLOR = '#ff6060';

export const useMainChartConfig = ({ data, selectedId }: Props) => {
  const [options, setOptions] = useState<ApexOptions | null>(null);
  const [series, setSeries] = useState<SeriesType[] | null>();

  const colorBySelectedId = useCallback(
    ({ dataPointIndex }: { dataPointIndex: number }) => {
      if (selectedId === null) {
        return DEFAULT_COLUMN_COLOR;
      } else {
        if (data?.id[dataPointIndex] === selectedId) return HIGHLIGHT_COLUMN_COLOR;
        return DEFAULT_COLUMN_COLOR;
      }
    },
    [selectedId, data],
  );

  useEffect(() => {
    if (!data) return;

    const newOption: ApexOptions = {
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [0, 1, 5],
        curve: 'smooth',
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
        },
      },
      colors: [colorBySelectedId, '#00E396'],
      labels: data.labels,
      fill: {
        opacity: [0.7, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100],
        },
      },
      markers: {
        size: 0,
      },
      xaxis: {
        type: 'datetime',
        tooltip: {
          enabled: false,
        },
      },
      yaxis: [
        {
          seriesName: 'Column',
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#008FFB',
          },
          labels: {
            style: {
              colors: '#008FFB',
            },
          },
          title: {
            text: 'Value Bar',
            style: {
              color: '#008FFB',
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        {
          seriesName: 'Area',
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#00E396',
          },
          labels: {
            style: {
              colors: '#00E396',
            },
          },
          title: {
            text: 'Value Area',
            style: {
              color: '#00E396',
            },
          },
        },
      ],
      tooltip: {
        shared: true,
        intersect: false,
        x: {
          formatter: function (_, { dataPointIndex }) {
            return data.id[dataPointIndex];
          },
        },
        y: {
          formatter: function (y) {
            if (typeof y !== 'undefined') {
              return y.toFixed(0);
            }
            return y;
          },
        },
      },
    };

    setOptions(newOption);
  }, [data, selectedId, colorBySelectedId]);

  useEffect(() => {
    if (!data) return;

    setSeries([
      {
        name: 'value_bar',
        type: 'column',
        data: data.bar,
      },
      {
        name: 'value_area',
        type: 'area',
        data: data.area,
      },
    ]);
  }, [data]);

  return {
    series,
    options,
  };
};
