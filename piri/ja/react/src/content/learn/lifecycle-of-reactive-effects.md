---
title: リアクティブエフェクトのライフサイクル
---

<Intro>

エフェクトはコンポーネントとは異なるライフサイクルを持っています。コンポーネントはマウント、更新、アンマウントすることがありますが、エフェクトは2つのことしかできません：何かを同期し始めることと、後でそれを同期しないようにすることです。このサイクルは、エフェクトが時間とともに変化するプロップスやステートに依存している場合、複数回発生することがあります。Reactは、エフェクトの依存関係を正しく指定したかどうかをチェックするリンタールールを提供しています。これにより、エフェクトが最新のプロップスとステートに同期され続けます。

</Intro>

<YouWillLearn>

- エフェクトのライフサイクルがコンポーネントのライフサイクルとどのように異なるか
- 各エフェクトを個別に考える方法
- エフェクトが再同期する必要があるときとその理由
- エフェクトの依存関係がどのように決定されるか
- 値がリアクティブであることの意味
- 空の依存関係配列の意味
- Reactがリンターを使用して依存関係が正しいことを確認する方法
- リンターと意見が合わないときにどうするか

</YouWillLearn>

## エフェクトのライフサイクル {/*the-lifecycle-of-an-effect*/}

すべてのReactコンポーネントは同じライフサイクルを経ます：

- コンポーネントは画面に追加されるときに_マウント_します。
- コンポーネントは新しいプロップスやステートを受け取るときに_更新_します。通常、これはインタラクションに応じて行われます。
- コンポーネントは画面から削除されるときに_アンマウント_します。

**これはコンポーネントについて考える良い方法ですが、エフェクトについて考える方法ではありません。** 代わりに、各エフェクトをコンポーネントのライフサイクルから独立して考えるようにしてください。エフェクトは、現在のプロップスとステートに[外部システムを同期する](/learn/synchronizing-with-effects)方法を記述します。コードが変更されると、同期が必要になる頻度が増減します。

この点を説明するために、コンポーネントをチャットサーバーに接続するエフェクトを考えてみましょう：

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

エフェクトの本体は、**同期を開始する方法**を指定します：

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

エフェクトが返すクリーンアップ関数は、**同期を停止する方法**を指定します：

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

直感的には、Reactがコンポーネントがマウントされるときに**同期を開始し**、アンマウントされるときに**同期を停止する**と考えるかもしれません。しかし、これは話の終わりではありません！時には、コンポーネントがマウントされたままである間に**複数回同期を開始および停止する**必要がある場合もあります。

なぜこれが必要なのか、いつそれが起こるのか、そしてどのようにこの動作を制御できるのかを見てみましょう。

<Note>

一部のエフェクトはクリーンアップ関数をまったく返しません。[多くの場合、](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)クリーンアップ関数を返すことを望むでしょうが、返さない場合、Reactは空のクリーンアップ関数を返したかのように振る舞います。

</Note>

### なぜ同期が複数回必要になるのか {/*why-synchronization-may-need-to-happen-more-than-once*/}

この`ChatRoom`コンポーネントがユーザーがドロップダウンで選択する`roomId`プロップを受け取ると想像してみてください。最初にユーザーが`"general"`ルームを`roomId`として選択したとしましょう。アプリは`"general"`チャットルームを表示します：

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

UIが表示された後、Reactはエフェクトを実行して**同期を開始します。** それは`"general"`ルームに接続します：

```js {3,4}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // "general"ルームに接続
    connection.connect();
    return () => {
      connection.disconnect(); // "general"ルームから切断
    };
  }, [roomId]);
  // ...
```

ここまでは順調です。

その後、ユーザーがドロップダウンで別のルーム（例えば`"travel"`）を選択します。まず、ReactはUIを更新します：

