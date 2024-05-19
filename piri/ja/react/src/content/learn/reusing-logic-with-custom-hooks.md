---
title: カスタムフックでロジックを再利用する
---

<Intro>

Reactには、`useState`、`useContext`、`useEffect`などのいくつかの組み込みフックがあります。時には、データを取得するため、ユーザーがオンラインかどうかを追跡するため、またはチャットルームに接続するためなど、より具体的な目的のためのフックが欲しいと思うことがあるでしょう。これらのフックはReactには見つからないかもしれませんが、アプリケーションのニーズに合わせて独自のフックを作成することができます。

</Intro>

<YouWillLearn>

- カスタムフックとは何か、そして独自のフックを書く方法
- コンポーネント間でロジックを再利用する方法
- カスタムフックの名前と構造の付け方
- カスタムフックを抽出するタイミングと理由

</YouWillLearn>

## カスタムフック: コンポーネント間でロジックを共有する {/*custom-hooks-sharing-logic-between-components*/}

ネットワークに大きく依存するアプリを開発していると想像してください（ほとんどのアプリがそうです）。アプリを使用している間にネットワーク接続が偶然切れた場合、ユーザーに警告したいとします。どうすればよいでしょうか？コンポーネントには次の2つのことが必要なようです：

1. ネットワークがオンラインかどうかを追跡する状態の一部。
2. グローバルな[`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event)および[`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event)イベントにサブスクライブし、その状態を更新するエフェクト。

これにより、コンポーネントはネットワークの状態と[同期](/learn/synchronizing-with-effects)されます。次のようなコードから始めるかもしれません：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```

</Sandpack>

ネットワークをオンオフしてみて、この`StatusBar`があなたの操作に応じて更新される様子を確認してください。

今度は、同じロジックを別のコンポーネントでも使用したいと想像してください。ネットワークがオフの間、「保存」ボタンが無効になり、「再接続中...」と表示されるようにしたいとします。

まず、`isOnline`状態とエフェクトを`SaveButton`にコピー＆ペーストすることができます：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

</Sandpack>

ネットワークをオフにすると、ボタンの外観が変わることを確認してください。

これらの2つのコンポーネントは正常に動作しますが、ロジックの重複は残念です。異なる*視覚的外観*を持っているにもかかわらず、ロジックを再利用したいようです。

### コンポーネントから独自のカスタムフックを抽出する {/*extracting-your-own-custom-hook-from-a-component*/}

[`useState`](/reference/react/useState)や[`useEffect`](/reference/react/useEffect)のように、組み込みの`useOnlineStatus`フックがあると想像してみてください。そうすれば、これらのコンポーネントの両方を簡略化し、重複を取り除くことができます：

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

組み込みのフックはありませんが、自分で書くことができます。`useOnlineStatus`という関数を宣言し、先ほど書いたコンポーネントからすべての重複コードを移動します：

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

関数の最後に`isOnline`を返します。これにより、コンポーネントがその値を読み取ることができます：

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

ネットワークのオンオフを切り替えると、両方のコンポーネントが更新されることを確認してください。

これで、コンポーネントにはそれほど多くの重複ロジックがなくなりました。**さらに重要なのは、コンポーネント内のコードが*何をしたいか*（オンラインステータスを使用する！）を記述しているのに対し、*どうやってそれをするか*（ブラウザのイベントにサブスクライブする）を記述していないことです。**

ロジックをカスタムフックに抽出すると、外部システムやブラウザAPIを扱う際の詳細を隠すことができます。コンポーネントのコードは意図を表現し、実装を表現しません。

### フックの名前は常に`use`で始まる {/*hook-names-always-start-with-use*/}

Reactアプリケーションはコンポーネントから構築されます。コンポーネントは、組み込みまたはカスタムのフックから構築されます。他の人が作成したカスタムフックを頻繁に使用することが多いですが、時折自分で作成することもあるでしょう！

これらの命名規則に従う必要があります：

1. **Reactコンポーネントの名前は大文字で始める必要があります。** 例えば、`StatusBar`や`SaveButton`のように。Reactコンポーネントは、Reactが表示方法を知っている何か（JSXの一部など）を返す必要があります。
2. **フックの名前は`use`で始まり、その後に大文字が続く必要があります。** 例えば、[`useState`](/reference/react/useState)（組み込み）や`useOnlineStatus`（カスタム、ページの前半にあるように）。フックは任意の値を返すことができます。

この規則により、コンポーネントを見たときに、その状態、エフェクト、および他のReact機能がどこに「隠れている」かを常に知ることが保証されます。例えば、コンポーネント内で`getColor()`関数呼び出しを見た場合、その名前が`use`で始まらないため、Reactの状態を含むことはできないと確信できます。しかし、`useOnlineStatus()`のような関数呼び出しは、内部に他のフックの呼び出しを含む可能性が高いです！

<Note>

リンターが[React用に設定されている場合、](/learn/editor-setup#linting)この命名規則を強制します。上のサンドボックスにスクロールして、`useOnlineStatus`を`getOnlineStatus`に名前を変更してみてください。リンターが`useState`や`useEffect`を内部で呼び出すことを許可しなくなることに気づくでしょう。フックとコンポーネントだけが他のフックを呼び出すことができます！

</Note>

<DeepDive>

#### レンダリング中に呼び出されるすべての関数は`use`プレフィックスで始めるべきですか？ {/*should-all-functions-called-during-rendering-start-with-the-use-prefix*/}

いいえ。フックを*呼び出さない*関数は、*フックである必要はありません。*

関数がフックを呼び出さない場合は、`use`プレフィックスを避けてください。代わりに、`use`プレフィックスなしで通常の関数として書いてください。例えば、以下の`useSorted`はフックを呼び出さないので、代わりに`getSorted`と呼びます：

```js
// 🔴 避けるべき: フックを使用しないフック
function useSorted(items) {
  return items.slice().sort();
}

