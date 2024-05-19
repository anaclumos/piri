---
title: hydrateRoot
---

<Intro>

`hydrateRoot`는 [`react-dom/server`](/reference/react-dom/server)에 의해 이전에 생성된 HTML 콘텐츠가 있는 브라우저 DOM 노드 내에 React 컴포넌트를 표시할 수 있게 합니다.

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `hydrateRoot(domNode, reactNode, options?)` {/*hydrateroot*/}

`hydrateRoot`를 호출하여 서버 환경에서 이미 렌더링된 기존 HTML에 React를 "연결"합니다.

```js
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

React는 `domNode` 내부에 존재하는 HTML에 연결되어 그 내부의 DOM을 관리하게 됩니다. React로 완전히 구축된 앱은 일반적으로 루트 컴포넌트와 함께 하나의 `hydrateRoot` 호출만 가집니다.

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `domNode`: 서버에서 루트 요소로 렌더링된 [DOM 요소](https://developer.mozilla.org/en-US/docs/Web/API/Element).

* `reactNode`: 기존 HTML을 렌더링하는 데 사용된 "React 노드". 이는 일반적으로 `renderToPipeableStream(<App />)`과 같은 `ReactDOM Server` 메서드로 렌더링된 `<App />`와 같은 JSX 조각이 됩니다.

* **선택적** `options`: 이 React 루트에 대한 옵션이 포함된 객체.

  * <CanaryBadge title="이 기능은 Canary 채널에서만 사용할 수 있습니다" /> **선택적** `onCaughtError`: Error Boundary에서 React가 오류를 잡을 때 호출되는 콜백. Error Boundary에서 잡은 `error`와 `componentStack`을 포함하는 `errorInfo` 객체와 함께 호출됩니다.
  * <CanaryBadge title="이 기능은 Canary 채널에서만 사용할 수 있습니다" /> **선택적** `onUncaughtError`: Error Boundary에서 잡히지 않은 오류가 발생할 때 호출되는 콜백. 발생한 `error`와 `componentStack`을 포함하는 `errorInfo` 객체와 함께 호출됩니다.
  * **선택적** `onRecoverableError`: React가 자동으로 오류에서 복구할 때 호출되는 콜백. React가 던진 `error`와 `componentStack`을 포함하는 `errorInfo` 객체와 함께 호출됩니다. 일부 복구 가능한 오류는 `error.cause`로 원래 오류 원인을 포함할 수 있습니다.
  * **선택적** `identifierPrefix`: [`useId`](/reference/react/useId)에서 생성된 ID에 대해 React가 사용하는 문자열 접두사. 동일한 페이지에서 여러 루트를 사용할 때 충돌을 피하는 데 유용합니다. 서버에서 사용된 것과 동일한 접두사여야 합니다.


#### 반환값 {/*returns*/}

`hydrateRoot`는 두 가지 메서드인 [`render`](#root-render)와 [`unmount`](#root-unmount)를 가진 객체를 반환합니다.

#### 주의사항 {/*caveats*/}

* `hydrateRoot()`는 렌더링된 콘텐츠가 서버에서 렌더링된 콘텐츠와 동일하다고 기대합니다. 불일치를 버그로 간주하고 수정해야 합니다.
* 개발 모드에서는 React가 수화 중 불일치에 대해 경고합니다. 불일치가 발생할 경우 속성 차이가 패치될 것이라는 보장은 없습니다. 이는 대부분의 앱에서 불일치가 드물기 때문에 성능상의 이유로 중요합니다. 모든 마크업을 검증하는 것은 비용이 많이 들기 때문입니다.
* 앱에서 `hydrateRoot` 호출은 하나만 있을 가능성이 큽니다. 프레임워크를 사용하는 경우, 프레임워크가 이 호출을 대신 수행할 수 있습니다.
* 앱이 이미 렌더링된 HTML 없이 클라이언트에서 렌더링되는 경우, `hydrateRoot()`를 사용하는 것은 지원되지 않습니다. 대신 [`createRoot()`](/reference/react-dom/client/createRoot)를 사용하세요.

---

### `root.render(reactNode)` {/*root-render*/}

`root.render`를 호출하여 브라우저 DOM 요소에 대해 수화된 React 루트 내의 React 컴포넌트를 업데이트합니다.

```js
root.render(<App />);
```

React는 수화된 `root` 내에서 `<App />`을 업데이트합니다.

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*root-render-parameters*/}

* `reactNode`: 업데이트하려는 "React 노드". 이는 일반적으로 `<App />`와 같은 JSX 조각이지만, [`createElement()`](/reference/react/createElement)로 생성된 React 요소, 문자열, 숫자, `null`, 또는 `undefined`를 전달할 수도 있습니다.


#### 반환값 {/*root-render-returns*/}

`root.render`는 `undefined`를 반환합니다.

#### 주의사항 {/*root-render-caveats*/}

* 루트가 수화를 완료하기 전에 `root.render`를 호출하면 React는 기존의 서버 렌더링된 HTML 콘텐츠를 지우고 전체 루트를 클라이언트 렌더링으로 전환합니다.

---

### `root.unmount()` {/*root-unmount*/}

`root.unmount`를 호출하여 React 루트 내의 렌더링된 트리를 제거합니다.

```js
root.unmount();
```

React로 완전히 구축된 앱은 일반적으로 `root.unmount` 호출이 없습니다.

이는 주로 React 루트의 DOM 노드(또는 그 조상 중 하나)가 다른 코드에 의해 DOM에서 제거될 수 있는 경우에 유용합니다. 예를 들어, 비활성 탭을 DOM에서 제거하는 jQuery 탭 패널을 상상해 보세요. 탭이 제거되면 그 안의 모든 것(React 루트 포함)이 DOM에서 제거됩니다. React에 제거된 루트의 콘텐츠 관리를 "중지"하도록 `root.unmount`를 호출해야 합니다. 그렇지 않으면 제거된 루트 내부의 컴포넌트가 정리되지 않고 구독과 같은 리소스를 해제하지 않습니다.

`root.unmount`를 호출하면 루트의 모든 컴포넌트가 언마운트되고 루트 DOM 노드에서 React가 "분리"되며, 트리 내의 모든 이벤트 핸들러나 상태도 제거됩니다.


#### 매개변수 {/*root-unmount-parameters*/}

`root.unmount`는 매개변수를 받지 않습니다.


#### 반환값 {/*root-unmount-returns*/}

`root.unmount`는 `undefined`를 반환합니다.

#### 주의사항 {/*root-unmount-caveats*/}

* `root.unmount`를 호출하면 트리 내의 모든 컴포넌트가 언마운트되고 루트 DOM 노드에서 React가 "분리"됩니다.

* `root.unmount`를 호출한 후에는 루트에서 `root.render`를 다시 호출할 수 없습니다. 언마운트된 루트에서 `root.render`를 호출하려고 하면 "언마운트된 루트를 업데이트할 수 없습니다"라는 오류가 발생합니다.

---

## 사용법 {/*usage*/}

### 서버 렌더링된 HTML 수화 {/*hydrating-server-rendered-html*/}

앱의 HTML이 [`react-dom/server`](/reference/react-dom/client/createRoot)에 의해 생성된 경우, 클라이언트에서 이를 *수화*해야 합니다.

```js [[1, 3, "document.getElementById('root')"], [2, 3, "<App />"]]
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