```js {1}
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

次に何が起こるべきか考えてみてください。ユーザーはUIで`"travel"`が選択されたチャットルームを見ています。しかし、前回実行されたエフェクトはまだ`"general"`ルームに接続されています。**`roomId`プロップが変更されたため、以前のエフェクトが行ったこと（`"general"`ルームへの接続）はもはやUIと一致しません。**

この時点で、Reactに次の2つのことを行ってほしいと思います：

1. 古い`roomId`との同期を停止する（`"general"`ルームから切断）
2. 新しい`roomId`との同期を開始する（`"travel"`ルームに接続）

**幸運なことに、これらのことをReactに教えています！** エフェクトの本体は同期を開始する方法を指定し、クリーンアップ関数は同期を停止する方法を指定します。Reactが今すべきことは、それらを正しい順序で、正しいプロップスとステートで呼び出すことだけです。具体的にどのように行われるか見てみましょう。

### Reactがエフェクトを再同期する方法 {/*how-react-re-synchronizes-your-effect*/}

`ChatRoom`コンポーネントが新しい`roomId`プロップの値を受け取ったことを思い出してください。以前は`"general"`でしたが、今は`"travel"`です。Reactはエフェクトを再同期して、異なるルームに再接続する必要があります。

**同期を停止するために、** Reactは`"general"`ルームに接続した後にエフェクトが返したクリーンアップ関数を呼び出します。`roomId`が`"general"`だったため、クリーンアップ関数は`"general"`ルームから切断します：

```js {6}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // "general"ルームに接続
    connection.connect();
    return () => {
      connection.disconnect(); // "general"ルームから切断
    };
    // ...
```

次に、Reactはこのレンダー中に提供されたエフェクトを実行します。今回は`roomId`が`"travel"`なので、`"travel"`チャットルームに**同期を開始**します（そのクリーンアップ関数が最終的に呼び出されるまで）：

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // "travel"ルームに接続
    connection.connect();
    // ...
```

これにより、ユーザーがUIで選択したルームに接続されます。災害回避！

コンポーネントが異なる`roomId`で再レンダーされるたびに、エフェクトは再同期されます。例えば、ユーザーが`roomId`を`"travel"`から`"music"`に変更したとしましょう。Reactは再びエフェクトを**同期停止**し、そのクリーンアップ関数を呼び出して`"travel"`ルームから切断します。次に、新しい`roomId`プロップでエフェクトの本体を実行して再び**同期開始**します（`"music"`ルームに接続）。

最後に、ユーザーが別の画面に移動すると、`ChatRoom`はアンマウントされます。これで接続を維持する必要はありません。Reactはエフェクトを**最後に同期停止**し、`"music"`チャットルームから切断します。

### エフェクトの視点から考える {/*thinking-from-the-effects-perspective*/}

`ChatRoom`コンポーネントの視点から起こったすべてのことを振り返ってみましょう：

1. `ChatRoom`が`roomId`を`"general"`に設定してマウントされました
1. `ChatRoom`が`roomId`を`"travel"`に設定して更新されました
1. `ChatRoom`が`roomId`を`"music"`に設定して更新されました
1. `ChatRoom`がアンマウントされました

コンポーネントのライフサイクルの各ポイントで、エフェクトは異なることを行いました：

1. エフェクトが`"general"`ルームに接続しました
1. エフェクトが`"general"`ルームから切断し、`"travel"`ルームに接続しました
1. エフェクトが`"travel"`ルームから切断し、`"music"`ルームに接続しました
1. エフェクトが`"music"`ルームから切断しました

次に、エフェクト自体の視点から何が起こったかを考えてみましょう：

```js
  useEffect(() => {
    // エフェクトがroomIdで指定されたルームに接続しました...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...切断するまで
      connection.disconnect();
    };
  }, [roomId]);
```

このコードの構造は、非重複の時間帯の連続として何が起こったかを見るようにインスピレーションを与えるかもしれません：

1. エフェクトが`"general"`ルームに接続しました（切断するまで）
1. エフェクトが`"travel"`ルームに接続しました（切断するまで）
1. エフェクトが`"music"`ルームに接続しました（切断するまで）

以前はコンポーネントの視点から考えていました。コンポーネントの視点から見ると、エフェクトを「コールバック」や「ライフサイクルイベント」として特定の時間に発生するもの（「レンダー後」や「アンマウント前」など）と考える誘惑に駆られました。この考え方は非常に複雑になるので、避けるのが最善です。