// ✅ 良い: フックを使用しない通常の関数
function getSorted(items) {
  return items.slice().sort();
}
```

これにより、条件を含む任意の場所でこの通常の関数を呼び出すことができます：

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ フックではないため、条件付きでgetSorted()を呼び出すことができます
    displayedItems = getSorted(items);
  }
  // ...
}
```

関数に少なくとも1つのフックを使用する場合は、`use`プレフィックスを付けて（したがってフックにして）ください：

```js
// ✅ 良い: 他のフックを使用するフック
function useAuth() {
  return useContext(Auth);
}
```

技術的には、これはReactによって強制されていません。原則として、他のフックを呼び出さないフックを作成することができます。これはしばしば混乱を招き、制限的なので、そのパターンを避けるのが最善です。しかし、まれに役立つ場合もあります。例えば、現在はフックを使用していないが、将来的にフックの呼び出しを追加する予定がある場合です。その場合、`use`プレフィックスで名前を付けるのが理にかなっています：

```js {3-4}
// ✅ 良い: 後で他のフックを使用する可能性が高いフック
function useAuth() {
  // 認証が実装されたときにこの行に置き換えます：
  // return useContext(Auth);
  return TEST_USER;
}
```

これにより、コンポーネントは条件付きでそれを呼び出すことができなくなります。これは、実際にフックの呼び出しを内部に追加するときに重要になります。内部でフックを使用する予定がない場合（今後も）、フックにしないでください。

</DeepDive>

### カスタムフックは状態そのものではなく、状態を持つロジックを共有する {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

前の例では、ネットワークをオンオフすると、両方のコンポーネントが一緒に更新されました。しかし、単一の`isOnline`状態変数がそれらの間で共有されていると考えるのは間違いです。このコードを見てください：

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

これは、重複を抽出する前と同じように機能します：

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

これらは完全に独立した状態変数とエフェクトです！同じ外部値（ネットワークがオンかどうか）で同期したため、同じ値を同時に持っているだけです。

これをよりよく説明するために、別の例が必要です。この`Form`コンポーネントを考えてみてください：

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Good morning, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

各フォームフィールドに対していくつかの重複したロジックがあります：

1. 状態の一部（`firstName`と`lastName`）。
1. 変更ハンドラー（`handleFirstNameChange`と`handleLastNameChange`）。
1. その入力の`value`と`onChange`属性を指定するJSXの一部。

この重複したロジックを`useFormInput`カスタムフックに抽出できます：

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        First name:
        <input {...firstNameProps} />
      </label>
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js src/useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

