import { useQuery, useQueryErrorResetBoundary } from '@tanstack/react-query';
import { getData } from './apis';
import { styled } from 'styled-components';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './components/ErrorFallback';
import { Loading } from './components/Loading';
import { Chart } from './components/Chart';

function App() {
  const DEFAULT_STALE_TIME = 1000 * 60 * 60;

  const { data, error } = useQuery(['data'], getData, {
    suspense: true,
    staleTime: DEFAULT_STALE_TIME,
  });

  const { reset } = useQueryErrorResetBoundary();

  return (
    <PageContainer>
      <div>
        <h3>차트</h3>
        <Suspense fallback={<Loading />}>
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary }) => (
              <ErrorFallback resetErrorBoundary={resetErrorBoundary} error={error} />
            )}
          >
            <Chart data={data} />
          </ErrorBoundary>
        </Suspense>
      </div>
    </PageContainer>
  );
}

export default App;

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;