**代わりに、常に単一の開始/停止サイクルに焦点を当ててください。コンポーネントがマウント、更新、アンマウントしているかどうかは関係ありません。必要なのは、同期を開始する方法と停止する方法を記述することだけです。うまくやれば、エフェクトは必要に応じて何度でも開始および停止することに耐えられるでしょう。**

これは、JSXを作成するレンダリングロジックを書くときにコンポーネントがマウントまたは更新しているかどうかを考えないことを思い出させるかもしれません。画面に表示されるべきものを記述し、Reactが[残りを理解します。](/learn/reacting-to-input-with-state)

### Reactがエフェクトが再同期できることを確認する方法 {/*how-react-verifies-that-your-effect-can-re-synchronize*/}

ここに遊べるライブ例があります。「Open chat」を押して`ChatRoom`コンポーネントをマウントします：

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

コンポーネントが最初にマウントされると、3つのログが表示されることに注意してください：

1. `✅ Connecting to "general" room at https://localhost:1234...` *(開発専用)*
1. `❌ Disconnected from "general" room at https://localhost:1234.` *(開発専用)*
1. `✅ Connecting to "general" room at https://localhost:1234...`

最初の2つのログは開発専用です。開発中、Reactは各コンポーネントを一度リマウントします。

**Reactは、開発中にエフェクトを強制的に再同期させることで、エフェクトが再同期できることを確認します。** これは、ドアのロックが機能するかどうかを確認するためにドアを一度開け閉めすることを思い出させるかもしれません。Reactは、開発中にエフェクトを一度余分に開始および停止して、[クリーンアップがうまく実装されていることを確認します。](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

エフェクトが実際に再同期する主な理由は、使用するデータが変更された場合です。上記のサンドボックスで、選択されたチャットルームを変更します。`roomId`が変更されると、エフェクトが再同期することに注意してください。

しかし、再同期が必要なより珍しいケースもあります。例えば、チャットが開いている間に上記のサンドボックスで`serverUrl`を編集してみてください。エフェクトがコードの編集に応じて再同期することに注意してください。将来的には、Reactは再同期に依存する機能を追加するかもしれません。

### Reactがエフェクトを再同期する必要があることを知る方法 {/*how-react-knows-that-it-needs-to-re-synchronize-the-effect*/}

Reactが`roomId`の変更後にエフェクトを再同期する必要があることをどうやって知ったのか疑問に思うかもしれません。それは*あなたがReactに*そのコードが`roomId`に依存していることを、依存関係のリストに含めることで伝えたからです。](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies)

```js {1,3,8}
function ChatRoom({ roomId }) { // roomIdプロップは時間とともに変化する可能性があります
  useEffect(() => {
   
const connection = createConnection(serverUrl, roomId); // このエフェクトはroomIdを読み取ります
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // したがって、このエフェクトがroomIdに「依存している」ことをReactに伝えます
  // ...
```

この仕組みは次の通りです：

1. `roomId`がプロップであることを知っており、それは時間とともに変化する可能性があります。
2. エフェクトが`roomId`を読み取ることを知っており（そのロジックが後で変わる可能性のある値に依存しています）。
3. これが理由で、エフェクトの依存関係として指定しました（`roomId`が変わると再同期するように）。

コンポーネントが再レンダーされるたびに、Reactは渡された依存関係の配列を確認します。配列内の値のいずれかが前回のレンダー時に渡された値と異なる場合、Reactはエフェクトを再同期します。

例えば、初回レンダー時に`["general"]`を渡し、次のレンダー時に`["travel"]`を渡した場合、Reactは`"general"`と`"travel"`を比較します。これらは異なる値です（[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)で比較されます）、したがってReactはエフェクトを再同期します。一方、コンポーネントが再レンダーされても`roomId`が変わらなかった場合、エフェクトは同じルームに接続されたままになります。

### 各エフェクトは別々の同期プロセスを表す {/*each-effect-represents-a-separate-synchronization-process*/}

エフェクトに無関係なロジックを追加するのは避けてください。これは、既に書いたエフェクトと同時に実行する必要があるからです。例えば、ユーザーがルームを訪れたときにアナリティクスイベントを送信したいとします。既に`roomId`に依存するエフェクトがあるので、そこにアナリティクスの呼び出しを追加したくなるかもしれません：

