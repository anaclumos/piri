---
title: use
canary: true
---

<Canary>

`use` API는 현재 React의 Canary 및 실험 채널에서만 사용할 수 있습니다. [React의 릴리스 채널에 대해 자세히 알아보세요](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`use`는 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)나 [context](/learn/passing-data-deeply-with-context)와 같은 리소스의 값을 읽을 수 있게 해주는 React API입니다.

```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `use(resource)` {/*use*/}

`use`를 컴포넌트에서 호출하여 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)나 [context](/learn/passing-data-deeply-with-context)와 같은 리소스의 값을 읽습니다.

```jsx
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
```

React Hooks와 달리, `use`는 루프 및 `if`와 같은 조건문 내에서 호출할 수 있습니다. React Hooks와 마찬가지로, `use`를 호출하는 함수는 컴포넌트 또는 Hook이어야 합니다.

Promise와 함께 호출될 때, `use` API는 [`Suspense`](/reference/react/Suspense) 및 [에러 경계](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)와 통합됩니다. `use`에 전달된 Promise가 대기 중일 때 `use`를 호출하는 컴포넌트는 *일시 중단*됩니다. `use`를 호출하는 컴포넌트가 Suspense 경계로 감싸져 있으면, 대체 콘텐츠가 표시됩니다. Promise가 해결되면, Suspense 대체 콘텐츠는 `use` API가 반환한 데이터를 사용하는 렌더링된 컴포넌트로 대체됩니다. `use`에 전달된 Promise가 거부되면, 가장 가까운 에러 경계의 대체 콘텐츠가 표시됩니다.

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `resource`: 값을 읽고자 하는 데이터의 소스입니다. 리소스는 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)나 [context](/learn/passing-data-deeply-with-context)일 수 있습니다.

#### 반환값 {/*returns*/}

`use` API는 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)나 [context](/learn/passing-data-deeply-with-context)와 같은 리소스에서 읽은 값을 반환합니다.

#### 주의사항 {/*caveats*/}

* `use` API는 컴포넌트 또는 Hook 내부에서 호출되어야 합니다.
* [서버 컴포넌트](/reference/rsc/use-server)에서 데이터를 가져올 때는 `use`보다 `async`와 `await`를 선호하세요. `async`와 `await`는 `await`가 호출된 지점에서 렌더링을 이어가지만, `use`는 데이터가 해결된 후 컴포넌트를 다시 렌더링합니다.
* [서버 컴포넌트](/reference/rsc/use-server)에서 Promise를 생성하고 이를 [클라이언트 컴포넌트](/reference/rsc/use-client)로 전달하는 것을 선호하세요. 클라이언트 컴포넌트에서 생성된 Promise는 매 렌더링마다 재생성됩니다. 서버 컴포넌트에서 클라이언트 컴포넌트로 전달된 Promise는 재렌더링 동안 안정적입니다. [이 예제를 참조하세요](#streaming-data-from-server-to-client).

---

## 사용법 {/*usage*/}

### `use`로 컨텍스트 읽기 {/*reading-context-with-use*/}

[context](/learn/passing-data-deeply-with-context)가 `use`에 전달되면, [`useContext`](/reference/react/useContext)와 유사하게 작동합니다. `useContext`는 컴포넌트의 최상위에서 호출되어야 하지만, `use`는 `if`와 같은 조건문 및 `for`와 같은 루프 내에서 호출될 수 있습니다. `use`는 더 유연하기 때문에 `useContext`보다 선호됩니다.

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ... 
```

`use`는 <CodeStep step={2}>컨텍스트 값</CodeStep>을 <CodeStep step={1}>전달된 컨텍스트</CodeStep>에 대해 반환합니다. 컨텍스트 값을 결정하기 위해 React는 컴포넌트 트리를 검색하여 해당 컨텍스트에 대한 **가장 가까운 컨텍스트 제공자**를 찾습니다.

