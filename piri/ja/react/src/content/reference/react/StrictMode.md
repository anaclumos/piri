---
title: <StrictMode>
---

<Intro>

`<StrictMode>`を使用すると、開発中にコンポーネントの一般的なバグを早期に発見できます。


```js
<StrictMode>
  <App />
</StrictMode>
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `<StrictMode>` {/*strictmode*/}

`StrictMode`を使用して、コンポーネントツリー内の追加の開発動作と警告を有効にします：

```js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

[以下の例を参照してください。](#usage)

Strict Modeは以下の開発専用の動作を有効にします：

- コンポーネントが不純なレンダリングによって引き起こされるバグを見つけるために[追加で再レンダリングされます](#fixing-bugs-found-by-double-rendering-in-development)。
- コンポーネントがエフェクトのクリーンアップが不足していることによって引き起こされるバグを見つけるために[エフェクトを追加で再実行します](#fixing-bugs-found-by-re-running-effects-in-development)。
- コンポーネントが[非推奨のAPIの使用についてチェックされます](#fixing-deprecation-warnings-enabled-by-strict-mode)。

#### Props {/*props*/}

`StrictMode`はプロパティを受け付けません。

#### 注意点 {/*caveats*/}

* `<StrictMode>`でラップされたツリー内でStrict Modeをオプトアウトする方法はありません。これにより、`<StrictMode>`内のすべてのコンポーネントがチェックされることが保証されます。製品に取り組む2つのチームがチェックの価値について意見が分かれる場合、合意に達するか、ツリー内で`<StrictMode>`を下げる必要があります。

---

## 使用法 {/*usage*/}

### アプリ全体にStrict Modeを有効にする {/*enabling-strict-mode-for-entire-app*/}

Strict Modeは、`<StrictMode>`コンポーネント内のコンポーネントツリー全体に対して追加の開発専用チェックを有効にします。これらのチェックは、開発プロセスの早い段階でコンポーネントの一般的なバグを見つけるのに役立ちます。

アプリ全体にStrict Modeを有効にするには、ルートコンポーネントをレンダリングするときに`<StrictMode>`でラップします：

```js {6,8}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

特に新しく作成されたアプリの場合、アプリ全体をStrict Modeでラップすることをお勧めします。`createRoot`を呼び出すフレームワークを使用している場合は、Strict Modeを有効にする方法についてそのドキュメントを確認してください。

Strict Modeのチェックは**開発中にのみ実行されますが、**コードに既に存在するバグを見つけるのに役立ちますが、これらのバグは本番環境で再現するのが難しい場合があります。Strict Modeを使用すると、ユーザーが報告する前にバグを修正できます。

<Note>

Strict Modeは開発中に以下のチェックを有効にします：

- コンポーネントが不純なレンダリングによって引き起こされるバグを見つけるために[追加で再レンダリングされます](#fixing-bugs-found-by-double-rendering-in-development)。
- コンポーネントがエフェクトのクリーンアップが不足していることによって引き起こされるバグを見つけるために[エフェクトを追加で再実行します](#fixing-bugs-found-by-re-running-effects-in-development)。
- コンポーネントが[非推奨のAPIの使用についてチェックされます](#fixing-deprecation-warnings-enabled-by-strict-mode)。

**これらのチェックはすべて開発専用であり、本番ビルドには影響しません。**

</Note>

---

### アプリの一部にStrict Modeを有効にする {/*enabling-strict-mode-for-a-part-of-the-app*/}

アプリケーションの任意の部分にStrict Modeを有効にすることもできます：

```js {7,12}
import { StrictMode } from 'react';

function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </>
  );
}
```

この例では、`Header`と`Footer`コンポーネントに対してStrict Modeのチェックは実行されません。しかし、`Sidebar`と`Content`、およびそれらの内部のすべてのコンポーネントに対しては、どれだけ深くてもチェックが実行されます。

---

### 開発中の二重レンダリングによって見つかったバグの修正 {/*fixing-bugs-found-by-double-rendering-in-development*/}

[Reactは、あなたが書いたすべてのコンポーネントが純粋な関数であると仮定します。](/learn/keeping-components-pure) これは、Reactコンポーネントが同じ入力（props、state、context）を与えられた場合、常に同じJSXを返す必要があることを意味します。

このルールを破るコンポーネントは予測不可能な動作をし、バグを引き起こします。偶然の不純なコードを見つけるのを助けるために、Strict Modeは開発中に**一部の関数を2回呼び出します。** これには以下が含まれます：

- コンポーネント関数の本体（イベントハンドラ内のコードは含まれません）
- [`useState`](/reference/react/useState)、[`set`関数](/reference/react/useState#setstate)、[`useMemo`](/reference/react/useMemo)、または[`useReducer`](/reference/react/useReducer)に渡す関数
- 一部のクラスコンポーネントメソッド（[`constructor`](/reference/react/Component#constructor)、[`render`](/reference/react/Component#render)、[`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate)など） ([全リストを見る](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects))

関数が純粋であれば、2回実行してもその動作は変わりません。なぜなら、純粋な関数は毎回同じ結果を生成するからです。しかし、関数が不純である場合（例えば、受け取ったデータを変更する場合）、2回実行すると目立つようになります（それが不純である理由です！）。これにより、バグを早期に発見して修正することができます。

**Strict Modeでの二重レンダリングがバグを早期に発見するのにどのように役立つかを示す例を以下に示します。**

この`StoryTray`コンポーネントは、`stories`の配列を受け取り、最後に「Create Story」アイテムを追加します：

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

上記のコードにはミスがあります。しかし、初期の出力が正しいように見えるため、見逃しやすいです。

このミスは、`StoryTray`コンポーネントが複数回再レンダリングされるとより目立つようになります。例えば、`StoryTray`がホバーするたびに異なる背景色で再レンダリングされるようにしましょう：

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

`StoryTray`コンポーネントにホバーするたびに、「Create Story」がリストに再度追加されることに気づくでしょう。コードの意図は一度だけ追加することでした。しかし、`StoryTray`はpropsから受け取った`stories`配列を直接変更しています。`StoryTray`がレンダリングされるたびに、同じ配列の末尾に「Create Story」を再度追加します。言い換えれば、`StoryTray`は純粋な関数ではありません。複数回実行すると異なる結果が生成されます。

この問題を修正するには、配列のコピーを作成し、そのコピーを変更する必要があります：

```js {2}
export default function StoryTray({ stories }) {
  const items = stories.slice(); // 配列をクローン
  // ✅ 良い: 新しい配列にプッシュ
  items.push({ id: 'create', label: 'Create Story' });
```

これにより、[`StoryTray`関数を純粋にします。](/learn/keeping-components-pure) 呼び出されるたびに、新しい配列のコピーを変更するだけで、外部のオブジェクトや変数には影響を与えません。これでバグは解決しますが、コンポーネントをより頻繁に再レンダリングする必要があり、その動作に問題があることが明らかになります。

**元の例では、バグは明らかではありませんでした。今度は元の（バグのある）コードを`<StrictMode>`でラップしてみましょう：**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

**Strict Modeは常にレンダリング関数を2回呼び出すため、すぐにミスがわかります**（「Create Story」が2回表示されます）。これにより、プロセスの早い段階でこのようなミスに気づくことができます。Strict Modeでコンポーネントを修正すると、以前のホバー機能のような将来の多くの本番バグも修正されます：

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories.slice(); // 配列をクローン
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Strict Modeがなければ、バグを見逃しやすかったでしょう。Strict Modeは同じバグをすぐに見つけることができました。Strict Modeは、チームやユーザーにバグを報告する前にバグを見つけるのに役立ちます。

[コンポーネントを純粋に保つ方法についてさらに読む。](/learn/keeping-components-pure)

<Note>

React DevToolsをインストールしている場合、2回目のレンダリング呼び出し中の`console.log`呼び出しは少し薄暗く表示されます。React DevToolsには、これらを完全に抑制する設定（デフォルトではオフ）もあります。

</Note>

---

### 開発中にエフェクトを再実行することで見つかったバグの修正 {/*fixing-bugs-found-by-re-running-effects-in-development*/}

Strict Modeは[エフェクト](/learn/synchronizing-with-effects)のバグを見つけるのにも役立ちます。

すべてのエフェクトにはセットアップコードがあり、クリーンアップコードがある場合もあります。通常、Reactはコンポーネントが*マウント*（画面に追加）されたときにセットアップを呼び出し、コンポーネントが*アンマウント*（画面から削除）されたときにクリーンアップを呼び出します。その後、依存関係が前回のレンダリングから変更された場合、Reactは再度クリーンアップとセットアップを呼び出します。

Strict Modeがオンの場合、Reactは開発中に**すべてのエフェクトに対して追加のセットアップ+クリーンアップサイクルを実行します。** これは驚くかもしれませんが、手動でキャッチするのが難しい微妙なバグを明らかにするのに役立ちます。

**Strict Modeでエフェクトを再実行することでバグを早期に発見する方法を示す例を以下に示します。**

次の例では、コンポーネントをチャットに接続します：

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // 実際の実装ではサーバーに接続します
  return {
    connect() {
      console.log('✅ "' + roomId + '"ルームに接続中 ' + serverUrl + '...');
      connections++;
      console.log('アクティブな接続数: ' + connections);
    },
    disconnect() {
      console.log('❌ "' + roomId + '"ルームから切断 ' + serverUrl);
      connections--;
      console.log('アクティブな接続数: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

このコードには問題がありますが、すぐには明らかではないかもしれません。

問題をより明確にするために、機能を実装しましょう。以下の例では、`roomId`はハードコーディングされていません。代わりに、ユーザーはドロップダウンから接続したい`roomId`を選択できます。「チャットを開く」をクリックし、その後、異なるチャットルームを順番に選択します。コンソールでアクティブな接続数を確認してください：

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        チャットルームを選択:{' '}
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
        {show ? 'チャットを閉じる' : 'チャットを開く'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // 実際の実装ではサーバーに接続します
  return {
    connect() {
      console.log('✅ "' + roomId + '"ルームに接続中 ' + serverUrl + '...');
      connections++;
      console.log('アクティブな接続数: ' + connections);
    },
    disconnect() {
      console.log('❌ "' + roomId + '"ルームから切断 ' + serverUrl);
      connections--;
      console.log('アクティブな接続数: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

アクティブな接続数が常に増え続けることに気づくでしょう。実際のアプリでは、これがパフォーマンスやネットワークの問題を引き起こします。問題は、[エフェクトにクリーンアップ関数が欠けていることです：](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)

```js {4}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
```

エフェクトが自分自身を「クリーンアップ」し、古い接続を破棄するようになったので、リークは解決されました。しかし、問題はさらに多くの機能（セレクトボックス）を追加するまで明らかにはなりませんでした。

**元の例では、バグは明らかではありませんでした。今度は元の（バグのある）コードを`<StrictMode>`でラップしてみましょう：**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // 実際の実装ではサーバーに接続します
  return {
    connect() {
      console.log('✅ "' + roomId + '"ルームに接続中 ' + serverUrl + '...');
      connections++;
      console.log('アクティブな接続数: ' + connections);
    },
    disconnect() {
      console.log('❌ "' + roomId + '"ルームから切断 ' + serverUrl);
      connections--;
      console.log('アクティブな接続数: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

**Strict Modeでは、すぐに問題があることがわかります**（アクティブな接続数が2にジャンプします）。Strict Modeはすべてのエフェクトに対して追加のセットアップ+クリーンアップサイクルを実行します。このエフェクトにはクリーンアップロジックがないため、追加の接続を作成しますが、それを破棄しません。これは、クリーンアップ関数が欠けていることを示しています。

Strict Modeは、プロセスの早い段階でこのようなミスに気づくことができます。Strict Modeでエフェクトを修正することで、以前のセレクトボックスのような将来の多くの本番バグも修正されます：

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

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
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        チャットルームを選択:{' '}
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
        {show ? 'チャットを閉じる' : 'チャットを開く'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // 実際の実装ではサーバーに接続します
  return {
    connect() {
      console.log('✅ "' + roomId + '"ルームに接続中 ' + serverUrl + '...');
      connections++;
      console.log('アクティブな接続数: ' + connections);
    },
    disconnect() {
      console.log('❌ "' + roomId + '"ルームから切断 ' + serverUrl);
      connections--;
      console.log('アクティブな接続数: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

コンソールのアクティブな接続数が増え続けないことに気づくでしょう。

Strict Modeがなければ、エフェクトにクリーンアップが必要であることを見逃しやすかったでしょう。開発中にエフェクトの*セットアップ → クリーンアップ → セットアップ*を実行することで、Strict Modeはクリーンアップロジックの欠如をより目立たせました。

[エフェクトのクリーンアップを実装する方法についてさらに読む。](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---

### Strict Modeで有効にされた非推奨警告の修正 {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}

Reactは、`<StrictMode>`ツリー内のどこかでこれらの非推奨APIのいずれかが使用されている場合に警告します：

* [`findDOMNode`](/reference/react-dom/findDOMNode)。 [代替案を見る。](https://reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)
* `UNSAFE_`クラスライフサイクルメソッド（[`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount)など）。 [代替案を見る。](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles) 
* レガシーコンテキスト（[`childContextTypes`](/reference/react/Component#static-childcontexttypes)、[`contextTypes`](/reference/react/Component#static-contexttypes)、および[`getChildContext`](/reference/react/Component#getchildcontext)）。 [代替案を見る。](/reference/react/createContext)
* レガシー文字列リファレンス（[`this.refs`](/reference/react/Component#refs)）。 [代替案を見る。](https://reactjs.org/docs/strict-mode.html#warning-about-legacy-string-ref-api-usage)

これらのAPIは主に古い[クラスコンポーネント](/reference/react/Component)で使用されるため、現代のアプリではほとんど見られません。