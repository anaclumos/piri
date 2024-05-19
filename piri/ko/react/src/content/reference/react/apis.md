---
title: 내장 React API
---

<Intro>

[Hooks](/reference/react) 및 [Components](/reference/react/components) 외에도 `react` 패키지는 컴포넌트를 정의하는 데 유용한 몇 가지 다른 API를 내보냅니다. 이 페이지는 나머지 최신 React API를 모두 나열합니다.

</Intro>

---

* [`createContext`](/reference/react/createContext)는 자식 컴포넌트에 컨텍스트를 정의하고 제공할 수 있게 해줍니다. [`useContext`](/reference/react/useContext)와 함께 사용됩니다.
* [`forwardRef`](/reference/react/forwardRef)는 컴포넌트가 부모에게 DOM 노드를 ref로 노출할 수 있게 해줍니다. [`useRef`](/reference/react/useRef)와 함께 사용됩니다.
* [`lazy`](/reference/react/lazy)는 컴포넌트의 코드를 처음 렌더링될 때까지 로딩을 지연시킬 수 있게 해줍니다.
* [`memo`](/reference/react/memo)는 동일한 props로 재렌더링을 건너뛸 수 있게 해줍니다. [`useMemo`](/reference/react/useMemo) 및 [`useCallback`](/reference/react/useCallback)과 함께 사용됩니다.
* [`startTransition`](/reference/react/startTransition)은 상태 업데이트를 긴급하지 않게 표시할 수 있게 해줍니다. [`useTransition`](/reference/react/useTransition)과 유사합니다.

---

## Resource APIs {/*resource-apis*/}

*리소스*는 상태의 일부로 포함되지 않고도 컴포넌트에서 접근할 수 있습니다. 예를 들어, 컴포넌트는 Promise에서 메시지를 읽거나 컨텍스트에서 스타일링 정보를 읽을 수 있습니다.

리소스에서 값을 읽으려면 다음 API를 사용하십시오:

* [`use`](/reference/react/use)는 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 또는 [context](/learn/passing-data-deeply-with-context)와 같은 리소스의 값을 읽을 수 있게 해줍니다.
```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```