注意すべきは、*1つの*状態変数`value`のみを宣言していることです。

しかし、`Form`コンポーネントは`use
FormInput`を*2回*呼び出しています：

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

これが、2つの独立した状態変数を宣言するのと同じように機能する理由です！

**カスタムフックは*状態そのもの*ではなく、*状態を持つロジック*を共有します。フックへの各呼び出しは、同じフックへの他の呼び出しから完全に独立しています。** これが、上記の2つのサンドボックスが完全に同等である理由です。カスタムフックを抽出する前後の動作は同じです。

複数のコンポーネント間で状態そのものを共有する必要がある場合は、[状態を持ち上げて渡す](/learn/sharing-state-between-components)代わりに行います。

## フック間でリアクティブな値を渡す {/*passing-reactive-values-between-hooks*/}

カスタムフック内のコードは、コンポーネントの再レンダリングごとに再実行されます。これは、コンポーネントと同様に、カスタムフックも[純粋である必要がある](/learn/keeping-components-pure)ことを意味します。カスタムフックのコードをコンポーネントの本体の一部と考えてください！

カスタムフックはコンポーネントと一緒に再レンダリングされるため、常に最新のプロップスと状態を受け取ります。これが何を意味するかを見るために、このチャットルームの例を考えてみましょう。サーバーURLやチャットルームを変更してみてください：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 実際の実装ではサーバーに接続します
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

`serverUrl`や`roomId`を変更すると、エフェクトが[変更に「反応」し](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)、再同期します。コンソールメッセージから、エフェクトの依存関係が変更されるたびにチャットが再接続されることがわかります。

次に、エフェクトのコードをカスタムフックに移動します：

```js {2-13}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

これにより、`ChatRoom`コンポーネントは内部の動作を気にせずにカスタムフックを呼び出すことができます：

```js {4-7}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

これで見た目がずっとシンプルになりました！（でも同じことをしています。）

ロジックが*依然として*プロップスや状態の変更に反応することに注意してください。サーバーURLや選択されたルームを編集してみてください：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 実際の実装ではサーバーに接続します
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

他のフックの戻り値を取得していることに注意してください：

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

そして、それを別のフックへの入力として渡しています：

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

`ChatRoom`コンポーネントが再レンダリングされるたびに、最新の`roomId`と`serverUrl`をフックに渡します。これが、再レンダリング後に値が異なる場合にエフェクトがチャットに再接続する理由です。（オーディオやビデオ処理ソフトウェアを使用したことがある場合、フックをチェーンすることは、視覚効果やオーディオエフェクトをチェーンすることを思い出させるかもしれません。`useState`の出力が`useChatRoom`の入力に「供給される」ようなものです。）

### カスタムフックにイベントハンドラーを渡す {/*passing-event-handlers-to-custom-hooks*/}

<Wip>

このセクションでは、**まだ安定版のReactでリリースされていない**実験的なAPIについて説明します。

</Wip>

`useChatRoom`を他のコンポーネントで使用し始めると、その動作をカスタマイズしたくなるかもしれません。例えば、現在、メッセージが到着したときのロジックはフック内にハードコードされています：

```js {9-11}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

このロジックをコンポーネントに戻したいとします：

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });
  // ...
```

これを実現するために、カスタムフックを`onReceiveMessage`を名前付きオプションの1つとして受け取るように変更します：

```js {1,10,13}
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ すべての依存関係が宣言されています
}
```

これで動作しますが、カスタムフックがイベントハンドラーを受け入れる場合、もう1つの改善点があります。

`onReceiveMessage`に依存することは理想的ではありません。なぜなら、コンポーネントが再レンダリングされるたびにチャットが再接続されるからです。このイベントハンドラーをエフェクトイベントにラップして、依存関係から削除します：

```js {1,4,5,15,18}
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ すべての依存関係が宣言されています
}
```

