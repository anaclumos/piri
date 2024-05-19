---
title: hydrateRoot
---

<Intro>

`hydrateRoot`を使用すると、ブラウザのDOMノード内に以前[`react-dom/server`](/reference/react-dom/server)によって生成されたHTMLコンテンツを表示することができます。

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `hydrateRoot(domNode, reactNode, options?)` {/*hydrateroot*/}

`hydrateRoot`を呼び出して、サーバー環境でReactによって既にレンダリングされたHTMLにReactを「アタッチ」します。

```js
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

Reactは`domNode`内に存在するHTMLにアタッチし、その中のDOMを管理します。Reactで完全に構築されたアプリは通常、ルートコンポーネントで1回だけ`hydrateRoot`を呼び出します。

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `domNode`: サーバー上でルート要素としてレンダリングされた[DOM要素](https://developer.mozilla.org/en-US/docs/Web/API/Element)。

* `reactNode`: 既存のHTMLをレンダリングするために使用される「Reactノード」。通常、`renderToPipeableStream(<App />)`のような`ReactDOM Server`メソッドでレンダリングされたJSXの一部である`<App />`です。

* **オプション** `options`: このReactルートのオプションを含むオブジェクト。

  * <CanaryBadge title="この機能はCanaryチャンネルでのみ利用可能です" /> **オプション** `onCaughtError`: エラーバウンダリでReactがエラーをキャッチしたときに呼び出されるコールバック。キャッチされた`error`と、`componentStack`を含む`errorInfo`オブジェクトが渡されます。
  * <CanaryBadge title="この機能はCanaryチャンネルでのみ利用可能です" /> **オプション** `onUncaughtError`: エラーバウンダリでキャッチされずにスローされたエラーが発生したときに呼び出されるコールバック。スローされた`error`と、`componentStack`を含む`errorInfo`オブジェクトが渡されます。
  * **オプション** `onRecoverableError`: Reactが自動的にエラーから回復したときに呼び出されるコールバック。Reactがスローする`error`と、`componentStack`を含む`errorInfo`オブジェクトが渡されます。一部の回復可能なエラーには、`error.cause`として元のエラー原因が含まれる場合があります。
  * **オプション** `identifierPrefix`: [`useId`](/reference/react/useId)によって生成されるIDのためにReactが使用する文字列プレフィックス。同じページに複数のルートを使用する場合に競合を避けるために便利です。サーバーで使用されるプレフィックスと同じでなければなりません。


#### 戻り値 {/*returns*/}

`hydrateRoot`は、[`render`](#root-render)と[`unmount`](#root-unmount)の2つのメソッドを持つオブジェクトを返します。

#### 注意点 {/*caveats*/}

* `hydrateRoot()`は、レンダリングされたコンテンツがサーバーでレンダリングされたコンテンツと同一であることを期待します。ミスマッチをバグとして扱い、修正する必要があります。
* 開発モードでは、Reactはハイドレーション中のミスマッチについて警告します。ミスマッチが発生した場合、属性の違いが修正される保証はありません。これはパフォーマンス上の理由で重要です。ほとんどのアプリではミスマッチはまれであり、すべてのマークアップを検証することは非常に高価になるためです。
* アプリには通常、1回の`hydrateRoot`呼び出ししかありません。フレームワークを使用している場合、この呼び出しはフレームワークが行うかもしれません。
* アプリが既にレンダリングされたHTMLなしでクライアント側でレンダリングされる場合、`hydrateRoot()`の使用はサポートされていません。代わりに[`createRoot()`](/reference/react-dom/client/createRoot)を使用してください。

---

### `root.render(reactNode)` {/*root-render*/}

`root.render`を呼び出して、ブラウザのDOM要素のハイドレートされたReactルート内のReactコンポーネントを更新します。

```js
root.render(<App />);
```

Reactはハイドレートされた`root`内の`<App />`を更新します。

[以下の例を参照してください。](#usage)

#### パラメータ {/*root-render-parameters*/}

* `reactNode`: 更新したい「Reactノード」。通常は`<App />`のようなJSXの一部ですが、[`createElement()`](/reference/react/createElement)で構築されたReact要素、文字列、数値、`null`、または`undefined`を渡すこともできます。


#### 戻り値 {/*root-render-returns*/}

`root.render`は`undefined`を返します。

#### 注意点 {/*root-render-caveats*/}

* ルートがハイドレートを完了する前に`root.render`を呼び出すと、Reactは既存のサーバーレンダリングされたHTMLコンテンツをクリアし、ルート全体をクライアントレンダリングに切り替えます。

---

### `root.unmount()` {/*root-unmount*/}

`root.unmount`を呼び出して、Reactルート内のレンダリングされたツリーを破棄します。

```js
root.unmount();
```

Reactで完全に構築されたアプリには通常、`root.unmount`の呼び出しはありません。

これは主に、ReactルートのDOMノード（またはその祖先のいずれか）が他のコードによってDOMから削除される可能性がある場合に役立ちます。例えば、非アクティブなタブをDOMから削除するjQueryタブパネルを想像してください。タブが削除されると、その中のすべて（Reactルート内も含む）がDOMから削除されます。削除されたルートのコンテンツの管理をReactに「停止」させるために`root.unmount`を呼び出す必要があります。そうしないと、削除されたルート内のコンポーネントはクリーンアップされず、サブスクリプションなどのリソースを解放しません。

`root.unmount`を呼び出すと、ルート内のすべてのコンポーネントがアンマウントされ、ルートDOMノードからReactが「デタッチ」され、ツリー内のイベントハンドラや状態も削除されます。


#### パラメータ {/*root-unmount-parameters*/}

`root.unmount`はパラメータを受け取りません。


#### 戻り値 {/*root-unmount-returns*/}

`root.unmount`は`undefined`を返します。

#### 注意点 {/*root-unmount-caveats*/}

* `root.unmount`を呼び出すと、ツリー内のすべてのコンポーネントがアンマウントされ、ルートDOMノードからReactが「デタッチ」されます。

* `root.unmount`を呼び出した後、再び`root.render`をルートに呼び出すことはできません。アンマウントされたルートに`root.render`を呼び出そうとすると、「アンマウントされたルートを更新できません」というエラーがスローされます。

---

## 使用例 {/*usage*/}

### サーバーレンダリングされたHTMLのハイドレーション {/*hydrating-server-rendered-html*/}

アプリのHTMLが[`react-dom/server`](/reference/react-dom/client/createRoot)によって生成された場合、クライアントで*ハイドレート*する必要があります。

```js [[1, 3, "document.getElementById('root')"], [2, 3, "<App />"]]
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

