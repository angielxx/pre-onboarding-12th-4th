import { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import ApexCharts from 'react-apexcharts';
import { useQuery } from '@tanstack/react-query';

import { FilterList } from '@/components';
import { ChartType } from '@/types/chart';
import { FetchAndDefineMainData } from '@/utils/mainData';
import { useMainChartConfig } from '@/hooks/useMainChartConfig';

export const MainChart = () => {
  const { data } = useQuery(['MainData'], FetchAndDefineMainData);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { series, options } = useMainChartConfig({ data, selectedId });

  const chartRef = useRef<ChartType | null>(null);

  useEffect(() => {
    if (!data) return;

    if (chartRef.current && chartRef.current.chart) {
      chartRef.current.chart.updateOptions(options, true, true, false);
    }
  }, [selectedId, data, options]);

  const chooseFilter = (id: string) => {
    if (selectedId === id) setSelectedId(null);
    else if (!selectedId) setSelectedId(id);
    else setSelectedId(id);
  };

  return (
    <ChartWrapper>
      <FilterList selectedId={selectedId} selectId={chooseFilter} />
      {options && series && (
        <ApexCharts ref={chartRef} options={options} series={series} type="line" height={350} />
      )}
    </ChartWrapper>
  );
};

const ChartWrapper = styled.div`
  width: 100%;
`;
