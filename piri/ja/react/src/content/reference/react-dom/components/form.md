---
title: <form>
canary: true
---

<Canary>

Reactの`<form>`に対する拡張機能は現在、Reactのcanaryおよび実験的なチャンネルでのみ利用可能です。Reactの安定版リリースでは、`<form>`は[組み込みのブラウザHTMLコンポーネント](https://react.dev/reference/react-dom/components#all-html-components)としてのみ機能します。[Reactのリリースチャンネルについてはこちら](https://react.dev/community/versioning-policy#all-release-channels)をご覧ください。

</Canary>


<Intro>

[組み込みのブラウザ`<form>`コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)を使用すると、情報を送信するためのインタラクティブなコントロールを作成できます。

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<form>` {/*form*/}

情報を送信するためのインタラクティブなコントロールを作成するには、[組み込みのブラウザ`<form>`コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)をレンダリングします。

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

[以下の例を参照してください。](#usage)

#### Props {/*props*/}

`<form>`はすべての[共通要素のprops](/reference/react-dom/components/common#props)をサポートします。

[`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action): URLまたは関数。URLが`action`に渡されると、フォームはHTMLフォームコンポーネントのように動作します。関数が`action`に渡されると、その関数がフォーム送信を処理します。`action`に渡される関数は非同期であり、送信されたフォームの[フォームデータ](https://developer.mozilla.org/en-US/docs/Web/API/FormData)を含む単一の引数で呼び出されます。`action`プロップは、`<button>`、`<input type="submit">`、または`<input type="image">`コンポーネントの`formAction`属性によって上書きされることがあります。

#### 注意点 {/*caveats*/}

* 関数が`action`または`formAction`に渡されると、`method`プロップの値に関係なくHTTPメソッドはPOSTになります。

---

## 使用法 {/*usage*/}

### クライアントでフォーム送信を処理する {/*handle-form-submission-on-the-client*/}

フォームが送信されたときに関数を実行するために、フォームの`action`プロップに関数を渡します。[`formData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)は引数として関数に渡されるため、フォームによって送信されたデータにアクセスできます。これは、URLのみを受け入れる従来の[HTML action](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action)とは異なります。

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
    const query = formData.get("query");
    alert(`You searched for '${query}'`);
  }
  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### サーバーアクションでフォーム送信を処理する {/*handle-form-submission-with-a-server-action*/}

入力と送信ボタンを持つ`<form>`をレンダリングします。フォームが送信されたときに関数を実行するために、フォームの`action`プロップにサーバーアクション（[`'use server'`](/reference/rsc/use-server)でマークされた関数）を渡します。

サーバーアクションを`<form action>`に渡すことで、JavaScriptが有効になっていない場合やコードが読み込まれる前でもフォームを送信できます。これは、接続が遅い、デバイスが遅い、またはJavaScriptが無効になっているユーザーにとって有益であり、URLが`action`プロップに渡された場合のフォームの動作に似ています。

隠しフォームフィールドを使用して、`<form>`のアクションにデータを提供できます。サーバーアクションは、送信されたフォームの隠しフィールドデータを[`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)のインスタンスとして受け取ります。

```jsx
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(formData) {
    'use server'
    const productId = formData.get('productId')
    await updateCart(productId)
  }
  return (
    <form action={addToCart}>
        <input type="hidden" name="productId" value={productId} />
        <button type="submit">Add to Cart</button>
    </form>

  );
}
```

隠しフォームフィールドを使用して`<form>`のアクションにデータを提供する代わりに、<CodeStep step={1}>`bind`</CodeStep>メソッドを呼び出して追加の引数を提供できます。これにより、関数に引数<CodeStep step={2}>`productId`</CodeStep>が新たにバインドされ、関数に引数として渡される<CodeStep step={3}>`formData`</CodeStep>に加えてバインドされます。

```jsx [[1, 8, "bind"], [2,8, "productId"], [2,4, "productId"], [3,4, "formData"]]
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(productId, formData) {
    "use server";
    await updateCart(productId)
  }
  const addProductToCart = addToCart.bind(null, productId);
  return (
    <form action={addProductToCart}>
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

`<form>`が[Server Component](/reference/rsc/use-client)によってレンダリングされ、[Server Action](/reference/rsc/use-server)が`<form>`の`action`プロップに渡されると、フォームは[プログレッシブエンハンスメント](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)されます。

### フォーム送信中の保留状態を表示する {/*display-a-pending-state-during-form-submission*/}
フォームが送信されているときに保留状態を表示するには、`useFormStatus`フックをフォーム内でレンダリングされたコンポーネントで呼び出し、返される`pending`プロパティを読み取ります。

ここでは、`pending`プロパティを使用してフォームが送信中であることを示しています。

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

`useFormStatus`フックの詳細については、[リファレンスドキュメント](/reference/react-dom/hooks/useFormStatus)を参照してください。

### 楽観的にフォームデータを更新する {/*optimistically-updating-form-data*/}
`useOptimistic`フックは、ネットワークリクエストのようなバックグラウンド操作が完了する前にユーザーインターフェースを楽観的に更新する方法を提供します。フォームのコンテキストでは、この技術はアプリをより応答性の高いものにするのに役立ちます。ユーザーがフォームを送信するとき、サーバーの応答を待つ代わりに、インターフェースはすぐに予想される結果で更新されます。

例えば、ユーザーがフォームにメッセージを入力して「送信」ボタンを押すと、`useOptimistic`フックを使用してメッセージがリストに「送信中...」ラベル付きで即座に表示されます。これはメッセージが実際にサーバーに送信される前です。この「楽観的」アプローチは、速度と応答性の印象を与えます。その後、フォームはバックグラウンドでメッセージを実際に送信しようとします。サーバーがメッセージを受信したことを確認すると、「送信中...」ラベルが削除されます。

<Sandpack>


```js src/App.js
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages([...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

[//]: # 'Uncomment the next line, and delete this line after the `useOptimistic` reference documentatino page is published'
[//]: # 'To learn more about the `useOptimistic` Hook see the [reference documentation](/reference/react/hooks/useOptimistic).'

### フォーム送信エラーの処理 {/*handling-form-submission-errors*/}

場合によっては、`<form>`の`action`プロップによって呼び出される関数がエラーをスローすることがあります。これらのエラーを処理するには、`<form>`をエラーバウンダリでラップします。`<form>`の`action`プロップによって呼び出される関数がエラーをスローすると、エラーバウンダリのフォールバックが表示されます。

<Sandpack>

```js src/App.js
import { ErrorBoundary } from "react-error-boundary";

export default function Search() {
  function search() {
    throw new Error("search error");
  }
  return (
    <ErrorBoundary
      fallback={<p>There was an error while submitting the form</p>}
    >
      <form action={search}>
        <input name="query" />
        <button type="submit">Search</button>
      </form>
    </ErrorBoundary>
  );
}

```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### JavaScriptなしでフォーム送信エラーを表示する {/*display-a-form-submission-error-without-javascript*/}

プログレッシブエンハンスメントのためにJavaScriptバンドルが読み込まれる前にフォーム送信エラーメッセージを表示するには、以下が必要です：

1. `<form>`が[Server Component](/reference/rsc/use-client)によってレンダリングされること
1. `<form>`の`action`プロップに渡される関数が[Server Action](/reference/rsc/use-server)であること
1. エラーメッセージを表示するために`useActionState`フックが使用されること

`useActionState`は2つのパラメータを取ります：[Server Action](/reference/rsc/use-server)と初期状態です。`useActionState`は2つの値、状態変数とアクションを返します。`useActionState`によって返されるアクションはフォームの`action`プロップに渡されるべきです。`useActionState`によって返される状態変数はエラーメッセージを表示するために使用できます。[Server Action](/reference/rsc/use-server)によって返される値は状態変数を更新するために使用されます。

<Sandpack>

```js src/App.js
import { useActionState } from "react";
import { signUpNewUser } from "./api";

export default function Page() {
  async function signup(prevState, formData) {
    "use server";
    const email = formData.get("email");
    try {
      await signUpNewUser(email);
      alert(`Added "${email}"`);
    } catch (err) {
      return err.toString();
    }
  }
  const [message, signupAction] = useActionState(signup, null);
  return (
    <>
      <h1>Signup for my newsletter</h1>
      <p>Signup with the same email twice to see an error</p>
      <form action={signupAction} id="signup-form">
        <label htmlFor="email">Email: </label>
        <input name="email" id="email" placeholder="react@example.com" />
        <button>Sign up</button>
        {!!message && <p>{message}</p>}
      </form>
    </>
  );
}
```

```js src/api.js hidden
let emails = [];

export async function signUpNewUser(newEmail) {
  if (emails.includes(newEmail)) {
    throw new Error("This email address has already been added");
  }
  emails.push(newEmail);
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

フォームアクションから状態を更新する方法については、[`useActionState`](/reference/react/useActionState)のドキュメントを参照してください。

### 複数の送信タイプを処理する {/*handling-multiple-submission-types*/}

フォームは、ユーザーが押したボタンに基づいて複数の送信アクションを処理するように設計できます。フォーム内の各ボタンは、`formAction`プロップを設定することで、特定のアクションや動作に関連付けることができます。

ユーザーが特定のボタンをタップすると、フォームが送信され、そのボタンの属性とアクションによって定義された対応するアクションが実行されます。例えば、フォームはデフォルトで記事をレビュー用に送信しますが、`formAction`が設定された別のボタンで記事をドラフトとして保存することができます。

<Sandpack>

```js src/App.js
export default function Search() {
  function publish(formData) {
    const content = formData.get("content");
    const button = formData.get("button");
    alert(`'${content}' was published with the '${button}' button`);
  }

  function save(formData) {
    const content = formData.get("content");
    alert(`Your draft of '${content}' has been saved!`);
  }

  return (
    <form action={publish}>
      <textarea name="content" rows={4} cols={40} />
      <br />
      <button type="submit" name="button" value="submit">Publish</button>
      <button formAction={save}>Save draft</button>
    </form>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>