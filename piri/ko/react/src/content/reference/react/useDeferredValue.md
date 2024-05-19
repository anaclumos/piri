---
title: useDeferredValue
---

<Intro>

`useDeferredValue`는 UI의 일부 업데이트를 지연시킬 수 있게 해주는 React Hook입니다.

```js
const deferredValue = useDeferredValue(value)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `useDeferredValue(value, initialValue?)` {/*usedeferredvalue*/}

`useDeferredValue`를 컴포넌트의 최상위 레벨에서 호출하여 해당 값의 지연된 버전을 얻습니다.

```js
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `value`: 지연시키고 싶은 값입니다. 어떤 타입이든 가능합니다.
* <CanaryBadge title="이 기능은 Canary 채널에서만 사용할 수 있습니다" /> **선택적** `initialValue`: 컴포넌트의 초기 렌더링 동안 사용할 값입니다. 이 옵션을 생략하면, `useDeferredValue`는 초기 렌더링 동안 지연되지 않습니다. 왜냐하면 대신 렌더링할 `value`의 이전 버전이 없기 때문입니다.

#### 반환값 {/*returns*/}

- `currentValue`: 초기 렌더링 동안 반환된 지연된 값은 제공한 값과 동일합니다. 업데이트 동안 React는 먼저 이전 값으로 다시 렌더링을 시도하고(그래서 이전 값을 반환), 그 다음에 새로운 값으로 백그라운드에서 다시 렌더링을 시도합니다(그래서 업데이트된 값을 반환).

<Canary>

최신 React Canary 버전에서는, `useDeferredValue`가 초기 렌더링 시 `initialValue`를 반환하고, 백그라운드에서 반환된 `value`로 다시 렌더링을 예약합니다.

</Canary>

#### 주의사항 {/*caveats*/}

- 업데이트가 Transition 내에 있을 때, `useDeferredValue`는 항상 새로운 `value`를 반환하고 지연된 렌더링을 생성하지 않습니다. 왜냐하면 업데이트가 이미 지연되었기 때문입니다.

- `useDeferredValue`에 전달하는 값은 원시 값(문자열, 숫자 등)이나 렌더링 외부에서 생성된 객체여야 합니다. 렌더링 중에 새 객체를 생성하고 즉시 `useDeferredValue`에 전달하면, 매 렌더링마다 다르게 되어 불필요한 백그라운드 재렌더링을 유발합니다.

- `useDeferredValue`가 다른 값(예: [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)와 비교하여)을 받으면, 현재 렌더링(이전 값을 여전히 사용하는 경우) 외에도 새로운 값으로 백그라운드에서 다시 렌더링을 예약합니다. 백그라운드 재렌더링은 인터럽트 가능: `value`에 또 다른 업데이트가 있으면, React는 백그라운드 재렌더링을 처음부터 다시 시작합니다. 예를 들어, 사용자가 입력을 차트가 지연된 값을 받는 것보다 빠르게 입력하면, 사용자가 입력을 멈출 때까지 차트는 다시 렌더링되지 않습니다.

- `useDeferredValue`는 [`<Suspense>`](/reference/react/Suspense)와 통합되어 있습니다. 새로운 값으로 인한 백그라운드 업데이트가 UI를 중단시키면, 사용자는 대체 UI를 보지 않고 이전 지연된 값을 보게 됩니다.

- `useDeferredValue` 자체는 추가 네트워크 요청을 방지하지 않습니다.

- `useDeferredValue` 자체로 인한 고정된 지연은 없습니다. React가 원래의 재렌더링을 완료하면, 즉시 새로운 지연된 값으로 백그라운드 재렌더링을 시작합니다. 이벤트(예: 입력)로 인한 업데이트는 백그라운드 재렌더링을 중단시키고 우선 처리됩니다.