これで、`ChatRoom`コンポーネントが再レンダリングされるたびにチャットが再接続されることはありません。以下は、カスタムフックにイベントハンドラーを渡す完全な動作デモです：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = use
State('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 実際の実装ではサーバーに接続します
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

`useChatRoom`の動作を知る必要がなくなったことに注目してください。これを他のコンポーネントに追加し、他のオプションを渡すことができ、それは同じように動作します。これがカスタムフックの力です。

## カスタムフックを使用するタイミング {/*when-to-use-custom-hooks*/}

すべての小さな重複コードのためにカスタムフックを抽出する必要はありません。いくつかの重複は問題ありません。例えば、前述のように単一の`useState`呼び出しをラップするために`useFormInput`フックを抽出することはおそらく不要です。

しかし、エフェクトを書くたびに、それをカスタムフックにラップする方が明確かどうかを考慮してください。[エフェクトはあまり頻繁に必要ないはずです。](/learn/you-might-not-need-an-effect) したがって、エフェクトを書いている場合、それはReactの外に「ステップアウト」して、外部システムと同期するか、Reactに組み込みのAPIがない何かを行う必要があることを意味します。カスタムフックにラップすることで、意図とデータの流れを正確に伝えることができます。

例えば、選択された都市のリストを表示する`ShippingForm`コンポーネントを考えてみてください。次のようなコードから始めるかもしれません：

```js {3-16,20-35}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // このエフェクトは国の都市を取得します
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // このエフェクトは選択された都市のエリアを取得します
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]);

  // ...
```

このコードは非常に重複していますが、[これらのエフェクトを互いに分離しておくことが正しいです。](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) それらは異なるものを同期しているので、1つのエフェクトに統合すべきではありません。代わりに、`ShippingForm`コンポーネントの上記の共通ロジックを`useData`フックに抽出して簡略化できます：

```js {2-18}
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

これで、`ShippingForm`コンポーネントの両方のエフェクトを`useData`呼び出しに置き換えることができます：

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

カスタムフックを抽出することで、データの流れが明確になります。`url`を入力し、`data`を出力します。エフェクトを`useData`内に「隠す」ことで、`ShippingForm`コンポーネントで[不要な依存関係](/learn/removing-effect-dependencies)を追加するのを防ぐこともできます。時間が経つにつれて、アプリのエフェクトのほとんどはカスタムフック内にあるでしょう。

<DeepDive>

#### カスタムフックを具体的な高レベルのユースケースに集中させる {/*keep-your-custom-hooks-focused-on-concrete-high-level-use-cases*/}

カスタムフックの名前を選ぶことから始めます。明確な名前を選ぶのに苦労する場合、それはエフェクトがコンポーネントのロジックに密接に結びついており、まだ抽出する準備ができていないことを意味するかもしれません。

理想的には、カスタムフックの名前は、コードを書かない人でもそのカスタムフックが何をするのか、何を受け取り、何を返すのかを推測できるほど明確であるべきです：

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `useChatRoom(options)`

外部システムと同期する場合、カスタムフックの名前はより技術的で、そのシステムに特有の専門用語を使用するかもしれません。それは、そのシステムに精通している人にとって明確であれば良いです：

* ✅ `useMediaQuery(query)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**カスタムフックを具体的な高レベルのユースケースに集中させます。** `useEffect` API自体の代替および便利なラッパーとして機能するカスタム「ライフサイクル」フックの作成と使用を避けます：

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

例えば、この`useMount`フックは、コードが「マウント時にのみ」実行されることを保証しようとします：

```js {4-5,14-15}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 🔴 避けるべき: カスタム「ライフサイクル」フックの使用
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 避けるべき: カスタム「ライフサイクル」フックの作成
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 React Hook useEffectには依存関係 'fn' が欠けています
}
```

**カスタム「ライフサイクル」フックはReactのパラダイムにうまく適合しません。** 例えば、このコード例には間違いがあります（`roomId`や`serverUrl`の変更に「反応」しません）が、リンターはそれについて警告しません。リンターは直接の`useEffect`呼び出しのみをチェックするため、あなたのフックについては知りません。

エフェクトを書いている場合は、まずReact APIを直接使用して始めます：

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ 良い: 目的別に分けられた2つの生のエフェクト

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

次に、異なる高レベルのユースケースのためにカスタムフックを抽出することができます（ただし、必ずしもそうする必要はありません）：

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ 素晴らしい: 目的に応じた名前のカスタムフック
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**良いカスタムフックは、その呼び出しコードをより宣言的にすることによって、その動作を制約します。** 例えば、`useChatRoom(options)`はチャットルームに接続することしかできず、`useImpressionLog(eventName, extraData)`はインプレッションログを分析に送信することしかできません。カスタムフックAPIがユースケースを制約せず、非常に抽象的である場合、長期的にはそれが解決するよりも多くの問題を引き起こす可能性があります。

</DeepDive>

### カスタムフックはより良いパターンへの移行を助ける {/*custom-hooks-help-you-migrate-to-better-patterns*/}

エフェクトは「エスケープハッチ」です。Reactの外に「ステップアウト」する必要があるとき、またはあなたのユースケースに対するより良い組み込みの解決策がないときに使用します。時間が経つにつれて、Reactチームの目標は、より具体的な問題に対するより具体的な解決策を提供することによって、アプリのエフェクトの数を最小限に減らすことです。エフェクトをカスタムフックにラップすることで、これらの解決策が利用可能になったときにコードをアップグレードしやすくなります。

この例に戻りましょう：

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js active
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

上記の例では、`useOnlineStatus`は[`useState`](/reference/react/useState)と[`useEffect`](/reference/react/useEffect)のペアで実装されています。しかし、これは最良の解決策ではありません。考慮されていないエッジケースがいくつかあります。例えば、コンポーネントがマウントされたときに`isOnline`がすでに`true`であると仮定していますが、ネットワークがすでにオフラインになっている場合は間違っているかもしれません。ブラウザの[`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) APIを使用してそれを確認できますが、直接使用するとサーバーで初期HTMLを生成するためには機能しません。要するに、このコードは改善の余地があります。

幸いなことに、React 18にはこれらの問題をすべて解決する専用のAPIである[`useSyncExternalStore`](/reference/react/useSyncExternalStore)が含まれています。以下は、この新しいAPIを利用するように書き直された`useOnlineStatus`フックです：

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js active
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // クライアントで値を取得する方法
    () => true // サーバーで値を取得する方法
  );
}

```

</Sandpack>

**コンポーネントを変更する必要がなかった**ことに注目してください：

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  // ...
}
```

これが、エフェクトをカスタムフックにラップすることがしばしば有益である理由の1つです：

1. エフェクトへのデータの流れを非常に明確にします。
2. コンポーネントがエフェクトの正確な実装ではなく、意図に集中できるようにします。
3. Reactが新しい機能を追加すると、コンポーネントを変更せずにエフェクトを削除できます。

[デザインシステム](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969)のように、アプリのコンポーネントから共通のイディオムをカスタムフックに抽出することが役立つかもしれません。これにより、コンポーネントのコードが意図に集中し、エフェクトを頻繁に書く必要がなくなります。多くの優れたカスタムフックはReactコミュニティによって維持されています。

<DeepDive>

#### Reactはデータフェッチングのための組み込みの解決策を提供しますか？ {/*will-react-provide-any-built-in-solution-for-data-fetching*/}

詳細はまだ調整中ですが、将来的には次のようにデータフェッチングを書くことを期待しています：

```js {1,4,6}
import { use } from 'react'; // まだ利用できません！

function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```

アプリで上記のようなカスタムフックを使用する場合、手動で各コンポーネントにエフェクトを書くよりも、最終的に推奨されるアプローチに移行するための変更が少なくて済みます。ただし、古いアプローチも問題なく動作するため、生のエフェクトを書くことに満足している場合は、そのまま続けることができます。

</DeepDive>

### 方法は1つではありません {/*there-is-more-than-one-way-to-do-it*/}

ブラウザの[`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) APIを使用して*ゼロから*フェードインアニメーションを実装したいとします。アニメーションループを設定するエフェクトから始めるかもしれません。アニメーションの各フレーム中に、DOMノードの不透明度を[refに保持](/learn/manipulating-the-dom-with-refs)し、`1`に達するまで変更します。コードは次のように始まるかもしれません：

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // まだ描画するフレームが残っています
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

