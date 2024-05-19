---
title: useSyncExternalStore
---

<Intro>

`useSyncExternalStore`는 외부 스토어에 구독할 수 있게 해주는 React Hook입니다.

```js
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` {/*usesyncexternalstore*/}

`useSyncExternalStore`를 컴포넌트의 최상위에서 호출하여 외부 데이터 스토어에서 값을 읽습니다.

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

이 함수는 스토어의 데이터 스냅샷을 반환합니다. 두 개의 함수를 인수로 전달해야 합니다:

1. `subscribe` 함수는 스토어에 구독하고 구독을 해제하는 함수를 반환해야 합니다.
2. `getSnapshot` 함수는 스토어에서 데이터의 스냅샷을 읽어야 합니다.

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `subscribe`: 단일 `callback` 인수를 받아 스토어에 구독하는 함수입니다. 스토어가 변경되면 제공된 `callback`을 호출해야 합니다. 이는 컴포넌트를 다시 렌더링하게 만듭니다. `subscribe` 함수는 구독을 정리하는 함수를 반환해야 합니다.

* `getSnapshot`: 컴포넌트가 필요로 하는 스토어의 데이터 스냅샷을 반환하는 함수입니다. 스토어가 변경되지 않는 한, `getSnapshot`을 반복 호출해도 동일한 값을 반환해야 합니다. 스토어가 변경되고 반환된 값이 다르면(비교는 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)로 수행), React는 컴포넌트를 다시 렌더링합니다.

* **선택적** `getServerSnapshot`: 스토어의 초기 스냅샷을 반환하는 함수입니다. 이는 서버 렌더링 중과 클라이언트에서 서버 렌더링된 콘텐츠의 수화(hydration) 중에만 사용됩니다. 서버 스냅샷은 클라이언트와 서버 간에 동일해야 하며, 일반적으로 직렬화되어 서버에서 클라이언트로 전달됩니다. 이 인수를 생략하면 서버에서 컴포넌트를 렌더링할 때 오류가 발생합니다.

#### 반환값 {/*returns*/}

렌더링 로직에서 사용할 수 있는 스토어의 현재 스냅샷입니다.

#### 주의사항 {/*caveats*/}

* `getSnapshot`이 반환하는 스토어 스냅샷은 불변이어야 합니다. 기본 스토어에 가변 데이터가 있는 경우, 데이터가 변경되면 새로운 불변 스냅샷을 반환해야 합니다. 그렇지 않으면 마지막 스냅샷을 캐시하여 반환합니다.

* 다시 렌더링 중에 다른 `subscribe` 함수를 전달하면, React는 새로 전달된 `subscribe` 함수를 사용하여 스토어에 다시 구독합니다. 이를 방지하려면 `subscribe`을 컴포넌트 외부에 선언하세요.

* 스토어가 [비차단 전환 업데이트](/reference/react/useTransition) 중에 변경되면, React는 해당 업데이트를 차단 업데이트로 수행하는 것으로 되돌아갑니다. 구체적으로, 모든 전환 업데이트에 대해 React는 DOM에 변경 사항을 적용하기 직전에 `getSnapshot`을 두 번째로 호출합니다. 처음 호출했을 때와 다른 값을 반환하면, React는 업데이트를 처음부터 다시 시작하여 이번에는 차단 업데이트로 적용하여 화면의 모든 컴포넌트가 동일한 버전의 스토어를 반영하도록 합니다.

* `useSyncExternalStore`로 반환된 스토어 값을 기반으로 렌더를 _중단_하는 것은 권장되지 않습니다. 그 이유는 외부 스토어의 변경 사항을 [비차단 전환 업데이트](/reference/react/useTransition)로 표시할 수 없기 때문에, 가장 가까운 [`Suspense` 폴백](/reference/react/Suspense)을 트리거하여 이미 렌더된 콘텐츠를 로딩 스피너로 대체하게 되어 일반적으로 UX가 좋지 않기 때문입니다.

  예를 들어, 다음과 같은 경우는 권장되지 않습니다:

  ```js
  const LazyProductDetailPage = lazy(() => import('./ProductDetailPage.js'));

  function ShoppingApp() {
    const selectedProductId = useSyncExternalStore(...);

    // ❌ `selectedProductId`에 의존하는 Promise로 `use` 호출
    const data = use(fetchItem(selectedProductId))

    // ❌ `selectedProductId`에 따라 조건부로 lazy 컴포넌트 렌더링
    return selectedProductId != null ? <LazyProductDetailPage /> : <FeaturedProducts />;
  }
  ```

---

## 사용법 {/*usage*/}

### 외부 스토어에 구독하기 {/*subscribing-to-an-external-store*/}

대부분의 React 컴포넌트는 [props,](/learn/passing-props-to-a-component) [state,](/reference/react/useState) 및 [context](/reference/react/useContext)에서만 데이터를 읽습니다. 그러나 때때로 컴포넌트는 시간이 지남에 따라 변경되는 React 외부의 스토어에서 데이터를 읽어야 할 때가 있습니다. 여기에는 다음이 포함됩니다:

