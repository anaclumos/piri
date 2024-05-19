---
title: useEffect
---

<Intro>

`useEffect`は、コンポーネントを外部システムと同期させるためのReact Hookです。[外部システムとコンポーネントを同期させる](/learn/synchronizing-with-effects)

```js
useEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## 参照 {/*reference*/}

### `useEffect(setup, dependencies?)` {/*useeffect*/}

Effectを宣言するために、コンポーネントのトップレベルで`useEffect`を呼び出します：

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `setup`: Effectのロジックを含む関数。setup関数はオプションで*クリーンアップ*関数を返すこともできます。コンポーネントがDOMに追加されると、Reactはsetup関数を実行します。依存関係が変更された再レンダリングのたびに、Reactは最初に古い値でクリーンアップ関数（提供されている場合）を実行し、その後新しい値でsetup関数を実行します。コンポーネントがDOMから削除されると、Reactはクリーンアップ関数を実行します。

* **オプション** `dependencies`: `setup`コード内で参照されるすべてのリアクティブな値のリスト。リアクティブな値には、props、state、およびコンポーネント本体内で直接宣言されたすべての変数と関数が含まれます。リンターが[React用に設定されている](/learn/editor-setup#linting)場合、すべてのリアクティブな値が依存関係として正しく指定されていることを確認します。依存関係のリストは一定の項目数を持ち、`[dep1, dep2, dep3]`のようにインラインで書かれる必要があります。Reactは[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)比較を使用して各依存関係を以前の値と比較します。この引数を省略すると、Effectはコンポーネントの再レンダリングごとに再実行されます。[依存関係の配列を渡す場合、空の配列を渡す場合、および依存関係をまったく渡さない場合の違いを参照してください。](#examples-dependencies)

#### 戻り値 {/*returns*/}

`useEffect`は`undefined`を返します。

#### 注意点 {/*caveats*/}

* `useEffect`はHookであるため、**コンポーネントのトップレベル**または独自のHookでのみ呼び出すことができます。ループや条件内で呼び出すことはできません。その場合は、新しいコンポーネントを抽出し、stateをそこに移動します。

* **外部システムと同期しようとしていない場合、** [Effectは必要ないかもしれません。](/learn/you-might-not-need-an-effect)

* ストリクトモードがオンの場合、Reactは**最初の実際のセットアップの前に、開発専用の追加のセットアップ+クリーンアップサイクルを実行します。** これは、クリーンアップロジックがセットアップロジックを「ミラーリング」し、セットアップが行っていることを停止または元に戻すことを確認するためのストレステストです。これが問題を引き起こす場合は、[クリーンアップ関数を実装します。](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* 依存関係の一部がコンポーネント内で定義されたオブジェクトや関数である場合、それらが**必要以上にEffectを再実行させるリスクがあります。** これを修正するには、不要な[オブジェクト](#removing-unnecessary-object-dependencies)および[関数](#removing-unnecessary-function-dependencies)の依存関係を削除します。また、[stateの更新を抽出](#updating-state-based-on-previous-state-from-an-effect)し、[非リアクティブなロジック](#reading-the-latest-props-and-state-from-an-effect)をEffectの外に移動することもできます。

* Effectがインタラクション（クリックなど）によって引き起こされなかった場合、Reactは一般的に**Effectを実行する前にブラウザが更新された画面を描画させます。** Effectが視覚的なことを行っている場合（例：ツールチップの位置決め）、遅延が目立つ場合（例：ちらつき）、`useEffect`を[`useLayoutEffect`](/reference/react/useLayoutEffect)に置き換えます。

* Effectがインタラクション（クリックなど）によって引き起こされた場合でも、**ブラウザはEffect内のstate更新を処理する前に画面を再描画することがあります。** 通常、それが望ましい動作です。しかし、ブラウザが画面を再描画するのをブロックする必要がある場合は、`useEffect`を[`useLayoutEffect`](/reference/react/useLayoutEffect)に置き換える必要があります。

* Effectは**クライアントでのみ実行されます。** サーバーレンダリング中には実行されません。

---

## 使用法 {/*usage*/}

### 外部システムへの接続 {/*connecting-to-an-external-system*/}

一部のコンポーネントは、ページに表示されている間、ネットワーク、ブラウザAPI、またはサードパーティライブラリに接続し続ける必要があります。これらのシステムはReactによって制御されていないため、*外部*と呼ばれます。

[コンポーネントを外部システムに接続するために、](/learn/synchronizing-with-effects)コンポーネントのトップレベルで`useEffect`を呼び出します：

```js [[1, 8, "const connection = createConnection(serverUrl, roomId);"], [1, 9, "connection.connect();"], [2, 11, "connection.disconnect();"], [3, 13, "[serverUrl, roomId]"]]
import { useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
  	const connection = createConnection(serverUrl, roomId);
    connection.connect();
  	return () => {
      connection.disconnect();
  	};
  }, [serverUrl, roomId]);
  // ...
}
```

`useEffect`に2つの引数を渡す必要があります：

1. そのシステムに接続する<CodeStep step={1}>セットアップコード</CodeStep>を含む*セットアップ関数*。
   - そのシステムから切断する<CodeStep step={2}>クリーンアップコード</CodeStep>を含む*クリーンアップ関数*を返す必要があります。
2. これらの関数内で使用されるコンポーネントのすべての値を含む<CodeStep step={3}>依存関係のリスト</CodeStep>。

**Reactは必要に応じてセットアップとクリーンアップ関数を呼び出します。これは複数回発生する可能性があります：**

1. コンポーネントがページに追加されたとき（*マウント*）、<CodeStep step={1}>セットアップコード</CodeStep>が実行されます。
2. <CodeStep step={3}>依存関係</CodeStep>が変更されたコンポーネントの再レンダリングごとに：
   - 最初に、古いpropsとstateで<CodeStep step={2}>クリーンアップコード</CodeStep>が実行されます。
   - 次に、新しいpropsとstateで<CodeStep step={1}>セットアップコード</CodeStep>が実行されます。
3. コンポーネントがページから削除された後（*アンマウント*）、<CodeStep step={2}>クリーンアップコード</CodeStep>が最後に実行されます。

**上記の例のシーケンスを説明しましょう。**  

上記の`ChatRoom`コンポーネントがページに追加されると、初期の`serverUrl`と`roomId`でチャットルームに接続します。再レンダリングの結果として`serverUrl`または`roomId`が変更された場合（例えば、ユーザーがドロップダウンで別のチャットルームを選択した場合）、Effectは*前のルームから切断し、次のルームに接続します。* `ChatRoom`コンポーネントがページから削除されると、Effectは最後に切断します。

**開発中にバグを見つけるために、Reactは<CodeStep step={1}>セットアップ</CodeStep>と<CodeStep step={2}>クリーンアップ</CodeStep>を最初の<CodeStep step={1}>セットアップ</CodeStep>の前に一度追加で実行します。** これは、Effectのロジックが正しく実装されていることを確認するためのストレステストです。これが目に見える問題を引き起こす場合、クリーンアップ関数にいくつかのロジックが欠けています。クリーンアップ関数は、セットアップ関数が行っていることを停止または元に戻す必要があります。基本的なルールは、ユーザーがセットアップが一度呼び出された場合（本番環境のように）と、*セットアップ* → *クリーンアップ* → *セットアップ*のシーケンス（開発環境のように）の間で区別できないようにすることです。[一般的な解決策を参照してください。](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

**すべてのEffectを独立したプロセスとして書き、1回のセットアップ/クリーンアップサイクルを考えるようにしてください。** コンポーネントがマウント、更新、アンマウントされているかどうかは関係ありません。クリーンアップロジックがセットアップロジックを正しく「ミラーリング」している場合、Effectは必要に応じてセットアップとクリーンアップを実行することに対して堅牢です。

<Note>

Effectを使用すると、コンポーネントを外部システム（チャットサービスなど）と同期させることができます。ここで、*外部システム*とは、Reactによって制御されていないコードの部分を意味します。例えば：

* <CodeStep step={1}>[`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)</CodeStep>と<CodeStep step={2}>[`clearInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)</CodeStep>を使用して管理されるタイマー。
* <CodeStep step={1}>[`window.addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)</CodeStep>と<CodeStep step={2}>[`window.removeEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)</CodeStep>を使用したイベントサブスクリプション。
* <CodeStep step={1}>`animation.start()`</CodeStep>と<CodeStep step={2}>`animation.reset()`</CodeStep>のようなAPIを持つサードパーティのアニメーションライブラリ。

**外部システムに接続していない場合、Effectは必要ないかもしれません。** [Effectは必要ないかもしれません。](/learn/you-might-not-need-an-effect)

</Note>

<Recipes titleText="外部システムに接続する例" titleId="examples-connecting">

#### チャットサーバーへの接続 {/*connecting-to-a-chat-server*/}

この例では、`ChatRoom`コンポーネントはEffectを使用して`chat.js`で定義された外部システムに接続し続けます。「チャットを開く」を押して`ChatRoom`コンポーネントを表示します。このサンドボックスは開発モードで実行されるため、[ここで説明されているように、](#examples-connecting)追加の接続と切断サイクルがあります。ドロップダウンと入力を使用して`roomId`と`serverUrl`を変更し、Effectがチャットに再接続する様子を確認してください。「チャットを閉じる」を押して、Effectが最後に切断する様子を確認してください。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
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
export function createConnection(serverUrl, roomId) {
  // 実際の実装ではサーバーに接続します
  return {
    connect() {
      console.log('✅ "' + roomId + '"ルームに' + serverUrl + 'で接続中...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '"ルームから' + serverUrl + 'で切断されました');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### グローバルブラウザイベントのリスニング {/*listening-to-a-global-browser-event*/}

この例では、外部システムはブラウザのDOM自体です。通常、イベントリスナーはJSXで指定しますが、グローバルな[`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window)オブジェクトをこの方法でリスニングすることはできません。Effectを使用すると、`window`オブジェクトに接続し、そのイベントをリスニングできます。`pointermove`イベントをリスニングすることで、カーソル（または指）の位置を追跡し、赤い点がそれに合わせて移動するように更新します。

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
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
  );
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### アニメーションのトリガー {/*triggering-an-animation*/}