コンポーネントをより読みやすくするために、ロジックを`useFadeIn`カスタムフックに抽出するかもしれません：

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // まだ描画するフレームが残っています
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

`useFadeIn`のコードをそのままにしておくこともできますが、さらにリファクタリングすることもできます。例えば、アニメーションループを設定するロジックを`useFadeIn`からカスタム`useAnimationLoop`フックに抽出することができます：

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEffectEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();
    let frameId = null;

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

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

</Sandpack>

しかし、そうする*必要はありません*。通常の関数と同様に、最終的にはコードの異なる部分の境界をどこに引くかを決定します。非常に異なるアプローチを取ることもできます。エフェクト内のロジックを保持する代わりに、ほとんどの命令的なロジックをJavaScriptの[クラス](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)内に移動することができます：

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress === 1) {
      this.stop();
    } else {
      // まだ描画するフレームが残っています
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

エフェクトはReactを外部システムに接続することを可能にします。エフェクト間の調整が必要な場合（例えば、複数のアニメーションをチェーンするため）、エフェクトとフックから完全にロジックを抽出することが理にかなっています。次に、抽出したコードが「外部システム」になります。これにより、エフェクトはシンプルなままで、Reactの外に移動したシステムにメッセージを送信するだけで済みます。

上記の例は、フェードインロジックがJavaScriptで書かれる必要があると仮定しています。しかし、この特定のフェードインアニメーションは、単純な[CSSアニメーション](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)で実装する方が簡単で効率的です：

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import './welcome.css';

function Welcome() {
  return (
    <h1 className="welcome">
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css src/styles.css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

```css src/welcome.css active
.welcome {
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);

  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

```

</Sandpack>

時には、フックさえ必要ありません！

<Recap>

- カスタムフックはコンポーネント間でロジックを共有します。
- カスタムフックの名前は常に`use`で始まり、その後に大文字が続きます。
- カスタムフックは状態そのものではなく、状態を持つロジックを共有します。
- リアクティブな値を1つのフックから別のフックに渡すことができ、それらは最新の状態を保ちます。
- すべてのフックは、コンポーネントが再レンダリングされるたびに再実行されます。
- カスタムフックのコードは、コンポーネントのコードと同様に純粋であるべきです。
- カスタムフックが受け取るイベントハンドラーをエフェクトイベントにラップします。
- `useMount`のようなカスタムフックを作成しないでください。目的を具体的に保ちます。
- コードの境界をどこに引くかはあなた次第です。

</Recap>

<Challenges>

#### `useCounter`フックを抽出する {/*extract-a-usecounter-hook*/}

このコンポーネントは、状態変数とエフェクトを使用して、毎秒インクリメントされる数値を表示します。このロジックを`useCounter`というカスタムフックに抽出します。`Counter`コンポーネントの実装が次のように見えるようにすることが目標です：

```js
export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

`useCounter.js`ファイルにカスタムフックを書き、`Counter.js`ファイルにインポートします。

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
// このファイルにカスタムフックを書いてください！
```

</Sandpack>

<Solution>

コードは次のようになります：

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval
(id);
  }, []);
  return count;
}
```

</Sandpack>

`App.js`はもう`useState`や`useEffect`をインポートする必要がないことに注意してください。

</Solution>

#### カウンターの遅延を設定可能にする {/*make-the-counter-delay-configurable*/}

この例では、スライダーで制御される`delay`状態変数がありますが、その値は使用されていません。`delay`値をカスタム`useCounter`フックに渡し、`useCounter`フックを変更して、ハードコードされた`1000`ミリ秒の代わりに渡された`delay`を使用するようにします。

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter();
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

<Solution>

`useCounter(delay)`で`delay`をフックに渡します。次に、フック内でハードコードされた`1000`の代わりに`delay`を使用します。エフェクトの依存関係に`delay`を追加する必要があります。これにより、`delay`の変更がインターバルをリセットすることが保証されます。

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

</Sandpack>

</Solution>

#### `useCounter`から`useInterval`を抽出する {/*extract-useinterval-out-of-usecounter*/}

現在、`useCounter`フックは2つのことを行っています。インターバルを設定し、各インターバルティックで状態変数をインクリメントします。インターバルを設定するロジックを`useInterval`という別のフックに分割します。`useInterval`は2つの引数を取るべきです：`onTick`コールバックと`delay`です。この変更後、`useCounter`の実装は次のようになります：

```js
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

