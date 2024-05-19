---
title: useId
---

<Intro>

`useId`は、アクセシビリティ属性に渡すための一意のIDを生成するためのReact Hookです。

```js
const id = useId()
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useId()` {/*useid*/}

一意のIDを生成するために、コンポーネントのトップレベルで`useId`を呼び出します：

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

`useId`はパラメータを取りません。

#### 戻り値 {/*returns*/}

`useId`は、この特定のコンポーネント内のこの特定の`useId`呼び出しに関連付けられた一意のID文字列を返します。

#### 注意点 {/*caveats*/}

* `useId`はHookなので、**コンポーネントのトップレベル**または独自のHooksでのみ呼び出すことができます。ループや条件の中で呼び出すことはできません。その場合は、新しいコンポーネントを抽出して状態を移動させてください。

* `useId`は**リスト内のキーを生成するために使用すべきではありません**。[キーはデータから生成する必要があります。](/learn/rendering-lists#where-to-get-your-key)

---

## 使用法 {/*usage*/}

<Pitfall>

**リスト内のキーを生成するために`useId`を呼び出さないでください。** [キーはデータから生成する必要があります。](/learn/rendering-lists#where-to-get-your-key)

</Pitfall>

### アクセシビリティ属性のための一意のIDを生成する {/*generating-unique-ids-for-accessibility-attributes*/}

一意のIDを生成するために、コンポーネントのトップレベルで`useId`を呼び出します：

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

次に、<CodeStep step={1}>生成されたID</CodeStep>を異なる属性に渡すことができます：

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**これが役立つ場面を例を通して見てみましょう。**

[HTMLアクセシビリティ属性](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)のような[`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby)は、2つのタグが関連していることを指定することができます。例えば、ある要素（入力など）が別の要素（段落など）によって説明されていることを指定できます。

通常のHTMLでは、次のように書きます：

```html {5,8}
<label>
  Password:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  The password should contain at least 18 characters
</p>
```

しかし、ReactではこのようにIDをハードコーディングするのは良いプラクティスではありません。コンポーネントはページ上で複数回レンダリングされる可能性がありますが、IDは一意でなければなりません！IDをハードコーディングする代わりに、`useId`で一意のIDを生成します：

```js {4,11,14}
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}
```

これで、`PasswordField`が画面上に複数回表示されても、生成されたIDは衝突しません。

<Sandpack>

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
      <h2>Confirm password</h2>
      <PasswordField />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

[このビデオを見て、支援技術を使用したユーザーエクスペリエンスの違いを確認してください。](https://www.youtube.com/watch?v=0dNzNcuEuOo)

<Pitfall>

[サーバーレンダリング](/reference/react-dom/server)では、**`useId`はサーバーとクライアントで同一のコンポーネントツリーを必要とします**。サーバーとクライアントでレンダリングされるツリーが完全に一致しない場合、生成されたIDは一致しません。

</Pitfall>

<DeepDive>

#### なぜuseIdはインクリメントカウンターよりも優れているのか？ {/*why-is-useid-better-than-an-incrementing-counter*/}

`useId`がグローバル変数のインクリメント（`nextId++`）よりも優れている理由を疑問に思うかもしれません。

`useId`の主な利点は、Reactが[サーバーレンダリング](/reference/react-dom/server)と連携することを保証することです。サーバーレンダリング中に、コンポーネントはHTML出力を生成します。後でクライアント側で、[ハイドレーション](/reference/react-dom/client/hydrateRoot)が生成されたHTMLにイベントハンドラをアタッチします。ハイドレーションが機能するためには、クライアントの出力がサーバーのHTMLと一致する必要があります。

インクリメントカウンターでは、クライアントコンポーネントがハイドレートされる順序がサーバーHTMLが出力された順序と一致しない可能性があるため、これを保証するのは非常に困難です。`useId`を呼び出すことで、ハイドレーションが機能し、サーバーとクライアントの出力が一致することを保証します。

React内部では、`useId`は呼び出し元コンポーネントの「親パス」から生成されます。これが、クライアントとサーバーツリーが同じであれば、レンダリング順序に関係なく「親パス」が一致する理由です。

</DeepDive>

---

### 複数の関連要素のためのIDを生成する {/*generating-ids-for-several-related-elements*/}

複数の関連要素にIDを付ける必要がある場合、`useId`を呼び出して共有プレフィックスを生成できます：

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>First Name:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Last Name:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

これにより、一意のIDが必要なすべての要素に対して`useId`を呼び出す必要がなくなります。

---

### 生成されたすべてのIDに共通のプレフィックスを指定する {/*specifying-a-shared-prefix-for-all-generated-ids*/}

1つのページに複数の独立したReactアプリケーションをレンダリングする場合、[`createRoot`](/reference/react-dom/client/createRoot#parameters)または[`hydrateRoot`](/reference/react-dom/client/hydrateRoot)呼び出しにオプションとして`identifierPrefix`を渡します。これにより、2つの異なるアプリによって生成されたIDが衝突することはありません。`useId`で生成されたすべての識別子は、指定した異なるプレフィックスで始まります。

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <div id="root1"></div>
    <div id="root2"></div>
  </body>
</html>
```

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  console.log('Generated identifier:', passwordHintId)
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
    </>
  );
}
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```

```css
#root1 {
  border: 5px solid blue;
  padding: 10px;
  margin: 5px;
}

#root2 {
  border: 5px solid green;
  padding: 10px;
  margin: 5px;
}

input { margin: 5px; }
```

</Sandpack>

---

### クライアントとサーバーで同じIDプレフィックスを使用する {/*using-the-same-id-prefix-on-the-client-and-the-server*/}

[同じページに複数の独立したReactアプリをレンダリングする場合](#specifying-a-shared-prefix-for-all-generated-ids)、これらのアプリの一部がサーバーレンダリングされている場合、クライアント側の[`hydrateRoot`](/reference/react-dom/client/hydrateRoot)呼び出しに渡す`identifierPrefix`が、[サーバーAPI](/reference/react-dom/server)に渡す`identifierPrefix`と同じであることを確認してください。例えば、[`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)などです。

```js
// サーバー
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(
  <App />,
  { identifierPrefix: 'react-app1' }
);
```

```js
// クライアント
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(
  domNode,
  reactNode,
  { identifierPrefix: 'react-app1' }
);
```

1つのページに1つのReactアプリしかない場合、`identifierPrefix`を渡す必要はありません。