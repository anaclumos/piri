---
title: イベントとエフェクトの分離
---

<Intro>

イベントハンドラは、同じ操作を再度実行したときにのみ再実行されます。イベントハンドラとは異なり、Effectは読み取った値（例えば、propやstate変数）が前回のレンダリング時と異なる場合に再同期されます。時には、両方の動作を組み合わせたEffectが必要になることもあります。このページでは、その方法を学びます。

</Intro>

<YouWillLearn>

- イベントハンドラとEffectの選び方
- なぜEffectはリアクティブで、イベントハンドラはそうでないのか
- Effectのコードの一部をリアクティブにしない方法
- Effect Eventsとは何か、そしてそれをEffectから抽出する方法
- Effect Eventsを使用して最新のpropsとstateを読み取る方法

</YouWillLearn>

## イベントハンドラとEffectの選び方 {/*choosing-between-event-handlers-and-effects*/}

まず、イベントハンドラとEffectの違いをおさらいしましょう。

チャットルームコンポーネントを実装していると想像してください。要件は次のようになります：

1. コンポーネントは選択されたチャットルームに自動的に接続する必要があります。
1. 「送信」ボタンをクリックすると、メッセージをチャットに送信する必要があります。

これらのコードを既に実装しているとしましょう。しかし、どこに配置すべきか迷っています。イベントハンドラを使用すべきか、Effectを使用すべきか？この質問に答えるたびに、[なぜそのコードが実行される必要があるのか](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)を考慮してください。

### イベントハンドラは特定の操作に応じて実行される {/*event-handlers-run-in-response-to-specific-interactions*/}

ユーザーの視点から見ると、メッセージの送信は特定の「送信」ボタンがクリックされた*ために*発生するべきです。ユーザーは他の時間や理由でメッセージが送信されると非常に不満を感じるでしょう。これが、メッセージの送信がイベントハンドラであるべき理由です。イベントハンドラは特定の操作を処理することができます：

```js {4-6}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}
```

イベントハンドラを使用すると、`sendMessage(message)`がユーザーがボタンを押した場合に*のみ*実行されることが保証されます。

### Effectは同期が必要なときに実行される {/*effects-run-whenever-synchronization-is-needed*/}

コンポーネントをチャットルームに接続し続ける必要があることを思い出してください。そのコードはどこに配置すべきでしょうか？

このコードを実行する*理由*は特定の操作ではありません。ユーザーがチャットルーム画面にどのようにナビゲートしたかは関係ありません。ユーザーがそれを見ていて、操作する可能性がある以上、コンポーネントは選択されたチャットサーバーに接続し続ける必要があります。たとえチャットルームコンポーネントがアプリの初期画面であり、ユーザーが一切の操作を行っていない場合でも、接続する必要があります。これがEffectである理由です：

```js {3-9}
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

このコードを使用すると、ユーザーが特定の操作を行ったかどうかに関係なく、常に現在選択されているチャットサーバーにアクティブな接続があることが保証されます。ユーザーがアプリを開いただけであっても、別のルームを選択した場合でも、他の画面に移動して戻ってきた場合でも、Effectはコンポーネントが現在選択されているルームと*同期し続ける*ことを保証し、[必要に応じて再接続します。](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once)

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
export function sendMessage(message) {
  console.log('🔵 You sent: ' + message);
}

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input, select { margin-right: 20px; }
```

</Sandpack>

## リアクティブな値とリアクティブなロジック {/*reactive-values-and-reactive-logic*/}

直感的には、イベントハンドラは常に「手動」でトリガーされると言えます。例えば、ボタンをクリックすることです。一方、Effectは「自動的」に実行され、同期を保つために必要な頻度で再実行されます。

これを考えるより正確な方法があります。

Props、state、およびコンポーネントの本体内で宣言された変数は<CodeStep step={2}>リアクティブな値</CodeStep>と呼ばれます。この例では、`serverUrl`はリアクティブな値ではありませんが、`roomId`と`message`はリアクティブな値です。これらはレンダリングデータフローに参加します：

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