これにより、<CodeStep step={1}>ブラウザのDOMノード</CodeStep>内のサーバーHTMLが、アプリの<CodeStep step={2}>Reactコンポーネント</CodeStep>でハイドレートされます。通常、起動時に1回行います。フレームワークを使用している場合、これを裏で行うかもしれません。

アプリをハイドレートするために、Reactはサーバーから生成された初期HTMLにコンポーネントのロジックを「アタッチ」します。ハイドレーションは、サーバーからの初期HTMLスナップショットをブラウザで実行される完全にインタラクティブなアプリに変えます。

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div>内のHTMLコンテンツは
  react-dom/serverによってAppから生成されました。
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

再び`hydrateRoot`を呼び出したり、他の場所で呼び出す必要はありません。この時点から、ReactはアプリケーションのDOMを管理します。UIを更新するには、コンポーネントが[状態を使用](/reference/react/useState)します。

<Pitfall>

`hydrateRoot`に渡すReactツリーは、サーバーで生成されたものと**同じ出力**を生成する必要があります。

これはユーザーエクスペリエンスにとって重要です。ユーザーはJavaScriptコードが読み込まれる前にサーバー生成のHTMLをしばらく見ることになります。サーバーレンダリングは、その出力のHTMLスナップショットを表示することでアプリの読み込みが速くなるという錯覚を作り出します。突然異なるコンテンツを表示すると、その錯覚が壊れます。これが、サーバーレンダリングの出力がクライアントの初期レンダリング出力と一致する必要がある理由です。