`Button`에 컨텍스트를 전달하려면, 해당 컨텍스트 제공자로 `Button` 또는 그 부모 컴포넌트 중 하나를 감싸세요.

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ... 버튼을 렌더링합니다 ...
}
```

제공자와 `Button` 사이에 몇 개의 컴포넌트 레이어가 있는지는 중요하지 않습니다. `Form` 내부의 *어디서든* `use(ThemeContext)`를 호출하는 `Button`은 `"dark"` 값을 받게 됩니다.

[`useContext`](/reference/react/useContext)와 달리, <CodeStep step={2}>`use`</CodeStep>는 <CodeStep step={1}>`if`</CodeStep>와 같은 조건문 및 루프 내에서 호출될 수 있습니다.

```js [[1, 2, "if"], [2, 3, "use"]]
function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return false;
}
```

<CodeStep step={2}>`use`</CodeStep>는 <CodeStep step={1}>`if`</CodeStep> 문 내에서 호출되어, 컨텍스트에서 값을 조건부로 읽을 수 있게 합니다.

<Pitfall>

`useContext`와 마찬가지로, `use(context)`는 `use(context)`를 호출하는 컴포넌트 *위*에 있는 가장 가까운 컨텍스트 제공자를 항상 찾습니다. 위쪽으로 검색하며, **호출하는 컴포넌트 내의 컨텍스트 제공자는** 고려하지 않습니다.

</Pitfall>

<Sandpack>

```js
import { createContext, use } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button show={true}>Sign up</Button>
      <Button show={false}>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = use(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ show, children }) {
  if (show) {
    const theme = use(ThemeContext);
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {children}
      </button>
    );
  }
  return false
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```

</Sandpack>

### 서버에서 클라이언트로 데이터 스트리밍 {/*streaming-data-from-server-to-client*/}

Promise를 <CodeStep step={1}>서버 컴포넌트</CodeStep>에서 <CodeStep step={2}>클라이언트 컴포넌트</CodeStep>로 prop으로 전달하여 서버에서 클라이언트로 데이터를 스트리밍할 수 있습니다.

```js [[1, 4, "App"], [2, 2, "Message"], [3, 7, "Suspense"], [4, 8, "messagePromise", 30], [4, 5, "messagePromise"]]
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

<CodeStep step={2}>클라이언트 컴포넌트</CodeStep>는 <CodeStep step={4}>prop으로 받은 Promise</CodeStep>를 <CodeStep step={5}>`use`</CodeStep> API에 전달합니다. 이를 통해 <CodeStep step={2}>클라이언트 컴포넌트</CodeStep>는 서버 컴포넌트에서 처음 생성된 <CodeStep step={4}>Promise</CodeStep>의 값을 읽을 수 있습니다.