このようなリアクティブな値は再レンダリングによって変更される可能性があります。例えば、ユーザーが`message`を編集したり、ドロップダウンで別の`roomId`を選択したりすることがあります。イベントハンドラとEffectは変更に対して異なる反応を示します：

- **イベントハンドラ内のロジックは*リアクティブではありません。*** ユーザーが同じ操作（例えばクリック）を再度実行しない限り、再実行されません。イベントハンドラはリアクティブな値を読み取ることができますが、その変更に「反応」しません。
- **Effect内のロジックは*リアクティブです。*** Effectがリアクティブな値を読み取る場合、[それを依存関係として指定する必要があります。](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) その後、再レンダリングによってその値が変更された場合、Reactは新しい値でEffectのロジックを再実行します。

この違いを説明するために、前の例を再訪しましょう。

### イベントハンドラ内のロジックはリアクティブではない {/*logic-inside-event-handlers-is-not-reactive*/}

このコード行を見てください。このロジックはリアクティブであるべきでしょうか？

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

ユーザーの視点から見ると、**`message`の変更はメッセージを送信したいという意味では*ありません。*** それは単にユーザーが入力していることを意味します。言い換えれば、メッセージを送信するロジックはリアクティブであるべきではありません。それは<CodeStep step={2}>リアクティブな値</CodeStep>が変更されたからといって再実行されるべきではありません。だからこそ、それはイベントハンドラに属します：

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

イベントハンドラはリアクティブではないため、`sendMessage(message)`はユーザーが送信ボタンをクリックしたときにのみ実行されます。

### Effect内のロジックはリアクティブである {/*logic-inside-effects-is-reactive*/}

次にこれらの行に戻りましょう：

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

ユーザーの視点から見ると、**`roomId`の変更は異なるルームに接続したいという意味です。** 言い換えれば、ルームに接続するロジックはリアクティブであるべきです。これらのコード行は<CodeStep step={2}>リアクティブな値</CodeStep>に「追従」し、その値が異なる場合に再実行されることを望んでいます。だからこそ、それはEffectに属します：

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

Effectはリアクティブであるため、`createConnection(serverUrl, roomId)`と`connection.connect()`は`roomId`の異なる値ごとに実行されます。Effectはチャット接続を現在選択されているルームに同期させ続けます。

## Effectから非リアクティブなロジックを抽出する {/*extracting-non-reactive-logic-out-of-effects*/}

リアクティブなロジックと非リアクティブなロジックを混ぜたい場合、状況はさらに複雑になります。

例えば、ユーザーがチャットに接続したときに通知を表示したいとします。現在のテーマ（ダークまたはライト）をpropsから読み取り、正しい色で通知を表示します：

```js {1,4-6}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    // ...
```

しかし、`theme`はリアクティブな値です（再レンダリングの結果として変更される可能性があります）、そして[Effectが読み取るすべてのリアクティブな値はその依存関係として宣言されなければなりません。](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) これで、Effectの依存関係として`theme`を指定する必要があります：

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ すべての依存関係が宣言されました
  // ...
```

この例を試してみて、このユーザーエクスペリエンスの問題を見つけてください：

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

`roomId`が変更されると、チャットは期待通りに再接続されます。しかし、`theme`も依存関係であるため、ダークテーマとライトテーマを切り替えるたびにチャットも再接続されます。これは良くありません！

言い換えれば、Effect内にあるにもかかわらず、この行はリアクティブであるべきではありません：

```js
      // ...
      showNotification('Connected!', theme);
      // ...
```

この非リアクティブなロジックを周囲のリアクティブなEffectから分離する方法が必要です。

### Effect Eventの宣言 {/*declaring-an-effect-event*/}

<Wip>

このセクションでは、**まだ安定版のReactでリリースされていない実験的なAPI**について説明します。

</Wip>

[`useEffectEvent`](/reference/react/experimental_useEffectEvent)という特別なフックを使用して、この非リアクティブなロジックをEffectから抽出します：

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('
Connected!', theme);
  });
  // ...
```

