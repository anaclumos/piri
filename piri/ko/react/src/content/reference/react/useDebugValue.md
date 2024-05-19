---
title: useDebugValue
---

<Intro>

`useDebugValue`는 [React DevTools](/learn/react-developer-tools)에서 커스텀 Hook에 레이블을 추가할 수 있게 해주는 React Hook입니다.

```js
useDebugValue(value, format?)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `useDebugValue(value, format?)` {/*usedebugvalue*/}

읽기 쉬운 디버그 값을 표시하기 위해 [커스텀 Hook](/learn/reusing-logic-with-custom-hooks)의 최상위 레벨에서 `useDebugValue`를 호출하세요:

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `value`: React DevTools에 표시하려는 값입니다. 어떤 타입이든 가질 수 있습니다.
* **선택적** `format`: 포맷팅 함수입니다. 컴포넌트가 검사될 때, React DevTools는 `value`를 인수로 하여 포맷팅 함수를 호출하고, 반환된 포맷된 값(어떤 타입이든 가질 수 있음)을 표시합니다. 포맷팅 함수를 지정하지 않으면 원래 `value` 자체가 표시됩니다.

#### 반환값 {/*returns*/}

`useDebugValue`는 아무것도 반환하지 않습니다.

## 사용법 {/*usage*/}

### 커스텀 Hook에 레이블 추가하기 {/*adding-a-label-to-a-custom-hook*/}

읽기 쉬운 <CodeStep step={1}>디버그 값</CodeStep>을 [React DevTools](/learn/react-developer-tools)에 표시하기 위해 [커스텀 Hook](/learn/reusing-logic-with-custom-hooks)의 최상위 레벨에서 `useDebugValue`를 호출하세요.

```js [[1, 5, "isOnline ? 'Online' : 'Offline'"]]
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

이렇게 하면 `useOnlineStatus`를 호출하는 컴포넌트가 검사될 때 `OnlineStatus: "Online"`과 같은 레이블을 갖게 됩니다:

![React DevTools에서 디버그 값을 보여주는 스크린샷](/images/docs/react-devtools-usedebugvalue.png)

`useDebugValue` 호출이 없으면, 기본 데이터(이 예제에서는 `true`)만 표시됩니다.

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

export default function App() {
  return <StatusBar />;
}
```

```js src/useOnlineStatus.js active
import { useSyncExternalStore, useDebugValue } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

<Note>

모든 커스텀 Hook에 디버그 값을 추가하지 마세요. 이는 공유 라이브러리의 일부이며 내부 데이터 구조가 복잡하여 검사하기 어려운 커스텀 Hook에 가장 유용합니다.

</Note>

---

### 디버그 값의 포맷팅 지연하기 {/*deferring-formatting-of-a-debug-value*/}

`useDebugValue`의 두 번째 인수로 포맷팅 함수를 전달할 수도 있습니다:

```js [[1, 1, "date", 18], [2, 1, "date.toDateString()"]]
useDebugValue(date, date => date.toDateString());
```

포맷팅 함수는 <CodeStep step={1}>디버그 값</CodeStep>을 매개변수로 받아 <CodeStep step={2}>포맷된 표시 값</CodeStep>을 반환해야 합니다. 컴포넌트가 검사될 때, React DevTools는 이 함수를 호출하고 그 결과를 표시합니다.

이렇게 하면 컴포넌트가 실제로 검사되지 않는 한 잠재적으로 비용이 많이 드는 포맷팅 로직을 실행하지 않도록 할 수 있습니다. 예를 들어, `date`가 Date 값인 경우, 매 렌더링마다 `toDateString()`을 호출하는 것을 피할 수 있습니다.