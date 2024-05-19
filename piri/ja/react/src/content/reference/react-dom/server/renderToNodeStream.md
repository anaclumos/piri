---
title: renderToNodeStream
---

<Deprecated>

このAPIは将来のReactのメジャーバージョンで削除されます。代わりに[`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)を使用してください。

</Deprecated>

<Intro>

`renderToNodeStream`はReactツリーを[Node.jsのReadable Stream](https://nodejs.org/api/stream.html#readable-streams)にレンダリングします。

```js
const stream = renderToNodeStream(reactNode, options?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `renderToNodeStream(reactNode, options?)` {/*rendertonodestream*/}

サーバー上で、`renderToNodeStream`を呼び出して、レスポンスにパイプできる[Node.jsのReadable Stream](https://nodejs.org/api/stream.html#readable-streams)を取得します。

```js
import { renderToNodeStream } from 'react-dom/server';

const stream = renderToNodeStream(<App />);
stream.pipe(response);
```

クライアント上では、[`hydrateRoot`](/reference/react-dom/client/hydrateRoot)を呼び出して、サーバー生成のHTMLをインタラクティブにします。

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `reactNode`: HTMLにレンダリングしたいReactノード。例えば、`<App />`のようなJSX要素。

* **オプション** `options`: サーバーレンダリング用のオブジェクト。
  * **オプション** `identifierPrefix`: [`useId`](/reference/react/useId)によって生成されたIDにReactが使用する文字列プレフィックス。同じページに複数のルートを使用する場合の競合を避けるために便利です。[`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters)に渡されるプレフィックスと同じでなければなりません。

#### 戻り値 {/*returns*/}

HTML文字列を出力する[Node.jsのReadable Stream](https://nodejs.org/api/stream.html#readable-streams)。

#### 注意点 {/*caveats*/}

* このメソッドは、すべての[サスペンス境界](/reference/react/Suspense)が完了するまで出力を返しません。

* React 18以降、このメソッドはすべての出力をバッファリングするため、実際にはストリーミングの利点を提供しません。このため、[`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)への移行が推奨されます。

* 返されるストリームはutf-8でエンコードされたバイトストリームです。別のエンコーディングのストリームが必要な場合は、テキストのトランスコーディング用の変換ストリームを提供する[iconv-lite](https://www.npmjs.com/package/iconv-lite)のようなプロジェクトを検討してください。

---

## 使用法 {/*usage*/}

### ReactツリーをHTMLとしてNode.jsのReadable Streamにレンダリングする {/*rendering-a-react-tree-as-html-to-a-nodejs-readable-stream*/}

`renderToNodeStream`を呼び出して、サーバーレスポンスにパイプできる[Node.jsのReadable Stream](https://nodejs.org/api/stream.html#readable-streams)を取得します：

```js {5-6}
import { renderToNodeStream } from 'react-dom/server';

// ルートハンドラーの構文はバックエンドフレームワークによって異なります
app.use('/', (request, response) => {
  const stream = renderToNodeStream(<App />);
  stream.pipe(response);
});
```

このストリームは、Reactコンポーネントの初期の非インタラクティブなHTML出力を生成します。クライアント上では、[`hydrateRoot`](/reference/react-dom/client/hydrateRoot)を呼び出して、そのサーバー生成のHTMLを*ハイドレート*し、インタラクティブにする必要があります。