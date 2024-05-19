---
title: hydrate
---

<Deprecated>

이 API는 React의 향후 주요 버전에서 제거될 예정입니다.

React 18에서는 `hydrate`가 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)로 대체되었습니다. React 18에서 `hydrate`를 사용하면 앱이 React 17에서 실행되는 것처럼 동작할 것이라는 경고가 표시됩니다. 자세한 내용은 [여기](/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis)에서 확인하세요.

</Deprecated>

<Intro>

`hydrate`는 React 17 이하에서 [`react-dom/server`](/reference/react-dom/server)에 의해 이전에 생성된 HTML 콘텐츠가 있는 브라우저 DOM 노드 내에 React 컴포넌트를 표시할 수 있게 합니다.

```js
hydrate(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `hydrate(reactNode, domNode, callback?)` {/*hydrate*/}

React 17 이하에서 `hydrate`를 호출하여 서버 환경에서 이미 렌더링된 기존 HTML에 React를 "연결"합니다.

```js
import { hydrate } from 'react-dom';

hydrate(reactNode, domNode);
```

React는 `domNode` 내부에 존재하는 HTML에 연결되어 그 내부의 DOM을 관리하게 됩니다. React로 완전히 구축된 앱은 일반적으로 루트 컴포넌트와 함께 하나의 `hydrate` 호출만 가집니다.

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `reactNode`: 기존 HTML을 렌더링하는 데 사용된 "React 노드". 이는 일반적으로 React 17에서 `renderToString(<App />)`과 같은 `ReactDOM Server` 메서드로 렌더링된 `<App />`과 같은 JSX 조각입니다.

* `domNode`: 서버에서 루트 요소로 렌더링된 [DOM 요소](https://developer.mozilla.org/en-US/docs/Web/API/Element).

* **선택 사항**: `callback`: 함수. 전달된 경우, React는 컴포넌트가 하이드레이션된 후에 이 함수를 호출합니다.

#### 반환값 {/*returns*/}

`hydrate`는 null을 반환합니다.

#### 주의사항 {/*caveats*/}
* `hydrate`는 렌더링된 콘텐츠가 서버에서 렌더링된 콘텐츠와 동일하다고 가정합니다. React는 텍스트 콘텐츠의 차이를 수정할 수 있지만, 불일치를 버그로 간주하고 수정해야 합니다.
* 개발 모드에서는 하이드레이션 중 불일치에 대해 경고합니다. 불일치가 발생할 경우 속성 차이가 수정될 것이라는 보장은 없습니다. 이는 대부분의 앱에서 불일치가 드물기 때문에 성능상의 이유로 중요합니다. 모든 마크업을 검증하는 것은 비용이 많이 들기 때문입니다.
* 앱에서 `hydrate` 호출은 하나만 있을 가능성이 큽니다. 프레임워크를 사용하는 경우, 프레임워크가 이 호출을 대신할 수 있습니다.
* 앱이 이미 렌더링된 HTML 없이 클라이언트에서 렌더링되는 경우, `hydrate()`를 사용하는 것은 지원되지 않습니다. 대신 [render()](/reference/react-dom/render) (React 17 이하) 또는 [createRoot()](/reference/react-dom/client/createRoot) (React 18+)를 사용하세요.

---

## 사용법 {/*usage*/}

`hydrate`를 호출하여 서버에서 렌더링된 <CodeStep step={1}>React 컴포넌트</CodeStep>를 브라우저 <CodeStep step={2}>DOM 노드</CodeStep>에 연결합니다.

```js [[1, 3, "<App />"], [2, 3, "document.getElementById('root')"]]
import { hydrate } from 'react-dom';

hydrate(<App />, document.getElementById('root'));
```

서버에서 렌더링된 HTML이 없는 클라이언트 전용 앱을 렌더링하기 위해 `hydrate()`를 사용하는 것은 지원되지 않습니다. 대신 [`render()`](/reference/react-dom/render) (React 17 이하) 또는 [`createRoot()`](/reference/react-dom/client/createRoot) (React 18+)를 사용하세요.

### 서버에서 렌더링된 HTML 하이드레이션 {/*hydrating-server-rendered-html*/}

React에서 "하이드레이션"은 서버 환경에서 이미 렌더링된 기존 HTML에 React가 "연결"되는 방식입니다. 하이드레이션 중에 React는 기존 마크업에 이벤트 리스너를 연결하고 클라이언트에서 앱 렌더링을 담당합니다.

React로 완전히 구축된 앱에서는 **일반적으로 전체 앱의 시작 시 한 번만 하나의 "루트"를 하이드레이트합니다**.

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Hello, world!</h1></div>
```

```js src/index.js active
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js src/App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>

일반적으로 `hydrate`를 다시 호출하거나 더 많은 곳에서 호출할 필요는 없습니다. 이 시점부터 React는 애플리케이션의 DOM을 관리하게 됩니다. UI를 업데이트하려면 컴포넌트가 [상태를 사용](/reference/react/useState)합니다.

하이드레이션에 대한 자세한 내용은 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 문서를 참조하세요.

---

### 피할 수 없는 하이드레이션 불일치 오류 억제 {/*suppressing-unavoidable-hydration-mismatch-errors*/}

서버와 클라이언트 간에 단일 요소의 속성 또는 텍스트 콘텐츠가 피할 수 없이 다른 경우(예: 타임스탬프), 하이드레이션 불일치 경고를 무시할 수 있습니다.

요소에서 하이드레이션 경고를 무시하려면 `suppressHydrationWarning={true}`를 추가하세요:

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Current Date: 01/01/2020</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js src/App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Current Date: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

이 방법은 한 단계 깊이까지만 작동하며, 탈출구로 사용하도록 설계되었습니다. 과도하게 사용하지 마세요. 텍스트 콘텐츠가 아닌 경우, React는 여전히 이를 수정하려고 시도하지 않으므로 향후 업데이트까지 일관성이 없을 수 있습니다.

---

### 클라이언트와 서버 콘텐츠가 다른 경우 처리 {/*handling-different-client-and-server-content*/}

서버와 클라이언트에서 의도적으로 다른 내용을 렌더링해야 하는 경우, 두 번의 렌더링을 수행할 수 있습니다. 클라이언트에서 다른 내용을 렌더링하는 컴포넌트는 [Effect](/reference/react/useEffect)에서 `true`로 설정할 수 있는 `isClient`와 같은 [상태 변수](/reference/react/useState)를 읽을 수 있습니다:

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Is Server</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js src/App.js active
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'Is Client' : 'Is Server'}
    </h1>
  );
}
```

</Sandpack>

이렇게 하면 초기 렌더링 패스가 서버와 동일한 콘텐츠를 렌더링하여 불일치를 피하지만, 하이드레이션 직후에 추가 패스가 동기적으로 발생합니다.

<Pitfall>

이 접근 방식은 컴포넌트가 두 번 렌더링해야 하므로 하이드레이션을 느리게 만듭니다. 느린 연결에서 사용자 경험을 신경 써야 합니다. JavaScript 코드가 초기 HTML 렌더링보다 훨씬 늦게 로드될 수 있으므로, 하이드레이션 직후에 다른 UI를 렌더링하는 것은 사용자에게 갑작스럽게 느껴질 수 있습니다.

</Pitfall>