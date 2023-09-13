# 원티드 프리온보딩 4주차 - 시계열 차트 구현

## 📚 과제

### 시계열 차트 구현

#### 과제1. 시계열 차트 구현

- 데이터의 key값을 기반으로 시계열 차트 구성
- area, bar의 그래프가 모두 존재하는 복합 그래프로 구현
- y축에 대략적인 수치 구현

#### 과제2. 호버 기능 구현

- 특정 구역에 호버시 `id`, `value_area`, `value_bar` 데이터를 툴팁 형태로 제공

#### 과제3. 필터링 기능 구현

- 필터링은 특정 데이터 구역을 하이라이트 하는 방식으로 구현
- 버튼 형태로 ID값(지역이름)을 이용
- 버튼에서 선택한 ID값과 동일한 ID값을 가진 데이터 구역만 하이라이트 처리
- 특정 데이터 구역을 클릭 시에도 필터링 기능과 동일한 형태로 동일한 ID값을 가진 데이터 구역을 하이라이트

---

## 사용한 기술 스택

<img src="https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square"/> <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white"/> <img src="https://img.shields.io/badge/React Query-FF4154?style=flat-square&logo=React query&logoColor=white"/> <img src="https://img.shields.io/badge/Styled Components-DB7093?style=flat-square&logo=Styled components&logoColor=white"/> <img src="https://img.shields.io/badge/Apexcharts-0D74E8?style=flat-square&logo=Apexcharts&logoColor=white"/> <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white"/>

</br>

---

## 🎬 페이지 미리보기 & 구현영상

구현영상은 배포 링크로 대체합니다.
https://pre-onboarding-12th-4th.vercel.app/

---

### 💭 설계 방향

1. 코드의 가독성 및 재사용성

   - 재사용 가능한 커스텀 훅
   - 한 컴포넌트를 구성하고 있는 컴포넌트들의 추상화 정도를 비슷하게 맞춰 코드 가독성을 높였습니다.

2. 성능 최적화

   - React query의 캐싱기능을 활용하여

3. Suspense 및 Error boundary의 사용

---

## 🛠️ 구현 설명

### 1. 시계열 차트 구현

#### 데이터 타입 정의 및 정제

차트를 시각화하는데 사용하고 있는 라이브러리인 Apexcharts의 사용법을 훑어본 결과, 데이터의 원본 그대로 차트에 사용하기 어려워보였습니다. 그래서 데이터 차트를 시각화하기 위해 필요한 데이터의 인터페이스를 먼저 정의했습니다.

```typescript
// src/types/chart.ts
export interface MainDataType {
  id: string[];
  labels: string[];
  bar: number[];
  area: number[];
}
```

데이터 fetch시 위와 같이 정의한 MainDataType에 맞게 데이터를 정제하여 반환하는 유틸함수를 정의했습니다.

```typescript
// src/utils/mainData.ts
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
```

#### UI 로직과 비즈니스 로직의 분리

MainChart 컴포넌트에는 UI 관련한 로직만 있을 수 있도록 Chart의 내용이나 옵션을 구성하는 복잡하고 긴 로직을 useMainChartConfig라는 커스텀 훅으로 분리했습니다.

```typescript
// src/hooks/useMainChartConfig.tsx
export const useMainChartConfig = ({ data, selectedId }: Props) => {
  const [options, setOptions] = useState<ApexOptions | null>(null);
  const [series, setSeries] = useState<SeriesType[] | null>();
  //...

  // data에 따라 options을 구성하는 로직
  useEffect(() => {
    if (!data) return;

    const newOption: ApexOptions = {
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
      },
      // ...more options
    };

    setOptions(newOption);
  }, [data, selectedId, colorBySelectedId]);

  // data에 따라 series를 구성하는 로직
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

  // options과 series를 반환
  return {
    series,
    options,
  };
};
```

커스텀 훅을 통해 로직을 분리한 결과, MainChart에서는 UI를 구성하는데 필요한 series, options의 결과값만을 받아 Chart UI를 구성하는 데 바로 사용하는 것을 보실 수 있습니다.