この例では、外部システムは`animation.js`のアニメーションライブラリです。これは、DOMノードを引数として受け取り、`start()`および`stop()`メソッドを公開する`FadeInAnimation`というJavaScriptクラスを提供します。このコンポーネントは、[refを使用して](/learn/manipulating-the-dom-with-refs)基礎となるDOMノードにアクセスします。
EffectはrefからDOMノードを読み取り、コンポーネントが表示されるとそのノードのアニメーションを自動的に開始します。

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(1000);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
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

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // すぐに終了にジャンプ
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // アニメーションを開始
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // まだ描画するフレームが残っている
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
```

</Sandpack>

<Solution />

#### モーダルダイアログの制御 {/*controlling-a-modal-dialog*/}

この例では、外部システムはブラウザのDOMです。`ModalDialog`コンポーネントは[`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)要素をレンダリングします。Effectを使用して、`isOpen`プロップを[`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal)および[`close()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close)メソッド呼び出しに同期させます。

<Sandpack>

```js
import { useState } from 'react';
import ModalDialog from './ModalDialog.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Open dialog
      </button>
      <ModalDialog isOpen={show}>
        Hello there!
        <br />
        <button onClick={() => {
          setShow(false);
        }}>Close</button>
      </ModalDialog>
    </>
  );
}
```

