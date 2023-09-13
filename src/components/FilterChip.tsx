import { styled } from 'styled-components';

interface Props {
  title: string;
  isSelected: boolean;
}

export const FilterChip = ({ title, isSelected, ...rest }: Props) => {
  return (
    <ChipContainer isSelected={isSelected} {...rest}>
      <p>{title}</p>
    </ChipContainer>
  );
};

const ChipContainer = styled.div<{ isSelected: boolean }>`
  cursor: pointer;
  padding: 4px 8px 4px 8px;
  font-size: 12px;
  border-radius: 99px;
  width: fit-content;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.color.primary : theme.color.grey100};
  color: ${({ theme, isSelected }) => (isSelected ? theme.color.grey100 : '')};
`;