* React 외부에 상태를 보유하는 서드파티 상태 관리 라이브러리.
* 변경 사항을 구독할 수 있는 가변 값과 이벤트를 노출하는 브라우저 API.

`useSyncExternalStore`를 컴포넌트의 최상위에서 호출하여 외부 데이터 스토어에서 값을 읽습니다.

```js [[1, 5, "todosStore.subscribe"], [2, 5, "todosStore.getSnapshot"], [3, 5, "todos", 0]]
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

이 함수는 스토어의 <CodeStep step={3}>스냅샷</CodeStep>을 반환합니다. 두 개의 함수를 인수로 전달해야 합니다:

1. <CodeStep step={1}>`subscribe` 함수</CodeStep>는 스토어에 구독하고 구독을 해제하는 함수를 반환해야 합니다.
2. <CodeStep step={2}>`getSnapshot` 함수</CodeStep>는 스토어에서 데이터의 스냅샷을 읽어야 합니다.

React는 이 함수들을 사용하여 컴포넌트를 스토어에 구독하고 변경 시 다시 렌더링합니다.

예를 들어, 아래 샌드박스에서 `todosStore`는 React 외부에 데이터를 저장하는 외부 스토어로 구현되었습니다. `TodosApp` 컴포넌트는 `useSyncExternalStore` Hook을 사용하여 해당 외부 스토어에 연결합니다.

<Sandpack>

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

export default function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Add todo</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todoStore.js
// 이것은 React와 통합해야 할 수 있는 서드파티 스토어의 예입니다.

// 앱이 완전히 React로 구축된 경우,
// React 상태를 사용하는 것이 좋습니다.

let nextId = 0;
let todos = [{ id: nextId++, text: 'Todo #1' }];
let listeners = [];

export const todosStore = {
  addTodo() {
    todos = [...todos, { id: nextId++, text: 'Todo #' + nextId }]
    emitChange();
  },
  subscribe(listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot() {
    return todos;
  }
};

function emitChange() {
  for (let listener of listeners) {
    listener();
  }
}
```

</Sandpack>

<Note>

가능한 경우, 내장된 React 상태인 [`useState`](/reference/react/useState) 및 [`useReducer`](/reference/react/useReducer)를 사용하는 것이 좋습니다. `useSyncExternalStore` API는 주로 기존의 비-React 코드와 통합해야 할 때 유용합니다.

</Note>

---

### 브라우저 API에 구독하기 {/*subscribing-to-a-browser-api*/}

`useSyncExternalStore`를 추가하는 또 다른 이유는 시간이 지남에 따라 변경되는 브라우저에서 노출된 값을 구독하려는 경우입니다. 예를 들어, 네트워크 연결이 활성화되어 있는지 여부를 표시하려는 경우를 가정해 보겠습니다. 브라우저는 [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)이라는 속성을 통해 이 정보를 노출합니다.

이 값은 React의 인식 없이 변경될 수 있으므로 `useSyncExternalStore`로 읽어야 합니다.

```js
import { useSyncExternalStore } from 'react';

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

`getSnapshot` 함수를 구현하려면 브라우저 API에서 현재 값을 읽습니다:

```js
function getSnapshot() {
  return navigator.onLine;
}
```

다음으로, `subscribe` 함수를 구현해야 합니다. 예를 들어, `navigator.onLine`이 변경되면 브라우저는 `window` 객체에서 [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) 및 [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) 이벤트를 발생시킵니다. 제공된 `callback` 인수를 해당 이벤트에 구독하고, 구독을 정리하는 함수를 반환해야 합니다:

```js
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

이제 React는 외부 `navigator.onLine` API에서 값을 읽고 변경 사항에 구독하는 방법을 알게 되었습니다. 네트워크에서 장치를 분리하고 컴포넌트가 응답하여 다시 렌더링되는 것을 확인하세요:

<Sandpack>

```js
import { useSyncExternalStore } from 'react';

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
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

---

### 로직을 커스텀 Hook으로 추출하기 {/*extracting-the-logic-to-a-custom-hook*/}

일반적으로 `useSyncExternalStore`를 직접 컴포넌트에서 작성하지 않습니다. 대신, 보통 커스텀 Hook에서 호출합니다. 이렇게 하면 다른 컴포넌트에서 동일한 외부 스토어를 사용할 수 있습니다.

예를 들어, 이 커스텀 `useOnlineStatus` Hook은 네트워크가 온라인인지 여부를 추적합니다:

```js {3,6}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  // ...
}

function subscribe(callback) {
  // ...
}
```

이제 다른 컴포넌트는 기본 구현을 반복하지 않고 `useOnlineStatus`를 호출할 수 있습니다:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
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

---

### 서버 렌더링 지원 추가하기 {/*adding-support-for-server-rendering*/}

React 앱이 [서버 렌더링](/reference/react-dom/server)을 사용하는 경우, React 컴포넌트는 초기 HTML을 생성하기 위해 브라우저 환경 외부에서도 실행됩니다. 이는 외부 스토어에 연결할 때 몇 가지 문제를 일으킵니다:

- 브라우저 전용 API에 연결하는 경우, 서버에서는 작동하지 않습니다.
- 서드파티 데이터 스토어에 연결하는 경우, 서버와 클라이언트 간에 데이터가 일치해야 합니다.

이 문제를 해결하려면 `useSyncExternalStore`의 세 번째 인수로 `getServerSnapshot` 함수를 전달하세요:

```js {4,12-14}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // 서버에서 생성된 HTML에 대해 항상 "Online"을 표시
}