이 코드는 <CodeStep step={1}>브라우저 DOM 노드</CodeStep> 내의 서버 HTML을 <CodeStep step={2}>React 컴포넌트</CodeStep>로 수화합니다. 일반적으로 시작 시 한 번 수행합니다. 프레임워크를 사용하는 경우, 프레임워크가 이 작업을 백그라운드에서 수행할 수 있습니다.

앱을 수화하려면 React가 서버에서 생성된 초기 HTML에 컴포넌트의 로직을 "연결"합니다. 수화는 서버에서 생성된 초기 HTML 스냅샷을 브라우저에서 실행되는 완전히 상호작용 가능한 앱으로 변환합니다.

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Hello, world!</h1><button>You clicked me <!-- -->0<!-- --> times</button></div>
```

```js src/index.js active
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>Hello, world!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked me {count} times
    </button>
  );
}
```

</Sandpack>

`hydrateRoot`를 다시 호출하거나 더 많은 곳에서 호출할 필요는 없습니다. 이 시점부터 React가 애플리케이션의 DOM을 관리합니다. UI를 업데이트하려면 컴포넌트가 [상태를 사용](/reference/react/useState)합니다.

<Pitfall>

`hydrateRoot`에 전달하는 React 트리는 서버에서와 **동일한 출력**을 생성해야 합니다.

이는 사용자 경험에 중요합니다. 사용자는 JavaScript 코드가 로드되기 전에 서버에서 생성된 HTML을 잠시 동안 보게 됩니다. 서버 렌더링은 HTML 스냅샷을 보여줌으로써 앱이 더 빨리 로드되는 착각을 일으킵니다. 갑자기 다른 콘텐츠를 표시하면 그 착각이 깨집니다. 따라서 서버 렌더 출력은 클라이언트의 초기 렌더 출력과 일치해야 합니다.

수화 오류를 유발하는 가장 일반적인 원인은 다음과 같습니다:

* 루트 노드 내부의 React가 생성한 HTML 주위의 여분의 공백(예: 줄 바꿈).
* 렌더링 로직에서 `typeof window !== 'undefined'`와 같은 체크 사용.
* 렌더링 로직에서 [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)와 같은 브라우저 전용 API 사용.
* 서버와 클라이언트에서 다른 데이터를 렌더링.

React는 일부 수화 오류에서 복구하지만, **다른 버그처럼 이를 수정해야 합니다.** 최상의 경우, 이는 속도 저하로 이어질 수 있으며, 최악의 경우 이벤트 핸들러가 잘못된 요소에 연결될 수 있습니다.

</Pitfall>

---

### 전체 문서 수화 {/*hydrating-an-entire-document*/}

React로 완전히 구축된 앱은 [`<html>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html) 태그를 포함하여 전체 문서를 JSX로 렌더링할 수 있습니다:

