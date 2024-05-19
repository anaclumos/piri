---
title: エスケープハッチ
---

<Intro>

いくつかのコンポーネントは、Reactの外部システムと制御および同期する必要があるかもしれません。例えば、ブラウザAPIを使用して入力にフォーカスを当てたり、Reactを使用せずに実装されたビデオプレーヤーを再生・一時停止したり、リモートサーバーからのメッセージを接続してリスニングする必要があるかもしれません。この章では、Reactの外に「ステップアウト」して外部システムに接続するためのエスケープハッチを学びます。アプリケーションのロジックとデータフローの大部分は、これらの機能に依存しないようにするべきです。

</Intro>

<YouWillLearn isChapter={true}>

* [再レンダリングせずに情報を「記憶」する方法](/learn/referencing-values-with-refs)
* [Reactが管理するDOM要素にアクセスする方法](/learn/manipulating-the-dom-with-refs)
* [コンポーネントを外部システムと同期する方法](/learn/synchronizing-with-effects)
* [コンポーネントから不要なエフェクトを削除する方法](/learn/you-might-not-need-an-effect)
* [エフェクトのライフサイクルがコンポーネントのライフサイクルと異なる点](/learn/lifecycle-of-reactive-effects)
* [一部の値がエフェクトを再トリガーしないようにする方法](/learn/separating-events-from-effects)
* [エフェクトの再実行頻度を減らす方法](/learn/removing-effect-dependencies)
* [コンポーネント間でロジックを共有する方法](/learn/reusing-logic-with-custom-hooks)

</YouWillLearn>

## Refsを使って値を参照する {/*referencing-values-with-refs*/}

コンポーネントに何らかの情報を「記憶」させたいが、その情報が[新しいレンダリングをトリガーしない](/learn/render-and-commit)ようにしたい場合、*ref*を使用できます：

```js
const ref = useRef(0);
```

状態と同様に、refsは再レンダリング間でReactによって保持されます。しかし、状態を設定するとコンポーネントが再レンダリングされますが、refを変更しても再レンダリングされません！`ref.current`プロパティを通じてそのrefの現在の値にアクセスできます。

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

