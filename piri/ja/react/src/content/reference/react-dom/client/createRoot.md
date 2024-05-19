---
title: createRoot
---

<Intro>

`createRoot`を使用すると、ブラウザのDOMノード内にReactコンポーネントを表示するためのルートを作成できます。

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## 参照 {/*reference*/}

### `createRoot(domNode, options?)` {/*createroot*/}

`createRoot`を呼び出して、ブラウザのDOM要素内にコンテンツを表示するためのReactルートを作成します。

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

Reactは`domNode`のルートを作成し、その内部のDOMを管理します。ルートを作成した後、[`root.render`](#root-render)を呼び出して、その中にReactコンポーネントを表示する必要があります。

```js
root.render(<App />);
```

Reactで完全に構築されたアプリは、通常、ルートコンポーネントに対して1回の`createRoot`呼び出ししか持ちません。ページの一部にReactを使用する場合は、必要に応じて複数のルートを持つことができます。

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `domNode`: [DOM要素](https://developer.mozilla.org/en-US/docs/Web/API/Element)。ReactはこのDOM要素のルートを作成し、`render`などの関数をルートで呼び出して、レンダリングされたReactコンテンツを表示できるようにします。

* **オプション** `options`: このReactルートのオプションを含むオブジェクト。

  * <CanaryBadge title="この機能はCanaryチャンネルでのみ利用可能です" /> **オプション** `onCaughtError`: Error BoundaryでReactがエラーをキャッチしたときに呼び出されるコールバック。キャッチされた`error`と、`componentStack`を含む`errorInfo`オブジェクトが渡されます。
  * <CanaryBadge title="この機能はCanaryチャンネルでのみ利用可能です" /> **オプション** `onUncaughtError`: エラーがスローされ、Error Boundaryでキャッチされなかったときに呼び出されるコールバック。スローされた`error`と、`componentStack`を含む`errorInfo`オブジェクトが渡されます。
  * **オプション** `onRecoverableError`: Reactが自動的にエラーから回復したときに呼び出されるコールバック。Reactがスローする`error`と、`componentStack`を含む`errorInfo`オブジェクトが渡されます。一部の回復可能なエラーには、`error.cause`として元のエラー原因が含まれる場合があります。
  * **オプション** `identifierPrefix`: [`useId`](/reference/react/useId)によって生成されるIDにReactが使用する文字列プレフィックス。同じページで複数のルートを使用する場合の競合を避けるのに役立ちます。

#### 戻り値 {/*returns*/}

`createRoot`は、[`render`](#root-render)と[`unmount`](#root-unmount)の2つのメソッドを持つオブジェクトを返します。

#### 注意点 {/*caveats*/}
* アプリがサーバーレンダリングされている場合、`createRoot()`の使用はサポートされていません。代わりに[`hydrateRoot()`](/reference/react-dom/client/hydrateRoot)を使用してください。
* アプリには通常、1回の`createRoot`呼び出ししかありません。フレームワークを使用している場合、その呼び出しはフレームワークが行うかもしれません。
* JSXの一部をコンポーネントの子ではないDOMツリーの別の部分にレンダリングしたい場合（例：モーダルやツールチップ）、`createRoot`の代わりに[`createPortal`](/reference/react-dom/createPortal)を使用してください。

---

### `root.render(reactNode)` {/*root-render*/}

`root.render`を呼び出して、ReactルートのブラウザDOMノードに[JSX](/learn/writing-markup-with-jsx)（「Reactノード」）の一部を表示します。

```js
root.render(<App />);
```

Reactは`root`に`<App />`を表示し、その内部のDOMを管理します。

[以下の例を参照してください。](#usage)

#### パラメータ {/*root-render-parameters*/}

* `reactNode`: 表示したい*Reactノード*。通常は`<App />`のようなJSXの一部ですが、[`createElement()`](/reference/react/createElement)で構築されたReact要素、文字列、数値、`null`、または`undefined`を渡すこともできます。

#### 戻り値 {/*root-render-returns*/}

`root.render`は`undefined`を返します。

#### 注意点 {/*root-render-caveats*/}

* 最初に`root.render`を呼び出すと、ReactはReactルート内の既存のHTMLコンテンツをすべてクリアし、その中にReactコンポーネントをレンダリングします。

* ルートのDOMノードにサーバーまたはビルド中にReactによって生成されたHTMLが含まれている場合、代わりに[`hydrateRoot()`](/reference/react-dom/client/hydrateRoot)を使用して、既存のHTMLにイベントハンドラをアタッチします。

* 同じルートで`render`を複数回呼び出すと、Reactは最新のJSXを反映するために必要なDOMを更新します。Reactは以前にレンダリングされたツリーと「一致させる」ことによって、DOMのどの部分を再利用できるか、どの部分を再作成する必要があるかを決定します。同じルートで再度`render`を呼び出すことは、ルートコンポーネントで[`set`関数](/reference/react/useState#setstate)を呼び出すのと似ています。Reactは不要なDOM更新を避けます。

---

### `root.unmount()` {/*root-unmount*/}

`root.unmount`を呼び出して、Reactルート内のレンダリングされたツリーを破棄します。

```js
root.unmount();
```

Reactで完全に構築されたアプリには、通常、`root.unmount`の呼び出しはありません。

これは主に、ReactルートのDOMノード（またはその祖先のいずれか）が他のコードによってDOMから削除される可能性がある場合に役立ちます。例えば、非アクティブなタブをDOMから削除するjQueryタブパネルを想像してください。タブが削除されると、その中のすべて（Reactルート内も含む）がDOMから削除されます。その場合、Reactに削除されたルートのコンテンツの管理を「停止」するように`root.unmount`を呼び出す必要があります。そうしないと、削除されたルート内のコンポーネントはクリーンアップしてグローバルリソース（サブスクリプションなど）を解放することを知りません。

`root.unmount`を呼び出すと、ルート内のすべてのコンポーネントがアンマウントされ、ReactがルートDOMノードから「デタッチ」されます。これには、イベントハンドラやツリー内の状態の削除も含まれます。

#### パラメータ {/*root-unmount-parameters*/}

`root.unmount`はパラメータを受け取りません。

#### 戻り値 {/*root-unmount-returns*/}

`root.unmount`は`undefined`を返します。

#### 注意点 {/*root-unmount-caveats*/}

* `root.unmount`を呼び出すと、ツリー内のすべてのコンポーネントがアンマウントされ、ReactがルートDOMノードから「デタッチ」されます。

* `root.unmount`を呼び出した後、同じルートで再度`root.render`を呼び出すことはできません。アンマウントされたルートで`root.render`を呼び出そうとすると、「アンマウントされたルートを更新できません」というエラーがスローされます。ただし、そのノードの以前のルートがアンマウントされた後、同じDOMノードに新しいルートを作成することはできます。

---

## 使用法 {/*usage*/}

### Reactで完全に構築されたアプリのレンダリング {/*rendering-an-app-fully-built-with-react*/}

アプリが完全にReactで構築されている場合、アプリ全体のために単一のルートを作成します。

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

通常、このコードは起動時に1回だけ実行する必要があります。これにより：

1. HTMLで定義された<CodeStep step={1}>ブラウザのDOMノード</CodeStep>を見つけます。
2. アプリの<CodeStep step={2}>Reactコンポーネント</CodeStep>をその中に表示します。

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- これはDOMノードです -->
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

**アプリが完全にReactで構築されている場合、これ以上のルートを作成したり、再度[`root.render`](#root-render)を呼び出す必要はありません。**

この時点から、Reactはアプリ全体のDOMを管理します。コンポーネントを追加するには、[`App`コンポーネント内にネストします。](/learn/importing-and-exporting-components) UIを更新する必要がある場合、各コンポーネントは[状態を使用して](/reference/react/useState)これを行うことができます。モーダルやツールチップのようにDOMノードの外に追加のコンテンツを表示する必要がある場合は、[ポータルでレンダリングします。](/reference/react-dom/createPortal)

<Note>

HTMLが空の場合、アプリのJavaScriptコードが読み込まれて実行されるまで、ユーザーは空白のページを見ます。

```html
<div id="root"></div>
```

これは非常に遅く感じることがあります！これを解決するために、コンポーネントから初期HTMLを[サーバーまたはビルド中に生成することができます。](/reference/react-dom/server) これにより、訪問者はJavaScriptコードが読み込まれる前にテキストを読んだり、画像を見たり、リンクをクリックしたりできます。この最適化を自動的に行う[フレームワークの使用をお勧めします。](/learn/start-a-new-react-project#production-grade-react-frameworks) 実行されるタイミングに応じて、これは*サーバーサイドレンダリング（SSR）*または*静的サイト生成（SSG）*と呼ばれます。

</Note>

<Pitfall>

**サーバーレンダリングまたは静的生成を使用するアプリは、`createRoot`の代わりに[`hydrateRoot`](/reference/react-dom/client/hydrateRoot)を呼び出す必要があります。** ReactはHTMLからのDOMノードを再利用（ハイドレート）し、破壊して再作成する代わりにそれらを再利用します。

</Pitfall>

---

### Reactで部分的に構築されたページのレンダリング {/*rendering-a-page-partially-built-with-react*/}

ページが[完全にReactで構築されていない場合](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)、`createRoot`を複数回呼び出して、Reactが管理するUIのトップレベルの各部分にルートを作成できます。各ルートに異なるコンテンツを表示するには、[`root.render`](#root-render)を呼び出します。

ここでは、2つの異なるReactコンポーネントが`index.html`ファイルで定義された2つのDOMノードにレンダリングされています。

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

[`document.createElement()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)を使用して新しいDOMノードを作成し、手動でドキュメントに追加することもできます。

```js
const domNode = document.createElement('div');
const root = createRoot(domNode); 
root.render(<Comment />);
document.body.appendChild(domNode); // ドキュメントのどこにでも追加できます
```

ReactツリーをDOMノードから削除し、それによって使用されるすべてのリソースをクリーンアップするには、[`root.unmount`](#root-unmount)を呼び出します。

```js
root.unmount();
```

これは主に、Reactコンポーネントが別のフレームワークで書かれたアプリ内にある場合に役立ちます。

---

### ルートコンポーネントの更新 {/*updating-a-root-component*/}

同じルートで`render`を複数回呼び出すことができます。コンポーネントツリーの構造が以前にレンダリングされたものと一致している限り、Reactは[状態を保持します。](/learn/preserving-and-resetting-state) この例では、入力フィールドに入力できることに注目してください。これは、毎秒繰り返される`render`呼び出しの更新が破壊的でないことを意味します。

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

`render`を複数回呼び出すことは一般的ではありません。通常、コンポーネントは[状態を更新します。](/reference/react/useState)

### キャッチされないエラーのダイアログを表示する {/*show-a-dialog-for-uncaught-errors*/}

<Canary>

`onUncaughtError`は最新のReact Canaryリリースでのみ利用可能です。

</Canary>

デフォルトでは、Reactはすべてのキャッチされないエラーをコンソールにログします。独自のエラーレポートを実装するには、オプションの`
onUncaughtError`ルートオプションを提供できます。

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

<CodeStep step={1}>onUncaughtError</CodeStep>オプションは、2つの引数を持つ関数です。

1. スローされた<CodeStep step={2}>error</CodeStep>。
2. エラーの<CodeStep step={4}>componentStack</CodeStep>を含む<CodeStep step={3}>errorInfo</CodeStep>オブジェクト。

`onUncaughtError`ルートオプションを使用してエラーダイアログを表示できます。

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
<!-- これはDOMノードです -->
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
  // 既にメッセージを表示しているため、それを削除し、最初のError:行を削除します。
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];
  
  // 原因がある場合は表示
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

### Error Boundaryエラーの表示 {/*displaying-error-boundary-errors*/}

<Canary>

`onCaughtError`は最新のReact Canaryリリースでのみ利用可能です。

</Canary>

デフォルトでは、ReactはError Boundaryによってキャッチされたすべてのエラーを`console.error`にログします。この動作を上書きするには、オプションの`onCaughtError`ルートオプションを提供して、[Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)によってキャッチされたエラーを処理します。

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

<CodeStep step={1}>onCaughtError</CodeStep>オプションは、2つの引数を持つ関数です。

1. Error Boundaryによってキャッチされた<CodeStep step={2}>error</CodeStep>。
2. エラーの<CodeStep step={4}>componentStack</CodeStep>を含む<CodeStep step={3}>errorInfo</CodeStep>オブジェクト。

`onCaughtError`ルートオプションを使用してエラーダイアログを表示したり、既知のエラーをログからフィルタリングしたりできます。

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
<!-- これはDOMノードです -->
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
  // 既にメッセージを表示しているため、それを削除し、最初のError:行を削除します。
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];

  // 原因がある場合は表示
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
      <h3>Error Boundary</h3>
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

### 回復可能なエラーのダイアログを表示する {/*displaying-a-dialog-for-recoverable-errors*/}

Reactは、レンダリング中にスローされたエラーから回復を試みるために、コンポーネントを自動的に再レンダリングすることがあります。成功した場合、Reactは開発者に通知するために回復可能なエラーをコンソールにログします。この動作を上書きするには、オプションの`onRecoverableError`ルートオプションを提供できます。

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

<CodeStep step={1}>onRecoverableError</CodeStep>オプションは、2つの引数を持つ関数です。

1. Reactがスローする<CodeStep step={2}>error</CodeStep>。一部のエラーには、<CodeStep step={3}>error.cause</CodeStep>として元の原因が含まれる場合があります。
2. エラーの<CodeStep step={5}>componentStack</CodeStep>を含む<CodeStep step={4}>errorInfo</CodeStep>オブジェクト。

`onRecoverableError`ルートオプションを使用してエラーダイアログを表示できます。

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
<!-- これはDOMノードです -->
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
  // 既にメッセージを表示しているため、それを削除し、最初のError:行を削除します。
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];

  // 原因がある場合は表示
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

// 🚩 バグ: これは絶対にしないでください。これによりエラーが強制されます。
let errorThrown = false;
export default function App() {
  return (
    <>
      <ErrorBoundary
        fallbackRender={fallbackRender}
      >
        {!errorThrown && <Throw />}
        <p>このコンポーネントはエラーをスローしましたが、2回目のレンダリングで回復しました。</p>
        <p>回復したため、Error Boundaryは表示されませんでしたが、<code>onRecoverableError</code>を使用してエラーダイアログが表示されました。</p>
      </ErrorBoundary>
      
    </>
  );
}

function fallbackRender() {
  return (
    <div role="alert">
      <h3>Error Boundary</h3>
      <p>何かがうまくいきませんでした。</p>
    </div>
  );
}

function Throw({error}) {
  // 並行レンダリング中に外部値が変更されることをシミュレートします。
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
## トラブルシューティング {/*troubleshooting*/}

### ルートを作成しましたが、何も表示されません {/*ive-created-a-root-but-nothing-is-displayed*/}

アプリをルートに実際に*レンダリング*するのを忘れていないか確認してください。

```js {5}
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

これを行うまで、何も表示されません。

---

### エラーが発生しています: "root.renderに2番目の引数を渡しました" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

一般的な間違いは、`createRoot`のオプションを`root.render(...)`に渡すことです。

<ConsoleBlock level="error">

警告: root.render(...)に2番目の引数を渡しましたが、1つの引数しか受け付けません。

</ConsoleBlock>

修正するには、ルートオプションを`createRoot(...)`に渡し、`root.render(...)`には渡さないでください。

```js {2,5}
// 🚩 間違い: root.renderは1つの引数しか受け付けません。
root.render(App, {onUncaughtError});

// ✅ 正しい: オプションをcreateRootに渡します。
const root = createRoot(container, {onUncaughtError}); 
root.render(<App />);
```

---

### エラーが発生しています: "ターゲットコンテナはDOM要素ではありません" {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

このエラーは、`createRoot`に渡しているものがDOMノードではないことを意味します。

何が起こっているのか分からない場合は、ログを試してみてください。

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

例えば、`domNode`が`null`の場合、[`getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById)が`null`を返したことを意味します。これは、呼び出し時に指定されたIDを持つノードがドキュメントに存在しない場合に発生します。いくつかの理由が考えられます。

1. 探しているIDがHTMLファイルで使用したIDと異なる可能性があります。タイプミスを確認してください！
2. バンドルの`<script>`タグが、HTML内の*後に*表示されるDOMノードを「見る」ことができません。

このエラーが発生するもう一つの一般的な方法は、`createRoot(<App />)`と書くことです。これは`createRoot(domNode)`ではありません。

---

### エラーが発生しています: "関数はReact子として有効ではありません。" {/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

このエラーは、`root.render`に渡しているものがReactコンポーネントではないことを意味します。

これは、`root.render`を`Component`で呼び出す場合に発生することがあります。

```js {2,5}
// 🚩 間違い: Appは関数であり、コンポーネントではありません。
root.render(App);

// ✅ 正しい: <App />はコンポーネントです。
root.render(<App />);
```

または、関数を`root.render`に渡す場合、呼び出し結果を渡すのではなく、次のようにします。

```js {2,5}
// 🚩 間違い: createAppは関数であり、コンポーネントではありません。
root.render(createApp);

// ✅ 正しい: createAppを呼び出してコンポーネントを返します。
root.render(createApp());
```

---

### サーバーレンダリングされたHTMLが最初から再作成されます {/*my-server-rendered-html-gets-re-created-from-scratch*/}

アプリがサーバーレンダリングされ、Reactによって生成された初期HTMLが含まれている場合、ルートを作成して`root.render`を呼び出すと、そのHTMLがすべて削除され、DOMノードが最初から再作成されることに気付くかもしれません。これは遅くなり、フォーカスやスクロール位置がリセットされ、他のユーザー入力が失われる可能性があります。

サーバーレンダリングされたアプリは、`createRoot`の代わりに[`hydrateRoot`](/reference/react-dom/client/hydrateRoot)を使用する必要があります。

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

そのAPIは異なります。特に、通常は追加の`root.render`呼び出しはありません。