```js {3,13}
function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

전체 문서를 수화하려면 `hydrateRoot`의 첫 번째 인수로 [`document`](https://developer.mozilla.org/en-US/docs/Web/API/Window/document) 전역을 전달하세요:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

---

### 피할 수 없는 수화 불일치 오류 억제 {/*suppressing-unavoidable-hydration-mismatch-errors*/}

단일 요소의 속성 또는 텍스트 콘텐츠가 서버와 클라이언트 간에 피할 수 없이 다른 경우(예: 타임스탬프), 수화 불일치 경고를 무시할 수 있습니다.

요소에서 수화 경고를 무시하려면 `suppressHydrationWarning={true}`를 추가하세요:

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Current Date: <!-- -->01/01/2020</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
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

이것은 한 단계 깊이까지만 작동하며, 탈출구로 의도된 것입니다. 과도하게 사용하지 마세요. 텍스트 콘텐츠가 아닌 경우, React는 여전히 이를 패치하려고 시도하지 않으므로 향후 업데이트까지 일관성이 없을 수 있습니다.

---

### 클라이언트와 서버 콘텐츠가 다른 경우 처리 {/*handling-different-client-and-server-content*/}

의도적으로 서버와 클라이언트에서 다른 것을 렌더링해야 하는 경우, 두 번의 렌더링을 수행할 수 있습니다. 클라이언트에서 다른 것을 렌더링하는 컴포넌트는 [Effect](/reference/react/useEffect)에서 `true`로 설정할 수 있는 `isClient`와 같은 [상태 변수](/reference/react/useState)를 읽을 수 있습니다:

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
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
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

이렇게 하면 초기 렌더링 패스가 서버와 동일한 콘텐츠를 렌더링하여 불일치를 피하지만, 수화 직후에 추가 패스가 동기적으로 발생합니다.

<Pitfall>

이 접근 방식은 수화를 느리게 만듭니다. 왜냐하면 컴포넌트가 두 번 렌더링해야 하기 때문입니다. 느린 연결에서 사용자 경험을 신경 써야 합니다. JavaScript 코드는 초기 HTML 렌더링보다 훨씬 늦게 로드될 수 있으므로, 수화 직후에 다른 UI를 렌더링하는 것은 사용자에게도 불쾌할 수 있습니다.

</Pitfall>

---

### 수화된 루트 컴포넌트 업데이트 {/*updating-a-hydrated-root-component*/}

루트가 수화를 완료한 후, [`root.render`](#root-render)를 호출하여 루트 React 컴포넌트를 업데이트할 수 있습니다. **[`createRoot`](/reference/react-dom/client/createRoot)와 달리, 초기 콘텐츠가 이미 HTML로 렌더링되었기 때문에 일반적으로 이를 수행할 필요는 없습니다.**

수화 후 어느 시점에서 `root.render`를 호출하고 컴포넌트 트리 구조가 이전에 렌더링된 것과 일치하면, React는 [상태를 유지](/learn/preserving-and-resetting-state)합니다. 이 예제에서 매 초마다 반복되는 `render` 호출의 업데이트가 파괴적이지 않다는 것을 알 수 있습니다:

<Sandpack>

```html public/index.html
<!--
  All HTML content inside <div id="root">...</div> was
  generated by rendering <App /> with react-dom/server.