refは、Reactが追跡しないコンポーネントの秘密のポケットのようなものです。例えば、refsを使用して[タイムアウトID](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value)、[DOM要素](https://developer.mozilla.org/en-US/docs/Web/API/Element)、およびコンポーネントのレンダリング出力に影響を与えない他のオブジェクトを保存できます。

<LearnMore path="/learn/referencing-values-with-refs">

**[Refsを使って値を参照する](/learn/referencing-values-with-refs)**を読んで、情報を記憶するためのrefsの使用方法を学びましょう。

</LearnMore>

## Refsを使ってDOMを操作する {/*manipulating-the-dom-with-refs*/}

Reactは自動的にDOMをレンダリング出力に一致させるため、コンポーネントがDOMを操作する必要はあまりありません。しかし、時にはReactが管理するDOM要素にアクセスする必要があるかもしれません。例えば、ノードにフォーカスを当てたり、スクロールしたり、そのサイズや位置を測定したりする場合です。Reactにはこれらのことを行うための組み込みの方法はないため、DOMノードへのrefが必要です。例えば、ボタンをクリックすると、refを使用して入力にフォーカスが当たります：

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/manipulating-the-dom-with-refs">

**[Refsを使ってDOMを操作する](/learn/manipulating-the-dom-with-refs)**を読んで、Reactが管理するDOM要素にアクセスする方法を学びましょう。

</LearnMore>

## エフェクトと同期する {/*synchronizing-with-effects*/}

いくつかのコンポーネントは外部システムと同期する必要があります。例えば、Reactの状態に基づいて非Reactコンポーネントを制御したり、サーバー接続を設定したり、コンポーネントが画面に表示されたときに分析ログを送信したりする場合です。イベントハンドラとは異なり、特定のイベントを処理することができるエフェクトは、レンダリング後にコードを実行することができます。これらを使用して、コンポーネントをReactの外部システムと同期させます。

再生/一時停止を数回押して、ビデオプレーヤーが`isPlaying`プロップ値に同期していることを確認してください：

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

多くのエフェクトは自分自身を「クリーンアップ」します。例えば、チャットサーバーへの接続を設定するエフェクトは、コンポーネントをそのサーバーから切断する方法をReactに伝える*クリーンアップ関数*を返すべきです：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // 実際の実装ではサーバーに接続します
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

開発中、Reactはエフェクトを一度余分に実行してクリーンアップします。これにより、クリーンアップ関数の実装を忘れないようにします。

<LearnMore path="/learn/synchronizing-with-effects">

**[エフェクトと同期する](/learn/synchronizing-with-effects)**を読んで、コンポーネントを外部システムと同期させる方法を学びましょう。

</LearnMore>

## エフェクトが不要な場合 {/*you-might-not-need-an-effect*/}

エフェクトはReactのパラダイムからのエスケープハッチです。これにより、Reactの外に「ステップアウト」してコンポーネントを外部システムと同期させることができます。外部システムが関与しない場合（例えば、プロップや状態が変わったときにコンポーネントの状態を更新したい場合）、エフェクトは必要ありません。不要なエフェクトを削除することで、コードが読みやすくなり、実行が速くなり、エラーが少なくなります。

エフェクトが不要な一般的なケースは2つあります：
- **レンダリングのためにデータを変換するためにエフェクトは不要です。**
- **ユーザーイベントを処理するためにエフェクトは不要です。**

例えば、他の状態に基づいて状態を調整するためにエフェクトは不要です：

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 避けるべき：冗長な状態と不要なエフェクト
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

代わりに、レンダリング中にできるだけ多くを計算します：

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ 良い：レンダリング中に計算
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

ただし、外部システムと同期するためにはエフェクトが必要です。

<LearnMore path="/learn/you-might-not-need-an-effect">

**[エフェクトが不要な場合](/learn/you-might-not-need-an-effect)**を読んで、不要なエフェクトを削除する方法を学びましょう。

</LearnMore>

## リアクティブエフェクトのライフサイクル {/*lifecycle-of-reactive-effects*/}

エフェクトはコンポーネントとは異なるライフサイクルを持ちます。コンポーネントはマウント、更新、アンマウントすることがあります。エフェクトは2つのことしかできません：何かを同期し始めることと、それを後で同期を停止することです。このサイクルは、エフェクトが時間とともに変化するプロップや状態に依存している場合、複数回発生することがあります。

このエフェクトは`roomId`プロップの値に依存しています。プロップは*リアクティブな値*であり、再レンダリング時に変更されることがあります。`roomId`が変更されると、エフェクトが再同期（およびサーバーに再接続）することに注意してください：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 実際の実装ではサーバーに接続します
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Reactは、エフェクトの依存関係を正しく指定したかどうかをチェックするリンタールールを提供します。上記の例で依存関係リストに`roomId`を指定し忘れた場合、リンターはそのバグを自動的に見つけます。

<LearnMore path="/learn/lifecycle-of-reactive-effects">

**[リアクティブエフェクトのライフサイクル](/learn/lifecycle-of-reactive-effects)**を読んで、エフェクトのライフサイクルがコンポーネントのライフサイクルとどのように異なるかを学びましょう。

</LearnMore>

## イベントとエフェクトを分離する {/*separating-events-from-effects*/}

<Wip>

このセクションでは、**まだ安定版のReactでリリースされていない実験的なAPI**について説明します。

</Wip>

イベントハンドラは、同じ操作を再度実行したときにのみ再実行されます。イベントハンドラとは異なり、エフェクトは、プロップや状態など、最後のレンダリング時と異なる値がある場合に再同期します。時には、両方の動作を混ぜ合わせたものが必要です：一部の値に応じて再実行されるエフェクトと、他の値には応じないエフェクトです。

エフェクト内のすべてのコードは*リアクティブ*です。再レンダリングによって読み取られたリアクティブな値が変更された場合、再度実行されます。例えば、このエフェクトは`roomId`または`theme`が変更された場合に再接続します：

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
  // 実際の実装ではサーバーに接続します
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
      background:theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

これは理想的ではありません。`roomId`が変更された場合にのみチャットに再接続したいのです。`theme`を切り替えるとチャットに再接続する必要はありません！`theme`を読み取るコードをエフェクトから*エフェクトイベント*に移動します：

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
  // 実際の実装ではサーバーに接続します
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

エフェクトイベント内のコードはリアクティブではないため、`theme`を変更してもエフェクトが再接続されることはありません。

<LearnMore path="/learn/separating-events-from-effects">

**[イベントとエフェクトを分離する](/learn/separating-events-from-effects)**を読んで、一部の値がエフェクトを再トリガーしないようにする方法を学びましょう。

</LearnMore>

## エフェクトの依存関係を削除する {/*removing-effect-dependencies*/}

エフェクトを書くとき、リンターはエフェクトが読み取るすべてのリアクティブな値（プロップや状態など）をエフェクトの依存関係リストに含めたかどうかを確認します。これにより、エフェクトがコンポーネントの最新のプロップと状態と同期し続けることが保証されます。不要な依存関係は、エフェクトが頻繁に実行されすぎたり、無限ループを引き起こしたりする可能性があります。依存関係を削除する方法はケースによって異なります。

例えば、このエフェクトは入力を編集するたびに再作成される`options`オブジェクトに依存しています：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 実際の実装ではサーバーに接続します
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

チャットを再接続するたびにメッセージを入力し始めるのは望ましくありません。この問題を解決するために、`options`オブジェクトの作成をエフェクト内に移動し、エフェクトが`roomId`文字列にのみ依存するようにします：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 実際の実装ではサーバーに接続します
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

依存関係リストを編集して`options`依存関係を削除することから始めるのではありません。それは間違いです。代わりに、依存関係が*不要*になるように周囲のコードを変更します。依存関係リストは、エフェクトのコードで使用されるすべてのリアクティブな値のリストと考えてください。意図的にそのリストに何を入れるかを選択するのではありません。リストはコードを説明します。依存関係リストを変更するには、コードを変更します。

<LearnMore path="/learn/removing-effect-dependencies">

**[エフェクトの依存関係を削除する](/learn/removing-effect-dependencies)**を読んで、エフェクトの再実行頻度を減らす方法を学びましょう。

</LearnMore>

## カスタムフックを使ってロジックを再利用する {/*reusing-logic-with-custom-hooks*/}

Reactには`useState`、`useContext`、`useEffect`などの組み込みフックがあります。時には、データを取得したり、ユーザーがオンラインかどうかを追跡したり、チャットルームに接続したりするための特定の目的のフックが欲しいと思うことがあります。これを行うために、アプリケーションのニーズに合わせて独自のフックを作成できます。

この例では、`usePointerPosition`カスタムフックがカーソル位置を追跡し、`useDelayedValue`カスタムフックが指定されたミリ秒数だけ遅れて渡された値を返します。サンドボックスのプレビューエリア上でカーソルを移動させると、カーソルを追いかける点のトレイルが表示されます：

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos4, 50);
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

```js src/useDelayedValue.js
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

カスタムフックを作成し、それらを組み合わせ、データを渡し、コンポーネント間で再利用することができます。アプリが成長するにつれて、手動でエフェクトを書くことが少なくなり、既に書いたカスタムフックを再利用できるようになります。また、Reactコミュニティによって維持されている多くの優れたカスタムフックもあります。

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

**[カスタムフックを使ってロジックを再利用する](/learn/reusing-logic-with-custom-hooks)**を読んで、コンポーネント間でロジックを共有する方法を学びましょう。

</LearnMore>

## 次は何ですか？ {/*whats-next*/}

[Refsを使って値を参照する](/learn/referencing-values-with-refs)に進んで、この章をページごとに読み始めましょう！