ハイドレーションエラーを引き起こす最も一般的な原因には次のものがあります：

* ルートノード内のReact生成HTMLの周囲の余分な空白（改行など）。
* レンダリングロジックで`typeof window !== 'undefined'`のようなチェックを使用すること。
* レンダリングロジックで[`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)のようなブラウザ専用のAPIを使用すること。
* サーバーとクライアントで異なるデータをレンダリングすること。

Reactは一部のハイドレーションエラーから回復しますが、**他のバグと同様に修正する必要があります。** 最良の場合、速度低下を引き起こし、最悪の場合、イベントハンドラが間違った要素にアタッチされる可能性があります。

</Pitfall>

---

### ドキュメント全体のハイドレーション {/*hydrating-an-entire-document*/}

Reactで完全に構築されたアプリは、[`<html>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html)タグを含むドキュメント全体をJSXとしてレンダリングできます：

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

ドキュメント全体をハイドレートするには、`hydrateRoot`の最初の引数として[`document`](https://developer.mozilla.org/en-US/docs/Web/API/Window/document)グローバルを渡します：

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

---

### 避けられないハイドレーションミスマッチエラーの抑制 {/*suppressing-unavoidable-hydration-mismatch-errors*/}

サーバーとクライアントの間で属性やテキストコンテンツが避けられないほど異なる場合（例えば、タイムスタンプ）、ハイドレーションミスマッチ警告を無効にすることができます。

要素のハイドレーション警告を無効にするには、`suppressHydrationWarning={true}`を追加します：

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div>内のHTMLコンテンツは
  react-dom/serverによってAppから生成されました。
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

これは1レベル深くしか機能せず、エスケープハッチとして意図されています。過度に使用しないでください。テキストコンテンツでない限り、Reactはそれを修正しようとしないため、将来の更新まで一貫性がないままになる可能性があります。

---

### クライアントとサーバーのコンテンツが異なる場合の処理 {/*handling-different-client-and-server-content*/}

意図的にサーバーとクライアントで異なるものをレンダリングする必要がある場合、2パスレンダリングを行うことができます。クライアントで異なるものをレンダリングするコンポーネントは、[Effect](/reference/react/useEffect)で`true`に設定できる[状態変数](/reference/react/useState)の`isClient`を読み取ることができます：

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div>内のHTMLコンテンツは
  react-dom/serverによってAppから生成されました。
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

この方法では、初期レンダーパスがサーバーと同じコンテンツをレンダリングし、ミスマッチを回避しますが、ハイドレーション直後に追加のパスが同期的に行われます。

<Pitfall>

このアプローチは、コンポーネントが2回レンダリングする必要があるため、ハイドレーションを遅くします。遅い接続でのユーザーエクスペリエンスに注意してください。JavaScriptコードは初期HTMLレンダリングよりもかなり遅れて読み込まれる可能性があるため、ハイドレーション直後に異なるUIをレンダリングすることは、ユーザーにとっても不快に感じるかもしれません。

</Pitfall>

---

### ハイドレートされたルートコンポーネントの更新 {/*updating-a-hydrated-root-component*/}

ルートがハイドレートを完了した後、[`root.render`](#root-render)を呼び出してルートReactコンポーネントを更新できます。**[`createRoot`](/reference/react-dom/client/createRoot)とは異なり、通常はこれを行う必要はありません。初期コンテンツはすでにHTMLとしてレンダリングされています。**

ハイドレーション後のある時点で`root.render`を呼び出し、コンポーネントツリーの構造が以前にレンダリングされたものと一致する場合、
Reactは[状態を保持](/learn/preserving-and-resetting-state)します。この例では、入力フィールドに入力できることに注意してください。これは、毎秒繰り返される`render`呼び出しの更新が破壊的でないことを意味します：

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div>内のすべてのHTMLコンテンツは
  react-dom/serverで<App />をレンダリングすることによって生成されました。
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

ハイドレートされたルートで[`root.render`](#root-render)を呼び出すことはまれです。通常は、代わりにコンポーネント内で[状態を更新](/reference/react/useState)します。

### キャッチされないエラーのダイアログを表示する {/*show-a-dialog-for-uncaught-errors*/}

<Canary>

`onUncaughtError`は最新のReact Canaryリリースでのみ利用可能です。

</Canary>

デフォルトでは、Reactはすべてのキャッチされないエラーをコンソールにログします。独自のエラーレポートを実装するには、オプションの`onUncaughtError`ルートオプションを提供できます：

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

<CodeStep step={1}>onUncaughtError</CodeStep>オプションは、2つの引数を持つ関数です：

1. スローされた<CodeStep step={2}>error</CodeStep>。
2. エラーの<CodeStep step={4}>componentStack</CodeStep>を含む<CodeStep step={3}>errorInfo</CodeStep>オブジェクト。

`onUncaughtError`ルートオプションを使用してエラーダイアログを表示できます：

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Reactアプリでエラーが発生した場合にクラッシュする可能性があるため、
  生のHTMLでエラーダイアログを表示します。
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">このエラーは次の場所で発生しました:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">コールスタック:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">原因:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    閉じる
  </button>
  <h3 id="error-not-dismissible">このエラーは閉じることができません。</h3>
</div>
<!--
  <div id="root">...</div>内のHTMLコンテンツは
  react-dom/serverによってAppから生成されました。
-->
<div id="root"><div><span>このエラーはエラーダイアログを表示します:</span><button>エラーをスロー</button></div></div>
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
  
  // タイトルを設定
  errorTitle.innerText = title;
  
  // エラーメッセージと本文を表示
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // コンポーネントスタックを表示
  errorComponentStack.innerText = componentStack;

  // コールスタックを表示
  // メッセージを表示したので、最初のError:行を削除します。
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];
  
  // 原因が利用可能な場合は表示
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // 閉じるボタンを表示（閉じることができる場合）
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }
  
  // ダイアログを表示
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
      <span>このエラーはエラーダイアログを表示します:</span>
      <button onClick={() => setThrowError(true)}>
        エラーをスロー
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


### エラーバウンダリのエラーを表示する {/*displaying-error-boundary-errors*/}

<Canary>

`onCaughtError`は最新のReact Canaryリリースでのみ利用可能です。

</Canary>

デフォルトでは、Reactはエラーバウンダリによってキャッチされたすべてのエラーを`console.error`にログします。この動作を上書きするには、[エラーバウンダリ](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)によってキャッチされたエラーのためにオプションの`onCaughtError`ルートオプションを提供できます：

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

<CodeStep step={1}>onCaughtError</CodeStep>オプションは、2つの引数を持つ関数です：

1. エラーバウンダリによってキャッチされた<CodeStep step={2}>error</CodeStep>。
2. エラーの<CodeStep step={4}>componentStack</CodeStep>を含む<CodeStep step={3}>errorInfo</CodeStep>オブジェクト。

`onCaughtError`ルートオプションを使用してエラーダイアログを表示したり、既知のエラーをログからフィルタリングしたりできます：

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Reactアプリでエラーが発生した場合にクラッシュする可能性があるため、
  生のHTMLでエラーダイアログを表示します。
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">このエラーは次の場所で発生しました:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">コールスタック:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">原因:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    閉じる
  </button>
  <h3 id="error-not-dismissible">このエラーは閉じることができません。</h3>
</div>
<!--
  <div id="root">...</div>内のHTMLコンテンツは
  react-dom/serverによってAppから生成されました。
-->
<div id="root"><span>このエラーはエラーダイアログを表示しません:</span><button>既知のエラーをスロー</button><span>このエラーはエラーダイアログを表示します:</span><button>未知のエラーをスロー</button></div>
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
  
  // タイトルを設定
  errorTitle.innerText = title;
  
  // エラーメッセージと本文を表示
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // コンポーネントスタックを表示
  errorComponentStack.innerText = componentStack;

  // コールスタックを表示
  // メッセージを表示したので、最初のError:行を削除します。
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];
  
  // 原因が利用可能な場合は表示
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // 閉じるボタンを表示（閉じることができる場合）
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }
  
  // ダイアログを表示
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
        <span>このエラーはエラーダイアログを表示しません:</span>
        <button onClick={handleKnown}>
          既知のエラーをスロー
        </button>
        <span>このエラーはエラーダイアログを表示します:</span>
        <button onClick={handleUnknown}>
          未知のエラーをスロー
        </button>
      </ErrorBoundary>
      
    </>
  );
}