ここで、`onConnected`は*Effect Event*と呼ばれます。これはEffectロジックの一部ですが、イベントハンドラに非常に似ています。ロジックの内部はリアクティブではなく、常に最新のpropsやstateの値を「見る」ことができます。

次に、Effectの内部から`onConnected` Effect Eventを呼び出します：

```js {2-4,9,13}
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ すべての依存関係が宣言されました
  // ...
```

これで問題が解決します。`onConnected`をEffectの依存関係リストから*削除*する必要があることに注意してください。**Effect Eventsはリアクティブではなく、依存関係から省略する必要があります。**

新しい動作が期待通りに動作することを確認してください：

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Effect Eventsはイベントハンドラに非常に似ています。主な違いは、イベントハンドラはユーザーの操作に応じて実行されるのに対し、Effect EventsはEffectからトリガーされることです。Effect Eventsは、Effectのリアクティブ性とリアクティブであるべきでないコードの間の「チェーンを切る」ことができます。

### Effect Eventsを使用して最新のpropsとstateを読み取る {/*reading-latest-props-and-state-with-effect-events*/}

<Wip>

このセクションでは、**まだ安定版のReactでリリースされていない実験的なAPI**について説明します。

</Wip>

Effect Eventsは、依存関係リンターを抑制したくなる多くのパターンを修正するのに役立ちます。

例えば、ページ訪問をログに記録するEffectがあるとします：

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

後で、サイトに複数のルートを追加します。今度は`Page`コンポーネントが現在のパスを持つ`url` propを受け取ります。`logVisit`呼び出しの一部として`url`を渡したいのですが、依存関係リンターが文句を言います：

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'url'
  // ...
}
```

コードが何をするべきかを考えてみてください。異なるURLに対して別々の訪問をログに記録したいです。各URLは異なるページを表しているからです。言い換えれば、この`logVisit`呼び出しは`url`に対してリアクティブであるべきです。このため、この場合、依存関係リンターに従い、`url`を依存関係として追加するのが理にかなっています：

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ すべての依存関係が宣言されました
  // ...
}
```

次に、ショッピングカート内のアイテム数を各ページ訪問と一緒に記録したいとします：

```js {2-3,6}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 React Hook useEffect has a missing dependency: 'numberOfItems'
  // ...
}
```

Effect内で`numberOfItems`を使用したため、リンターはそれを依存関係として追加するように求めます。しかし、`logVisit`呼び出しが`numberOfItems`に対してリアクティブであることを望んでいません。ユーザーがショッピングカートに何かを入れ、`numberOfItems`が変更された場合、それはユーザーが再度ページを訪れたことを意味しません。言い換えれば、*ページを訪れる*ことは、ある意味で「イベント」です。それは特定の瞬間に発生します。

コードを2つの部分に分割します：

```js {5-7,10}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ すべての依存関係が宣言されました
  // ...
}
```

ここで、`onVisit`はEffect Eventです。内部のコードはリアクティブではありません。このため、`numberOfItems`（または他のリアクティブな値！）を使用しても、周囲のコードが変更に応じて再実行されることを心配する必要はありません。

一方、Effect自体はリアクティブのままです。Effect内のコードは`url` propを使用しているため、異なる`url`で再レンダリングされるたびにEffectが再実行されます。これにより、`onVisit` Effect Eventが呼び出されます。

結果として、`url`の変更ごとに`logVisit`を呼び出し、常に最新の`numberOfItems`を読み取ります。しかし、`numberOfItems`が単独で変更された場合、コードのいずれも再実行されません。

<Note>

`onVisit()`を引数なしで呼び出し、内部で`url`を読み取ることができるかどうか疑問に思うかもしれません：

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

これは機能しますが、Effect Eventに`url`を明示的に渡す方が良いです。**Effect Eventに`url`を引数として渡すことで、異なる`url`でページを訪れることがユーザーの視点から別の「イベント」であることを示しています。** `visitedUrl`は発生した「イベント」の一部です：

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

