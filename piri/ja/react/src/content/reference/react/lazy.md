---
title: lazy
---

<Intro>

`lazy`を使用すると、コンポーネントのコードを初めてレンダリングされるまで遅延させることができます。

```js
const SomeComponent = lazy(load)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `lazy(load)` {/*lazy*/}

`lazy`をコンポーネントの外で呼び出して、遅延読み込みされるReactコンポーネントを宣言します：

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `load`: [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)または他の*thenable*（`then`メソッドを持つPromiseのようなオブジェクト）を返す関数。Reactは返されたコンポーネントを初めてレンダリングしようとするまで`load`を呼び出しません。Reactが最初に`load`を呼び出した後、それが解決するのを待ち、解決された値の`.default`をReactコンポーネントとしてレンダリングします。返されたPromiseとPromiseの解決された値はキャッシュされるため、Reactは`load`を一度しか呼び出しません。Promiseが拒否された場合、Reactは最も近いエラーバウンダリが処理するために拒否理由を`throw`します。

#### 戻り値 {/*returns*/}

`lazy`はツリー内でレンダリングできるReactコンポーネントを返します。遅延コンポーネントのコードがまだ読み込まれている間、それをレンダリングしようとすると*サスペンド*します。読み込み中にローディングインジケーターを表示するには、[`<Suspense>`](/reference/react/Suspense)を使用します。

---

### `load`関数 {/*load*/}

#### パラメータ {/*load-parameters*/}

`load`はパラメータを受け取りません。

#### 戻り値 {/*load-returns*/}

[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)または他の*thenable*（`then`メソッドを持つPromiseのようなオブジェクト）を返す必要があります。最終的に`.default`プロパティが有効なReactコンポーネントタイプ（関数、[`memo`](/reference/react/memo)、または[`forwardRef`](/reference/react/forwardRef)コンポーネントなど）であるオブジェクトに解決される必要があります。

---

## 使用法 {/*usage*/}

### Suspenseを使用したコンポーネントの遅延読み込み {/*suspense-for-code-splitting*/}

通常、コンポーネントは静的な[`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)宣言でインポートします：

```js
import MarkdownPreview from './MarkdownPreview.js';
```

このコンポーネントのコードの読み込みを初めてレンダリングされるまで遅延させるには、このインポートを次のように置き換えます：

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

このコードは[動的`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)に依存しており、バンドラーやフレームワークのサポートが必要な場合があります。このパターンを使用するには、インポートする遅延コンポーネントが`default`エクスポートとしてエクスポートされている必要があります。

コンポーネントのコードがオンデマンドで読み込まれるようになったので、読み込み中に表示する内容も指定する必要があります。これを行うには、遅延コンポーネントまたはその親のいずれかを[`<Suspense>`](/reference/react/Suspense)バウンダリでラップします：

```js {1,4}
<Suspense fallback={<Loading />}>
  <h2>プレビュー</h2>
  <MarkdownPreview />
 </Suspense>
```

この例では、`MarkdownPreview`のコードはレンダリングしようとするまで読み込まれません。`MarkdownPreview`がまだ読み込まれていない場合、その代わりに`Loading`が表示されます。チェックボックスをオンにしてみてください：

<Sandpack>

```js src/App.js
import { useState, Suspense, lazy } from 'react';
import Loading from './Loading.js';

const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')));

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Hello, **world**!');
  return (
    <>
      <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} />
      <label>
        <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
        プレビューを表示
      </label>
      <hr />
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>プレビュー</h2>
          <MarkdownPreview markdown={markdown} />
        </Suspense>
      )}
    </>
  );
}

// デモのために固定遅延を追加
function delayForDemo(promise) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
```

```js src/Loading.js
export default function Loading() {
  return <p><i>読み込み中...</i></p>;
}
```

```js src/MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(markdown)}}
    />
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label {
  display: block;
}

input, textarea {
  margin-bottom: 10px;
}

body {
  min-height: 200px;
}
```

</Sandpack>

このデモは人工的な遅延で読み込まれます。次回チェックボックスをオフにして再度オンにすると、`Preview`はキャッシュされるため、読み込み状態は表示されません。読み込み状態を再度表示するには、サンドボックスで「リセット」をクリックしてください。

[Suspenseを使用した読み込み状態の管理について詳しく学ぶ。](/reference/react/Suspense)

---

## トラブルシューティング {/*troubleshooting*/}

### `lazy`コンポーネントの状態が予期せずリセットされる {/*my-lazy-components-state-gets-reset-unexpectedly*/}

他のコンポーネント*内*で`lazy`コンポーネントを宣言しないでください：

```js {4-5}
import { lazy } from 'react';

function Editor() {
  // 🔴 悪い例: これにより再レンダリング時にすべての状態がリセットされます
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  // ...
}
```

代わりに、常にモジュールのトップレベルで宣言してください：

```js {3-4}
import { lazy } from 'react';

// ✅ 良い例: コンポーネントの外で遅延コンポーネントを宣言します
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  // ...
}
```