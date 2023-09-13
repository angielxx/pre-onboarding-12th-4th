import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useQueryClient } from '@tanstack/react-query';

import { FilterChip } from '@/components';
import { MainDataType } from '@/types/chart';

interface Props {
  selectedId: string | null;
  selectId: (id: string) => void;
}

export const FilterList = ({ selectedId, selectId }: Props) => {
  const queryclient = useQueryClient();
  const data = queryclient.getQueryData<MainDataType>(['MainData']);

  const [filterIds, setFilterIds] = useState<string[] | null>(null);

  useEffect(() => {
    if (!data) return;

    setFilterIds(Array.from(new Set(data.id)));
  }, [data]);

  return (
    <FilterContainer>
      {filterIds &&
        filterIds.map((id, idx) => (
          <FilterChip
            key={idx}
            title={id}
            isSelected={selectedId === id}
            onClick={() => selectId(id)}
          />
        ))}
    </FilterContainer>
  );
};

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  height: 20px;
`;