- `useDeferredValue`로 인한 백그라운드 재렌더링은 화면에 커밋될 때까지 Effects를 실행하지 않습니다. 백그라운드 재렌더링이 중단되면, 데이터가 로드되고 UI가 업데이트된 후에 Effects가 실행됩니다.

---

## 사용법 {/*usage*/}

### 새로운 콘텐츠가 로드되는 동안 오래된 콘텐츠 표시하기 {/*showing-stale-content-while-fresh-content-is-loading*/}

`useDeferredValue`를 컴포넌트의 최상위 레벨에서 호출하여 UI의 일부 업데이트를 지연시킵니다.

```js [[1, 5, "query"], [2, 5, "deferredQuery"]]
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

초기 렌더링 동안, <CodeStep step={2}>지연된 값</CodeStep>은 제공한 <CodeStep step={1}>값</CodeStep>과 동일합니다.

업데이트 동안, <CodeStep step={2}>지연된 값</CodeStep>은 최신 <CodeStep step={1}>값</CodeStep>보다 "뒤처집니다". 특히, React는 먼저 지연된 값을 업데이트하지 않고 다시 렌더링을 시도하고, 그 다음에 백그라운드에서 새로 받은 값으로 다시 렌더링을 시도합니다.

**이것이 유용한 경우를 예제로 살펴보겠습니다.**

<Note>

이 예제는 Suspense를 지원하는 데이터 소스를 사용한다고 가정합니다:

- [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) 및 [Next.js](https://nextjs.org/docs/getting-started/react-essentials)와 같은 Suspense를 지원하는 프레임워크를 사용한 데이터 가져오기
- [`lazy`](/reference/react/lazy)를 사용한 컴포넌트 코드의 지연 로드
- [`use`](/reference/react/use)를 사용한 Promise 값 읽기

[더 많은 Suspense 및 그 제한 사항에 대해 알아보세요.](/reference/react/Suspense)

</Note>

이 예제에서, `SearchResults` 컴포넌트는 검색 결과를 가져오는 동안 [중단됩니다](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading). `"a"`를 입력하고 결과를 기다린 다음 `"ab"`로 편집해 보세요. `"a"`에 대한 결과가 로딩 대체 UI로 교체됩니다.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

일반적인 대체 UI 패턴은 결과 목록 업데이트를 지연시키고 새 결과가 준비될 때까지 이전 결과를 계속 표시하는 것입니다. `useDeferredValue`를 호출하여 지연된 버전의 쿼리를 전달하세요:

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

`query`는 즉시 업데이트되어 입력란에 새 값이 표시됩니다. 그러나 `deferredQuery`는 데이터가 로드될 때까지 이전 값을 유지하므로 `SearchResults`는 잠시 동안 오래된 결과를 표시합니다.

아래 예제에서 `"a"`를 입력하고 결과가 로드될 때까지 기다린 다음 입력란을 `"ab"`로 편집해 보세요. Suspense 대체 UI 대신, 새 결과가 로드될 때까지 오래된 결과 목록이 표시되는 것을 확인할 수 있습니다:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

<DeepDive>

#### 값 지연이 내부적으로 어떻게 작동하나요? {/*how-does-deferring-a-value-work-under-the-hood*/}

두 단계로 이루어진다고 생각할 수 있습니다:

1. **먼저, React는 새로운 `query`(`"ab"`)로 다시 렌더링하지만, 이전 `deferredQuery`(여전히 `"a"`)로 렌더링합니다.** `deferredQuery` 값은 *지연된* 값입니다: `query` 값보다 "뒤처집니다".

2. **백그라운드에서, React는 *`query`와 `deferredQuery` 모두 업데이트된 상태로 다시 렌더링을 시도합니다.** 이 재렌더링이 완료되면 React는 이를 화면에 표시합니다. 그러나 중단되면(예: `"ab"`에 대한 결과가 아직 로드되지 않은 경우), React는 이 렌더링 시도를 포기하고 데이터가 로드된 후 다시 시도합니다. 사용자는 데이터가 준비될 때까지 오래된 지연된 값을 계속 보게 됩니다.

지연된 "백그라운드" 렌더링은 인터럽트 가능합니다. 예를 들어, 입력란에 다시 입력하면 React는 이를 포기하고 새 값으로 다시 시작합니다. React는 항상 최신 제공 값을 사용합니다.

여전히 각 키 입력마다 네트워크 요청이 발생합니다. 여기서 지연되는 것은 결과 표시(준비될 때까지)이지 네트워크 요청 자체는 아닙니다. 사용자가 계속 입력해도 각 키 입력에 대한 응답이 캐시되므로, 백스페이스를 누르면 즉시 반응하고 다시 가져오지 않습니다.

</DeepDive>

---

### 콘텐츠가 오래되었음을 나타내기 {/*indicating-that-the-content-is-stale*/}

위 예제에서는 최신 쿼리에 대한 결과 목록이 아직 로드 중임을 나타내는 표시가 없습니다. 새 결과가 로드되는 데 시간이 걸리면 사용자가 혼란스러울 수 있습니다. 결과 목록이 최신 쿼리와 일치하지 않을 때 시각적 표시를 추가하여 사용자가 더 명확하게 알 수 있도록 할 수 있습니다:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

이 변경으로 인해 입력을 시작하면 새 결과 목록이 로드될 때까지 오래된 결과 목록이 약간 희미해집니다. 아래 예제와 같이 CSS 전환을 추가하여 희미해지는 것을 점진적으로 느끼게 할 수도 있습니다:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div style={{
          opacity: isStale ? 0.5 : 1,
          transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
        }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

---

### UI의 일부 재렌더링 지연시키기 {/*deferring-re-rendering-for-a-part-of-the-ui*/}

`useDeferredValue`를 성능 최적화로 사용할 수도 있습니다. 이는 UI의 일부가 다시 렌더링하는 데 시간이 오래 걸리고, 이를 최적화할 쉬운 방법이 없으며, 나머지 UI를 차단하지 않도록 하고 싶을 때 유용합니다.

입력란과 매 키 입력마다 다시 렌더링되는 컴포넌트(예: 차트 또는 긴 목록)가 있다고 가정해 보겠습니다:

```js
function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

