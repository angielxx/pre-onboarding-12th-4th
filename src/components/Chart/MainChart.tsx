import { ApexOptions } from 'apexcharts';
import { useCallback, useEffect, useRef, useState } from 'react';
import ApexCharts from 'react-apexcharts';
import { styled } from 'styled-components';

import { useQuery } from '@tanstack/react-query';
import { FetchAndDefineMainData } from '@/utils/QueryFn/mainData';
import { FilterChip } from '../FilterChip';
import ReactApexChart from 'react-apexcharts';

export const MainChart = () => {
  const { data } = useQuery(['data'], FetchAndDefineMainData);

  const [series, setSeries] = useState<
    | {
        name: string;
        type: string;
        data: number[];
      }[]
    | null
  >();
  const [options, setOptions] = useState<ApexOptions | null>(null);
  const [filterIds, setFilterIds] = useState<string[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const chartRef = useRef<ChartType | null>(null);

  interface ChartType extends ReactApexChart {
    chart: any;
  }

  const colorBySelectedId = useCallback(
    ({ dataPointIndex }: { dataPointIndex: number }) => {
      if (selectedId === null) {
        return '#008FFB';
      } else {
        if (data?.id[dataPointIndex] === selectedId) return '#ff6060';
        return '#008FFB';
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
          // distributed: true,
          columnWidth: '50%',
        },
      },
      colors: [colorBySelectedId, '#00E396'],
      labels: data.labels,
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
    };

    setFilterIds(Array.from(new Set(data.id)));
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
    setOptions(newOption);

    if (chartRef.current && chartRef.current.chart) {
      chartRef.current.chart.updateOptions(options, true, true, false);
    }
  }, [data, selectedId, colorBySelectedId]);

  const chooseFilter = (id: string) => {
    if (selectedId === id) setSelectedId(null);
    else if (!selectedId) setSelectedId(id);
    else setSelectedId(id);
  };

  return (
    <ChartWrapper>
      <FilterContainer>
        {filterIds &&
          filterIds.map((id, idx) => (
            <div onClick={() => chooseFilter(id)} key={idx}>
              <FilterChip title={id} isSelected={selectedId === id} />
            </div>
          ))}
      </FilterContainer>
      {options && series && (
        <ApexCharts ref={chartRef} options={options} series={series} type="line" height={350} />
      )}
    </ChartWrapper>
  );
};

const ChartWrapper = styled.div`
  width: 90vw;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
`;
