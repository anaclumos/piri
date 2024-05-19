---
title: TypeScript 사용하기
re: https://github.com/reactjs/react.dev/issues/5960
---

<Intro>

TypeScript는 JavaScript 코드베이스에 타입 정의를 추가하는 인기 있는 방법입니다. 기본적으로 TypeScript는 [JSX를 지원](/learn/writing-markup-with-jsx)하며, 프로젝트에 [`@types/react`](https://www.npmjs.com/package/@types/react)와 [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom)를 추가하여 완전한 React Web 지원을 받을 수 있습니다.

</Intro>

<YouWillLearn>

* [React 컴포넌트와 TypeScript](/learn/typescript#typescript-with-react-components)
* [Hooks를 사용한 타이핑 예제](/learn/typescript#example-hooks)
* [`@types/react`의 일반적인 타입](/learn/typescript/#useful-types)
* [추가 학습 자료](/learn/typescript/#further-learning)

</YouWillLearn>

## 설치 {/*installation*/}

모든 [프로덕션급 React 프레임워크](/learn/start-a-new-react-project#production-grade-react-frameworks)는 TypeScript 사용을 지원합니다. 프레임워크별 설치 가이드를 따르세요:

- [Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### 기존 React 프로젝트에 TypeScript 추가하기 {/*adding-typescript-to-an-existing-react-project*/}

최신 버전의 React 타입 정의를 설치하려면:

<TerminalBlock>
npm install @types/react @types/react-dom
</TerminalBlock>

다음 컴파일러 옵션을 `tsconfig.json`에 설정해야 합니다:

1. [`lib`](https://www.typescriptlang.org/tsconfig/#lib)에 `dom`이 포함되어야 합니다 (참고: `lib` 옵션이 지정되지 않은 경우 기본적으로 `dom`이 포함됩니다).
1. [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx)는 유효한 옵션 중 하나로 설정되어야 합니다. 대부분의 애플리케이션에서는 `preserve`가 충분합니다.
  라이브러리를 게시하는 경우, 어떤 값을 선택할지에 대한 [`jsx` 문서](https://www.typescriptlang.org/tsconfig/#jsx)를 참조하세요.

## React 컴포넌트와 TypeScript {/*typescript-with-react-components*/}

<Note>

JSX를 포함하는 모든 파일은 `.tsx` 파일 확장자를 사용해야 합니다. 이는 이 파일에 JSX가 포함되어 있음을 TypeScript에 알리는 TypeScript 전용 확장자입니다.

</Note>

React와 함께 TypeScript를 작성하는 것은 React와 함께 JavaScript를 작성하는 것과 매우 유사합니다. 컴포넌트 작업 시 주요 차이점은 컴포넌트의 props에 대한 타입을 제공할 수 있다는 것입니다. 이러한 타입은 정확성 검사와 편집기 내 문서 제공에 사용될 수 있습니다.

[Quick Start](/learn) 가이드의 [`MyButton` 컴포넌트](/learn#components)를 가져와 버튼의 `title`을 설명하는 타입을 추가할 수 있습니다:

<Sandpack>

```tsx src/App.tsx active
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a button" />
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```
</Sandpack>

<Note>

이 샌드박스는 TypeScript 코드를 처리할 수 있지만 타입 체커를 실행하지 않습니다. 이는 학습을 위해 TypeScript 샌드박스를 수정할 수 있지만 타입 오류나 경고를 받지 않는다는 것을 의미합니다. 타입 검사를 받으려면 [TypeScript Playground](https://www.typescriptlang.org/play)를 사용하거나 더 완전한 기능을 갖춘 온라인 샌드박스를 사용하세요.

</Note>

이 인라인 구문은 컴포넌트에 대한 타입을 제공하는 가장 간단한 방법이지만, 설명해야 할 필드가 몇 개 생기기 시작하면 다루기 어려워질 수 있습니다. 대신, 컴포넌트의 props를 설명하기 위해 `interface` 또는 `type`을 사용할 수 있습니다:

<Sandpack>

```tsx src/App.tsx active
interface MyButtonProps {
  /** 버튼 안에 표시할 텍스트 */
  title: string;
  /** 버튼을 상호작용할 수 있는지 여부 */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
    <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a disabled button" disabled={true}/>
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

컴포넌트의 props를 설명하는 타입은 필요에 따라 간단하거나 복잡할 수 있지만, `type` 또는 `interface`로 설명된 객체 타입이어야 합니다. TypeScript가 객체를 설명하는 방법에 대해 [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)에서 배울 수 있지만, prop이 몇 가지 다른 타입 중 하나일 수 있는 경우를 설명하기 위해 [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)를 사용하거나 더 고급 사용 사례를 위해 [Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) 가이드를 참조할 수도 있습니다.


## Hooks 예제 {/*example-hooks*/}

`@types/react`의 타입 정의에는 내장된 Hooks에 대한 타입이 포함되어 있어 추가 설정 없이 컴포넌트에서 사용할 수 있습니다. 이들은 컴포넌트에서 작성한 코드를 고려하여 작성되었기 때문에, 많은 경우 [추론된 타입](https://www.typescriptlang.org/docs/handbook/type-inference.html)을 얻을 수 있으며, 이상적으로는 타입을 제공하는 세부 사항을 처리할 필요가 없습니다.

그러나 Hooks에 대한 타입을 제공하는 몇 가지 예제를 살펴볼 수 있습니다.

### `useState` {/*typing-usestate*/}

[`useState` Hook](/reference/react/useState)은 초기 상태로 전달된 값을 재사용하여 값의 타입을 결정합니다. 예를 들어:

```ts
// 타입을 "boolean"으로 추론
const [enabled, setEnabled] = useState(false);
```

이렇게 하면 `enabled`에 `boolean` 타입이 할당되고, `setEnabled`는 `boolean` 인수를 받거나 `boolean`을 반환하는 함수를 받는 함수가 됩니다. 상태에 대한 타입을 명시적으로 제공하려면 `useState` 호출에 타입 인수를 제공할 수 있습니다:

```ts 
// 타입을 "boolean"으로 명시적으로 설정
const [enabled, setEnabled] = useState<boolean>(false);
```

이 경우에는 별로 유용하지 않지만, 공통적으로 타입을 제공하고자 하는 경우는 유니언 타입을 가질 때입니다. 예를 들어, 여기서 `status`는 몇 가지 다른 문자열 중 하나일 수 있습니다:

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

또는, [상태 구조화 원칙](/learn/choosing-the-state-structure#principles-for-structuring-state)에서 권장하는 대로 관련 상태를 객체로 그룹화하고 객체 타입을 통해 다양한 가능성을 설명할 수 있습니다:

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer` {/*typing-usereducer*/}

[`useReducer` Hook](/reference/react/useReducer)은 리듀서 함수와 초기 상태를 받는 더 복잡한 Hook입니다. 리듀서 함수의 타입은 초기 상태에서 추론됩니다. 상태에 대한 타입을 제공하기 위해 `useReducer` 호출에 타입 인수를 선택적으로 제공할 수 있지만, 초기 상태에 타입을 설정하는 것이 더 좋습니다:

<Sandpack>

```tsx src/App.tsx active
import {useReducer} from 'react';

interface State {
   count: number 
};

type CounterAction =
  | { type: "reset" }
  | { type: "setCount"; value: State["count"] }

const initialState: State = { count: 0 };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setCount":
      return { ...state, count: action.value };
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>Welcome to my counter</h1>

      <p>Count: {state.count}</p>
      <button onClick={addFive}>Add 5</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>


우리는 몇 가지 주요 위치에서 TypeScript를 사용하고 있습니다:

 - `interface State`는 리듀서의 상태 모양을 설명합니다.
 - `type CounterAction`은 리듀서에 디스패치할 수 있는 다양한 액션을 설명합니다.
 - `const initialState: State`는 초기 상태에 대한 타입을 제공하며, 기본적으로 `useReducer`에서 사용되는 타입입니다.
 - `stateReducer(state: State, action: CounterAction): State`는 리듀서 함수의 인수와 반환 값에 대한 타입을 설정합니다.

`initialState`에 타입을 설정하는 것보다 더 명시적인 대안은 `useReducer`에 타입 인수를 제공하는 것입니다:

```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext` {/*typing-usecontext*/}

[`useContext` Hook](/reference/react/useContext)은 컴포넌트를 통해 props를 전달하지 않고 데이터 트리를 통해 데이터를 전달하는 기술입니다. 이는 제공자 컴포넌트를 생성하고 자주 자식 컴포넌트에서 값을 소비하기 위한 Hook을 생성하여 사용됩니다.

컨텍스트에서 제공되는 값의 타입은 `createContext` 호출에 전달된 값에서 추론됩니다:

<Sandpack>

```tsx src/App.tsx active
import { createContext, useContext, useState } from 'react';

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<Theme>("system");

const useGetTheme = () => useContext(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext.Provider value={theme}>
      <MyComponent />
    </ThemeContext.Provider>
  )
}

function MyComponent() {
  const theme = useGetTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
    </div>
  )
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

이 기술은 의미 있는 기본값이 있을 때 작동합니다 - 그러나 때때로 기본값이 없을 때 `null`이 합리적으로 느껴질 수 있습니다. 그러나 타입 시스템이 코드를 이해할 수 있도록 `ContextShape | null`을 `createContext`에 명시적으로 설정해야 합니다.

이로 인해 컨텍스트 소비자에 대한 타입에서 `| null`을 제거해야 하는 문제가 발생합니다. 우리의 권장 사항은 Hook이 존재 여부를 런타임에서 확인하고 존재하지 않을 때 오류를 발생시키는 것입니다:

```js {5, 16-20}
import { createContext, useContext, useState, useMemo } from 'react';

// 이것은 더 간단한 예제이지만, 여기서 더 복잡한 객체를 상상할 수 있습니다
type ComplexObject = {
  kind: string
};

// 컨텍스트는 기본값을 정확하게 반영하기 위해 타입에 `| null`로 생성됩니다.
const Context = createContext<ComplexObject | null>(null);

// Hook에서 존재 여부를 확인하여 `| null`이 제거됩니다.
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("useGetComplexObject must be used within a Provider") }
  return object;
}

export default function MyApp() {
  const object = useMemo(() => ({ kind: "complex" }), []);

  return (
    <Context.Provider value={object}>
      <MyComponent />
    </Context.Provider>
  )
}

function MyComponent() {
  const object = useGetComplexObject();

  return (
    <div>
      <p>Current object: {object.kind}</p>
    </div>
  )
}
```

### `useMemo` {/*typing-usememo*/}

[`useMemo`](/reference/react/useMemo) Hooks는 함수 호출에서 메모이제이션된 값을 생성/재접근하며, 두 번째 매개변수로 전달된 종속성이 변경될 때만 함수를 다시 실행합니다. Hook 호출의 결과는 첫 번째 매개변수의 함수 반환 값에서 추론됩니다. Hook에 타입 인수를 제공하여 더 명시적으로 할 수 있습니다.

```ts
// visibleTodos의 타입은 filterTodos의 반환 값에서 추론됩니다
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```


### `useCallback` {/*typing-usecallback*/}

[`useCallback`](/reference/react/useCallback)은 두 번째 매개변수로 전달된 종속성이 동일한 한 함수에 대한 안정적인 참조를 제공합니다. `useMemo`와 마찬가지로 함수의 타입은 첫 번째 매개변수의 함수 반환 값에서 추론되며, Hook에 타입 인수를 제공하여 더 명시적으로 할 수 있습니다.

```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

TypeScript strict 모드에서 작업할 때 `useCallback`은 콜백의 매개변수에 대한 타입을 추가해야 합니다. 이는 콜백의 타입이 함수의 반환 값에서 추론되며, 매개변수 없이 타입을 완전히 이해할 수 없기 때문입니다.

코드 스타일 선호도에 따라, `*EventHandler` 함수를 사용하여 콜백을 정의할 때 이벤트 핸들러에 대한 타입을 제공할 수 있습니다:

```ts
import { useState, useCallback } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])
  
  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

## 유용한 타입 {/*useful-types*/}

`@types/react` 패키지에서 제공하는 타입은 매우 광범위하며, React와 TypeScript의 상호 작용에 익숙해지면 읽어볼 가치가 있습니다. [DefinitelyTyped의 React 폴더](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts)에서 찾을 수 있습니다. 여기서는 몇 가지 일반적인 타입을 다루겠습니다.

### DOM 이벤트 {/*typing-dom-events*/}

React에서 DOM 이벤트를 다룰 때, 이벤트의 타입은 종종 이벤트 핸들러에서 추론될 수 있습니다. 그러나 이벤트 핸들러에 전달할 함수를 추출하려면 이벤트의 타입을 명시적으로 설정해야 합니다.

<Sandpack>

```tsx src/App.tsx active
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

React 타입에는 많은 이벤트 타입이 제공됩니다 - 전체 목록은 [여기](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373)에서 찾을 수 있으며, 이는 [DOM의 가장 인기 있는 이벤트](https://developer.mozilla.org/en-US/docs/Web/Events)를 기반으로 합니다.

찾고 있는 타입을 결정할 때 사용하는 이벤트 핸들러의 호버 정보를 먼저 확인할 수 있으며, 이는 이벤트의 타입을 보여줍니다.

이 목록에 포함되지 않은 이벤트를 사용해야 하는 경우, `React.SyntheticEvent` 타입을 사용할 수 있으며, 이는 모든 이벤트의 기본 타입입니다.

### Children {/*typing-children*/}

컴포넌트의 children을 설명하는 두 가지 일반적인 방법이 있습니다. 첫 번째는 JSX에서 children으로 전달될 수 있는 모든 가능한 타입의 유니언인 `React.ReactNode` 타입을 사용하는 것입니다:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

이는 children의 매우 광범위한 정의입니다. 두 번째는 JSX 요소만 포함하고 문자열이나 숫자와 같은 JavaScript 원시 타입을 포함하지 않는 `React.ReactElement` 타입을 사용하는 것입니다:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

참고로, TypeScript를 사용하여 특정 타입의 JSX 요소만 children으로 허용하는 컴포넌트를 설명할 수는 없습니다. 예를 들어, `li` 요소만 children으로 허용하는 컴포넌트를 타입 시스템으로 설명할 수 없습니다.

`React.ReactNode`와 `React.ReactElement`의 예제를 타입 체커와 함께 [이 TypeScript 플레이그라운드](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFf39deFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA)에서 확인할 수 있습니다.

### 스타일 Props {/*typing-style-props*/}

React에서 인라인 스타일을 사용할 때, `React.CSSProperties`를 사용하여 `style` prop에 전달되는 객체를 설명할 수 있습니다. 이 타입은 모든 가능한 CSS 속성의 유니언이며, `style` prop에 유효한 CSS 속성을 전달하는지 확인하고 편집기에서 자동 완성을 받을 수 있는 좋은 방법입니다.

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## 추가 학습 자료 {/*further-learning*/}

이 가이드는 React와 함께 TypeScript를 사용하는 기본 사항을 다루었지만, 배울 것이 훨씬 더 많습니다.
문서의 개별 API 페이지에는 TypeScript와 함께 사용하는 방법에 대한 더 심층적인 문서가 포함될 수 있습니다.

다음 리소스를 추천합니다:

 - [TypeScript 핸드북](https://www.typescriptlang.org/docs/handbook/)은 TypeScript의 공식 문서로, 대부분의 주요 언어 기능을 다룹니다.

 - [TypeScript 릴리스 노트](https://devblogs.microsoft.com/typescript/)는 새로운 기능을 깊이 있게 다룹니다.

 - [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)는 TypeScript와 React를 함께 사용하는 방법에 대한 커뮤니티 유지 치트 시트로, 이 문서보다 더 많은 유용한 엣지 케이스를 다루고 더 폭넓은 내용을 제공합니다.

 - [TypeScript 커뮤니티 Discord](https://discord.com/invite/typescript)는 TypeScript와 React 문제에 대한 질문을 하고 도움을 받을 수 있는 좋은 장소입니다.