먼저, `SlowList`가 props가 동일할 때 재렌더링을 건너뛰도록 최적화합니다. 이를 위해 [`memo`로 감쌉니다:](/reference/react/memo#skipping-re-rendering-when-props-are-unchanged)

```js {1,3}
const SlowList = memo(function SlowList({ text }) {
  // ...
});
```

그러나 이는 `SlowList` props가 *이전과 동일할 때*만 도움이 됩니다. 현재 직면한 문제는 props가 *다를 때*이며, 실제로 다른 시각적 출력을 보여줘야 할 때입니다.

구체적으로, 주요 성능 문제는 입력란에 입력할 때마다 `SlowList`가 새로운 props를 받고, 전체 트리를 다시 렌더링하는 것이 입력을 느리게 만든다는 것입니다. 이 경우, `useDeferredValue`를 사용하면 입력 업데이트(빠르게 해야 함)를 결과 목록 업데이트(느려도 됨)보다 우선시할 수 있습니다:

```js {3,7}
function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

이는 `SlowList`의 재렌더링을 더 빠르게 만들지는 않습니다. 그러나 목록의 재렌더링이 키 입력을 차단하지 않도록 우선순위를 낮추도록 React에 알립니다. 목록은 입력보다 "뒤처지고" 나중에 "따라잡습니다". 이전과 마찬가지로, React는 가능한 빨리 목록을 업데이트하려고 시도하지만, 사용자가 입력하는 것을 차단하지 않습니다.

<Recipes titleText="useDeferredValue와 최적화되지 않은 재렌더링의 차이점" titleId="examples">

#### 목록의 지연된 재렌더링 {/*deferred-re-rendering-of-the-list*/}

이 예제에서, `SlowList` 컴포넌트의 각 항목은 **인위적으로 느리게** 되어 있어 `useDeferredValue`가 입력을 어떻게 반응하게 하는지 볼 수 있습니다. 입력란에 입력하고 입력이 빠르게 반응하는 동안 목록이 "뒤처지는" 것을 확인하세요.

<Sandpack>

```js
import { useState, useDeferredValue } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

```js src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log once. The actual slowdown is inside SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

#### 최적화되지 않은 목록의 재렌더링 {/*unoptimized-re-rendering-of-the-list*/}

이 예제에서, `SlowList` 컴포넌트의 각 항목은 **인위적으로 느리게** 되어 있지만, `useDeferredValue`는 없습니다.

입력란에 입력할 때 입력이 매우 느리게 반응하는 것을 확인하세요. 이는 `useDeferredValue` 없이 각 키 입력이 전체 목록을 즉시 다시 렌더링하게 하기 때문입니다.

<Sandpack>

```js
import { useState } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

```js src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log once. The actual slowdown is inside SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

이 최적화는 `SlowList`가 [`memo`](/reference/react/memo)로 감싸져 있어야 합니다. 이는 `text`가 변경될 때마다 React가 부모 컴포넌트를 빠르게 다시 렌더링할 수 있어야 하기 때문입니다. 그 재렌더링 동안, `deferredText`는 여전히 이전 값을 가지고 있으므로 `SlowList`는 재렌더링을 건너뛸 수 있습니다(그 props가 변경되지 않았기 때문입니다). [`memo`](/reference/react/memo) 없이도 재렌더링해야 하므로 최적화의 의미가 없어집니다.

</Pitfall>

<DeepDive>

#### 값 지연이 디바운싱 및 스로틀링과 어떻게 다른가요? {/*how-is-deferring-a-value-different-from-debouncing-and-throttling*/}

이 시나리오에서 사용해본 적이 있을 수 있는 두 가지 일반적인 최적화 기술이 있습니다:

- *디바운싱*은 사용자가 입력을 멈출 때까지(예: 1초 동안) 기다렸다가 목록을 업데이트하는 것입니다.
- *스로틀링*은 목록을 일정 시간마다(예: 최대 1초에 한 번) 업데이트하는 것입니다.

이 기술들이 일부 경우에 유용하지만, `useDeferredValue`는 렌더링을 최적화하는 데 더 적합합니다. 왜냐하면 React 자체와 깊이 통합되어 있으며 사용자의 장치에 적응하기 때문입니다.

디바운싱이나 스로틀링과 달리, 고정된 지연을 선택할 필요가 없습니다. 사용자의 장치가 빠르면(예: 강력한 노트북), 지연된 재렌더링은 거의 즉시 발생하여 눈에 띄지 않습니다. 사용자의 장치가 느리면 목록이 입력보다 "뒤처지고" 장치가 느린 정도에 비례하여 "따라잡습니다".

또한, 디바운싱이나 스로틀링과 달리, `useDeferredValue`로 수행된 지연된 재렌더링은 기본적으로 인터럽트 가능합니다. 이는 React가 큰 목록을 다시 렌더링하는 중에 사용자가 또 다른 키 입력을 하면, React가 그 재렌더링을 포기하고 키 입력을 처리한 다음 다시 백그라운드에서 렌더링을 시작한다는 것을 의미합니다. 반면, 디바운싱과 스로틀링은 여전히 *차단*되므로 렌더링이 키 입력을 차단하는 순간을 단순히 연기합니다.

최적화하려는 작업이 렌더링 중에 발생하지 않는 경우, 디바운싱과 스로틀링은 여전히 유용합니다. 예를 들어, 네트워크 요청을 줄일 수 있습니다. 이 기술들을 함께 사용할 수도 있습니다.

</DeepDive>