```js {3}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

しかし、後でこのエフェクトに再接続が必要な別の依存関係を追加すると想像してみてください。このエフェクトが再同期すると、同じルームに対して`logVisit(roomId)`も呼び出されますが、これは意図していません。訪問のログは**接続とは別のプロセス**です。これらを別々のエフェクトとして書きます：

```js {2-4}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]);
  // ...
}
```

**コード内の各エフェクトは、別々で独立した同期プロセスを表すべきです。**

上記の例では、1つのエフェクトを削除しても他のエフェクトのロジックは壊れません。これは、それらが異なるものを同期していることを示す良い指標であり、それらを分割するのが理にかなっています。一方、まとまったロジックを別々のエフェクトに分割すると、コードは「きれい」に見えるかもしれませんが、[保守が難しくなります。](/learn/you-might-not-need-an-effect#chains-of-computations) したがって、プロセスが同じか別かを考えるべきであり、コードがきれいに見えるかどうかではありません。

## エフェクトはリアクティブな値に「反応」する {/*effects-react-to-reactive-values*/}

エフェクトは2つの変数（`serverUrl`と`roomId`）を読み取りますが、依存関係として指定したのは`roomId`だけです：

```js {5,10}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

なぜ`serverUrl`は依存関係として必要ないのでしょうか？

これは、`serverUrl`が再レンダーによって変更されないためです。コンポーネントが何度再レンダーされても、なぜ再レンダーされるかに関係なく、常に同じです。`serverUrl`が変更されないため、依存関係として指定する意味がありません。結局のところ、依存関係は時間とともに変化する場合にのみ何かを行います！

一方、`roomId`は再レンダー時に異なる可能性があります。**プロップス、ステート、およびコンポーネント内で宣言された他の値は、レンダリング中に計算され、Reactのデータフローに参加するため、_リアクティブ_です。**

もし`serverUrl`がステート変数であれば、それはリアクティブです。リアクティブな値は依存関係に含める必要があります：

```js {2,5,10}
function ChatRoom({ roomId }) { // プロップスは時間とともに変化します
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // ステートは時間とともに変化する可能性があります

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // エフェクトはプロップスとステートを読み取ります
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // したがって、このエフェクトがプロップスとステートに「依存している」ことをReactに伝えます
  // ...
}
```

`serverUrl`を依存関係として含めることで、変更後にエフェクトが再同期されることを保証します。

選択されたチャットルームを変更したり、上記のサンドボックスでサーバーURLを編集してみてください：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
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

リアクティブな値（`roomId`や`serverUrl`）を変更するたびに、エフェクトはチャットサーバーに再接続します。

### 空の依存関係を持つエフェクトの意味 {/*what-an-effect-with-empty-dependencies-means*/}

`serverUrl`と`roomId`の両方をコンポーネントの外に移動した場合はどうなりますか？

```js {1,2}
const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ すべての依存関係が宣言されています
  // ...
}
```

今、エフェクトのコードは*リアクティブな値*を使用していないため、依存関係は空（`[]`）にすることができます。

