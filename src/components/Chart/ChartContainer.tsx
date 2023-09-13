import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { MainChart, ResetBoundaryWrapper } from '@/components';

export const ChartContainer = () => {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [btnText, setBtnText] = useState<string>('');

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

const Container = styled.div`
  height: 350px;
  width: 70%;
  min-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Btn = styled.button`
  border: none;
  padding: 8px 16px 8px 16px;
  border-radius: 99px;
  background-color: ${({ theme }) => theme.color.primaryLight};
  width: fit-content;
`;
