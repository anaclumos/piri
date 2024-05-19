---
title: 내장 React Hooks
---

<Intro>

*Hooks*를 사용하면 컴포넌트에서 다양한 React 기능을 사용할 수 있습니다. 내장된 Hooks를 사용하거나 이를 결합하여 자신만의 Hooks를 만들 수 있습니다. 이 페이지는 React의 모든 내장 Hooks를 나열합니다.

</Intro>

---

## State Hooks {/*state-hooks*/}

*State*는 컴포넌트가 [사용자 입력과 같은 정보를 "기억"할 수 있게 합니다.](/learn/state-a-components-memory) 예를 들어, 폼 컴포넌트는 state를 사용하여 입력 값을 저장할 수 있고, 이미지 갤러리 컴포넌트는 state를 사용하여 선택된 이미지 인덱스를 저장할 수 있습니다.

컴포넌트에 state를 추가하려면 다음 Hooks 중 하나를 사용하세요:

* [`useState`](/reference/react/useState)는 직접 업데이트할 수 있는 state 변수를 선언합니다.
* [`useReducer`](/reference/react/useReducer)는 [리듀서 함수](/learn/extracting-state-logic-into-a-reducer) 내에 업데이트 로직이 있는 state 변수를 선언합니다.

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## Context Hooks {/*context-hooks*/}

*Context*는 컴포넌트가 [props로 전달하지 않고도 먼 부모로부터 정보를 받을 수 있게 합니다.](/learn/passing-props-to-a-component) 예를 들어, 앱의 최상위 컴포넌트는 현재 UI 테마를 모든 하위 컴포넌트에 전달할 수 있습니다.

* [`useContext`](/reference/react/useContext)는 컨텍스트를 읽고 구독합니다.

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Ref Hooks {/*ref-hooks*/}

*Refs*는 컴포넌트가 [렌더링에 사용되지 않는 정보를 보유할 수 있게 합니다,](/learn/referencing-values-with-refs) 예를 들어 DOM 노드나 타임아웃 ID와 같은 정보를 보유할 수 있습니다. state와 달리 ref를 업데이트해도 컴포넌트가 다시 렌더링되지 않습니다. Refs는 React 패러다임에서 벗어나는 "탈출구"입니다. 내장된 브라우저 API와 같은 비-React 시스템과 작업할 때 유용합니다.

* [`useRef`](/reference/react/useRef)는 ref를 선언합니다. 어떤 값이든 보유할 수 있지만, 대부분 DOM 노드를 보유하는 데 사용됩니다.
* [`useImperativeHandle`](/reference/react/useImperativeHandle)는 컴포넌트가 노출하는 ref를 사용자 정의할 수 있게 합니다. 이는 거의 사용되지 않습니다.

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## Effect Hooks {/*effect-hooks*/}

*Effects*는 컴포넌트가 [외부 시스템과 연결하고 동기화할 수 있게 합니다.](/learn/synchronizing-with-effects) 여기에는 네트워크, 브라우저 DOM, 애니메이션, 다른 UI 라이브러리를 사용하여 작성된 위젯 및 기타 비-React 코드와의 작업이 포함됩니다.

* [`useEffect`](/reference/react/useEffect)는 컴포넌트를 외부 시스템에 연결합니다.

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```

Effects는 React 패러다임에서 벗어나는 "탈출구"입니다. 애플리케이션의 데이터 흐름을 조정하기 위해 Effects를 사용하지 마세요. 외부 시스템과 상호작용하지 않는 경우, [Effect가 필요하지 않을 수 있습니다.](/learn/you-might-not-need-an-effect)

`useEffect`에는 타이밍에 차이가 있는 두 가지 잘 사용되지 않는 변형이 있습니다:

* [`useLayoutEffect`](/reference/react/useLayoutEffect)는 브라우저가 화면을 다시 그리기 전에 실행됩니다. 여기서 레이아웃을 측정할 수 있습니다.
* [`useInsertionEffect`](/reference/react/useInsertionEffect)는 React가 DOM을 변경하기 전에 실행됩니다. 라이브러리는 여기서 동적 CSS를 삽입할 수 있습니다.

---

## Performance Hooks {/*performance-hooks*/}

리렌더링 성능을 최적화하는 일반적인 방법은 불필요한 작업을 건너뛰는 것입니다. 예를 들어, React에게 캐시된 계산을 재사용하거나 이전 렌더링 이후 데이터가 변경되지 않은 경우 리렌더링을 건너뛰도록 지시할 수 있습니다.

계산과 불필요한 리렌더링을 건너뛰려면 다음 Hooks 중 하나를 사용하세요:

- [`useMemo`](/reference/react/useMemo)는 비용이 많이 드는 계산의 결과를 캐시할 수 있게 합니다.
- [`useCallback`](/reference/react/useCallback)는 최적화된 컴포넌트에 전달하기 전에 함수 정의를 캐시할 수 있게 합니다.

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

때로는 화면이 실제로 업데이트되어야 하기 때문에 리렌더링을 건너뛸 수 없습니다. 그런 경우, 입력에 타이핑하는 것과 같은 동기화가 필요한 차단 업데이트와 차트를 업데이트하는 것과 같은 사용자 인터페이스를 차단할 필요가 없는 비차단 업데이트를 분리하여 성능을 향상시킬 수 있습니다.

렌더링을 우선시하려면 다음 Hooks 중 하나를 사용하세요:

- [`useTransition`](/reference/react/useTransition)은 상태 전환을 비차단으로 표시하고 다른 업데이트가 이를 중단할 수 있게 합니다.
- [`useDeferredValue`](/reference/react/useDeferredValue)는 UI의 비중요 부분 업데이트를 지연시키고 다른 부분이 먼저 업데이트되도록 합니다.

---

## Other Hooks {/*other-hooks*/}

이 Hooks는 대부분 라이브러리 작성자에게 유용하며 애플리케이션 코드에서는 자주 사용되지 않습니다.

- [`useDebugValue`](/reference/react/useDebugValue)는 사용자 정의 Hook에 대해 React DevTools가 표시하는 레이블을 사용자 정의할 수 있게 합니다.
- [`useId`](/reference/react/useId)는 컴포넌트가 고유 ID를 자신과 연결할 수 있게 합니다. 주로 접근성 API와 함께 사용됩니다.
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore)는 컴포넌트가 외부 스토어에 구독할 수 있게 합니다.
* [`useActionState`](/reference/react/useActionState)는 액션의 상태를 관리할 수 있게 합니다.

---

## Your own Hooks {/*your-own-hooks*/}

JavaScript 함수를 사용하여 [자신만의 커스텀 Hooks를 정의할 수 있습니다.](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component)