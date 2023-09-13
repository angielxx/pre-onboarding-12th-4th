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

   - 스토어를 기능에 따라 분리하여 사용
   - 재사용 가능한 기능(debounce, fetch)을 커스텀 훅으로 정의

2. 성능 최적화

   - 검색창 입력값에 debounce를 적용하여 API 호출 횟수 최적화
   - API 호출의 결과를 로컬 스토리지에 캐싱하여 재사용

---

## 🛠️ 구현 설명

### 1. 검색창

아래 경우의 수를 모두 핸들링할 수 있도록 구현했습니다.

- [x] input 값 없을 때 최근 검색어 목록 보이기
- [x] input 값 있을 때 추천 검색어 목록 보이기
- [x] 키보드 이동시 최근검색어 혹은 추천검색어 중 선택된 검색어를 input에 반영
- [x] 키보드 이동 후 change 이벤트 발생 시 변경된 input 값으로 재반영
- [x] 마우스를 호버시 최근검색어 혹은 추천검색어 중 호버된 검색어를 input에 반영

#### keywordStore

input창과 관련된 상태와 액션들을 관리할 수 있는 keywordStore를 분리하여 작성했습니다.

```javascript
// keywordStore.ts
const useKeywordStore = create<State>()(
  devtools((set, get) => ({
    isShowList: false,
    isKeyDown: false,

    keyword: '',
    inputValue: '',

    selectedId: -1,
    keywordsList: [],

    setState: newState => set({ ...get(), ...newState }),

    setIsShowList: isShowList => set({ ...get(), isShowList }),
    setIsKeyDown: isKeyDown => set({ ...get(), isKeyDown }),

    setKeyword: keyword => set({ ...get(), keyword }),
    setInputValue: inputValue => set({ ...get(), inputValue }),

    setSelectedId: selectedId => set({ ...get(), selectedId }),
    setKeywordsList: keywordsList => set({ ...get(), keywordsList }),
  })),
);
```

특히, 아래 두 가지 값을 통해 사용자의 검색어를 관리했습니다. inputValue의 경우 사용자에 의해 입력된 문자를 보존하여 제공하기 위해 사용했으며, 키보드 이동 혹은 마우스 호버 이벤트로 최근 검색어 또는 추천 검색어 선택시 keyword에 반영했습니다. 이때 엔터 등의 이벤트 발생 시 최종적으로 사용자가 선택하는 검색어는 keyword가 되도록 구현했습니다.

- keyword : 검색에 최종적으로 반영될 검색어
- inputValue : 사용자의 의해 입력된 값

#### keyDown 이벤트 핸들러

input의 keyDown 핸들러에서 주목할 점은 두 가지 입니다.

1. 한글 입력 시 핸들러 중복 호출 방지

   - IME composition을 통해 OS와 브라우저 두 곳에서 keydown이벤트가 처리되기 때문에 핸들러가 두 번 호출되는 문제가 있었습니다 이를 방지하기 위해 keyboardEvent의 isComposing 속성이 true 일 때 핸들러가 작동하지 않도록 방지했습니다.

2. 위, 아래 방향키 입력 시 커서 이동 방지

- 위, 아래 방향키 입력 시 커서가 이동되는 현상이 발생했습니다. 이러한 현상을 방지하기 위해 event.preventDefault()로 기본 동작을 통한 커서 이동을 방지했습니다.

```javascript
// TextInput.tsx

//...
const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
  if (event.nativeEvent.isComposing) return;

  const { key } = event;

  if (key === 'ArrowUp') {
    event.preventDefault();
    setIsKeyDown(true);
    setSelectedId(Math.max(selectedId - 1, -1));
  } else if (key === 'ArrowDown') {
    event.preventDefault();
    setIsKeyDown(true);
    setSelectedId(Math.min(selectedId + 1, keywordsList.length - 1));
  } else if (key === 'Enter' && keyword.trim()) {
    event.preventDefault();
    addKeyword(keyword);
    setIsKeyDown(false);
    setIsShowList(false);
    setKeyword('');
    await setInputValue('');
    setSelectedId(-1);
    inputRef.current?.blur();
  }
};
```