Effect Eventが`visitedUrl`を明示的に「要求」しているため、Effectの依存関係から`url`を誤って削除することはできません。`url`を依存関係から削除すると（異なるページ訪問が1つとしてカウントされるように）、リンターが警告します。`onVisit`が`url`に対してリアクティブであることを望んでいるため、内部で`url`を読み取るのではなく、Effectから*渡します。

これは、Effect内に非同期ロジックがある場合に特に重要です：

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // 訪問のログを遅延させる
  }, [url]);
```

ここで、`onVisit`内の`url`は*最新の*`url`（既に変更されている可能性があります）に対応していますが、`visitedUrl`はこのEffect（およびこの`onVisit`呼び出し）を実行する原因となった元の`url`に対応しています。

</Note>

<DeepDive>

#### 依存関係リンターを抑制するのは大丈夫ですか？ {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

既存のコードベースでは、次のようにリンターのルールが抑制されていることがあります：

```js {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 このようにリンターを抑制しないでください：
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

`useEffectEvent`がReactの安定版の一部になった後は、**リンターを抑制しないことをお勧めします。**

ルールを抑制する最初の欠点は、Effectに新しいリアクティブな依存関係を導入したときにReactが警告しなくなることです。前の例では、Reactがリマインドしてくれたため、`url`を依存関係に追加しました。リンターを無効にすると、そのEffectに対する将来の編集に対してそのようなリマインドを受け取ることはなくなります。これによりバグが発生します。

リンターを抑制することによって引き起こされる混乱したバグの例を次に示します。この例では、`handleMove`関数は現在の`canMove` state変数の値を読み取り、ドットがカーソルに従うかどうかを決定する必要があります。しかし、`canMove`は常に`true`です。

なぜでしょうか？

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

このコードの問題は、依存関係リンターを抑制していることです。抑制を削除すると、このEffectのコードが`handleMove`関数に依存していることがわかります。これは理にかなっています：`handleMove`はコンポーネント本体内で宣言されているため、リアクティブな値です。すべてのリアクティブな値は依存関係として指定する必要があります。さもなければ、時間が経つにつれて古くなる可能性があります！

元のコードの著者は、このEffectがリアクティブな値に依存していない（`[]`）とReactに「嘘」をついています。これが、`canMove`が変更された後（およびそれに伴って`handleMove`も変更された後）にReactがEffectを再同期しなかった理由です。ReactがEffectを再同期しなかったため、リスナーとしてアタッチされた`handleMove`は初期レンダリング時に作成された`handleMove`関数です。初期レンダリング時には`canMove`は`true`でした。これが、初期レンダリングの`handleMove`がその値を永遠に見る理由です。

**リンターを抑制しない限り、古い値の問題に遭遇することはありません。**

`useEffectEvent`を使用すると、リンターに「嘘」をつく必要がなくなり、コードは期待通りに動作します：

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,

      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

これは、`useEffectEvent`が*常に*正しい解決策であるという意味ではありません。リアクティブであるべきでない行にのみ適用する必要があります。上記のサンドボックスでは、`canMove`に関してEffectのコードがリアクティブであることを望んでいませんでした。だからこそ、Effect Eventを抽出することが理にかなっていました。

依存関係リンターを抑制する他の正しい代替案については、[Effectの依存関係を削除する](/learn/removing-effect-dependencies)を参照してください。

</DeepDive>

### Effect Eventsの制限 {/*limitations-of-effect-events*/}

<Wip>

このセクションでは、**まだ安定版のReactでリリースされていない実験的なAPI**について説明します。

</Wip>

Effect Eventsの使用には非常に制限があります：

* **Effectの内部からのみ呼び出してください。**
* **他のコンポーネントやフックに渡さないでください。**

例えば、次のようにEffect Eventを宣言して渡さないでください：

```js {4-6,8}
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 避ける：Effect Eventsの渡し

  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // "callback"を依存関係に指定する必要があります
}
```

代わりに、Effect Eventsをそれを使用するEffectのすぐ隣に常に宣言してください：

```js {10-12,16,21}
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ 良い：Effectの内部でのみローカルに呼び出される
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // "onTick"（Effect Event）を依存関係として指定する必要はありません
}
```

Effect EventsはEffectコードの非リアクティブな「部分」です。それらを使用するEffectの隣に配置する必要があります。

<Recap>

- イベントハンドラは特定の操作に応じて実行されます。
- Effectは同期が必要なときに実行されます。
- イベントハンドラ内のロジックはリアクティブではありません。
- Effect内のロジックはリアクティブです。
- Effectから非リアクティブなロジックをEffect Eventsに移動できます。
- Effectの内部からのみEffect Eventsを呼び出してください。
- Effect Eventsを他のコンポーネントやフックに渡さないでください。

</Recap>

<Challenges>

#### 更新されない変数を修正する {/*fix-a-variable-that-doesnt-update*/}

この`Timer`コンポーネントは、毎秒増加する`count` state変数を保持しています。増加する値は`increment` state変数に格納されており、プラスとマイナスのボタンで制御できます。

しかし、プラスボタンを何度押しても、カウンターは毎秒1ずつ増加し続けます。このコードには何が問題なのでしょうか？なぜEffectのコード内で`increment`が常に1なのでしょうか？間違いを見つけて修正してください。

<Hint>

このコードを修正するには、ルールに従うだけで十分です。

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

通常通り、Effect内のバグを探すときは、まずリンターの抑制を探します。

抑制コメントを削除すると、ReactはこのEffectのコードが`increment`に依存していることを教えてくれます。Reactに依存関係がない（`[]`）と「嘘」をついているためです。`increment`を依存関係配列に追加します：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

これで、`increment`が変更されると、ReactはEffectを再同期し、インターバルを再起動します。

</Solution>

#### フリーズするカウンターを修正する {/*fix-a-freezing-counter*/}

この`Timer`コンポーネントは、毎秒増加する`count` state変数を保持しています。増加する値は`increment` state変数に格納されており、プラスとマイナスのボタンで制御できます。例えば、プラスボタンを9回押すと、カウンターは毎秒10ずつ増加するようになります。

このユーザーインターフェースには小さな問題があります。プラスまたはマイナスボタンを1秒ごとに押すと、タイマー自体が一時停止するように見えることがあります。ボタンを押してから1秒が経過するまでタイマーが再開しません。この問題の原因を見つけ、タイマーが*毎秒*中断なく動作するように修正してください。

<Hint>

Effectのコードが`increment` state変数を使用しているようです。`increment`の現在の値を使用して`setCount`を呼び出す行は本当にリアクティブである必要がありますか？

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i

=> i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

問題は、Effect内のコードが`increment` state変数を使用していることです。これはEffectの依存関係であるため、`increment`の変更ごとにEffectが再同期され、インターバルがクリアされます。インターバルが発火する前にクリアし続けると、タイマーが停止したように見えます。

問題を解決するには、Effectから`onTick` Effect Eventを抽出します：

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

`onTick`はEffect Eventであるため、その内部のコードはリアクティブではありません。`increment`の変更はEffectをトリガーしません。

</Solution>

#### 調整できない遅延を修正する {/*fix-a-non-adjustable-delay*/}

この例では、インターバルの遅延をカスタマイズできます。遅延は`delay` state変数に格納されており、2つのボタンで更新できます。しかし、「プラス100ミリ秒」ボタンを押して`delay`が1000ミリ秒（つまり1秒）になるまで押しても、タイマーは非常に速く（100ミリ秒ごとに）増加し続けます。遅延の変更が無視されているようです。バグを見つけて修正してください。

<Hint>

Effect Events内のコードはリアクティブではありません。`setInterval`呼び出しを再実行したい場合がありますか？

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  const onMount = useEffectEvent(() => {
    return setInterval(() => {
      onTick();
    }, delay);
  });

  useEffect(() => {
    const id = onMount();
    return () => {
      clearInterval(id);
    }
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

上記の例の問題は、`onMount`というEffect Eventを抽出したことです。コードが実際に何をすべきかを考慮せずに抽出しました。Effect Eventsは特定の理由でのみ抽出する必要があります：コードの一部を非リアクティブにしたい場合です。しかし、`setInterval`呼び出しは`delay` state変数に対してリアクティブであるべきです。`delay`が変更された場合、インターバルを最初から設定したいです！このコードを修正するには、すべてのリアクティブなコードをEffect内に戻します：

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => {
      clearInterval(id);
    }
  }, [delay]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

一般的に、コードの*タイミング*ではなく*目的*に焦点を当てた関数（例えば`onMount`）には疑いを持つべきです。最初は「より記述的」に感じるかもしれませんが、意図を曖昧にします。Effect Eventsは*ユーザーの視点から見た*何かに対応するべきです。例えば、`onMessage`、`onTick`、`onVisit`、または`onConnected`は良いEffect Eventの名前です。これらの内部のコードはおそらくリアクティブである必要はありません。一方、`onMount`、`onUpdate`、`onUnmount`、または`onAfterRender`のような名前は非常に一般的であり、リアクティブであるべきコードを誤って含める可能性があります。これが、Effect Eventsを*ユーザーが何が起こったと思うか*に基づいて命名するべき理由です。

</Solution>

#### 遅延通知を修正する {/*fix-a-delayed-notification*/}

チャットルームに参加すると、このコンポーネントは通知を表示します。しかし、通知はすぐには表示されません。代わりに、ユーザーがUIを見回す時間を確保するために、通知は2秒遅延されます。

これはほぼ機能しますが、バグがあります。「general」から「travel」、そして「music」に非常に速く切り替えてみてください。十分に速く行うと、2つの通知が表示されます（予想通り！）が、どちらも「Welcome to music」と表示されます。

「general」から「travel」、そして「music」に非常に速く切り替えると、最初の通知が「Welcome to travel」、2番目の通知が「Welcome to music」と表示されるように修正してください。（追加のチャレンジとして、通知が正しいルームを表示するように*既に*修正したと仮定して、後者の通知のみが表示されるようにコードを変更してください。）

<Hint>

Effectはどのルームに接続したかを知っています。Effect Eventに渡したい情報はありますか？

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Welcome to ' + roomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected();
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution>

Effect Eventの内部では、`roomId`はEffect Eventが呼び出された時点の値です。

Effect Eventは2秒の遅延で呼び出されます。`travel`ルームから`music`ルームに素早く切り替えると、`travel`ルームの通知が表示される時点で`roomId`は既に`"music"`になっています。これが、両方の通知が「Welcome to music」と表示される理由です。

問題を修正するには、Effect Eventの内部で*最新の*`roomId`を読み取る代わりに、`connectedRoomId`のようにEffect Eventのパラメータにします。そして、Effectから`onConnected(roomId)`を呼び出して`roomId`を渡します：

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

`roomId`が`"travel"`に設定されたEffect（つまり、`"travel"`ルームに接続したEffect）は`"travel"`の通知を表示します。`roomId`が`"music"`に設定されたEffect（つまり、`"music"`ルームに接続したEffect）は`"music"`の通知を表示します。言い換えれば、`connectedRoomId`はリアクティブなEffectから来ており、`theme`は常に最新の値を使用します。

追加のチャレンジを解決するために、通知のタイムアウトIDを保存し、Effectのクリーンアップ関数でクリアします：

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    let notificationTimeoutId;
    connection.on('connected', () => {
      notificationTimeoutId = setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => {
      connection.disconnect();
      if (notificationTimeoutId !== undefined) {
        clearTimeout(notificationTimeoutId);
      }
    };
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

これにより、ルームを変更したときに既にスケジュールされている（まだ表示されていない）通知がキャンセルされます。

</Solution>

</Challenges>