```js [[2, 6, "Message"], [4, 6, "messagePromise"], [4, 7, "messagePromise"], [5, 7, "use"]]
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```
<CodeStep step={2}>`Message`</CodeStep>가 <CodeStep step={3}>[`Suspense`](/reference/react/Suspense)</CodeStep>로 감싸져 있기 때문에, Promise가 해결될 때까지 대체 콘텐츠가 표시됩니다. Promise가 해결되면, <CodeStep step={5}>`use`</CodeStep> API가 값을 읽고 <CodeStep step={2}>`Message`</CodeStep> 컴포넌트가 Suspense 대체 콘텐츠를 대체합니다.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve) => setTimeout(resolve, 1000, "⚛️"));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js src/index.js hidden
// TODO: update to import from stable
// react instead of canary once the `use`
// API is in a stable release of React
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```
</Sandpack>

<Note>

서버 컴포넌트에서 클라이언트 컴포넌트로 Promise를 전달할 때, 그 해결된 값은 서버와 클라이언트 간에 전달될 수 있도록 직렬화 가능해야 합니다. 함수와 같은 데이터 타입은 직렬화할 수 없으며, 이러한 Promise의 해결된 값이 될 수 없습니다.

</Note>


<DeepDive>

#### Promise를 서버 컴포넌트에서 해결해야 할까요, 클라이언트 컴포넌트에서 해결해야 할까요? {/*resolve-promise-in-server-or-client-component*/}

Promise는 서버 컴포넌트에서 클라이언트 컴포넌트로 전달되어 `use` API로 클라이언트 컴포넌트에서 해결될 수 있습니다. 또한 서버 컴포넌트에서 `await`로 Promise를 해결하고 필요한 데이터를 prop으로 클라이언트 컴포넌트에 전달할 수도 있습니다.

```js
export default async function App() {
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />
}
```

하지만 [서버 컴포넌트](/reference/react/components#server-components)에서 `await`를 사용하면 `await` 문이 완료될 때까지 렌더링이 차단됩니다. 서버 컴포넌트에서 클라이언트 컴포넌트로 Promise를 전달하면, Promise가 서버 컴포넌트의 렌더링을 차단하지 않게 됩니다.

</DeepDive>

### 거부된 Promise 처리하기 {/*dealing-with-rejected-promises*/}

일부 경우 `use`에 전달된 Promise가 거부될 수 있습니다. 거부된 Promise를 처리하는 방법은 다음과 같습니다:

1. [에러 경계로 사용자에게 에러를 표시합니다.](#displaying-an-error-to-users-with-error-boundary)
2. [`Promise.catch`로 대체 값을 제공합니다](#providing-an-alternative-value-with-promise-catch)

<Pitfall>
`use`는 try-catch 블록 내에서 호출될 수 없습니다. try-catch 블록 대신 [컴포넌트를 에러 경계로 감싸거나](#displaying-an-error-to-users-with-error-boundary), [Promise의 `.catch` 메서드로 `use`에 대체 값을 제공하세요](#providing-an-alternative-value-with-promise-catch).
</Pitfall>

#### 에러 경계로 사용자에게 에러 표시하기 {/*displaying-an-error-to-users-with-error-boundary*/}

Promise가 거부될 때 사용자에게 에러를 표시하려면, [에러 경계](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)를 사용할 수 있습니다. 에러 경계를 사용하려면, `use` API를 호출하는 컴포넌트를 에러 경계로 감싸세요. `use`에 전달된 Promise가 거부되면 에러 경계의 대체 콘텐츠가 표시됩니다.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function MessageContainer({ messagePromise }) {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <Suspense fallback={<p>⌛Downloading message...</p>}>
        <Message messagePromise={messagePromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Message({ messagePromise }) {
  const content = use(messagePromise);
  return <p>Here is the message: {content}</p>;
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve, reject) => setTimeout(reject, 1000));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js src/index.js hidden
// TODO: update to import from stable
// react instead of canary once the `use`
// API is in a stable release of React
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

#### `Promise.catch`로 대체 값을 제공하기 {/*providing-an-alternative-value-with-promise-catch*/}

Promise가 거부될 때 대체 값을 제공하려면, Promise의 <CodeStep step={1}>[`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)</CodeStep> 메서드를 사용할 수 있습니다.

```js [[1, 6, "catch"],[2, 7, "return"]]
import { Message } from './message.js';

export default function App() {
  const messagePromise = new Promise((resolve, reject) => {
    reject();
  }).catch(() => {
    return "no new message found.";
  });

  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

Promise의 <CodeStep step={1}>`catch`</CodeStep> 메서드를 사용하려면, Promise 객체에서 <CodeStep step={1}>`catch`</CodeStep>를 호출하세요. <CodeStep step={1}>`catch`</CodeStep>는 에러 메시지를 인수로 받는 함수를 인수로 받습니다. <CodeStep step={1}>`catch`</CodeStep>에 전달된 함수가 <CodeStep step={2}>반환</CodeStep>하는 값은 Promise의 해결된 값으로 사용됩니다.

---

## 문제 해결 {/*troubleshooting*/}

### "Suspense Exception: This is not a real error!" {/*suspense-exception-error*/}

`use`를 React 컴포넌트 또는 Hook 함수 외부에서 호출하거나, `use`를 try-catch 블록 내에서 호출하고 있습니다. `use`를 try-catch 블록 내에서 호출하는 경우, 컴포넌트를 에러 경계로 감싸거나, Promise의 `catch`를 호출하여 에러를 잡고 다른 값으로 Promise를 해결하세요. [이 예제를 참조하세요](#dealing-with-rejected-promises).

`use`를 React 컴포넌트 또는 Hook 함수 외부에서 호출하는 경우, `use` 호출을 React 컴포넌트 또는 Hook 함수로 이동하세요.

```jsx
function MessageComponent({messagePromise}) {
  function download() {
    // ❌ `use`를 호출하는 함수가 컴포넌트나 Hook이 아닙니다.
    const message = use(messagePromise);
    // ...
```

대신, `use`를 컴포넌트 클로저 외부에서 호출하세요. `use`를 호출하는 함수는 컴포넌트나 Hook이어야 합니다.

```jsx
function MessageComponent({messagePromise}) {
  // ✅ `use`가 컴포넌트에서 호출되고 있습니다.
  const message = use(messagePromise);
  // ...
```