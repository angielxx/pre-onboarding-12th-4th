import { styled } from 'styled-components';

import { ChartContainer } from '@/components/Chart/ChartContainer';

function App() {
  return (
    <PageContainer>
      <ChartContainer />
    </PageContainer>
  );
}

export default App;

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 32px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
`;
