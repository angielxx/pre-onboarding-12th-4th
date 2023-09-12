import { ApexOptions } from 'apexcharts';
import { useState } from 'react';
import ApexCharts from 'react-apexcharts';
import { styled } from 'styled-components';

import { SeriesType } from '@/types/MainChart';
import { useQuery } from '@tanstack/react-query';
import { FetchAndDefineMainData } from '@/utils/QueryFn/mainData';

export const MainChart = () => {
  const { data } = useQuery(['data'], FetchAndDefineMainData);

  const [series, setSeries] = useState<SeriesType[]>([
    {
      name: 'value_bar',
      type: 'column',
      data: data ? data.bar : [],
    },
    {
      name: 'value_area',
      type: 'area',
      data: data ? data.area : [],
    },
  ]);

  return (
    <ChartWrapper>
      <ApexCharts options={options} series={series} type="line" height={350} />
    </ChartWrapper>
  );
};

const options: ApexOptions = {
  chart: {
    height: 350,
    type: 'line',
    stacked: false,
  },
  stroke: {
    width: [0, 2, 5],
    curve: 'smooth',
  },
  plotOptions: {
    bar: {
      columnWidth: '50%',
    },
  },

  fill: {
    opacity: [0.85, 0.25, 1],
    gradient: {
      inverseColors: false,
      shade: 'light',
      type: 'vertical',
      opacityFrom: 0.85,
      opacityTo: 0.55,
      stops: [0, 100, 100, 100],
    },
  },
  labels: [
    '01/01/2003',
    '02/01/2003',
    '03/01/2003',
    '04/01/2003',
    '05/01/2003',
    '06/01/2003',
    '07/01/2003',
    '08/01/2003',
    '09/01/2003',
    '10/01/2003',
    '11/01/2003',
  ],
  markers: {
    size: 0,
  },
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    title: {
      text: 'Points',
    },
    min: 0,
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: function (y) {
        if (typeof y !== 'undefined') {
          return y.toFixed(0) + ' points';
        }
        return y;
      },
    },
  },
};

const ChartWrapper = styled.div`
  width: 50vw;
`;