```typescript
// src/components/Chart/MainChart.tsx
export const MainChart = () => {
  const { data } = useQuery(['data'], FetchAndDefineMainData);

  const { series, options } = useMainChartConfig({ data, selectedId });

  // ...

  return (
    <ChartWrapper>
      <FilterList selectedId={selectedId} selectId={chooseFilter} />
      {options && series && (
        <ApexCharts ref={chartRef} options={options} series={series} type="line" height={350} />
      )}
    </ChartWrapper>
  );
};
```

#### React Query의 캐싱기능을 통해 API 요청 최적화

React Query의 캐싱기능을 통해 API 요청 후 1시간(staleTime) 동안 캐시된 데이터를 사용하도록 했습니다. StaleTime의 경우, 주어진 mock data가 모두 2023년 2월 1일의 데이터임을 확인하고 현재 시점(2023년 9월 13일) 기준으로 과거의 데이터이기 때문에 최신 데이터를 반영할 필요가 없다고 생각하여 StaleTime을 1시간으로 길게 설정했습니다.

```typescript
// src/main.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      suspense: true,
      useErrorBoundary: true,
      staleTime: 1000 * 60 * 60,
      cacheTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});
```

캐시된 데이터가 사용되는 것을 눈으로 확인할 수 있도록 하기 위해, 차트 보기/숨기기 버튼을 구현했습니다. '차트 보기' 버튼 클릭 시 최초 API 요청 이후 '차트 숨기기'를 클릭하고 다시 '차트 보기'를 클릭했을 때, 'loading...'이 나타나지 않는 것을 확인할 수 있습니다.

또한 filterList에서 fetch한 데이터를 사용하여 사용자에게 제공 가능한 filter의 목록을 정제해야 했습니다. 이 때, 필요한 데이터인 MainData의 queryKey를 사용하여 queryClient에서 꺼내서 사용했습니다.

```typescript
// src/components/Filter/FilterList.tsx
export const FilterList = ({ selectedId, selectId }: Props) => {
  const queryclient = useQueryClient();
  const data = queryclient.getQueryData<MainDataType>(['MainData']);

  const [filterIds, setFilterIds] = useState<string[] | null>(null);

  useEffect(() => {
    if (!data) return;

    setFilterIds(Array.from(new Set(data.id)));
  }, [data]);

  return; //...
};
```

#### React Query + Suspense + Error Boundary

React의 Suspense와 Error Boundary를 사용하여 Loading 상태와 Error 상태에 따른 적절한 Fallback UI를 사용자에게 제공하고, React Query의 QueryErrorResetBoundary를 사용하여 Error 발생 시 해당 요청을 재시도하고 ErrorBoundary를 리셋하여 Error에 대한 가이드를 제공했습니다.

QueryErrorResetBoundary, ErrorBoundary와 Suspense를 사용하여 컴포넌트를 감싸는 부분을 재사용할 수 있도록 컴포넌트화 했습니다.

```typescript
export const ResetBoundaryWrapper = ({ children }: Props) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorFallback reset={resetErrorBoundary} error={error} />
          )}
        >
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
```

```typescript
// src/components/Fallback/ErrorFallback.tsx
export const ErrorFallback = ({ reset, error }: Props) => {
  const resetOnClick = () => reset();

  return (
    <div>
      <p>{error?.message}</p>
      <button onClick={resetOnClick}>Try again</button>
    </div>
  );
};

```

이 컴포넌트를 사용하여 Loading 및 Error가 발생할 수 있는 부분을 감쌌습니다.

```typescript
// src/components/Chart/ChartContainer.tsx
export const ChartContainer = () => {
  const [showChart, setShowChart] = useState < boolean > false;
  const [btnText, setBtnText] = useState < string > '';

  useEffect(() => {
    setBtnText(showChart ? '차트 숨기기' : '차트 보기');
  }, [showChart]);

  const toggleShowChart = () => setShowChart(prev => !prev);

  return (
    <Container>
      <Btn onClick={toggleShowChart}>{btnText}</Btn>
      {showChart && (
        <ResetBoundaryWrapper>
          <MainChart />
        </ResetBoundaryWrapper>
      )}
    </Container>
  );
};
```

