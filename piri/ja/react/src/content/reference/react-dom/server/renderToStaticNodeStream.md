---
title: renderToStaticNodeStream
---

<Intro>

`renderToStaticNodeStream` は、非インタラクティブなReactツリーを [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) にレンダリングします。

```js
const stream = renderToStaticNodeStream(reactNode, options?)
```

</Intro>

<InlineToc />

---

## 参照 {/*reference*/}

### `renderToStaticNodeStream(reactNode, options?)` {/*rendertostaticnodestream*/}

サーバー上で、`renderToStaticNodeStream` を呼び出して [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) を取得します。

```js
import { renderToStaticNodeStream } from 'react-dom/server';

const stream = renderToStaticNodeStream(<Page />);
stream.pipe(response);
```

[以下の例を参照してください。](#usage)

このストリームは、Reactコンポーネントの非インタラクティブなHTML出力を生成します。

#### パラメータ {/*parameters*/}

* `reactNode`: HTMLにレンダリングしたいReactノード。例えば、`<Page />` のようなJSX要素。

* **オプション** `options`: サーバーレンダリング用のオブジェクト。
  * **オプション** `identifierPrefix`: [`useId`](/reference/react/useId) によって生成されるIDのためにReactが使用する文字列プレフィックス。同じページで複数のルートを使用する際の競合を避けるのに役立ちます。

#### 戻り値 {/*returns*/}

HTML文字列を出力する [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams)。生成されたHTMLはクライアントでハイドレートできません。

#### 注意点 {/*caveats*/}

* `renderToStaticNodeStream` の出力はハイドレートできません。

* このメソッドは、すべての [Suspense boundaries](/reference/react/Suspense) が完了するまで出力を返しません。

* React 18以降、このメソッドはすべての出力をバッファリングするため、実際にはストリーミングの利点を提供しません。

* 返されるストリームはutf-8でエンコードされたバイトストリームです。別のエンコーディングのストリームが必要な場合は、テキストのトランスコーディング用の変換ストリームを提供する [iconv-lite](https://www.npmjs.com/package/iconv-lite) などのプロジェクトを検討してください。

---

## 使用法 {/*usage*/}

### Reactツリーを静的HTMLとしてNode.js Readable Streamにレンダリングする {/*rendering-a-react-tree-as-static-html-to-a-nodejs-readable-stream*/}

`renderToStaticNodeStream` を呼び出して [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) を取得し、サーバーレスポンスにパイプします：

```js {5-6}
import { renderToStaticNodeStream } from 'react-dom/server';

// ルートハンドラーの構文はバックエンドフレームワークによって異なります
app.use('/', (request, response) => {
  const stream = renderToStaticNodeStream(<Page />);
  stream.pipe(response);
});
```

このストリームは、Reactコンポーネントの初期の非インタラクティブなHTML出力を生成します。

<Pitfall>

このメソッドは **ハイドレートできない非インタラクティブなHTMLをレンダリングします。** これは、Reactを単純な静的ページジェネレーターとして使用したい場合や、メールのような完全に静的なコンテンツをレンダリングする場合に役立ちます。

インタラクティブなアプリは、サーバー上で [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) を使用し、クライアント上で [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を使用する必要があります。

</Pitfall>