#### 최근 검색어 및 추천 검색어 목록 표시

사용자의 입력값이 없을 때 최근 검색어를, 입력값이 발생했을 때 추천 검색어를 제공했습니다. 두 가지의 경우를 명시적으로 표시하기 위해 삼항 연산자를 사용하지 않고, 각 상태를 변수로 표시하여 그에 맞는 검색어를 제공했습니다.

```javascript
// KeywordsList.tsx
export const KeywordsList = () => {
  // ...

  const list_type = inputValue ? 'recommended' : 'recent';

  useEffect(() => {
    if (list_type === 'recent') {
      setKeywordsList(recentKeywords);
    }
    if (list_type === 'recommended') {
      setKeywordsList(data);
    }
  }, [data, recentKeywords, list_type, setKeywordsList]);

  return (
    <>
      {list_type === 'recent' && <RecentKeywordsList />}
      {list_type === 'recommended' && <RecommendedKeywordsList />}
    </>
  );
};
```

### 2. 추천 검색어 제공

- 어떠한 값에 대해 특정 시간이 지난 후 변화를 감지하는 debounce 기능을 커스텀 훅으로 분리했습니다.

```javascript
// useDebounce.tsx
import { useState, useEffect } from 'react';

export default function useDebounce<T>(value: T, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

- 검색어에 대한 API 호출을 담당하는 커스텀 훅 useSearchQuery를 정의했습니다.
- 사용자의 검색어에 debounce를 적용하여 API 호출 횟수를 최적화했습니다.
- 검색어에 대한 API 호출을 하기 전 'cache hit'인 경우 캐시된 데이터를 사용하고, 'cache miss'인 경우 API를 호출하도록 했습니다.

```javascript
// useSearchQuery.tsx
export const useSearchQuery = () => {
  const { setCache, findCache } = useCacheStore(state => state);

  const { keyword, isKeyDown } = useKeywordStore(state => state);

  const { setIsLoading, setData } = useFetchStore(state => state);

  const debouncedKeyword = useDebounce(keyword, 300);

  useEffect(() => {
    const fetchData = async (text: string) => {
      if (isKeyDown) return;

      try {
        setIsLoading(true);
        const { data } = await searchByKeyword(text);
        setData(data);
        setCache(text, data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isKeyDown) return;
    if (keyword === '') return;

    const cacheResult = findCache(keyword);

    if (cacheResult) {
      // 'cache hit'
      setData(cacheResult);
    } else {
      // 'cache miss'
      fetchData(debouncedKeyword);
    }
  }, [isKeyDown, keyword, debouncedKeyword]);

  return;
};
```

### 3. API 결과 캐싱 기능

- zustand의 persist middleware를 사용하여 local storage에 저장했습니다.
- 캐싱 관련한 로직만 담당하는 store인 cacheStore를 분리하여 작성했습니다.
- expire time의 기본값을 상수화하여 명시적으로 표현했습니다.
- expirre time를 인자로 받아 그 값에 따라 캐시 기한을 저장했습니다.

```javascript
// cacheStore.ts
export const DEFAULT_EXPIRE_TIME = 1000 * 60 * 60;

const useCacheStore = create<State>()(
  devtools(
    persist(
      (set, get) => ({
        cache: {},

        setCache: (key, data, expireTime = DEFAULT_EXPIRE_TIME): void => {
          const due = Date.now() + expireTime;
          set(state => ({ cache: { ...state.cache, [key]: { data, due } } }));
        },

        findCache: key => {
          const cacheData = get().cache[key];
          if (cacheData) {
            const hasExpired = cacheData.due < Date.now();
            if (hasExpired) return undefined;
            return cacheData.data;
          } else {
            return undefined;
          }
        },
      }),
      { name: 'cacheStore' },
    ),
  ),
);
```