function subscribe(callback) {
  // ...
}
```

`getServerSnapshot` 함수는 `getSnapshot`과 유사하지만 두 가지 상황에서만 실행됩니다:

- HTML을 생성할 때 서버에서 실행됩니다.
- [수화(hydration)](/reference/react-dom/client/hydrateRoot) 중, 즉 서버 HTML을 가져와 상호작용 가능하게 만들 때 클라이언트에서 실행됩니다.

이를 통해 앱이 상호작용 가능해지기 전에 사용할 초기 스냅샷 값을 제공할 수 있습니다. 서버 렌더링에 의미 있는 초기 값이 없는 경우, 이 인수를 생략하여 [클라이언트에서 렌더링을 강제](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)할 수 있습니다.

<Note>

`getServerSnapshot`이 서버에서 반환한 것과 동일한 데이터를 초기 클라이언트 렌더링에서 반환하도록 하세요. 예를 들어, `getServerSnapshot`이 서버에서 일부 미리 채워진 스토어 콘텐츠를 반환한 경우, 이 콘텐츠를 클라이언트로 전송해야 합니다. 이를 수행하는 한 가지 방법은 서버 렌더링 중에 `<script>` 태그를 내보내 `window.MY_STORE_DATA`와 같은 전역 변수를 설정하고, 클라이언트에서 `getServerSnapshot`에서 해당 전역 변수를 읽는 것입니다. 외부 스토어는 이를 수행하는 방법에 대한 지침을 제공해야 합니다.

</Note>

---

## 문제 해결 {/*troubleshooting*/}

### "The result of `getSnapshot` should be cached" 오류가 발생합니다 {/*im-getting-an-error-the-result-of-getsnapshot-should-be-cached*/}

이 오류는 `getSnapshot` 함수가 호출될 때마다 새로운 객체를 반환한다는 의미입니다. 예를 들어:

```js {2-5}
function getSnapshot() {
  // 🔴 `getSnapshot`에서 항상 다른 객체를 반환하지 마세요
  return {
    todos: myStore.todos
  };
}
```

`getSnapshot`의 반환 값이 마지막 호출 때와 다르면 React는 컴포넌트를 다시 렌더링합니다. 이 때문에 항상 다른 값을 반환하면 무한 루프에 빠져 이 오류가 발생합니다.

`getSnapshot` 객체는 실제로 변경된 경우에만 다른 객체를 반환해야 합니다. 스토어에 불변 데이터가 포함된 경우, 해당 데이터를 직접 반환할 수 있습니다:

```js {2-3}
function getSnapshot() {
  // ✅ 불변 데이터를 반환할 수 있습니다
  return myStore.todos;
}
```

스토어 데이터가 가변적인 경우, `getSnapshot` 함수는 불변 스냅샷을 반환해야 합니다. 이는 새로운 객체를 생성해야 한다는 의미이지만, 모든 호출에 대해 이를 수행해서는 안 됩니다. 대신, 마지막으로 계산된 스냅샷을 저장하고, 스토어의 데이터가 변경되지 않은 경우 마지막 스냅샷과 동일한 스냅샷을 반환해야 합니다. 가변 스토어의 데이터가 변경되었는지 여부를 결정하는 방법은 가변 스토어에 따라 다릅니다.

---

### `subscribe` 함수가 매번 다시 렌더링될 때마다 호출됩니다 {/*my-subscribe-function-gets-called-after-every-re-render*/}

이 `subscribe` 함수는 *컴포넌트 내부*에 정의되어 있어 매번 다시 렌더링될 때마다 다릅니다:

```js {4-7}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // 🚩 항상 다른 함수이므로 React는 매번 다시 렌더링될 때마다 다시 구독합니다
  function subscribe() {
    // ...
  }

  // ...
}
```
  
React는 다시 렌더링될 때마다 다른 `subscribe` 함수를 전달하면 스토어에 다시 구독합니다. 성능 문제를 일으키고 다시 구독을 피하고 싶다면, `subscribe` 함수를 컴포넌트 외부로 이동하세요:

```js {6-9}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}

// ✅ 항상 동일한 함수이므로 React는 다시 구독할 필요가 없습니다
function subscribe() {
  // ...
}
```

또는, `subscribe`을 [`useCallback`](/reference/react/useCallback)으로 감싸서 일부 인수가 변경될 때만 다시 구독하도록 할 수 있습니다:

```js {4-8}
function ChatIndicator({ userId }) {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // ✅ userId가 변경되지 않는 한 동일한 함수
  const subscribe = useCallback(() => {
    // ...
  }, [userId]);

  // ...
}
```