`useInterval.js`ファイルに`useInterval`を書き、`useCounter.js`ファイルにインポートします。

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

```js src/useInterval.js
// ここにフックを書いてください！
```

</Sandpack>

<Solution>

`useInterval`内のロジックは、インターバルを設定し、クリアする必要があります。それ以外のことは必要ありません。

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

</Sandpack>

この解決策には少し問題がありますが、次のチャレンジで解決します。

</Solution>

#### リセットされるインターバルを修正する {/*fix-a-resetting-interval*/}

この例では、*2つ*の別々のインターバルがあります。

`App`コンポーネントは`useCounter`を呼び出し、毎秒カウンターを更新するために`useInterval`を呼び出します。しかし、`App`コンポーネントは*また*ページの背景色を2秒ごとにランダムに更新するために`useInterval`を呼び出します。

なぜか、ページの背景色を更新するコールバックは実行されません。`useInterval`内にいくつかのログを追加します：

```js {2,5}
  useEffect(() => {
    console.log('✅ Setting up an interval with delay ', delay)
    const id = setInterval(onTick, delay);
    return () => {
      console.log('❌ Clearing an interval with delay ', delay)
      clearInterval(id);
    };
  }, [onTick, delay]);
```

ログは期待通りの動作を示していますか？エフェクトの一部が不必要に再同期しているように見える場合、どの依存関係がそれを引き起こしていると推測できますか？エフェクトからその依存関係を[削除する方法](/learn/removing-effect-dependencies)はありますか？