コンポーネントの視点から考えると、空の`[]`依存関係配列は、このエフェクトがコンポーネントがマウントされたときにチャットルームに接続し、アンマウントされたときに切断することを意味します。（Reactは依然として[開発中にエフェクトを一度余分に再同期します。](#how-react-verifies-that-your-effect-can-re-synchronize) これはロジックをストレステストするためです。）

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
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

しかし、[エフェクトの視点から考えると、](#thinking-from-the-effects-perspective)マウントやアンマウントについて考える必要はありません。重要なのは、エフェクトが同期を開始および停止する方法を指定したことです。今日、リアクティブな依存関係はありません。しかし、将来的にユーザーが`roomId`や`serverUrl`を変更できるようにしたい場合（それらがリアクティブになる）、エフェクトのコードは変更されません。依存関係にそれらを追加するだけです。

### コンポーネント本体で宣言されたすべての変数はリアクティブです {/*all-variables-declared-in-the-component-body-are-reactive*/}

プロップスやステートだけがリアクティブな値ではありません。それらから計算された値もリアクティブです。プロップスやステートが変更されると、コンポーネントは再レンダーされ、それらから計算された値も変更されます。これが、エフェクトが使用するコンポーネント本体のすべての変数がエフェクトの依存関係リストに含まれるべき理由です。

ユーザーがドロップダウンでチャットサーバーを選択できるとしましょうが、設定でデフォルトサーバーも設定できるとします。設定ステートを[コンテキスト](/learn/scaling-up-with-reducer-and-context)に入れていると仮定し、そのコンテキストから`settings`を読み取ります。次に、プロップスから選択されたサーバーとデフォルトサーバーに基づいて`serverUrl`を計算します：

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomIdはリアクティブです
  const settings = useContext(SettingsContext); // settingsはリアクティブです
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrlはリアクティブです
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // エフェクトはroomIdとserverUrlを読み取ります
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // したがって、どちらかが変更されたときに再同期する必要があります！
  // ...
}
```

この例では、`serverUrl`はプロップスやステート変数ではありません。それはレンダリング中に計算される通常の変数です。しかし、それはレンダリング中に計算されるため、再レンダーによって変更される可能性があります。これがリアクティブである理由です。

**コンポーネント内のすべての値（プロップス、ステート、コンポーネント本体の変数を含む）はリアクティブです。リアクティブな値は再レンダー時に変更される可能性があるため、エフェクトの依存関係として含める必要があります。**

言い換えれば、エフェクトはコンポーネント本体のすべての値に「反応」します。

<DeepDive>

#### グローバルまたは可変の値は依存関係になり得るか？ {/*can-global-or-mutable-values-be-dependencies*/}

可変の値（グローバル変数を含む）はリアクティブではありません。

**[`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname)のような可変の値は依存関係になり得ません。** それは可変であり、Reactのレンダリングデータフローの完全に外部でいつでも変更される可能性があります。それを変更してもコンポーネントの再レンダーをトリガーしません。したがって、依存関係として指定しても、Reactはそれが変更されたときにエフェクトを再同期することを*知らない*でしょう。これはReactのルールを破ることにもなります。レンダリング中に可変データを読み取ること（依存関係を計算する際）は、[レンダリングの純粋性を損ないます。](/learn/keeping-components-pure) 代わりに、[`useSyncExternalStore`](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store)を使用して外部の可変値を読み取り、購読する必要があります。