-->
<div id="root"><h1>Hello, world! <!-- -->0</h1><input placeholder="Type something here"/></div>
```

```js src/index.js active
import { hydrateRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = hydrateRoot(
  document.getElementById('root'),
  <App counter={0} />
);

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js src/App.js
export default function App({counter}) {
  return (
    <>
      <h1>Hello, world! {counter}</h1>
      <input placeholder="Type something here" />
    </>
  );
}
```

</Sandpack>

수화된 루트에서 [`root.render`](#root-render)를 호출하는 것은 드뭅니다. 일반적으로 컴포넌트 내부에서 [상태를 업데이트](/reference/react/useState)합니다.

### 잡히지 않은 오류에 대한 대화 상자 표시 {/*show-a-dialog-for-uncaught-errors*/}

<Canary>

`onUncaughtError`는 최신 React Canary 릴리스에서만 사용할 수 있습니다.

</Canary>

기본적으로 React는 모든 잡히지 않은 오류를 콘솔에 기록합니다. 자체 오류 보고를 구현하려면 선택적 `onUncaughtError` 루트 옵션을 제공할 수 있습니다:

```js [[1, 7, "onUncaughtError"], [2, 7, "error", 1], [3, 7, "errorInfo"], [4, 11, "componentStack"]]
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onUncaughtError: (error, errorInfo) => {
      console.error(
        'Uncaught error',
        error,
        errorInfo.componentStack
      );
    }

  }
);
root.render(<App />);
```

<CodeStep step={1}>onUncaughtError</CodeStep> 옵션은 두 개의 인수를 가진 함수입니다:

1. <CodeStep step={2}>발생한 오류</CodeStep>.
2. <CodeStep step={3}>errorInfo</CodeStep> 객체로, 오류의 <CodeStep step={4}>componentStack</CodeStep>을 포함합니다.

`onUncaughtError` 루트 옵션을 사용하여 오류 대화 상자를 표시할 수 있습니다:

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  React 앱에서 오류가 발생할 수 있으므로
  원시 HTML로 오류 대화 상자 표시
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">이 오류는 다음 위치에서 발생했습니다:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">호출 스택:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">원인:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    닫기
  </button>
  <h3 id="error-not-dismissible">이 오류는 해제할 수 없습니다.</h3>
</div>
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><div><span>이 오류는 오류 대화 상자를 표시합니다:</span><button>오류 발생</button></div></div>
</body>
</html>
```