問題を修正した後、ページの背景が2秒ごとに更新されることを期待するべきです。

<Hint>

`useInterval`フックはイベントリスナーを引数として受け取るようです。このイベントリスナーをラップして、エフェクトの依存関係にする必要がない方法を考えられますか？

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

</Sandpack>

<Solution>

`useInterval`内で、ティックコールバックをエフェクトイベントにラップします。これにより、エフェクトの依存関係から`onTick`を省略できます。エフェクトはコンポーネントの再レンダリングごとに再同期しないため、ページの背景色変更インターバルが毎秒リセットされることはありません。

この変更により、両方のインターバルが期待通りに動作し、互いに干渉しません：

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

</Sandpack>

</Solution>

#### スタッガードムーブメントを実装する {/*implement-a-staggering-movement*/}

この例では、`usePointerPosition()`フックが現在のポインタ位置を追跡します。プレビューエリア上でカーソルや指を動かしてみてください。赤い点があなたの動きに従うのがわかります。その位置は`pos1`変数に保存されます。

実際には、5つの異なる赤い点がレンダリングされています。現在、それらはすべて同じ位置に表示されているため、見えません。これを修正する必要があります。実装したいのは「スタッガード」ムーブメントです：各点が前の点の経路を「追う」ようにします。例えば、カーソルを素早く動かすと、最初の点はすぐにそれに従い、2番目の点は少し遅れて最初の点に従い、3番目の点は2番目の点に従う、というようにします。

`useDelayedValue`カスタムフックを実装する必要があります。現在の実装は提供された`value`を返します。代わりに、`delay`ミリ秒前の値を返すようにします。これには状態とエフェクトが必要かもしれません。

`useDelayedValue`を実装した後、点が互いに追従するのが見えるはずです。

<Hint>

カスタムフック内で`delayedValue`を状態変数として保持する必要があります。`value`が更新されると、エフェクトを実行したくなります。このエフェクトは`delay`後に`delayedValue`を更新する必要があります。`setTimeout`を呼び出すのが役立つかもしれません。

このエフェクトにはクリーンアップが必要ですか？なぜですか、なぜではないですか？

</Hint>

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  // TODO: このフックを実装してください
  return value;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

<Solution>

ここに動作するバージョンがあります。`delayedValue`を状態変数として保持します。`value`が更新されると、エフェクトがタイムアウトをスケジュールして`delayedValue`を更新します。これにより、`delayedValue`は常に実際の`value`に「遅れ」を持ちます。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

このエフェクトにはクリーンアップが*必要ありません*。クリーンアップ関数で`clearTimeout`を呼び出すと、`value`が変更されるたびに既にスケジュールされたタイムアウトがリセットされます。動きを連続させるためには、すべてのタイムアウトが発火する必要があります。

</Solution>

</Challenges>