```js src/ModalDialog.js active
import { useEffect, useRef } from 'react';

export default function ModalDialog({ isOpen, children }) {
  const ref = useRef();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
    };
  }, [isOpen]);

  return <dialog ref={ref}>{children}</dialog>;
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### 要素の可視性の追跡 {/*tracking-element-visibility*/}

この例では、外部システムは再びブラウザのDOMです。`App`コンポーネントは長いリストを表示し、その後に`Box`コンポーネント、さらにもう一つの長いリストを表示します。リストを下にスクロールします。`Box`コンポーネントがビューポート内で完全に表示されると、背景色が黒に変わることに注意してください。これを実装するために、`Box`コンポーネントはEffectを使用して[`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)を管理します。このブラウザAPIは、DOM要素がビューポート内で表示されているかどうかを通知します。

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (keep scrolling)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';

export default function Box() {
  const ref = useRef(null);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
      } else {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
      }
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, []);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### カスタムHookでEffectをラップする {/*wrapping-effects-in-custom-hooks*/}

Effectは["エスケープハッチ"](/learn/escape-hatches)です。Reactの組み込みソリューションがない場合に使用します。Effectを手動で頻繁に書く必要がある場合は、コンポーネントが依存する共通の動作のためにいくつかの[カスタムHook](/learn/reusing-logic-with-custom-hooks)を抽出する必要があることを示しています。

例えば、この`useChatRoom`カスタムHookは、Effectのロジックをより宣言的なAPIの背後に「隠します」：

```js {1,11}
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

次に、任意のコンポーネントからこのように使用できます：

```js {4-7}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

Reactエコシステムには、あらゆる目的のための優れたカスタムHookも多数あります。

[カスタムHookでEffectをラップする方法について詳しく学びます。](/learn/reusing-logic-with-custom-hooks)

<Recipes titleText="カスタムHookでEffectをラップする例" titleId="examples-custom-hooks">

#### カスタム`useChatRoom`Hook {/*custom-usechatroom-hook*/}

この例は、[以前の例の一つ](#examples-connecting)と同じですが、ロジックがカスタムHookに抽出されています。

<Sandpack>

```js
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
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

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 実際の実装ではサーバーに接続します
  return {
    connect() {
      console.log('✅ "' + roomId + '"ルームに' + serverUrl + 'で接続中...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '"ルームから' + serverUrl + 'で切断されました');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### カスタム`useWindowListener`Hook {/*custom-usewindowlistener-hook*/}

この例は、[以前の例の一つ](#examples-connecting)と同じですが、ロジックがカスタムHookに抽出されています。

<Sandpack>

```js
import { useState } from 'react';
import { useWindowListener } from './useWindowListener.js';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useWindowListener('pointermove', (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  });

  return (
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
  );
}
```

```js src/useWindowListener.js
import { useState, useEffect } from 'react';

