---
title: useActionState
canary: true
---

<Canary>

`useActionState`フックは現在、ReactのCanaryおよび実験的なチャンネルでのみ利用可能です。[リリースチャンネルについてはこちら](/community/versioning-policy#all-release-channels)をご覧ください。さらに、`useActionState`の完全な利点を得るためには、[React Server Components](/reference/rsc/use-client)をサポートするフレームワークを使用する必要があります。

</Canary>

<Note>

以前のReact Canaryバージョンでは、このAPIはReact DOMの一部であり、`useFormState`と呼ばれていました。

</Note>

<Intro>

`useActionState`は、フォームアクションの結果に基づいて状態を更新するためのフックです。

```js
const [state, formAction] = useActionState(fn, initialState, permalink?);
```

</Intro>

<InlineToc />

---

## 参照 {/*reference*/}

### `useActionState(action, initialState, permalink?)` {/*useactionstate*/}

{/* TODO T164397693: link to actions documentation once it exists */}

`useActionState`をコンポーネントのトップレベルで呼び出して、[フォームアクションが呼び出されたとき](/reference/react-dom/components/form)に更新されるコンポーネントの状態を作成します。`useActionState`には既存のフォームアクション関数と初期状態を渡し、新しいアクションと最新のフォーム状態を返します。最新のフォーム状態は、提供した関数にも渡されます。

```js
import { useActionState } from "react";

async function increment(previousState, formData) {
  return previousState + 1;
}

function StatefulForm({}) {
  const [state, formAction] = useActionState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>Increment</button>
    </form>
  )
}
```

フォーム状態は、フォームが最後に送信されたときにアクションによって返された値です。フォームがまだ送信されていない場合、それは渡した初期状態です。

サーバーアクションと一緒に使用すると、`useActionState`はフォームの送信からのサーバーの応答を、ハイドレーションが完了する前に表示することができます。

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `fn`: フォームが送信されたりボタンが押されたりしたときに呼び出される関数。この関数が呼び出されると、フォームの前の状態（最初は渡した`initialState`、その後は前回の戻り値）が最初の引数として渡され、その後に通常のフォームアクションが受け取る引数が続きます。
* `initialState`: 状態を初期化したい値。シリアライズ可能な任意の値を指定できます。この引数はアクションが最初に呼び出された後は無視されます。
* **オプション** `permalink`: このフォームが変更する一意のページURLを含む文字列。動的コンテンツ（例：フィード）を持つページでプログレッシブエンハンスメントと一緒に使用するために：`fn`が[サーバーアクション](/reference/rsc/use-server)であり、JavaScriptバンドルが読み込まれる前にフォームが送信された場合、ブラウザは現在のページのURLではなく、指定されたパーマリンクURLに移動します。Reactが状態を渡す方法を知るために、同じフォームコンポーネント（同じアクション`fn`と`permalink`を含む）が宛先ページにレンダリングされていることを確認してください。フォームがハイドレートされた後、このパラメータは効果を持ちません。

{/* TODO T164397693: link to serializable values docs once it exists */}

#### 戻り値 {/*returns*/}

`useActionState`は、正確に2つの値を持つ配列を返します：

1. 現在の状態。最初のレンダリング時には、渡した`initialState`と一致します。アクションが呼び出された後は、アクションによって返された値と一致します。
2. フォームコンポーネントの`action`プロップや、フォーム内の任意の`button`コンポーネントの`formAction`プロップとして渡すことができる新しいアクション。

#### 注意点 {/*caveats*/}

* React Server Componentsをサポートするフレームワークと一緒に使用すると、`useActionState`はクライアントでJavaScriptが実行される前にフォームをインタラクティブにすることができます。Server Componentsを使用しない場合、それはコンポーネントのローカル状態と同等です。
* `useActionState`に渡される関数は、最初の引数として前のまたは初期の状態を受け取ります。これにより、そのシグネチャは`useActionState`を使用せずに直接フォームアクションとして使用された場合とは異なります。

---

## 使用法 {/*usage*/}

### フォームアクションによって返される情報の使用 {/*using-information-returned-by-a-form-action*/}

`useActionState`をコンポーネントのトップレベルで呼び出して、フォームが最後に送信されたときのアクションの戻り値にアクセスします。

```js [[1, 5, "state"], [2, 5, "formAction"], [3, 5, "action"], [4, 5, "null"], [2, 8, "formAction"]]
import { useActionState } from 'react';
import { action } from './actions.js';

function MyComponent() {
  const [state, formAction] = useActionState(action, null);
  // ...
  return (
    <form action={formAction}>
      {/* ... */}
    </form>
  );
}
```

`useActionState`は、正確に2つのアイテムを持つ配列を返します：

1. フォームの<CodeStep step={1}>現在の状態</CodeStep>。これは最初に提供した<CodeStep step={4}>初期状態</CodeStep>に設定され、フォームが送信された後は提供した<CodeStep step={3}>アクション</CodeStep>の戻り値に設定されます。
2. `<form>`にその`action`プロップとして渡す<CodeStep step={2}>新しいアクション</CodeStep>。

フォームが送信されると、提供した<CodeStep step={3}>アクション</CodeStep>関数が呼び出されます。その戻り値はフォームの新しい<CodeStep step={1}>現在の状態</CodeStep>になります。

提供した<CodeStep step={3}>アクション</CodeStep>は、フォームの<CodeStep step={1}>現在の状態</CodeStep>という新しい最初の引数も受け取ります。フォームが最初に送信されたとき、これは提供した<CodeStep step={4}>初期状態</CodeStep>であり、その後の送信では、アクションが最後に呼び出されたときの戻り値になります。その他の引数は、`useActionState`が使用されていない場合と同じです。

```js [[3, 1, "action"], [1, 1, "currentState"]]
function action(currentState, formData) {
  // ...
  return 'next state';
}
```

<Recipes titleText="フォーム送信後の情報表示" titleId="display-information-after-submitting-a-form">

#### フォームエラーの表示 {/*display-form-errors*/}

サーバーアクションによって返されるエラーメッセージやトーストなどのメッセージを表示するには、アクションを`useActionState`の呼び出しでラップします。

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction] = useActionState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {message}
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return "Added to cart";
  } else {
    return "Couldn't add to cart: the item is sold out.";
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>

<Solution />

#### フォーム送信後の構造化情報の表示 {/*display-structured-information-after-submitting-a-form*/}

サーバーアクションの戻り値は、任意のシリアライズ可能な値にすることができます。例えば、アクションが成功したかどうかを示すブール値、エラーメッセージ、または更新された情報を含むオブジェクトにすることができます。

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [formState, formAction] = useActionState(addToCart, {});
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {formState?.success &&
        <div className="toast">
          Added to cart! Your cart now has {formState.cartSize} items.
        </div>
      }
      {formState?.success === false &&
        <div className="error">
          Failed to add to cart: {formState.message}
        </div>
      }
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return {
      success: true,
      cartSize: 12,
    };
  } else {
    return {
      success: false,
      message: "The item is sold out.",
    };
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>

<Solution />

</Recipes>

## トラブルシューティング {/*troubleshooting*/}

### アクションが送信されたフォームデータを読み取れなくなった {/*my-action-can-no-longer-read-the-submitted-form-data*/}

アクションを`useActionState`でラップすると、それは*最初の引数*として追加の引数を受け取ります。送信されたフォームデータは通常の最初の引数ではなく、*2番目の引数*になります。追加された最初の引数は、フォームの現在の状態です。

```js
function action(currentState, formData) {
  // ...
}
```