### 2. 호버 기능 구현

호버 기능의 경우 ApexCharts 라이브러리에서 기본적으로 차트 호버시 ToolTip을 보여주는 기능이 있었기 때문에 쉽게 구현할 수 있었습니다. 다만, 옵션 내부에서 formatter를 통해 ToolTip의 내용을 원하는 형태로 구성해야 했습니다.

```typescript
// src/hooks/useMainChartConfig.tsx
export const useMainChartConfig = ({ data, selectedId }: Props) => {
  //...

  useEffect(() => {
    if (!data) return;

    const newOption: ApexOptions = {
      // ...more options
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

  //...

  return {
    series,
    options,
  };
};
```

### 3. 필터링 기능 구현

필터 버튼을 누르면 selectedId가 변경되고, 이 값을 차트의 옵션을 구성하는 커스텀 훅인 `useMainChartConfig`가 받아 차트의 옵션을 새로 구성하여 반환하도록 했습니다.

```typescript
// src/components/Chart/MainChart.tsx
export const MainChart = () => {
  //...

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { series, options } = useMainChartConfig({ data, selectedId });

  //...
};
```

ApexCharts에서 colors 옵션에 series의 수만큼 색상을 지정해주면 각 series에 colors 옵션에 같은 인덱스에 지정된 색상이 적용됩니다.

```typescript
// series의 값
[
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
];
```

```typescript
// color option
colors: [colorBySelectedId, '#00E396'],
```

colorBySelectedId 함수를 정의하여 selectedId에 따라 각 column의 색을 순서대로 담은 배열을 반환하여 옵션에 사용했습니다. 이 때 colorBySelectedId 함수는 useCallback을 사용하여 해당 함수의 반복적인 생성을 방지했습니다.

```typescript
const DEFAULT_COLUMN_COLOR = '#008FFB';
const HIGHLIGHT_COLUMN_COLOR = '#ff6060';

export const useMainChartConfig = ({ data, selectedId }: Props) => {
  //...

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
      //...more options

      colors: [colorBySelectedId, '#00E396'],

      //...more options
    };

    setOptions(newOption);
  }, [data, selectedId, colorBySelectedId]);
};
```

---

## 🛠️ 이슈 및 고민

### 1. 필터링 id 변경 시 차트 재렌더링 안되는 이슈

selectedId가 변경될 때, options가 변경됐는데로 불구하고 Chart가 다시 렌더링되지 않는 이슈가 있었습니다. options의 내용을 변수에 할당하여 state를 변경하는 방법을 사용하여 options의 이전 상태값과 현재 상태값의 Object.is 비교를 비교했고, 그 결과가 false인 것을 확인했습니다. 하지만 이 방법을 사용했음에도 재렌더링이 발생하지 않았습니다.

이러한 이유로 강제로 재렌더링 할 수 있는 방법을 사용하고자 했습니다. 임의의 state를 만들어 Options이 발생할 때 Date.now()의 값을 할당하여 상태를 변경하여 차트의 재렌더링이 발생할 수 있도록 했습니다. 하지만, 이 방법을 사용했음에도 재렌더링이 발생하지 않았습니다.

결과적으로 useRef를 사용해 selectedId가 변경됐을 때 직접 DOM을 조작하여 차트에 변경된 options를 반영하도록 했습니다.

```typescript
export const MainChart = () => {
  //...

  const chartRef = useRef<ChartType | null>(null);

  useEffect(() => {
    if (!data) return;

    if (chartRef.current && chartRef.current.chart) {
      chartRef.current.chart.updateOptions(options, true, true, false);
    }
  }, [selectedId, data, options]);

  //...

  return (
    <ChartWrapper>
      <FilterList selectedId={selectedId} selectId={chooseFilter} />
      {options && series && (
        <ApexCharts ref={chartRef} options={options} series={series} type="line" height={350} />
      )}
    </ChartWrapper>
  );
};
```

이 때, ref에 담기는 값이 ApexCharts 라이브러리에 내장된 type이 없어서 이에 맞는 타입을 정의하여 사용했습니다.

```typescript
// src/types/chart.ts
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
```