```css src/styles.css active
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;  
}
```

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");
  
  // 제목 설정
  errorTitle.innerText = title;
  
  // 오류 메시지 및 본문 표시
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // 컴포넌트 스택 표시
  errorComponentStack.innerText = componentStack;

  // 호출 스택 표시
  // 이미 메시지를 표시했으므로 이를 제거하고 첫 번째 Error: 줄을 제거합니다.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];
  
  // 원인이 있는 경우 표시
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // 해제 가능한 경우 닫기 버튼 표시
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }
  
  // 대화 상자 표시
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Caught Error", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Uncaught Error", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Recoverable Error", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {reportUncaughtError} from "./reportError";
import "./styles.css";
import {renderToString} from 'react-dom/server';

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
  onUncaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportUncaughtError({
        error,
        componentStack: errorInfo.componentStack
      });
    }
  }
});
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [throwError, setThrowError] = useState(false);
  
  if (throwError) {
    foo.bar = 'baz';
  }
  
  return (
    <div>
      <span>이 오류는 오류 대화 상자를 표시합니다:</span>
      <button onClick={() => setThrowError(true)}>
        오류 발생
      </button>
    </div>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```

</Sandpack>


### Error Boundary 오류 표시 {/*displaying-error-boundary-errors*/}

<Canary>

`onCaughtError`는 최신 React Canary 릴리스에서만 사용할 수 있습니다.

</Canary>

기본적으로 React는 Error Boundary에 의해 잡힌 모든 오류를 `console.error`에 기록합니다. 이 동작을 재정의하려면 [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)에 의해 잡힌 오류에 대해 선택적 `onCaughtError` 루트 옵션을 제공할 수 있습니다:

```js [[1, 7, "onCaughtError"], [2, 7, "error", 1], [3, 7, "errorInfo"], [4, 11, "componentStack"]]
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onCaughtError: (error, errorInfo) => {
      console.error(
        'Caught error',
        error,
        errorInfo.componentStack
      );
    }
  }
);
root.render(<App />);
```

<CodeStep step={1}>onCaughtError</CodeStep> 옵션은 두 개의 인수를 가진 함수입니다:

1. <CodeStep step={2}>Error Boundary에 의해 잡힌 오류</CodeStep>.
2. 오류의 <CodeStep step={3}>componentStack</CodeStep>을 포함하는 <CodeStep step={4}>errorInfo</CodeStep> 객체.

`onCaughtError` 루트 옵션을 사용하여 오류 대화 상자를 표시하거나 알려진 오류를 로깅에서 필터링할 수 있습니다:

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  React 앱에서 오류가 발생할 수 있으므로
  원시 HTML로 오류 대화 상자 표시
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">이 오류는 다음 위치에서 발생했습니다:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">호출 스택:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">원인:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    닫기
  </button>
  <h3 id="error-not-dismissible">이 오류는 해제할 수 없습니다.</h3>
</div>
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><span>이 오류는 오류 대화 상자를 표시하지 않습니다:</span><button>알려진 오류 발생</button><span>이 오류는 오류 대화 상자를 표시합니다:</span><button>알 수 없는 오류 발생</button></div>
</body>
</html>
```

```css src/styles.css active
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;  
}
```

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");
  
  // 제목 설정
  errorTitle.innerText = title;
  
  // 오류 메시지 및 본문 표시
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // 컴포넌트 스택 표시
  errorComponentStack.innerText = componentStack;

  // 호출 스택 표시
  // 이미 메시지를 표시했으므로 이를 제거하고 첫 번째 Error: 줄을 제거합니다.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];
  
  // 원인이 있는 경우 표시
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // 해제 가능한 경우 닫기 버튼 표시
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }
  
  // 대화 상자 표시
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Caught Error", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Uncaught Error", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Recoverable Error", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {reportCaughtError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportCaughtError({
        error,
        componentStack: errorInfo.componentStack
      });
    }
  }
});
```

```js src/App.js
import { useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";

export default function App() {
  const [error, setError] = useState(null);
  
  function handleUnknown() {
    setError("unknown");
  }

  function handleKnown() {
    setError("known");
  }
  
  return (
    <>
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          setError(null);
        }}
      >
        {error != null && <Throw error={error} />}
        <span>이 오류는 오류 대화 상자를 표시하지 않습니다:</span>
        <button onClick={handleKnown}>
          알려진 오류 발생
        </button>
        <span>이 오류는 오류 대화 상자를 표시합니다:</span>
        <button onClick={handleUnknown}>
          알 수 없는 오류 발생
        </button>
      </ErrorBoundary>
      
    </>
  );
}

function fallbackRender({ resetErrorBoundary }) {
  return (
    <div role="alert">
      <h3>Error Boundary</h3>
      <p>문제가 발생했습니다.</p>
      <button onClick={resetErrorBoundary}>재설정</button>
    </div>
  );
}

