import { ApexOptions } from 'apexcharts';
import { useEffect, useState } from 'react';
import ApexCharts from 'react-apexcharts';
import { styled } from 'styled-components';

import { SeriesType } from '@/types/MainChart';
import { useQuery } from '@tanstack/react-query';
import { FetchAndDefineMainData } from '@/utils/QueryFn/mainData';

export const MainChart = () => {
  const { data } = useQuery(['data'], FetchAndDefineMainData);

  const [series, setSeries] = useState<SeriesType[] | null>();
  const [options, setOptions] = useState<ApexOptions | null>(null);

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
    setOptions({
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
      },
      dataLabels: {
        enabled: false,
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
      labels: data.labels,
      title: { text: '프리온보딩 인턴쉽 4주차 - 시계열 차트 만들기', align: 'center' },
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
      markers: {
        size: 0,
      },
      xaxis: {
        type: 'datetime',
        labels: {
          show: true,
          rotate: -45,
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: [
        {
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
          seriesName: 'Income',
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
            return data?.id[dataPointIndex];
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
    });
  }, [data]);

  return (
    <ChartWrapper>
      {options && series && (
        <ApexCharts options={options} series={series} type="line" height={350} />
      )}
    </ChartWrapper>
  );
};

const ChartWrapper = styled.div`
  width: 90vw;
`;
