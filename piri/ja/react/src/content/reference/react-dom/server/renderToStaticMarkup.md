---
title: renderToStaticMarkup
---

<Intro>

`renderToStaticMarkup` は、非インタラクティブなReactツリーをHTML文字列にレンダリングします。

```js
const html = renderToStaticMarkup(reactNode, options?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `renderToStaticMarkup(reactNode, options?)` {/*rendertostaticmarkup*/}

サーバー上で、`renderToStaticMarkup` を呼び出してアプリをHTMLにレンダリングします。

```js
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<Page />);
```

これにより、Reactコンポーネントの非インタラクティブなHTML出力が生成されます。

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `reactNode`: HTMLにレンダリングしたいReactノード。例えば、`<Page />` のようなJSXノード。
* **オプション** `options`: サーバーレンダリング用のオブジェクト。
  * **オプション** `identifierPrefix`: Reactが[`useId`](/reference/react/useId)で生成するIDのために使用する文字列プレフィックス。同じページで複数のルートを使用する際の競合を避けるのに役立ちます。

#### 戻り値 {/*returns*/}

HTML文字列。

#### 注意点 {/*caveats*/}

* `renderToStaticMarkup` の出力はハイドレートできません。

* `renderToStaticMarkup` はSuspenseのサポートが限定的です。コンポーネントがサスペンドすると、`renderToStaticMarkup` は即座にフォールバックをHTMLとして送信します。

* `renderToStaticMarkup` はブラウザでも動作しますが、クライアントコードでの使用は推奨されません。ブラウザでコンポーネントをHTMLにレンダリングする必要がある場合は、[DOMノードにレンダリングしてHTMLを取得してください。](/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code)

---

## 使用法 {/*usage*/}

### 非インタラクティブなReactツリーをHTMLとして文字列にレンダリングする {/*rendering-a-non-interactive-react-tree-as-html-to-a-string*/}

`renderToStaticMarkup` を呼び出して、アプリをHTML文字列にレンダリングし、サーバーレスポンスで送信できます：

```js {5-6}
import { renderToStaticMarkup } from 'react-dom/server';

// ルートハンドラーの構文はバックエンドフレームワークによって異なります
app.use('/', (request, response) => {
  const html = renderToStaticMarkup(<Page />);
  response.send(html);
});
```

これにより、Reactコンポーネントの初期の非インタラクティブなHTML出力が生成されます。

<Pitfall>

このメソッドは**ハイドレートできない非インタラクティブなHTMLをレンダリングします。** これは、Reactを単純な静的ページジェネレーターとして使用したい場合や、メールのような完全に静的なコンテンツをレンダリングする場合に便利です。

インタラクティブなアプリは、サーバーで[`renderToString`](/reference/react-dom/server/renderToString)を使用し、クライアントで[`hydrateRoot`](/reference/react-dom/client/hydrateRoot)を使用する必要があります。

</Pitfall>