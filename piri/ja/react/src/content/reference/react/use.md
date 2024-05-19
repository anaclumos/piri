---
title: use
canary: true
---

<Canary>

`use` APIは現在、ReactのCanaryおよび実験的なチャンネルでのみ利用可能です。[Reactのリリースチャンネルについてはこちら](/community/versioning-policy#all-release-channels)をご覧ください。

</Canary>

<Intro>

`use`は、[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)や[context](/learn/passing-data-deeply-with-context)のようなリソースの値を読み取るためのReact APIです。

```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `use(resource)` {/*use*/}

コンポーネント内で`use`を呼び出して、[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)や[context](/learn/passing-data-deeply-with-context)のようなリソースの値を読み取ります。

```jsx
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
```

React Hooksとは異なり、`use`はループや`if`のような条件文の中で呼び出すことができます。React Hooksと同様に、`use`を呼び出す関数はコンポーネントまたはフックでなければなりません。

Promiseを使用して呼び出す場合、`use` APIは[`Suspense`](/reference/react/Suspense)や[エラーバウンダリ](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)と統合されます。`use`に渡されたPromiseが保留中の場合、`use`を呼び出すコンポーネントは*サスペンド*されます。`use`を呼び出すコンポーネントがSuspenseバウンダリでラップされている場合、フォールバックが表示されます。Promiseが解決されると、Suspenseのフォールバックは`use` APIによって返されたデータを使用してレンダリングされたコンポーネントに置き換えられます。`use`に渡されたPromiseが拒否された場合、最も近いエラーバウンダリのフォールバックが表示されます。

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `resource`: 読み取りたいデータのソースです。リソースは[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)や[context](/learn/passing-data-deeply-with-context)である可能性があります。

#### 戻り値 {/*returns*/}

`use` APIは、[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)や[context](/learn/passing-data-deeply-with-context)の解決された値のように、リソースから読み取られた値を返します。

#### 注意点 {/*caveats*/}

* `use` APIはコンポーネントまたはフック内で呼び出す必要があります。
* [Server Component](/reference/rsc/use-server)でデータを取得する場合、`use`よりも`async`と`await`を優先してください。`async`と`await`は`await`が呼び出されたポイントからレンダリングを再開しますが、`use`はデータが解決された後にコンポーネントを再レンダリングします。
* [Server Components](/reference/rsc/use-server)でPromiseを作成し、それを[Client Components](/reference/rsc/use-client)に渡すことを優先してください。Client Componentsで作成されたPromiseは、レンダリングごとに再作成されます。Server ComponentからClient Componentに渡されたPromiseは、再レンダリング間で安定しています。[この例を参照してください](#streaming-data-from-server-to-client)。

---

## 使用法 {/*usage*/}

### `use`を使用してコンテキストを読み取る {/*reading-context-with-use*/}

[context](/learn/passing-data-deeply-with-context)が`use`に渡されると、[`useContext`](/reference/react/useContext)と同様に機能します。`useContext`はコンポーネントのトップレベルで呼び出す必要がありますが、`use`は`if`のような条件文や`for`のようなループ内で呼び出すことができます。`use`はより柔軟であるため、`useContext`よりも優先されます。

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ... 
```

`use`は、渡された<CodeStep step={1}>context</CodeStep>の<CodeStep step={2}>コンテキスト値</CodeStep>を返します。コンテキスト値を決定するために、Reactはコンポーネントツリーを検索し、その特定のコンテキストの**最も近いコンテキストプロバイダー**を見つけます。

`Button`にコンテキストを渡すには、それまたはその親コンポーネントのいずれかを対応するコンテキストプロバイダーでラップします。

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

プロバイダーと`Button`の間にいくつのコンポーネント層があっても関係ありません。`Form`内の*どこにでも*ある`Button`が`use(ThemeContext)`を呼び出すと、値として`"dark"`を受け取ります。

[`useContext`](/reference/react/useContext)とは異なり、<CodeStep step={2}>`use`</CodeStep>は<CodeStep step={1}>`if`</CodeStep>のような条件文やループ内で呼び出すことができます。

```js [[1, 2, "if"], [2, 3, "use"]]
function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return false;
}
```

<CodeStep step={2}>`use`</CodeStep>は<CodeStep step={1}>`if`</CodeStep>文の中から呼び出され、条件付きでコンテキストから値を読み取ることができます。

<Pitfall>

`useContext`と同様に、`use(context)`は常に`use(context)`を呼び出すコンポーネントの*上*にある最も近いコンテキストプロバイダーを探します。上方向に検索し、**呼び出しているコンポーネント内のコンテキストプロバイダーは考慮しません**。

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

### サーバーからクライアントへのデータストリーミング {/*streaming-data-from-server-to-client*/}

Promiseを<CodeStep step={1}>Server Component</CodeStep>から<CodeStep step={2}>Client Component</CodeStep>にプロップとして渡すことで、サーバーからクライアントにデータをストリーミングできます。

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

<CodeStep step={2}>Client Component</CodeStep>は、プロップとして受け取った<CodeStep step={4}>Promise</CodeStep>を<CodeStep step={5}>`use`</CodeStep> APIに渡します。これにより、<CodeStep step={2}>Client Component</CodeStep>は、Server Componentによって最初に作成された<CodeStep step={4}>Promise</CodeStep>から値を読み取ることができます。

```js [[2, 6, "Message"], [4, 6, "messagePromise"], [4, 7, "messagePromise"], [5, 7, "use"]]
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```
<CodeStep step={2}>`Message`</CodeStep>が<CodeStep step={3}>[`Suspense`](/reference/react/Suspense)</CodeStep>でラップされているため、Promiseが解決されるまでフォールバックが表示されます。Promiseが解決されると、その値は<CodeStep step={5}>`use`</CodeStep> APIによって読み取られ、<CodeStep step={2}>`Message`</CodeStep>コンポーネントがSuspenseフォールバックに置き換えられます。

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

Server ComponentからClient ComponentにPromiseを渡す場合、その解決された値はサーバーとクライアント間でシリアライズ可能でなければなりません。関数のようなデータ型はシリアライズできず、そのようなPromiseの解決値にはなりません。

</Note>


<DeepDive>

#### PromiseをServer ComponentまたはClient Componentで解決するべきか？ {/*resolve-promise-in-server-or-client-component*/}

PromiseはServer ComponentからClient Componentに渡され、`use` APIを使用してClient Componentで解決されることがあります。また、Server Componentで`await`を使用してPromiseを解決し、必要なデータをプロップとしてClient Componentに渡すこともできます。

```js
export default async function App() {
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />
}
```

しかし、[Server Component](/reference/react/components#server-components)で`await`を使用すると、`await`文が終了するまでそのレンダリングがブロックされます。Server ComponentからClient ComponentにPromiseを渡すことで、Server ComponentのレンダリングがPromiseによってブロックされるのを防ぎます。

</DeepDive>

### 拒否されたPromiseの処理 {/*dealing-with-rejected-promises*/}

場合によっては、`use`に渡されたPromiseが拒否されることがあります。拒否されたPromiseを処理するには、次のいずれかの方法を使用できます：

1. [エラーバウンダリを使用してユーザーにエラーを表示する。](#displaying-an-error-to-users-with-error-boundary)
2. [Promiseの`catch`メソッドを使用して代替値を提供する。](#providing-an-alternative-value-with-promise-catch)

<Pitfall>
`use`はtry-catchブロック内で呼び出すことはできません。代わりに、[コンポーネントをエラーバウンダリでラップする](#displaying-an-error-to-users-with-error-boundary)か、[Promiseの`catch`メソッドを使用して代替値を提供する](#providing-an-alternative-value-with-promise-catch)必要があります。
</Pitfall>

#### エラーバウンダリを使用してユーザーにエラーを表示する {/*displaying-an-error-to-users-with-error-boundary*/}

Promiseが拒否された場合にユーザーにエラーを表示したい場合は、[エラーバウンダリ](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)を使用できます。エラーバウンダリを使用するには、`use` APIを呼び出しているコンポーネントをエラーバウンダリでラップします。`use`に渡されたPromiseが拒否された場合、エラーバウンダリのフォールバックが表示されます。

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

#### Promiseの`catch`メソッドを使用して代替値を提供する {/*providing-an-alternative-value-with-promise-catch*/}

Promiseが拒否された場合に代替値を提供したい場合は、Promiseの<CodeStep step={1}>[`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)</CodeStep>メソッドを使用できます。

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

Promiseの<CodeStep step={1}>`catch`</CodeStep>メソッドを使用するには、Promiseオブジェクトに対して<CodeStep step={1}>`catch`</CodeStep>を呼び出します。<CodeStep step={1}>`catch`</CodeStep>は1つの引数を取ります：エラーメッセージを引数として取る関数です。<CodeStep step={1}>`catch`</CodeStep>に渡された関数が<CodeStep step={2}>返す</CodeStep>ものは、Promiseの解決値として使用されます。

---

## トラブルシューティング {/*troubleshooting*/}

### "Suspense Exception: This is not a real error!" {/*suspense-exception-error*/}

`use`をReactコンポーネントまたはフック関数の外で呼び出しているか、try-catchブロック内で呼び出している可能性があります。try-catchブロック内で`use`を呼び出している場合は、コンポーネントをエラーバウンダリでラップするか、Promiseの`catch`を呼び出してエラーをキャッチし、別の値でPromiseを解決してください。[これらの例を参照してください](#dealing-with-rejected-promises)。

`use`をReactコンポーネントまたはフック関数の外で呼び出している場合は、`use`呼び出しをReactコンポーネントまたはフック関数に移動してください。

```jsx
function MessageComponent({messagePromise}) {
  function download() {
    // ❌ `use`を呼び出している関数はコンポーネントまたはフックではありません
    const message = use(messagePromise);
    // ...
```

代わりに、`use`をコンポーネントクロージャの外で呼び出し、`use`を呼び出す関数がコンポーネントまたはフックであるようにします。

```jsx
function MessageComponent({messagePromise}) {
  // ✅ `use`はコンポーネントから呼び出されています。
  const message = use(messagePromise);
  // ...
```