function Throw({error}) {
  if (error === "known") {
    throw new Error('Known error')
  } else {
    foo.bar = 'baz';
  }
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

### 복구 가능한 수화 불일치 오류에 대한 대화 상자 표시 {/*show-a-dialog-for-recoverable-hydration-mismatch-errors*/}

React가 수화 불일치를 발견하면 클라이언트에서 렌더링을 시도하여 자동으로 복구합니다. 기본적으로 React는 수화 불일치 오류를 `console.error`에 기록합니다. 이 동작을 재정의하려면 선택적 `onRecoverableError` 루트 옵션을 제공할 수 있습니다:

```js [[1, 7, "onRecoverableError"], [2, 7, "error", 1], [3, 11, "error.cause", 1], [4, 7, "errorInfo"], [5, 12, "componentStack"]]
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onRecoverableError: (error, errorInfo) => {
      console.error(
        'Caught error',
        error,
        error.cause,
        errorInfo.componentStack
      );
    }
  }
);
```

<CodeStep step={1}>onRecoverableError</CodeStep> 옵션은 두 개의 인수를 가진 함수입니다:

1. React가 던진 <CodeStep step={2}>오류</CodeStep>. 일부 오류는 <CodeStep step={3}>error.cause</CodeStep>로 원래 원인을 포함할 수 있습니다.
2. 오류의 <CodeStep step={4}>componentStack</CodeStep>을 포함하는 <CodeStep step={5}>errorInfo</CodeStep> 객체.

`onRecoverableError` 루트 옵션을 사용하여 수화 불일치에 대한 오류 대화 상자를 표시할 수 있습니다:

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  React 앱에서 오류가 발생할 수 있으므로
  원시 HTML로 오류 대화 상자 표시
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">이 오류는 다음 위치에서 발생했습니다:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">호출 스택:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">원인:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    닫기
  </button>
  <h3 id="error-not-dismissible">이 오류는 해제할 수 없습니다.</h3>
</div>
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><span>서버</span></div>
</body>
</html>
```

```css src/styles.css active
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;  
}
```

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");
  
  // 제목 설정
  errorTitle.innerText = title;
  
  // 오류 메시지 및 본문 표시
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // 컴포넌트 스택 표시
  errorComponentStack.innerText = componentStack;

  // 호출 스택 표시
  // 이미 메시지를 표시했으므로 이를 제거하고 첫 번째 Error: 줄을 제거합니다.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];
  
  // 원인이 있는 경우 표시
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // 해제 가능한 경우 닫기 버튼 표시
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }
  
  // 대화 상자 표시
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Caught Error", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Uncaught Error", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Recoverable Error", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {reportRecoverableError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
  onRecoverableError: (error, errorInfo) => {
    reportRecoverableError({
      error,
      cause: error.cause,
      componentStack: errorInfo.componentStack
    });
  }
});
```

```js src/App.js
import { useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";

export default function App() {
  const [error, setError] = useState(null);
  
  function handleUnknown() {
    setError("unknown");
  }

  function handleKnown() {
    setError("known");
  }
  
  return (
    <span>{typeof window !== 'undefined' ? '클라이언트' : '서버'}</span>
  );
}

function fallbackRender({ resetErrorBoundary }) {
  return (
    <div role="alert">
      <h3>Error Boundary</h3>
      <p>문제가 발생했습니다.</p>
      <button onClick={resetErrorBoundary}>재설정</button>
    </div>
  );
}

function Throw({error}) {
  if (error === "known") {
    throw new Error('Known error')
  } else {
    foo.bar = 'baz';
  }
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

## 문제 해결 {/*troubleshooting*/}


### 오류가 발생했습니다: "You passed a second argument to root.render" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

일반적인 실수는 `hydrateRoot`의 옵션을 `root.render(...)`에 전달하는 것입니다:

<ConsoleBlock level="error">

경고: root.render(...)에 두 번째 인수를 전달했지만 하나의 인수만 허용됩니다.

</ConsoleBlock>

수정하려면 루트 옵션을 `root.render(...)`가 아닌 `hydrateRoot(...)`에 전달하세요:
```js {2,5}
// 🚩 잘못된 예: root.render는 하나의 인수만 받습니다.
root.render(App, {onUncaughtError});

// ✅ 올바른 예: 옵션을 createRoot에 전달합니다.
const root = hydrateRoot(container, <App />, {onUncaughtError});
```