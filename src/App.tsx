import { styled } from 'styled-components';
import { Suspense, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { ErrorFallback, Loading, MainChart } from '@/components';

function App() {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [btnText, setBtnText] = useState<string>('');

  useEffect(() => {
    setBtnText(showChart ? '차트 숨기기' : '차트 보기');
  }, [showChart]);

  const toggleShowChart = () => setShowChart(prev => !prev);

  return (
    <PageContainer>
      <button onClick={toggleShowChart}>{btnText}</button>
      {showChart && (
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              fallbackRender={({ error, resetErrorBoundary }) => (
                <ErrorFallback reset={resetErrorBoundary} error={error} />
              )}
            >
              <Suspense fallback={<Loading />}>
                <MainChart />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      )}
    </PageContainer>
  );
}

export default App;

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