**[`ref.current`](/reference/react/useRef#reference)のような可変の値やそれから読み取るものも依存関係になり得ません。** `useRef`から返されるrefオブジェクト自体は依存関係になり得ますが、その`current`プロパティは意図的に可変です。それは[再レンダーをトリガーせずに何かを追跡するために使用されます。](/learn/referencing-values-with-refs) しかし、それを変更しても再レンダーをトリガーしないため、それはリアクティブな値ではなく、Reactはそれが変更されたときにエフェクトを再実行することを知りません。

以下のページで学ぶように、リンターはこれらの問題を自動的にチェックします。

</DeepDive>

### Reactはすべてのリアクティブな値を依存関係として指定したことを確認します {/*react-verifies-that-you-specified-every-reactive-value-as-a-dependency*/}

リンターが[React用に設定されている場合、](/learn/editor-setup#linting)エフェクトのコードで使用されるすべてのリアクティブな値が依存関係として宣言されていることを確認します。例えば、これはリントエラーです。なぜなら、`roomId`と`serverUrl`の両方がリアクティブだからです：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomIdはリアクティブです
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrlはリアクティブです

  useEffect(() => {
    const connection = createConnection(serverUrl, room
Id);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- ここに問題があります！

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

これはReactのエラーのように見えるかもしれませんが、実際にはコードにバグがあることを指摘しています。`roomId`と`serverUrl`の両方が時間とともに変化する可能性がありますが、エフェクトがそれらが変わったときに再同期することを忘れています。ユーザーがUIで異なる値を選択しても、初期の`roomId`と`serverUrl`に接続されたままになります。

バグを修正するには、リンターの提案に従って`roomId`と`serverUrl`をエフェクトの依存関係として指定します：

```js {9}
function ChatRoom({ roomId }) { // roomIdはリアクティブです
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrlはリアクティブです
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // ✅ すべての依存関係が宣言されています
  // ...
}
```

上記のサンドボックスでこの修正を試してみてください。リンターエラーが消え、チャットが必要に応じて再接続されることを確認してください。

<Note>

一部のケースでは、Reactはコンポーネント内で宣言されている値が変更されないことを*知っています*。例えば、[`useState`から返される`set`関数](/reference/react/useState#setstate)や[`useRef`から返されるrefオブジェクト](/reference/react/useRef)は*安定しており*、再レンダー時に変更されないことが保証されています。安定した値はリアクティブではないため、リストから省略することができます。含めることは許可されていますが、それらは変更されないため、問題ありません。

</Note>

### 再同期したくない場合の対処法 {/*what-to-do-when-you-dont-want-to-re-synchronize*/}

前の例では、`roomId`と`serverUrl`を依存関係としてリストすることでリントエラーを修正しました。

**しかし、これらの値がリアクティブな値ではないことをリンターに「証明」することもできます。** つまり、それらが再レンダーの結果として*変更されることがない*ことを示します。例えば、`serverUrl`と`roomId`がレンダリングに依存せず、常に同じ値を持つ場合、それらをコンポーネントの外に移動できます。これで依存関係は不要になります：

```js {1,2,11}
const serverUrl = 'https://localhost:1234'; // serverUrlはリアクティブではありません
const roomId = 'general'; // roomIdはリアクティブではありません

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ すべての依存関係が宣言されています
  // ...
}
```

また、それらを*エフェクト内に*移動することもできます。それらはレンダリング中に計算されないため、リアクティブではありません：

```js {3,4,10}
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrlはリアクティブではありません
    const roomId = 'general'; // roomIdはリアクティブではありません
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ すべての依存関係が宣言されています
  // ...
}
```

**エフェクトはリアクティブなコードブロックです。** それらは、内部で読み取る値が変更されたときに再同期します。イベントハンドラとは異なり、エフェクトは必要に応じて何度も実行されます。

**依存関係を「選ぶ」ことはできません。** 依存関係には、エフェクト内で読み取るすべての[リアクティブな値](#all-variables-declared-in-the-component-body-are-reactive)を含める必要があります。リンターはこれを強制します。これが無限ループやエフェクトが頻繁に再同期する問題を引き起こすことがあります。これらの問題をリンターを抑制することで解決しないでください！代わりに次のことを試してください：

* **エフェクトが独立した同期プロセスを表していることを確認してください。** エフェクトが何も同期していない場合、[それは不要かもしれません。](/learn/you-might-not-need-an-effect) それが複数の独立したものを同期している場合、[それを分割します。](#each-effect-represents-a-separate-synchronization-process)

* **プロップスやステートの最新の値を読み取りたいが、エフェクトを再同期させたくない場合、** エフェクトをリアクティブな部分（エフェクト内に保持する）と非リアクティブな部分（_エフェクトイベント_と呼ばれるものに分離する）に分割できます。[イベントとエフェクトを分離する方法を読む。](/learn/separating-events-from-effects)

* **オブジェクトや関数を依存関係として使用することを避けてください。** レンダリング中にオブジェクトや関数を作成し、それをエフェクトから読み取る場合、それらは毎回異なります。これにより、エフェクトが毎回再同期します。[エフェクトから不要な依存関係を削除する方法を読む。](/learn/removing-effect-dependencies)

<Pitfall>

リンターは友達ですが、その力は限られています。リンターは依存関係が*間違っている*ときにのみ知っています。各ケースを解決する*最良の方法*は知りません。リンターが依存関係を提案しても、それを追加するとループが発生する場合、リンターを無視するべきではありません。エフェクト内（または外）のコードを変更して、その値がリアクティブでなくなり、依存関係として*必要なくなる*ようにする必要があります。

既存のコードベースがある場合、次のようにリンターを抑制するエフェクトがあるかもしれません：

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 このようにリンターを抑制するのは避けてください：
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

[次の](/learn/separating-events-from-effects) [ページ](/learn/removing-effect-dependencies)で、ルールを破らずにこのコードを修正する方法を学びます。修正する価値は常にあります！

</Pitfall>

<Recap>

- コンポーネントはマウント、更新、アンマウントできます。
- 各エフェクトは周囲のコンポーネントとは別のライフサイクルを持っています。
- 各エフェクトは、開始および停止できる別々の同期プロセスを記述します。
- エフェクトを読み書きするときは、コンポーネントの視点（マウント、更新、アンマウントの方法）ではなく、各個別のエフェクトの視点（同期の開始と停止の方法）から考えてください。
- コンポーネント本体で宣言された値は「リアクティブ」です。
- リアクティブな値は時間とともに変化する可能性があるため、エフェクトを再同期する必要があります。
- リンターは、エフェクト内で使用されるすべてのリアクティブな値が依存関係として指定されていることを確認します。
- リンターが指摘するすべてのエラーは正当です。ルールを破らずにコードを修正する方法は常にあります。

</Recap>

<Challenges>

#### キーストロークごとに再接続する問題を修正する {/*fix-reconnecting-on-every-keystroke*/}

この例では、`ChatRoom`コンポーネントはコンポーネントがマウントされたときにチャットルームに接続し、アンマウントされたときに切断し、異なるチャットルームを選択したときに再接続します。この動作は正しいので、維持する必要があります。

しかし、問題があります。メッセージボックス入力に入力するたびに、`ChatRoom`もチャットに再接続します。（コンソールをクリアして入力するとこれがわかります。）この問題を修正して、これが発生しないようにしてください。

<Hint>

このエフェクトには依存関係配列が必要かもしれません。どの依存関係が必要でしょうか？

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  });

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

<Solution>

このエフェクトには依存関係配列がまったくなかったため、再レンダーごとに再同期されました。まず、依存関係配列を追加します。次に、エフェクトが使用するすべてのリアクティブな値が配列に指定されていることを確認します。例えば、`roomId`はリアクティブ（プロップスであるため）なので、配列に含める必要があります。これにより、ユーザーが異なるルームを選択したときにチャットが再接続されます。一方、`serverUrl`はコンポーネントの外で定義されているため、配列に含める必要はありません。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

</Solution>

#### 同期のオンとオフを切り替える {/*switch-synchronization-on-and-off*/}

この例では、エフェクトがウィンドウの[`pointermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event)イベントにサブスクライブして、画面上のピンクのドットを移動させます。プレビューエリアにカーソルを合わせる（またはモバイルデバイスの場合は画面に触れる）と、ピンクのドットが動きを追従するのがわかります。

また、チェックボックスもあります。チェックボックスをオンにすると`canMove`ステート変数が切り替わりますが、このステート変数はコード内でどこにも使用されていません。あなたのタスクは、`canMove`が`false`（チェックボックスがオフ）のときにドットが動かなくなるようにコードを変更することです。チェックボックスを再びオンにすると（`canMove`が`true`に設定される）、ドットは再び動きを追従するべきです。つまり、ドットが動くかどうかはチェックボックスがチェックされているかどうかと同期している必要があります。

<Hint>

エフェクトを条件付きで宣言することはできません。しかし、エフェクト内のコードは条件を使用できます！

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
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

<Solution>

1つの解決策は、`setPosition`の呼び出しを`if (canMove) { ... }`条件にラップすることです：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

または、*イベントサブスクリプション*ロジックを`if (canMove) { ... }`条件にラップすることもできます：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    if (canMove) {
      window.addEventListener('pointermove', handleMove);
      return () => window.removeEventListener('pointermove', handleMove);
    }
  }, [canMove]);

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

これらのどちらの場合も、`canMove`はエフェクト内で読み取るリアクティブな変数です。これが依存関係リストに指定される必要がある理由です。これにより、`canMove`の値が変更されるたびにエフェクトが再同期されます。

</Solution>

#### 古い値のバグを調査する {/*investigate-a-stale-value-bug*/}

この例では、ピンクのドットはチェックボックスがオンのときに動き、チェックボックスがオフのときに動かなくなるはずです。このロジックは既に実装されています：`handleMove`イベントハンドラが`canMove`ステート変数をチェックします。

しかし、何らかの理由で、`handleMove`内の`canMove`ステート変数が「古い」ように見えます：チェックボックスをオフにしても常に`true`です。これはどうしてでしょうか？コードの間違いを見つけて修正してください。

<Hint>

リンタールールが抑制されている場合、それを削除してください！そこに問題があることが多いです。

</Hint>

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

<Solution>

元のコードの問題は、依存関係リンターを抑制していることでした。抑制を削除すると、`handleMove`関数が依存関係であることがわかります。これは理にかなっています：`handleMove`はコンポーネント本体内で宣言されているため、リアクティブな値です。すべてのリアクティブな値は依存関係として指定される必要があります。そうしないと、時間とともに古くなる可能性があります！

元のコードの著者は、エフェクトが依存していない（`[]`）とReactに「嘘をついて」いました。これが、`canMove`が変更された後（および`handleMove`とともに）エフェクトが再同期されなかった理由です。Reactがエフェクトを再同期しなかったため、リスナーとしてアタッチされた`handleMove`は初回レンダー時に作成された`handleMove`関数です。初回レンダー時には`canMove`が`true`だったため、初回レンダーの`handleMove`はその値を永遠に見ることになります。

**リンターを抑制しない限り、古い値の問題に遭遇することはありません。** このバグを解決する方法はいくつかありますが、常にリンターの抑制を削除することから始めるべきです。次に、リントエラーを修正するためにコードを変更します。

依存関係を`[handleMove]`に変更することもできますが、レンダーごとに新しく定義される関数であるため、依存関係配列を完全に削除することもできます。これにより、エフェクトは再レンダーごとに再同期されます：

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
  });

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

この解決策は機能しますが、理想的ではありません。エフェクト内に`console.log('Resubscribing')`を追加すると、再レンダーごとに再サブスクライブされることがわかります。再サブスクライブは高速ですが、それでも頻繁に行うのは避けたいものです。

より良い修正は、`handleMove`関数を*エフェクト内に*移動することです。これにより、`handleMove`はリアクティブな値ではなくなり、エフェクトは関数に依存しなくなります。代わりに、エフェクト内で読み取る`canMove`に依存する必要があります。これは、エフェクトが`canMove`の値と同期するようになるため、望んでいた動作に一致します：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

エフェクト本体に`console.log('Resubscribing')`を追加してみてください。これで、チェックボックスを切り替えたとき（`canMove`が変更されたとき）やコードを編集したときにのみ再サブスクライブされることがわかります。これにより、前のアプローチよりも優れています。

このタイプの問題に対するより一般的なアプローチについては、[イベントとエフェクトの分離](/learn/separating-events-from-effects)で学びます。

</Solution>

#### 接続の切り替えを修正する {/*fix-a-connection-switch*/}

この例では、`chat.js`のチャットサービスは`createEncryptedConnection`と`createUnencryptedConnection`の2つの異なるAPIを公開しています。ルート`App`コンポーネントはユーザーに暗号化を使用するかどうかを選択させ、その後、対応するAPIメソッドを`createConnection`プロップとして子`ChatRoom`コンポーネントに渡します。

最初は、コンソールログに接続が暗号化されていないと表示されます。チェックボックスをオンにしてみてください：何も起こりません。しかし、その後、選択されたルームを変更すると、チャットが再接続され、暗号化が有効になります（コンソールメッセージからわかります）。これはバグです。チェックボックスを切り替えるとチャットが再接続されるようにバグを修正してください。

<Hint>

リンターを抑制することは常に疑わしいです。これがバグの原因でしょうか？

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // 実際の実装ではサーバーに接続します
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // 実際の実装ではサーバーに接続します
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

リンターの抑制を削除すると、リントエラーが表示されます。問題は、`createConnection`がプロップであり、リアクティブな値であることです。それは時間とともに変化する可能性があります！（実際、ユーザーがチェックボックスをオンにしたとき、親コンポーネントは異なる値の`createConnection`プロップを渡します。）これが依存関係であるべき理由です。リストに含めてバグを修正します：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export