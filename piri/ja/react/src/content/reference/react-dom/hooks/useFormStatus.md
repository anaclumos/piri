---
title: useFormStatus
canary: true
---

<Canary>

`useFormStatus`フックは現在、ReactのCanaryおよび実験的なチャンネルでのみ利用可能です。[Reactのリリースチャンネルについてはこちら](/community/versioning-policy#all-release-channels)をご覧ください。

</Canary>

<Intro>

`useFormStatus`は、最後のフォーム送信のステータス情報を提供するフックです。

```js
const { pending, data, method, action } = useFormStatus();
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useFormStatus()` {/*use-form-status*/}

`useFormStatus`フックは、最後のフォーム送信のステータス情報を提供します。

```js {5},[[1, 6, "status.pending"]]
import { useFormStatus } from "react-dom";
import action from './actions';

function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>Submit</button>
}

export default function App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
```

ステータス情報を取得するには、`Submit`コンポーネントが`<form>`内でレンダリングされる必要があります。このフックは、フォームがアクティブに送信されているかどうかを示す<CodeStep step={1}>`pending`</CodeStep>プロパティなどの情報を返します。

上記の例では、`Submit`はこの情報を使用して、フォームが送信中の間に`<button>`の押下を無効にします。

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

`useFormStatus`はパラメータを受け取りません。

#### 戻り値 {/*returns*/}

以下のプロパティを持つ`status`オブジェクト：

* `pending`: ブール値。`true`の場合、親`<form>`が送信待ちであることを意味します。それ以外の場合は`false`。

* `data`: 親`<form>`が送信しているデータを含む[`FormDataインターフェース`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)を実装するオブジェクト。アクティブな送信がない場合や親`<form>`がない場合は`null`。

* `method`: `'get'`または`'post'`のいずれかの文字列値。これは、親`<form>`が`GET`または`POST`の[HTTPメソッド](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)で送信しているかどうかを表します。デフォルトでは、`<form>`は`GET`メソッドを使用し、[`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method)プロパティで指定できます。

[//]: # (Link to `<form>` documentation. "Read more on the `action` prop on `<form>`.")
* `action`: 親`<form>`の`action`プロパティに渡された関数への参照。親`<form>`がない場合、このプロパティは`null`です。`action`プロパティにURI値が提供されている場合、または`action`プロパティが指定されていない場合、`status.action`は`null`になります。

#### 注意点 {/*caveats*/}

* `useFormStatus`フックは、`<form>`内でレンダリングされるコンポーネントから呼び出される必要があります。
* `useFormStatus`は親`<form>`のステータス情報のみを返します。同じコンポーネントや子コンポーネントにレンダリングされた`<form>`のステータス情報は返しません。

---

## 使用法 {/*usage*/}

### フォーム送信中の保留状態を表示する {/*display-a-pending-state-during-form-submission*/}
フォームが送信中の間に保留状態を表示するには、`<form>`内でレンダリングされるコンポーネントで`useFormStatus`フックを呼び出し、返される`pending`プロパティを読み取ります。

ここでは、`pending`プロパティを使用してフォームが送信中であることを示します。

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

function Form({ action }) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
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

<Pitfall>

##### `useFormStatus`は同じコンポーネントにレンダリングされた`<form>`のステータス情報を返しません。 {/*useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component*/}

`useFormStatus`フックは、親`<form>`のステータス情報のみを返し、フックを呼び出している同じコンポーネントや子コンポーネントにレンダリングされた`<form>`のステータス情報は返しません。

```js
function Form() {
  // 🚩 `pending`は決してtrueになりません
  // useFormStatusはこのコンポーネントにレンダリングされたフォームを追跡しません
  const { pending } = useFormStatus();
  return <form action={submit}></form>;
}
```

代わりに、`<form>`内に位置するコンポーネント内から`useFormStatus`を呼び出します。

```js
function Submit() {
  // ✅ `pending`はSubmitコンポーネントをラップするフォームから派生します
  const { pending } = useFormStatus(); 
  return <button disabled={pending}>...</button>;
}

function Form() {
  // これはuseFormStatusが追跡する<form>です
  return (
    <form action={submit}>
      <Submit />
    </form>
  );
}
```

</Pitfall>

### 送信されているフォームデータを読み取る {/*read-form-data-being-submitted*/}

`useFormStatus`から返されるステータス情報の`data`プロパティを使用して、ユーザーが送信しているデータを表示できます。

ここでは、ユーザーがユーザー名をリクエストできるフォームがあります。`useFormStatus`を使用して、リクエストされたユーザー名を確認する一時的なステータスメッセージを表示します。

<Sandpack>

```js src/UsernameForm.js active
import {useState, useMemo, useRef} from 'react';
import {useFormStatus} from 'react-dom';

export default function UsernameForm() {
  const {pending, data} = useFormStatus();

  return (
    <div>
      <h3>Request a Username: </h3>
      <input type="text" name="username" disabled={pending}/>
      <button type="submit" disabled={pending}>
        Submit
      </button>
      <br />
      <p>{data ? `Requesting ${data?.get("username")}...`: ''}</p>
    </div>
  );
}
```

```js src/App.js
import UsernameForm from './UsernameForm';
import { submitForm } from "./actions.js";
import {useRef} from 'react';

export default function App() {
  const ref = useRef(null);
  return (
    <form ref={ref} action={async (formData) => {
      await submitForm(formData);
      ref.current.reset();
    }}>
      <UsernameForm />
    </form>
  );
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 2000));
}
```

```css
p {
    height: 14px;
    padding: 0;
    margin: 2px 0 0 0 ;
    font-size: 14px
}

button {
    margin-left: 2px;
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

---

## トラブルシューティング {/*troubleshooting*/}

### `status.pending`が決して`true`にならない {/*pending-is-never-true*/}

`useFormStatus`は親`<form>`のステータス情報のみを返します。

`useFormStatus`を呼び出すコンポーネントが`<form>`内にネストされていない場合、`status.pending`は常に`false`を返します。`useFormStatus`が`<form>`要素の子であるコンポーネントで呼び出されていることを確認してください。

`useFormStatus`は、同じコンポーネントにレンダリングされた`<form>`のステータスを追跡しません。詳細については[注意点](#useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component)を参照してください。