function fallbackRender({ resetErrorBoundary }) {
  return (
    <div role="alert">
      <h3>エラーバウンダリ</h3>
      <p>何かがうまくいきませんでした。</p>
      <button onClick={resetErrorBoundary}>リセット</button>
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

### 回復可能なハイドレーションミスマッチエラーのダイアログを表示する {/*show-a-dialog-for-recoverable-hydration-mismatch-errors*/}

Reactがハイドレーションミスマッチに遭遇した場合、自動的にクライアントでのレンダリングを試みます。デフォルトでは、Reactはハイドレーションミスマッチエラーを`console.error`にログします。この動作を上書きするには、オプションの`onRecoverableError`ルートオプションを提供できます：

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

<CodeStep step={1}>onRecoverableError</CodeStep>オプションは、2つの引数を持つ関数です：

1. Reactがスローする<CodeStep step={2}>error</CodeStep>。一部のエラーには、<CodeStep step={3}>error.cause</CodeStep>として元の原因が含まれる場合があります。
2. エラーの<CodeStep step={5}>componentStack</CodeStep>を含む<CodeStep step={4}>errorInfo</CodeStep>オブジェクト。

`onRecoverableError`ルートオプションを使用してハイドレーションミスマッチのエラーダイアログを表示できます：

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Reactアプリでエラーが発生した場合にクラッシュする可能性があるため、
  生のHTMLでエラーダイアログを表示します。
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">このエラーは次の場所で発生しました:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">コールスタック:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">原因:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    閉じる
  </button>
  <h3 id="error-not-dismissible">このエラーは閉じることができません。</h3>
</div>
<!--
  <div id="root">...</div>内のHTMLコンテンツは
  react-dom/serverによってAppから生成されました。
-->
<div id="root"><span>Server</span></div>
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
  
  // タイトルを設定
  errorTitle.innerText = title;
  
  // エラーメッセージと本文を表示
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // コンポーネントスタックを表示
  errorComponentStack.innerText = componentStack;

  // コールスタックを表示
  // メッセージを表示したので、最初のError:行を削除します。
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];
  
  // 原因が利用可能な場合は表示
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // 閉じるボタンを表示（閉じることができる場合）
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }
  
  // ダイアログを表示
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
    <span>{typeof window !== 'undefined' ? 'Client' : 'Server'}</span>
  );
}

function fallbackRender({ resetErrorBoundary }) {
  return (
    <div role="alert">
      <h3>エラーバウンダリ</h3>
      <p>何かがうまくいきませんでした。</p>
      <button onClick={resetErrorBoundary}>リセット</button>
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

## トラブルシューティング {/*troubleshooting*/}


### エラーが発生しました: "root.renderに2番目の引数を渡しました" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

一般的な間違いは、`hydrateRoot`のオプションを`root.render(...)`に渡すことです：

<ConsoleBlock level="error">

警告: root.render(...)に2番目の引数を渡しましたが、1つの引数しか受け付けません。

</ConsoleBlock>

修正するには、ルートオプションを`root.render(...)`ではなく`hydrateRoot(...)`に渡します：
```js {2,5}
// 🚩 間違い: root.renderは1つの引数しか受け付けません。
root.render(App, {onUncaughtError});

// ✅ 正しい: オプションをcreateRootに渡します。
const root = hydrateRoot(container, <App />, {onUncaughtError});
```