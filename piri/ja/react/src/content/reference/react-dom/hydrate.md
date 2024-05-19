---
title: hydrate
---

<Deprecated>

このAPIは将来のReactのメジャーバージョンで削除されます。

React 18では、`hydrate`は[`hydrateRoot`](/reference/react-dom/client/hydrateRoot)に置き換えられました。React 18で`hydrate`を使用すると、アプリがReact 17で実行されているかのように動作するという警告が表示されます。詳細は[こちら](/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis)をご覧ください。

</Deprecated>

<Intro>

`hydrate`は、React 17およびそれ以前のバージョンで[`react-dom/server`](/reference/react-dom/server)によって事前に生成されたHTMLコンテンツを持つブラウザのDOMノード内にReactコンポーネントを表示するためのものです。

```js
hydrate(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `hydrate(reactNode, domNode, callback?)` {/*hydrate*/}

React 17およびそれ以前のバージョンで`hydrate`を呼び出して、サーバー環境で既にレンダリングされた既存のHTMLにReactを「アタッチ」します。

```js
import { hydrate } from 'react-dom';

hydrate(reactNode, domNode);
```

Reactは`domNode`内に存在するHTMLにアタッチし、その中のDOMの管理を引き継ぎます。Reactで完全に構築されたアプリは通常、ルートコンポーネントで1回だけ`hydrate`を呼び出します。

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `reactNode`: 既存のHTMLをレンダリングするために使用される「Reactノード」。これは通常、React 17で`renderToString(<App />)`のような`ReactDOM Server`メソッドでレンダリングされた`<App />`のようなJSXの一部です。

* `domNode`: サーバー上でルート要素としてレンダリングされた[DOM要素](https://developer.mozilla.org/en-US/docs/Web/API/Element)。

* **オプション**: `callback`: 関数。渡された場合、Reactはコンポーネントがハイドレートされた後にこれを呼び出します。

#### 戻り値 {/*returns*/}

`hydrate`はnullを返します。

#### 注意点 {/*caveats*/}
* `hydrate`は、レンダリングされたコンテンツがサーバーでレンダリングされたコンテンツと同一であることを期待します。Reactはテキストコンテンツの違いを修正できますが、不一致をバグとして扱い、修正する必要があります。
* 開発モードでは、Reactはハイドレーション中の不一致について警告します。不一致の場合、属性の違いが修正される保証はありません。これはパフォーマンス上の理由で重要です。ほとんどのアプリでは不一致はまれであり、すべてのマークアップを検証することは非常に高価になるためです。
* アプリには通常、1回だけ`hydrate`呼び出しがあります。フレームワークを使用している場合、フレームワークがこの呼び出しを行うかもしれません。
* アプリが既にレンダリングされたHTMLなしでクライアントレンダリングされている場合、`hydrate()`の使用はサポートされていません。代わりに[render()](/reference/react-dom/render)（React 17およびそれ以前）または[createRoot()](/reference/react-dom/client/createRoot)（React 18以降）を使用してください。

---

## 使用法 {/*usage*/}

`hydrate`を呼び出して、サーバーレンダリングされた<CodeStep step={1}>Reactコンポーネント</CodeStep>を<CodeStep step={2}>ブラウザのDOMノード</CodeStep>にアタッチします。

```js [[1, 3, "<App />"], [2, 3, "document.getElementById('root')"]]
import { hydrate } from 'react-dom';

hydrate(<App />, document.getElementById('root'));
```

サーバーレンダリングされたHTMLなしでクライアント専用アプリをレンダリングするために`hydrate()`を使用することはサポートされていません。代わりに[`render()`](/reference/react-dom/render)（React 17およびそれ以前）または[`createRoot()`](/reference/react-dom/client/createRoot)（React 18以降）を使用してください。

### サーバーレンダリングされたHTMLのハイドレーション {/*hydrating-server-rendered-html*/}

Reactでは、「ハイドレーション」はサーバー環境で既にレンダリングされた既存のHTMLにReactが「アタッチ」する方法です。ハイドレーション中、Reactは既存のマークアップにイベントリスナーをアタッチし、クライアント上でアプリのレンダリングを引き継ごうとします。

Reactで完全に構築されたアプリでは、**通常、アプリ全体の起動時に1回だけ「ルート」をハイドレートします**。

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div>内のHTMLコンテンツは
  react-dom/serverによってAppから生成されました。
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

通常、再度`hydrate`を呼び出したり、他の場所で呼び出したりする必要はありません。この時点から、ReactはアプリケーションのDOMを管理します。UIを更新するには、コンポーネントが[状態を使用します。](/reference/react/useState)

ハイドレーションの詳細については、[`hydrateRoot`](/reference/react-dom/client/hydrateRoot)のドキュメントを参照してください。

---

### 避けられないハイドレーション不一致エラーの抑制 {/*suppressing-unavoidable-hydration-mismatch-errors*/}

サーバーとクライアントの間で単一の要素の属性やテキストコンテンツが避けられないほど異なる場合（例えば、タイムスタンプ）、ハイドレーション不一致の警告を抑制することができます。

要素のハイドレーション警告を抑制するには、`suppressHydrationWarning={true}`を追加します：

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div>内のHTMLコンテンツは
  react-dom/serverによってAppから生成されました。
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

これは1レベル深くまでしか機能せず、エスケープハッチとして意図されています。過度に使用しないでください。テキストコンテンツでない限り、Reactはそれを修正しようとしないため、将来の更新まで一貫性がないままになる可能性があります。

---

### クライアントとサーバーのコンテンツの違いを処理する {/*handling-different-client-and-server-content*/}

サーバーとクライアントで意図的に異なるものをレンダリングする必要がある場合、2パスレンダリングを行うことができます。クライアントで異なるものをレンダリングするコンポーネントは、[Effect](/reference/react/useEffect)で`true`に設定できる`isClient`のような[状態変数](/reference/react/useState)を読み取ることができます：

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

この方法では、最初のレンダーパスはサーバーと同じコンテンツをレンダリングし、不一致を避けますが、ハイドレーション直後に追加のパスが同期的に行われます。

<Pitfall>

このアプローチは、コンポーネントが2回レンダリングされるため、ハイドレーションを遅くします。遅い接続でのユーザーエクスペリエンスに注意してください。JavaScriptコードは初期HTMLレンダリングよりもかなり遅れてロードされる可能性があるため、ハイドレーション直後に異なるUIをレンダリングすると、ユーザーにとって不快に感じるかもしれません。

</Pitfall>