---
title: renderToString
---

<Pitfall>

`renderToString`はストリーミングやデータの待機をサポートしていません。[代替案を参照してください。](#alternatives)

</Pitfall>

<Intro>

`renderToString`はReactツリーをHTML文字列にレンダリングします。

```js
const html = renderToString(reactNode, options?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `renderToString(reactNode, options?)` {/*rendertostring*/}

サーバー上で、`renderToString`を呼び出してアプリをHTMLにレンダリングします。

```js
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

クライアント上で、サーバー生成のHTMLをインタラクティブにするために[`hydrateRoot`](/reference/react-dom/client/hydrateRoot)を呼び出します。

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `reactNode`: HTMLにレンダリングしたいReactノード。例えば、`<App />`のようなJSXノード。

* **オプション** `options`: サーバーレンダリング用のオブジェクト。
  * **オプション** `identifierPrefix`: [`useId`](/reference/react/useId)によって生成されたIDにReactが使用する文字列プレフィックス。同じページに複数のルートを使用する場合の競合を避けるために役立ちます。[`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters)に渡されるプレフィックスと同じでなければなりません。

#### 戻り値 {/*returns*/}

HTML文字列。

#### 注意点 {/*caveats*/}

* `renderToString`はSuspenseのサポートが限定的です。コンポーネントがサスペンドすると、`renderToString`は即座にそのフォールバックをHTMLとして送信します。

* `renderToString`はブラウザでも動作しますが、クライアントコードでの使用は[推奨されません。](#removing-rendertostring-from-the-client-code)

---

## 使用法 {/*usage*/}

### ReactツリーをHTMLとして文字列にレンダリングする {/*rendering-a-react-tree-as-html-to-a-string*/}

`renderToString`を呼び出してアプリをHTML文字列にレンダリングし、サーバーレスポンスで送信できます：

```js {5-6}
import { renderToString } from 'react-dom/server';

// ルートハンドラーの構文はバックエンドフレームワークによって異なります
app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(html);
});
```

これにより、Reactコンポーネントの初期の非インタラクティブなHTML出力が生成されます。クライアントでは、サーバー生成のHTMLを*ハイドレート*してインタラクティブにするために[`hydrateRoot`](/reference/react-dom/client/hydrateRoot)を呼び出す必要があります。


<Pitfall>

`renderToString`はストリーミングやデータの待機をサポートしていません。[代替案を参照してください。](#alternatives)

</Pitfall>

---

## 代替案 {/*alternatives*/}

### サーバー上で`renderToString`からストリーミングメソッドへの移行 {/*migrating-from-rendertostring-to-a-streaming-method-on-the-server*/}

`renderToString`は文字列を即座に返すため、ストリーミングやデータの待機をサポートしていません。

可能な場合は、以下の完全な機能を持つ代替案を使用することをお勧めします：

* Node.jsを使用している場合は、[`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)を使用してください。
* Denoや[Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)を持つ最新のエッジランタイムを使用している場合は、[`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream)を使用してください。

サーバー環境がストリームをサポートしていない場合は、引き続き`renderToString`を使用できます。

---

### クライアントコードから`renderToString`を削除する {/*removing-rendertostring-from-the-client-code*/}

時々、`renderToString`はクライアントでコンポーネントをHTMLに変換するために使用されます。

```js {1-2}
// 🚩 不要: クライアントでrenderToStringを使用する
import { renderToString } from 'react-dom/server';

const html = renderToString(<MyIcon />);
console.log(html); // 例えば、"<svg>...</svg>"
```

クライアントで`react-dom/server`をインポートすると、バンドルサイズが不必要に増加するため、避けるべきです。ブラウザでコンポーネントをHTMLにレンダリングする必要がある場合は、[`createRoot`](/reference/react-dom/client/createRoot)を使用し、DOMからHTMLを読み取ります：

```js
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

const div = document.createElement('div');
const root = createRoot(div);
flushSync(() => {
  root.render(<MyIcon />);
});
console.log(div.innerHTML); // 例えば、"<svg>...</svg>"
```

[`flushSync`](/reference/react-dom/flushSync)の呼び出しは、DOMが更新される前にその[`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)プロパティを読み取るために必要です。

---

## トラブルシューティング {/*troubleshooting*/}

### コンポーネントがサスペンドすると、HTMLには常にフォールバックが含まれる {/*when-a-component-suspends-the-html-always-contains-a-fallback*/}

`renderToString`はSuspenseを完全にはサポートしていません。

コンポーネントがサスペンドすると（例えば、[`lazy`](/reference/react/lazy)で定義されているか、データを取得するため）、`renderToString`はそのコンテンツが解決されるのを待ちません。代わりに、`renderToString`はその上の最も近い[`<Suspense>`](/reference/react/Suspense)境界を見つけ、その`fallback`プロップをHTMLにレンダリングします。コンテンツはクライアントコードが読み込まれるまで表示されません。

これを解決するには、[推奨されるストリーミングソリューション](#migrating-from-rendertostring-to-a-streaming-method-on-the-server)のいずれかを使用してください。これにより、サーバーで解決されるときにコンテンツをチャンクとしてストリーミングでき、クライアントコードが読み込まれる前にページが徐々に埋められていくのがユーザーに見えます。