export function useWindowListener(eventType, listener) {
  useEffect(() => {
    window.addEventListener(eventType, listener);
    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, listener]);
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### カスタム`useIntersectionObserver`Hook {/*custom-useintersectionobserver-hook*/}

この例は、[以前の例の一つ](#examples-connecting)と同じですが、ロジックが部分的にカスタムHookに抽出されています。

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (keep scrolling)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver.js';

export default function Box() {
  const ref = useRef(null);
  const isIntersecting = useIntersectionObserver(ref);

  useEffect(() => {
   if (isIntersecting) {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'white';
    } else {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    }
  }, [isIntersecting]);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

```js src/useIntersectionObserver.js
import { useState, useEffect } from 'react';

export function useIntersectionObserver(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      setIsIntersecting(entry.isIntersecting);
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, [ref]);

  return isIntersecting;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### 非Reactウィジェットの制御 {/*controlling-a-non-react-widget*/}

時々、コンポーネントのプロップやステートを外部システムに同期させたいことがあります。

例えば、サードパーティの地図ウィジェットやReactを使用せずに書かれたビデオプレーヤーコンポーネントがある場合、その状態をReactコンポーネントの現在の状態に一致させるためにメソッドを呼び出すEffectを使用できます。このEffectは、`map-widget.js`で定義された`MapWidget`クラスのインスタンスを作成します。`Map`コンポーネントの`zoomLevel`プロップを変更すると、Effectはクラスインスタンスの`setZoom()`を呼び出して同期を保ちます：

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
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

```js src/App.js
import { useState } from 'react';
import Map from './Map.js';

export default function App() {
  const [zoomLevel, setZoomLevel] = useState(0);
  return (
    <>
      Zoom level: {zoomLevel}x
      <button onClick={() => setZoomLevel(zoomLevel + 1)}>+</button>
      <button onClick={() => setZoomLevel(zoomLevel - 1)}>-</button>
      <hr />
      <Map zoomLevel={zoomLevel} />
    </>
  );
}
```

```js src/Map.js active
import { useRef, useEffect } from 'react';
import { MapWidget } from './map-widget.js';

export default function Map({ zoomLevel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return (
    <div
      style={{ width: 200, height: 200 }}
      ref={containerRef}
    />
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export class MapWidget {
  constructor(domNode) {
    this.map = L.map(domNode, {
      zoomControl: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      scrollWheelZoom: false,
      zoomAnimation: false,
      touchZoom: false,
      zoomSnap: 0.1
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    this.map.setView([0, 0], 0);
  }
  setZoom(level) {
    this.map.setZoom(level);
  }
}
```

```css
button { margin: 5px; }
```

</Sandpack>

この例では、`MapWidget`クラスは渡されたDOMノードのみを管理するため、クリーンアップ関数は必要ありません
。`Map` Reactコンポーネントがツリーから削除されると、DOMノードと`MapWidget`クラスインスタンスの両方がブラウザのJavaScriptエンジンによって自動的にガベージコレクションされます。

---

### Effectを使用してデータを取得する {/*fetching-data-with-effects*/}

Effectを使用してコンポーネントのデータを取得することができます。フレームワークを使用している場合、フレームワークのデータ取得メカニズムを使用する方が、Effectを手動で書くよりも効率的です。

Effectを手動で使用してデータを取得したい場合、コードは次のようになります：

```js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [person]);

  // ...
```

`ignore`変数が`false`に初期化され、クリーンアップ中に`true`に設定されることに注意してください。これにより、ネットワーク応答が送信された順序と異なる順序で到着する可能性があるため、コードが「競合状態」に陥らないようにします。

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

</Sandpack>

`async` / `await`構文を使用して書き直すこともできますが、クリーンアップ関数を提供する必要があります：

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    async function startFetching() {
      setBio(null);
      const result = await fetchBio(person);
      if (!ignore) {
        setBio(result);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

</Sandpack>

Effect内でデータを直接取得するのは繰り返しが多く、後でキャッシュやサーバーレンダリングなどの最適化を追加するのが難しくなります。[カスタムHookを使用する方が簡単です。](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

<DeepDive>

#### データ取得にEffectを使用する代替手段は何ですか？ {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Effect内で`fetch`呼び出しを行うのは、特に完全にクライアントサイドのアプリでデータを取得する[人気のある方法](https://www.robinwieruch.de/react-hooks-fetch-data/)です。しかし、これは非常に手動のアプローチであり、以下のような重大な欠点があります：

- **Effectはサーバー上で実行されません。** これは、初期のサーバーレンダリングされたHTMLがデータなしのローディング状態のみを含むことを意味します。クライアントコンピュータはすべてのJavaScriptをダウンロードし、アプリをレンダリングしてからデータをロードする必要があります。これは非常に効率的ではありません。
- **Effect内で直接データを取得すると、「ネットワークウォーターフォール」を作成しやすくなります。** 親コンポーネントをレンダリングし、データを取得し、子コンポーネントをレンダリングし、それからデータを取得し始めます。ネットワークが非常に速くない場合、これはすべてのデータを並行して取得するよりもかなり遅くなります。
- **Effect内で直接データを取得すると、データを事前ロードまたはキャッシュしないことがよくあります。** 例えば、コンポーネントがアンマウントされて再度マウントされると、再度データを取得する必要があります。
- **あまりエルゴノミックではありません。** 競合状態のようなバグに悩まされないように`fetch`呼び出しを書くときには、かなりのボイラープレートコードが含まれます。

これらの欠点はReactに特有のものではありません。マウント時にデータを取得することは、どのライブラリでも同様の問題があります。ルーティングと同様に、データ取得はうまく行うのが簡単ではないため、次のアプローチをお勧めします：

- **[フレームワーク](/learn/start-a-new-react-project#production-grade-react-frameworks)を使用している場合は、その組み込みのデータ取得メカニズムを使用してください。** モダンなReactフレームワークには、効率的で上記の欠点を持たないデータ取得メカニズムが統合されています。
- **それ以外の場合は、クライアントサイドのキャッシュを使用または構築することを検討してください。** 人気のあるオープンソースソリューションには、[React Query](https://tanstack.com/query/latest/)、[useSWR](https://swr.vercel.app/)、および[React Router 6.4+](https://beta.reactrouter.com/en/main/start/overview)があります。独自のソリューションを構築することもできます。その場合、Effectを内部で使用しますが、リクエストの重複排除、レスポンスのキャッシュ、およびネットワークウォーターフォールの回避（データの事前ロードまたはルートへのデータ要件の引き上げ）などのロジックも追加します。

これらのアプローチが適さない場合は、Effect内で直接データを取得し続けることができます。

</DeepDive>

---

### リアクティブな依存関係の指定 {/*specifying-reactive-dependencies*/}

**Effectの依存関係を「選択」することはできません。** Effectのコードで使用されるすべての<CodeStep step={2}>リアクティブな値</CodeStep>は依存関係として宣言する必要があります。Effectの依存関係リストは周囲のコードによって決まります：

```js [[2, 1, "roomId"], [2, 2, "serverUrl"], [2, 5, "serverUrl"], [2, 5, "roomId"], [2, 8, "serverUrl"], [2, 8, "roomId"]]
function ChatRoom({ roomId }) { // これはリアクティブな値です
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // これもリアクティブな値です

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // このEffectはこれらのリアクティブな値を読み取ります
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]); // ✅ したがって、依存関係として指定する必要があります
  // ...
}
```

`serverUrl`または`roomId`が変更されると、Effectは新しい値を使用してチャットに再接続します。

**[リアクティブな値](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)には、propsおよびコンポーネント内で直接宣言されたすべての変数と関数が含まれます。** `roomId`と`serverUrl`はリアクティブな値であるため、依存関係から削除することはできません。これを省略しようとすると、[React用に正しく設定されたリンター](/learn/editor-setup#linting)がこれを間違いとしてフラグを立てます：

```js {8}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffectには依存関係が不足しています: 'roomId'と'serverUrl'
  // ...
}
```

**依存関係を削除するには、それが依存関係である必要がないことをリンターに「証明」する必要があります。** 例えば、`serverUrl`をコンポーネントの外に移動して、それがリアクティブではなく、再レンダリング時に変更されないことを証明できます：

```js {1,8}
const serverUrl = 'https://localhost:1234'; // もはやリアクティブな値ではありません

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ すべての依存関係が宣言されています
  // ...
}
```

`serverUrl`がもはやリアクティブな値ではなく（再レンダリング時に変更されない）、依存関係である必要がなくなりました。**Effectのコードがリアクティブな値を使用しない場合、その依存関係リストは空（`[]`）である必要があります：**

```js {1,2,9}
const serverUrl = 'https://localhost:1234'; // もはやリアクティブな値ではありません
const roomId = 'music'; // もはやリアクティブな値ではありません

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ すべての依存関係が宣言されています
  // ...
}
```

[依存関係が空のEffect](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means)は、コンポーネントのpropsやstateが変更されても再実行されません。

<Pitfall>

既存のコードベースがある場合、次のようにリンターを抑制するEffectがあるかもしれません：

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 このようにリンターを抑制するのは避けてください：
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**依存関係がコードと一致しない場合、バグを導入するリスクが高くなります。** リンターを抑制することで、Effectが依存する値についてReactに「嘘」をつくことになります。[代わりに、それらが不要であることを証明してください。](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)

</Pitfall>

<Recipes titleText="リアクティブな依存関係を渡す例" titleId="examples-dependencies">

#### 依存関係の配列を渡す {/*passing-a-dependency-array*/}

依存関係を指定すると、Effectは**初回レンダリング後および依存関係が変更された再レンダリング後に実行されます。**

```js {3}
useEffect(() => {
  // ...
}, [a, b]); // aまたはbが異なる場合に再実行されます
```

以下の例では、`serverUrl`と`roomId`は[リアクティブな値](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)であるため、両方とも依存関係として指定する必要があります。その結果、ドロップダウンで別のルームを選択したり、サーバーURLの入力を編集したりすると、チャットが再接続されます。ただし、`message`はEffectで使用されていないため（依存関係ではない）、メッセージを編集してもチャットは再接続されません。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
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
        <button onClick={() => setShow(!show)}>
          {show ? 'Close chat' : 'Open chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 実際の実装ではサーバーに接続します
  return {
    connect() {
      console.log('✅ "' + roomId + '"ルームに' + serverUrl + 'で接続中...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '"ルームから' + serverUrl + 'で切断されました');
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### 空の依存関係配列を渡す {/*passing-an-empty-dependency-array*/}

Effectがリアクティブな値を使用しない場合、**初回レンダリング後にのみ実行されます。**

```js {3}
useEffect(() => {
  // ...
}, []); // 再実行されません（開発中に一度だけ実行されます）
```

**依存関係が空でも、バグを見つけるために開発中にセットアップとクリーンアップが[一度追加で実行されます。](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)**

この例では、`serverUrl`と`roomId`の両方がハードコードされています。それらはコンポーネントの外で宣言されているため、リアクティブな値ではなく、依存関係ではありません。依存関係リストは空であり、Effectは再レンダリング時に再実行されません。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId
= 'music';

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 実際の実装ではサーバーに接続します
  return {
    connect() {
      console.log('✅ "' + roomId + '"ルームに' + serverUrl + 'で接続中...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '"ルームから' + serverUrl + 'で切断されました');
    }
  };
}
```

</Sandpack>

<Solution />

#### 依存関係配列をまったく渡さない場合 {/*passing-no-dependency-array-at-all*/}

依存関係配列をまったく渡さない場合、Effectは**コンポーネントのすべてのレンダリング（および再レンダリング）後に実行されます。**

```js {3}
useEffect(() => {
  // ...
}); // 常に再実行されます
```

この例では、`serverUrl`と`roomId`を変更するとEffectが再実行されますが、それは理にかなっています。しかし、`message`を変更するとEffectも再実行されますが、これはおそらく望ましくありません。このため、通常は依存関係配列を指定します。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }); // 依存関係配列をまったく渡さない

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
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
        <button onClick={() => setShow(!show)}>
          {show ? 'Close chat' : 'Open chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 実際の実装ではサーバーに接続します
  return {
    connect() {
      console.log('✅ "' + roomId + '"ルームに' + serverUrl + 'で接続中...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '"ルームから' + serverUrl + 'で切断されました');
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Effectから前のstateに基づいてstateを更新する {/*updating-state-based-on-previous-state-from-an-effect*/}

Effectから前のstateに基づいてstateを更新したい場合、問題が発生することがあります：

```js {6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1); // 毎秒カウンターをインクリメントしたい...
    }, 1000)
    return () => clearInterval(intervalId);
  }, [count]); // 🚩 ... しかし、`count`を依存関係として指定すると、常にインターバルがリセットされます。
  // ...
}
```

`count`はリアクティブな値であるため、依存関係リストに指定する必要があります。しかし、それにより、`count`が変更されるたびにEffectがクリーンアップとセットアップを再度行うことになります。これは理想的ではありません。

これを修正するには、`setCount`に[`c => c + 1`のstateアップデーター](/reference/react/useState#updating-state-based-on-the-previous-state)を渡します：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // ✅ stateアップデーターを渡します
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅ これで`count`は依存関係ではありません

  return <h1>{count}</h1>;
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

`count + 1`の代わりに`c => c + 1`を渡すことで、[Effectが`count`に依存する必要がなくなります。](/learn/removing-effect-dependencies#are-you-reading-some-state-to-calculate-the-next-state) この修正により、`count`が変更されるたびにインターバルをクリーンアップして再設定する必要がなくなります。

---

### 不要なオブジェクト依存関係の削除 {/*removing-unnecessary-object-dependencies*/}

Effectがレンダリング中に作成されたオブジェクトや関数に依存している場合、頻繁に実行される可能性があります。例えば、このEffectは、`options`オブジェクトが[毎回異なるため、](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)毎回再接続します：

```js {6-9,12,15}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { // 🚩 このオブジェクトは毎回新しく作成されます
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options); // Effect内で使用されます
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🚩 その結果、これらの依存関係は毎回異なります
  // ...
```

レンダリング中に作成されたオブジェクトを依存関係として使用するのは避けてください。代わりに、Effect内でオブジェクトを作成します：

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
      console.log('✅ "' + roomId + '"ルームに' + serverUrl + 'で接続中...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '"ルームから' + serverUrl + 'で切断されました');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

これで、`options`オブジェクトをEffect内で作成するようになり、Effect自体は`roomId`文字列にのみ依存します。

この修正により、入力に文字を入力してもチャットが再接続されません。オブジェクトが再作成されるのとは異なり、`roomId`のような文字列は別の値に設定されない限り変更されません。[依存関係の削除について詳しく読む。](/learn/removing-effect-dependencies)

---

### 不要な関数依存関係の削除 {/*removing-unnecessary-function-dependencies*/}

Effectがレンダリング中に作成されたオブジェクトや関数に依存している場合、頻繁に実行される可能性があります。例えば、このEffectは、`createOptions`関数が[毎回異なるため、](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)毎回再接続します：

```js {4-9,12,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() { // 🚩 この関数は毎回新しく作成されます
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions(); // Effect内で使用されます
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🚩 その結果、これらの依存関係は毎回異なります
  // ...
```

関数を毎回新しく作成すること自体は問題ではありません。それを最適化する必要はありません。しかし、依存関係として使用すると、毎回再レンダリング後にEffectが再実行されます。

レンダリング中に作成された関数を依存関係として使用するのは避けてください。代わりに、Effect内で関数を宣言します：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
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
      console.log('✅ "' + roomId + '"ルームに' + serverUrl + 'で接続中...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '"ルームから' + serverUrl + 'で切断されました');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

これで、`createOptions`関数をEffect内で定義するようになり、Effect自体は`roomId`文字列にのみ依存します。この修正により、入力に文字を入力してもチャットが再接続されません。関数が再作成されるのとは異なり、`roomId`のような文字列は別の値に設定されない限り変更されません。[依存関係の削除について詳しく読む。](/learn/removing-effect-dependencies)

---

### Effectから最新のpropsとstateを読み取る {/*reading-the-latest-props-and-state-from-an-effect*/}

<Wip>

このセクションでは、**まだリリースされていない実験的なAPI**について説明します。

</Wip>

デフォルトでは、Effectからリアクティブな値を読み取ると、その値の変更に「反応」する必要があります。ほとんどの依存関係に対して、これは望ましい動作です。

**しかし、時々、Effectから最新のpropsとstateを読み取りたいが、それに「反応」したくない場合があります。** 例えば、ページ訪問ごとにショッピングカート内のアイテム数をログに記録したいとします：

```js {3}
function Page({ url, shoppingCart }) {
  useEffect(() => {
    logVisit(url, shoppingCart.length);
  }, [url, shoppingCart]); // ✅ すべての依存関係が宣言されています
  // ...
}
```

**`url`の変更後に新しいページ訪問をログに記録したいが、`shoppingCart`が変更された場合には記録したくない場合はどうしますか？** 依存関係のルールを破ることなく`shoppingCart`を除外することはできません。しかし、Effect内のコードが変更に「反応」しないようにすることはできます。[`useEffectEvent`](/reference/react/experimental_useEffectEvent) Hookを使用して*Effectイベント*を宣言し、その中で`shoppingCart`を読み取るコードを移動します：

```js {2-4,7,8}
function Page({ url, shoppingCart }) {
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, shoppingCart.length)
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ すべての依存関係が宣言されています
  // ...
}
```

**Effectイベントはリアクティブではなく、Effectの依存関係から常に省略する必要があります。** これにより、非リアクティブなコード（propsとstateの最新の値を読み取ることができる）がその中に配置されます。`onVisit`内で`shoppingCart`を読み取ることで、`shoppingCart`がEffectを再実行しないようにします。

[Effectイベントがリアクティブなコードと非リアクティブなコードを分離する方法について詳しく読む。](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)

---

### サーバーとクライアントで異なるコンテンツを表示する {/*displaying-different-content-on-the-server-and-the-client*/}

アプリがサーバーレンダリングを使用している場合（[直接](/reference/react-dom/server)または[フレームワークを介して](/learn/start-a-new-react-project#production-grade-react-frameworks)）、コンポーネントは2つの異なる環境でレンダリングされます。サーバーでは、初期HTMLを生成するためにレンダリングされます。クライアントでは、Reactが再度レンダリングコードを実行し、そのHTMLにイベントハンドラをアタッチします。これは、[ハイドレーション](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html)が機能するためには、初期レンダリング出力がクライアントとサーバーで同一である必要があります。

稀に、クライアントで異なるコンテンツを表示する必要がある場合があります。例えば、アプリが[`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)からデータを読み取る場合、サーバーではそれを行うことはできません。これを実装する方法は次のとおりです：

```js
function MyComponent() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (didMount) {
    // ... クライアント専用のJSXを返します ...
  } else {
    // ... 初期のJSXを返します ...
  }
}
```

アプリが読み込まれている間、ユーザーは初期レンダリング出力を見ます。その後、読み込みとハイドレーションが完了すると、Effectが実行され、`didMount`が`true`に設定され、再レンダリングがトリガーされます。これにより、クライアント専用のレンダリング出力に切り替わります。Effectはサーバー上では実行されないため、初期サーバーレンダリング中は`didMount`が`false`でした。

このパターンは慎重に使用してください。接続が遅いユーザーは、初期コンテンツをかなりの時間（場合によっては数秒）見ることになるため、コンポーネントの外観に大きな変化を加えたくないでしょう。多くの場合、CSSを使用して異なるものを条件付きで表示することで、この必要性を回避できます。

---

## トラブルシューティング {/*troubleshooting*/}

### コンポーネントがマウントされたときにEffectが2回実行される {/*my-effect-runs-twice-when-the-component-mounts*/}

ストリクトモードがオンの場合、開発中にReactはセットアップとクリーンアップを実際のセットアップの前に一度追加で実行します。

これは、Effectのロジックが正しく実装されていることを確認するためのストレステストです。これが目に見える問題を引き起こす場合、クリーンアップ関数にいくつかのロジックが欠けています。クリーンアップ関数は、セットアップ関数が行っていることを停止または元に戻す必要があります。基本的なルールは、ユーザーがセットアップが一度呼び出された場合（本番環境のように）と、セットアップ → クリーンアップ → セットアップのシーケンス（開発環境のように）の間で区別できないようにすることです。

[これがバグを見つけるのにどのように役立つか](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)および[ロジックを修正する方法](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)について詳しく読む。

---

### Effectが毎回の再レンダリング後に実行される {/*my-effect-runs-after-every-re-render*/}

まず、依存関係配列を指定し忘れていないか確認してください：

```js {3}
useEffect(() => {
  // ...
}); // 🚩 依存関係配列がない：毎回のレンダリング後に再実行されます！
```

依存関係配列を指定しているのにEffectがループで再実行される場合、それは依存関係の1つが毎回の再レンダリングで異なるためです。

この問題をデバッグするには、依存関係を手動でコンソールにログ出力します：

```js {5}
  useEffect(() => {
    // ..
  }, [serverUrl, roomId]);

  console.log([serverUrl, roomId]);
```

異なる再レンダリングからの配列を右クリックして「グローバル変数として保存」を選択します。最初の配列が`temp1`として保存され、2番目の配列が`temp2`として保存されたと仮定すると、ブラウザのコンソールを使用して両方の配列の各依存関係が同じかどうかを確認できます：

```js
Object.is(temp1[0], temp2[0]); // 配列間の最初の依存関係は同じですか？
Object.is(temp1[1], temp2[1]); // 配列間の2番目の依存関係は同じですか？
Object.is(temp1[2], temp2[2]); // ... すべての依存関係について同様に ...
```

毎回の再レンダリングで異なる依存関係を見つけたら、通常は次の方法のいずれかで修正できます：

- [Effectから前のstateに基づいてstateを更新する](#updating-state-based-on-previous-state-from-an-effect)
- [不要なオブジェクト依存関係の削除](#removing-unnecessary-object-dependencies)
- [不要な関数依存関係の削除](#removing-unnecessary-function-dependencies)
- [Effectから最新のpropsとstateを読み取る](#reading-the-latest-props-and-state-from-an-effect)

最後の手段として（これらの方法が役立たなかった場合）、その作成を[`useMemo`](/reference/react/useMemo#memoizing-a-dependency-of-another-hook)または[`useCallback`](/reference/react/useCallback#preventing-an-effect-from-firing-too-often)（関数の場合）でラップします。

---

### Effectが無限ループで再実行され続ける {/*my-effect-keeps-re-running-in-an-infinite-cycle*/}

Effectが無限ループで実行される場合、次の2つのことが真実である必要があります：

- Effectがstateを更新しています。
- そのstateが再レンダリングを引き起こし、それがEffectの依存関係を変更します。

問題を修正する前に、Effectが外部システム（DOM、ネットワーク、サードパーティのウィジェットなど）に接続しているかどうかを考えてください。Effectがstateを設定する必要があるのはなぜですか？それはその外部システムと同期していますか？それともアプリケーションのデータフローを管理しようとしていますか？

外部システムがない場合、[Effectを完全に削除することが](/learn/you-might-not-need-an-effect)ロジックを簡素化するかどうかを検討してください。

本当に外部システムと同期している場合、Effectがstateを更新する理由と条件について考えてください。何かが変更されてコンポーネントの視覚的な出力に影響を与えましたか？レンダリングに使用されないデータを追跡する必要がある場合、[ref](/reference/react/useRef#referencing-a-value-with-a-ref)（再レンダリングをトリガーしない）がより適切かもしれません。Effectが必要以上にstateを更新し（再レンダリングをトリガーし）ないことを確認してください。

最後に、Effectが適切なタイミングでstateを更新しているが、それでもループが発生する場合、それはそのstateの更新がEffectの依存関係の1つを変更するためです。[依存関係の変更をデバッグする方法を読む。](/reference/react/useEffect#my-effect-runs-after-every-re-render)

---

### コンポーネントがアンマウントされていないのにクリーンアップロジックが実行される {/*my-cleanup-logic-runs-even-though-my-component-didnt-unmount*/}

クリーンアップ関数はアンマウント時だけでなく、依存関係が変更された再レンダリングの前にも実行されます。さらに、開発中には、Reactが[コンポーネントのマウント直後にセットアップ+クリーンアップを一度追加で実行します。](#my-effect-runs-twice-when-the-component-mounts)

クリーンアップコードに対応するセットアップコードがない場合、それは通常コードの臭いです：

```js {2-5}
useEffect(() => {
  // 🔴 対応するセットアップロジックのないクリーンアップロジックは避けてください
  return () => {
    doSomething();
  };
}, []);
```

クリーンアップロジックはセットアップロジックと「対称的」であり、セットアップが行ったことを停止または元に戻す必要があります：

```js {2-3,5}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
```

[Effectのライフサイクルがコンポーネントのライフサイクルとどのように異なるかを学びます。](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)

---

### Effectが視覚的なことを行っている場合、実行前にちらつきが見える {/*my-effect-does-something-visual-and-i-see-a-flicker-before-it-runs*/}

Effectがブラウザの[画面描画をブロックする必要がある場合、](/learn/render-and-commit#epilogue-browser-paint) `useEffect`を[`useLayoutEffect`](/reference/react/useLayoutEffect)に置き換えます。これは、**ほとんどのEffectには必要ありません。** Effectをブラウザの描画前に実行する必要がある場合にのみ必要です。例えば、ツールチップを測定して位置決めする場合などです。