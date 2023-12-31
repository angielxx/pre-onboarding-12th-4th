import { styled } from 'styled-components';

export const Loading = () => {
  return (
    <LoadingWrapper>
      <p>Loading...</p>
    </LoadingWrapper>
  );
};

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
