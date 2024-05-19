---
title: useOptimistic
canary: true
---

<Canary>

`useOptimistic`フックは現在、ReactのCanaryおよび実験的なチャンネルでのみ利用可能です。[Reactのリリースチャンネルについてはこちら](/community/versioning-policy#all-release-channels)をご覧ください。

</Canary>

<Intro>

`useOptimistic`は、UIを楽観的に更新するためのReactフックです。

```js
  const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useOptimistic(state, updateFn)` {/*use*/}

`useOptimistic`は、非同期アクションが進行中の間に異なる状態を表示するためのReactフックです。いくつかの状態を引数として受け取り、ネットワークリクエストなどの非同期アクションの期間中に異なる状態を返します。現在の状態とアクションへの入力を受け取り、アクションが保留中の間に使用される楽観的な状態を返す関数を提供します。

この状態は「楽観的」な状態と呼ばれ、通常はアクションの実行結果を即座にユーザーに提示するために使用されますが、実際にはアクションの完了には時間がかかります。

```js
import { useOptimistic } from 'react';

function AppContainer() {
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // updateFn
    (currentState, optimisticValue) => {
      // merge and return new state
      // with optimistic value
    }
  );
}
```

[以下にさらに多くの例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `state`: 最初に返される値およびアクションが保留中でないときに返される値。
* `updateFn(currentState, optimisticValue)`: 現在の状態と`addOptimistic`に渡された楽観的な値を受け取り、結果として得られる楽観的な状態を返す関数。純粋関数でなければなりません。`updateFn`は2つのパラメータを取ります。`currentState`と`optimisticValue`です。返り値は`currentState`と`optimisticValue`のマージされた値になります。

#### 戻り値 {/*returns*/}

* `optimisticState`: 結果として得られる楽観的な状態。アクションが保留中でない場合は`state`と等しく、保留中の場合は`updateFn`によって返される値と等しい。
* `addOptimistic`: 楽観的な更新があるときに呼び出すディスパッチ関数。任意の型の1つの引数`optimisticValue`を取り、`state`と`optimisticValue`を使って`updateFn`を呼び出します。

---

## 使用法 {/*usage*/}

### フォームの楽観的な更新 {/*optimistically-updating-with-forms*/}

`useOptimistic`フックは、ネットワークリクエストのようなバックグラウンド操作が完了する前にユーザーインターフェースを楽観的に更新する方法を提供します。フォームの文脈では、この技術はアプリをより応答性の高いものにするのに役立ちます。ユーザーがフォームを送信するとき、サーバーの応答を待つ代わりに、インターフェースは期待される結果で即座に更新されます。

例えば、ユーザーがフォームにメッセージを入力して「送信」ボタンを押すと、`useOptimistic`フックはメッセージが実際にサーバーに送信される前に、リストに「送信中...」ラベル付きで即座に表示されるようにします。この「楽観的」アプローチは、速度と応答性の印象を与えます。その後、フォームはバックグラウンドで実際にメッセージを送信しようとします。サーバーがメッセージを受信したことを確認すると、「送信中...」ラベルが削除されます。

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
    setMessages((messages) => [...messages, { text: sentMessage }]);
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