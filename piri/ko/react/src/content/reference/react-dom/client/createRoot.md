---
title: createRoot
---

<Intro>

`createRoot`를 사용하면 브라우저 DOM 노드 안에 React 컴포넌트를 표시할 루트를 생성할 수 있습니다.

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## 참고자료 {/*reference*/}

### `createRoot(domNode, options?)` {/*createroot*/}

`createRoot`를 호출하여 브라우저 DOM 요소 안에 콘텐츠를 표시할 React 루트를 생성합니다.

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React는 `domNode`에 대한 루트를 생성하고 그 안의 DOM을 관리합니다. 루트를 생성한 후에는 [`root.render`](#root-render)를 호출하여 그 안에 React 컴포넌트를 표시해야 합니다:

```js
root.render(<App />);
```

React로 완전히 구축된 앱은 일반적으로 루트 컴포넌트에 대해 하나의 `createRoot` 호출만 가집니다. 페이지의 일부에 React를 사용하는 경우 필요한 만큼 별도의 루트를 가질 수 있습니다.

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `domNode`: [DOM 요소.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React는 이 DOM 요소에 대한 루트를 생성하고, `render`와 같은 함수를 호출하여 렌더링된 React 콘텐츠를 표시할 수 있게 합니다.

* **선택적** `options`: 이 React 루트에 대한 옵션이 포함된 객체.

  * <CanaryBadge title="이 기능은 Canary 채널에서만 사용할 수 있습니다" /> **선택적** `onCaughtError`: Error Boundary에서 React가 오류를 잡았을 때 호출되는 콜백. Error Boundary가 잡은 `error`와 `componentStack`을 포함하는 `errorInfo` 객체와 함께 호출됩니다.
  * <CanaryBadge title="이 기능은 Canary 채널에서만 사용할 수 있습니다" /> **선택적** `onUncaughtError`: 오류가 발생하고 Error Boundary에서 잡히지 않았을 때 호출되는 콜백. 발생한 `error`와 `componentStack`을 포함하는 `errorInfo` 객체와 함께 호출됩니다.
  * **선택적** `onRecoverableError`: React가 자동으로 오류에서 복구할 때 호출되는 콜백. React가 던진 `error`와 `componentStack`을 포함하는 `errorInfo` 객체와 함께 호출됩니다. 일부 복구 가능한 오류에는 `error.cause`로 원래 오류 원인이 포함될 수 있습니다.
  * **선택적** `identifierPrefix`: [`useId`](/reference/react/useId)에서 생성된 ID에 React가 사용하는 문자열 접두사. 동일한 페이지에서 여러 루트를 사용할 때 충돌을 피하는 데 유용합니다.

#### 반환값 {/*returns*/}

`createRoot`는 두 가지 메서드가 있는 객체를 반환합니다: [`render`](#root-render) 및 [`unmount`.](#root-unmount)

#### 주의사항 {/*caveats*/}
* 앱이 서버 렌더링된 경우, `createRoot()`를 사용하는 것은 지원되지 않습니다. 대신 [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot)를 사용하세요.
* 앱에서 `createRoot` 호출은 하나만 있을 가능성이 큽니다. 프레임워크를 사용하는 경우, 프레임워크가 이 호출을 대신할 수 있습니다.
* 컴포넌트의 자식이 아닌 DOM 트리의 다른 부분에 JSX를 렌더링하려면, `createRoot` 대신 [`createPortal`](/reference/react-dom/createPortal)을 사용하세요.

---

### `root.render(reactNode)` {/*root-render*/}

`root.render`를 호출하여 React 루트의 브라우저 DOM 노드에 [JSX](/learn/writing-markup-with-jsx) ("React 노드")를 표시합니다.

```js
root.render(<App />);
```

React는 `root`에 `<App />`을 표시하고 그 안의 DOM을 관리합니다.

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*root-render-parameters*/}

* `reactNode`: 표시하려는 *React 노드*. 일반적으로 `<App />`과 같은 JSX 조각이지만, [`createElement()`](/reference/react/createElement)로 생성된 React 요소, 문자열, 숫자, `null`, 또는 `undefined`를 전달할 수도 있습니다.

#### 반환값 {/*root-render-returns*/}

`root.render`는 `undefined`를 반환합니다.

#### 주의사항 {/*root-render-caveats*/}

* `root.render`를 처음 호출할 때, React는 React 컴포넌트를 렌더링하기 전에 React 루트 내부의 기존 HTML 콘텐츠를 모두 지웁니다.

* 루트의 DOM 노드에 서버나 빌드 중에 React가 생성한 HTML이 포함된 경우, [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot)를 사용하여 기존 HTML에 이벤트 핸들러를 연결하세요.

* 동일한 루트에서 `render`를 여러 번 호출하면, React는 전달된 최신 JSX를 반영하기 위해 DOM을 필요한 만큼 업데이트합니다. React는 이전에 렌더링된 트리와 ["매칭하여"](/learn/preserving-and-resetting-state) DOM의 어느 부분을 재사용할 수 있고 어느 부분을 다시 생성해야 하는지 결정합니다. 동일한 루트에서 다시 `render`를 호출하는 것은 루트 컴포넌트에서 [`set` 함수](/reference/react/useState#setstate)를 호출하는 것과 유사합니다: React는 불필요한 DOM 업데이트를 피합니다.

---

### `root.unmount()` {/*root-unmount*/}

`root.unmount`를 호출하여 React 루트 내부의 렌더링된 트리를 제거합니다.

```js
root.unmount();
```

React로 완전히 구축된 앱은 일반적으로 `root.unmount` 호출이 없습니다.

이는 주로 React 루트의 DOM 노드(또는 그 조상)가 다른 코드에 의해 DOM에서 제거될 수 있는 경우에 유용합니다. 예를 들어, jQuery 탭 패널이 비활성 탭을 DOM에서 제거하는 경우, 탭이 제거되면 그 안의 모든 것(React 루트 포함)이 DOM에서 제거됩니다. 이 경우, React에 제거된 루트의 콘텐츠 관리를 중지하도록 `root.unmount`를 호출해야 합니다. 그렇지 않으면 제거된 루트 내부의 컴포넌트는 정리하고 전역 리소스(예: 구독)를 해제해야 한다는 것을 알지 못합니다.

`root.unmount`를 호출하면 루트의 모든 컴포넌트가 언마운트되고 React가 루트 DOM 노드에서 "분리"됩니다. 이벤트 핸들러나 트리의 상태도 제거됩니다.

#### 매개변수 {/*root-unmount-parameters*/}

`root.unmount`는 매개변수를 받지 않습니다.

#### 반환값 {/*root-unmount-returns*/}

`root.unmount`는 `undefined`를 반환합니다.

#### 주의사항 {/*root-unmount-caveats*/}

* `root.unmount`를 호출하면 트리의 모든 컴포넌트가 언마운트되고 React가 루트 DOM 노드에서 "분리"됩니다.

* `root.unmount`를 호출한 후에는 동일한 루트에서 다시 `root.render`를 호출할 수 없습니다. 언마운트된 루트에서 `root.render`를 호출하려고 하면 "Cannot update an unmounted root" 오류가 발생합니다. 그러나 해당 노드의 이전 루트가 언마운트된 후 동일한 DOM 노드에 대해 새 루트를 생성할 수 있습니다.

---

## 사용법 {/*usage*/}

### React로 완전히 구축된 앱 렌더링 {/*rendering-an-app-fully-built-with-react*/}

앱이 완전히 React로 구축된 경우, 전체 앱에 대해 단일 루트를 생성합니다.

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

일반적으로 이 코드는 시작 시 한 번만 실행하면 됩니다. 이 코드는 다음을 수행합니다:

1. HTML에서 정의된 <CodeStep step={1}>브라우저 DOM 노드</CodeStep>를 찾습니다.
2. 앱의 <CodeStep step={2}>React 컴포넌트</CodeStep>를 그 안에 표시합니다.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- This is the DOM node -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
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

**앱이 완전히 React로 구축된 경우, 더 이상 루트를 생성하거나 [`root.render`](#root-render)를 다시 호출할 필요가 없습니다.**

이 시점부터 React는 전체 앱의 DOM을 관리합니다. 더 많은 컴포넌트를 추가하려면, [`App` 컴포넌트 내부에 중첩하세요.](/learn/importing-and-exporting-components) UI를 업데이트해야 할 때, 각 컴포넌트는 [상태를 사용하여](/reference/react/useState) 이를 수행할 수 있습니다. 모달이나 툴팁과 같은 추가 콘텐츠를 DOM 노드 외부에 표시해야 할 때, [포털을 사용하여 렌더링하세요.](/reference/react-dom/createPortal)

<Note>

HTML이 비어 있으면, 앱의 JavaScript 코드가 로드되고 실행될 때까지 사용자는 빈 페이지를 보게 됩니다:

```html
<div id="root"></div>
```

이것은 매우 느리게 느껴질 수 있습니다! 이를 해결하기 위해, 컴포넌트에서 초기 HTML을 [서버나 빌드 중에 생성](/reference/react-dom/server)할 수 있습니다. 그러면 방문자는 JavaScript 코드가 로드되기 전에 텍스트를 읽고, 이미지를 보고, 링크를 클릭할 수 있습니다. 우리는 [프레임워크를 사용하는 것을 권장합니다](/learn/start-a-new-react-project#production-grade-react-frameworks) 이 최적화를 기본적으로 수행합니다. 실행 시점에 따라, 이를 *서버 사이드 렌더링(SSR)* 또는 *정적 사이트 생성(SSG)*이라고 합니다.

</Note>

<Pitfall>

**서버 렌더링 또는 정적 생성된 앱은 `createRoot` 대신 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 호출해야 합니다.** React는 기존 HTML을 파괴하고 다시 생성하는 대신, HTML의 DOM 노드를 *하이드레이트* (재사용)합니다.

</Pitfall>

---

### React로 부분적으로 구축된 페이지 렌더링 {/*rendering-a-page-partially-built-with-react*/}

페이지가 [완전히 React로 구축되지 않은 경우](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page), `createRoot`를 여러 번 호출하여 React가 관리하는 UI의 최상위 부분마다 루트를 생성할 수 있습니다. 각 루트에 대해 [`root.render`](#root-render)를 호출하여 다른 콘텐츠를 표시할 수 있습니다.

여기서는 두 개의 다른 React 컴포넌트가 `index.html` 파일에 정의된 두 개의 DOM 노드에 렌더링됩니다:

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>This paragraph is not rendered by React (open index.html to verify).</p>
      <section id="comments"></section>
    </main>
  </body>
</html>
```

```js src/index.js active
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode); 
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode); 
commentRoot.render(<Comments />);
```

```js src/Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Comments</h2>
      <Comment text="Hello!" author="Sophie" />
      <Comment text="How are you?" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

[`document.createElement()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)를 사용하여 새 DOM 노드를 생성하고 문서에 수동으로 추가할 수도 있습니다.

```js
const domNode = document.createElement('div');
const root = createRoot(domNode); 
root.render(<Comment />);
document.body.appendChild(domNode); // 문서의 어디에나 추가할 수 있습니다
```

React 트리를 DOM 노드에서 제거하고 사용된 모든 리소스를 정리하려면, [`root.unmount`](#root-unmount)를 호출하세요.

```js
root.unmount();
```

이는 주로 React 컴포넌트가 다른 프레임워크로 작성된 앱 내부에 있는 경우에 유용합니다.

---

### 루트 컴포넌트 업데이트 {/*updating-a-root-component*/}

동일한 루트에서 `render`를 여러 번 호출할 수 있습니다. 컴포넌트 트리 구조가 이전에 렌더링된 것과 일치하는 한, React는 [상태를 유지](/learn/preserving-and-resetting-state)합니다. 이 예제에서 매초 반복되는 `render` 호출이 파괴적이지 않다는 것을 보여주는 입력란에 입력할 수 있습니다:

<Sandpack>

```js src/index.js active
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

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

`render`를 여러 번 호출하는 것은 드문 일입니다. 일반적으로 컴포넌트는 [상태를 업데이트](/reference/react/useState)합니다.

### 잡히지 않은 오류에 대한 대화 상자 표시 {/*show-a-dialog-for-uncaught-errors*/}

<Canary>

`onUncaughtError`는 최신 React Canary 릴리스에서만 사용할 수 있습니다.

</Canary>

기본적으로 React는 모든 잡히지 않은 오류를 콘솔에 기록합니다. 자체 오류 보고를 구현하려면 선택적 `onUncaughtError` 루트 옵션을 제공할 수 있습니다:

```js [[1, 6, "onUncaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
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

<CodeStep step={1}>onUncaughtError</CodeStep> 옵션은 두 개의 인수를 받는 함수입니다:

1. 던져진 <CodeStep step={2}>error</CodeStep>.
2. 오류의 <CodeStep step={4}>componentStack</CodeStep>을 포함하는 <CodeStep step={3}>errorInfo</CodeStep> 객체.

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
    onclick="document.getElementById('error-dialog').classList.add('hidden
')"
  >
    닫기
  </button>
  <h3 id="error-not-dismissible">이 오류는 해제할 수 없습니다.</h3>
</div>
<!-- This is the DOM node -->
<div id="root"></div>
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
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {reportUncaughtError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportUncaughtError({
        error,
        componentStack: errorInfo.componentStack
      });
    }
  }
});
root.render(<App />);
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

기본적으로 React는 Error Boundary에서 잡은 모든 오류를 `console.error`에 기록합니다. 이 동작을 재정의하려면, 선택적 `onCaughtError` 루트 옵션을 제공하여 [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)에서 잡은 오류를 처리할 수 있습니다:

```js [[1, 6, "onCaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
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

<CodeStep step={1}>onCaughtError</CodeStep> 옵션은 두 개의 인수를 받는 함수입니다:

1. Error Boundary에서 잡은 <CodeStep step={2}>error</CodeStep>.
2. 오류의 <CodeStep step={4}>componentStack</CodeStep>을 포함하는 <CodeStep step={3}>errorInfo</CodeStep> 객체.

`onCaughtError` 루트 옵션을 사용하여 오류 대화 상자를 표시하거나 알려진 오류의 로깅을 필터링할 수 있습니다:

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
<!-- This is the DOM node -->
<div id="root"></div>
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
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {reportCaughtError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportCaughtError({
        error, 
        componentStack: errorInfo.componentStack,
      });
    }
  }
});
root.render(<App />);
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

### 복구 가능한 오류에 대한 대화 상자 표시 {/*displaying-a-dialog-for-recoverable-errors*/}

React는 렌더링 중에 발생한 오류에서 복구를 시도하기 위해 컴포넌트를 두 번째로 렌더링할 수 있습니다. 성공하면, React는 개발자에게 알리기 위해 복구 가능한 오류를 콘솔에 기록합니다. 이 동작을 재정의하려면 선택적 `onRecoverableError` 루트 옵션을 제공할 수 있습니다:

```js [[1, 6, "onRecoverableError"], [2, 6, "error", 1], [3, 10, "error.cause"], [4, 6, "errorInfo"], [5, 11, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
  {
    onRecoverableError: (error, errorInfo) => {
      console.error(
        'Recoverable error',
        error,
        error.cause,
        errorInfo.componentStack,
      );
    }
  }
);
root.render(<App />);
```

<CodeStep step={1}>onRecoverableError</CodeStep> 옵션은 두 개의 인수를 받는 함수입니다:

1. React가 던진 <CodeStep step={2}>error</CodeStep>. 일부 오류에는 <CodeStep step={3}>error.cause</CodeStep>로 원래 원인이 포함될 수 있습니다.
2. 오류의 <CodeStep step={5}>componentStack</CodeStep>을 포함하는 <CodeStep step={4}>errorInfo</CodeStep> 객체.

`onRecoverableError` 루트 옵션을 사용하여 오류 대화 상자를 표시할 수 있습니다:

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
<!-- This is the DOM node -->
<div id="root"></div>
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
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {reportRecoverableError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container, {
  onRecoverableError: (error, errorInfo) => {
    reportRecoverableError({
      error,
      cause: error.cause,
      componentStack: errorInfo.componentStack,
    });
  }
});
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";

// 🚩 버그: 절대 이렇게 하지 마세요. 이것은 오류를 강제로 발생시킵니다.
let errorThrown = false;
export default function App() {
  return (
    <>
      <ErrorBoundary
        fallbackRender={fallbackRender}
      >
        {!errorThrown && <Throw />}
        <p>이 컴포넌트는 오류를 발생시켰지만 두 번째 렌더링 중에 복구되었습니다.</p>
        <p>복구되었기 때문에 Error Boundary가 표시되지 않았지만, <code>onRecoverableError</code>를 사용하여 오류 대화 상자가 표시되었습니다.</p>
      </ErrorBoundary>
      
    </>
  );
}

function fallbackRender() {
  return (
    <div role="alert">
      <h3>Error Boundary</h3>
      <p>문제가 발생했습니다.</p>
    </div>
  );
}

function Throw({error}) {
  // 동시 렌더링 중 외부 값이 변경되는 것을 시뮬레이션합니다.
  errorThrown = true;
  foo.bar = 'baz';
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


---
## 문제 해결 {/*troubleshooting*/}

### 루트를 생성했지만 아무것도 표시되지 않습니다 {/*ive-created-a-root-but-nothing-is-displayed*/}

앱을 루트에 *렌더링*하는 것을 잊지 않았는지 확인하세요:

```js {5}
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

그렇게 하지 않으면 아무것도 표시되지 않습니다.

---

### "root.render에 두 번째 인수를 전달했습니다"라는 오류가 발생합니다 {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

일반적인 실수는 `createRoot`의 옵션을 `root.render(...)`에 전달하는 것입니다:

<ConsoleBlock level="error">

경고: root.render(...)에 두 번째 인수를 전달했지만 하나의 인수만 허용됩니다.

</ConsoleBlock>

수정하려면, 루트 옵션을 `createRoot(...)`에 전달하고 `root.render(...)`에는 전달하지 마세요:
```js {2,5}
// 🚩 잘못된 예: root.render는 하나의 인수만 받습니다.
root.render(App, {onUncaughtError});

// ✅ 올바른 예: 옵션을 createRoot에 전달합니다.
const root = createRoot(container, {onUncaughtError}); 
root.render(<App />);
```

---

### "대상 컨테이너가 DOM 요소가 아닙니다"라는 오류가 발생합니다 {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

이 오류는 `createRoot`에 전달한 것이 DOM 노드가 아님을 의미합니다.

무슨 일이 일어나고 있는지 확실하지 않은 경우, 이를 로깅해 보세요:

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

예를 들어, `domNode`가 `null`인 경우, 이는 [`getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById)가 `null`을 반환했음을 의미합니다. 이는 호출 시점에 문서에 주어진 ID를 가진 노드가 없을 때 발생합니다. 몇 가지 이유가 있을 수 있습니다:

1. 찾고 있는 ID가 HTML 파일에서 사용한 ID와 다를 수 있습니다. 오타를 확인하세요!
2. 번들의 `<script>` 태그가 HTML에서 *이후에* 나타나는 DOM 노드를 "볼" 수 없습니다.

이 오류가 발생하는 또 다른 일반적인 방법은 `createRoot(<App />)`를 `createRoot(domNode)` 대신 작성하는 것입니다.

---

### "함수는 유효한 React 자식이 아닙니다"라는 오류가 발생합니다 {/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

이 오류는 `root.render`에 전달한 것이 React 컴포넌트가 아님을 의미합니다.

이는 `root.render`를 `Component`로 호출하는 경우 발생할 수 있습니다:

```js {2,5}
// 🚩 잘못된 예: App은 함수이지 컴포넌트가 아닙니다.
root.render(App);

// ✅ 올바른 예: <App />은 컴포넌트입니다.
root.render(<App />);
```

또는 `root.render`에 함수를 전달하는 경우, 이를 호출한 결과를 전달하지 않는 경우:

```js {2,5}
// 🚩 잘못된 예: createApp은 함수이지 컴포넌트가 아닙니다.
root.render(createApp);

// ✅ 올바른 예: createApp을 호출하여 컴포넌트를 반환합니다.
root.render(createApp());
```

---

### 서버 렌더링된 HTML이 처음부터 다시 생성됩니다 {/*my-server-rendered-html-gets-re-created-from-scratch*/}

앱이 서버 렌더링되고 React가 생성한 초기 HTML을 포함하는 경우, 루트를 생성하고 `root.render`를 호출하면 모든 HTML이 삭제되고 모든 DOM 노드가 처음부터 다시 생성되는 것을 알 수 있습니다. 이는 느릴 수 있으며, 포커스와 스크롤 위치를 재설정하고 다른 사용자 입력을 잃을 수 있습니다.

서버 렌더링된 앱은 `createRoot` 대신 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 사용해야 합니다:

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

API가 다르다는 점에 유의하세요. 특히, 일반적으로 추가적인 `root.render` 호출이 없습니다.