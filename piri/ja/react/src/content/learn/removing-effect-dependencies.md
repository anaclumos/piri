---
title: エフェクト依存関係の削除
---

<Intro>

Effectを書くとき、リンターはEffectが読み取るすべてのリアクティブな値（propsやstateなど）をEffectの依存関係リストに含めたかどうかを確認します。これにより、Effectがコンポーネントの最新のpropsやstateと同期し続けることが保証されます。不必要な依存関係は、Effectが頻繁に実行されすぎたり、無限ループを引き起こしたりする原因となることがあります。このガイドに従って、Effectから不必要な依存関係を見直し、削除してください。

</Intro>

<YouWillLearn>

- 無限Effect依存ループの修正方法
- 依存関係を削除したい場合の対処法
- Effectから値を読み取る際に「反応」しない方法
- オブジェクトや関数の依存関係を避ける方法と理由
- 依存関係リンターを抑制することが危険な理由とその代替手段

</YouWillLearn>

## 依存関係はコードに一致するべき {/*dependencies-should-match-the-code*/}

Effectを書くとき、まずはEffectが行いたいことを[開始および停止](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)する方法を指定します：

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  	// ...
}
```

次に、Effectの依存関係を空にしておくと（`[]`）、リンターは正しい依存関係を提案します：

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
  }, []); // <-- ここで間違いを修正！
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

リンターの指示に従って依存関係を埋めます：

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ すべての依存関係が宣言されました
  // ...
}
```

[Effectsはリアクティブな値に「反応」します。](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) `roomId`はリアクティブな値であるため（再レンダリングによって変更される可能性がある）、リンターはそれを依存関係として指定したかどうかを確認します。`roomId`が異なる値を受け取ると、ReactはEffectを再同期します。これにより、チャットが選択された部屋に接続され続け、ドロップダウンに「反応」します：

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

### 依存関係を削除するには、それが依存関係でないことを証明する {/*to-remove-a-dependency-prove-that-its-not-a-dependency*/}

Effectの依存関係を「選ぶ」ことはできないことに注意してください。Effectのコードで使用されるすべての<CodeStep step={2}>リアクティブな値</CodeStep>は、依存関係リストに宣言する必要があります。依存関係リストは周囲のコードによって決まります：

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // これはリアクティブな値です
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // このEffectはそのリアクティブな値を読み取ります
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ したがって、Effectの依存関係としてそのリアクティブな値を指定する必要があります
  // ...
}
```

[リアクティブな値](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive)には、propsやコンポーネント内で直接宣言されたすべての変数や関数が含まれます。`roomId`はリアクティブな値であるため、依存関係リストから削除することはできません。リンターはそれを許可しません：

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffectには依存関係 'roomId' が欠けています
  // ...
}
```

そしてリンターは正しいです！`roomId`は時間とともに変わる可能性があるため、これによりコードにバグが発生します。

**依存関係を削除するには、それが依存関係である必要がないことをリンターに「証明」する必要があります。** 例えば、`roomId`をコンポーネントの外に移動して、それがリアクティブでなく、再レンダリング時に変更されないことを証明できます：

```js {2,9}
const serverUrl = 'https://localhost:1234';
const roomId = 'music'; // もはやリアクティブな値ではありません

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ すべての依存関係が宣言されました
  // ...
}
```

`roomId`がもはやリアクティブな値でなく（再レンダリング時に変更されない）、依存関係である必要がなくなったため、空の依存関係リスト（`[]`）を指定できます：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
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

これが、依存関係リストが空（`[]`）であるEffectが意味することです。Effectはもはやリアクティブな値に依存していないため、コンポーネントのpropsやstateが変更されても再実行する必要はありません。

### 依存関係を変更するには、コードを変更する {/*to-change-the-dependencies-change-the-code*/}

ワークフローにパターンがあることに気付いたかもしれません：

1. まず、Effectのコードやリアクティブな値の宣言方法を**変更**します。
2. 次に、リンターに従って依存関係を**変更したコードに合わせて調整**します。
3. 依存関係リストに満足できない場合は、**最初のステップに戻って**（再度コードを変更します）。

最後の部分が重要です。**依存関係を変更したい場合は、まず周囲のコードを変更します。** 依存関係リストは、Effectのコードで使用されるすべてのリアクティブな値のリストと考えることができます。リストに何を入れるかを選ぶのではなく、リストはコードを**記述**します。依存関係リストを変更するには、コードを変更します。

これは方程式を解くような感じがするかもしれません。目標（例えば、依存関係を削除すること）から始め、その目標に一致するコードを「見つける」必要があります。方程式を解くのが楽しいと感じる人もいれば、Effectを書くのが楽しいと感じる人もいます！幸いなことに、以下に試すことができる一般的なレシピのリストがあります。

<Pitfall>

既存のコードベースがある場合、次のようにリンターを抑制するEffectがあるかもしれません：

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 このようにリンターを抑制するのは避けてください：
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**依存関係がコードと一致しない場合、バグが発生するリスクが非常に高くなります。** リンターを抑制することで、Effectが依存する値についてReactに「嘘」をつくことになります。

代わりに、以下のテクニックを使用してください。

</Pitfall>

<DeepDive>

#### 依存関係リンターを抑制することがなぜ危険なのか？ {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}

リンターを抑制すると、見つけにくく修正しにくい非常に直感に反するバグが発生します。以下はその一例です：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
	setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
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

Effectを「マウント時のみ実行」したいとします。空の依存関係（`[]`）がそれを行うと読んだので、リンターを無視し、強制的に`[]`を依存関係として指定しました。

このカウンターは、2つのボタンで設定可能な量だけ毎秒インクリメントされるはずでした。しかし、Effectが何にも依存しないとReactに「嘘」をついたため、Reactは初期レンダリングの`onTick`関数を永遠に使用し続けます。[そのレンダリング中に、](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `count`は`0`で、`increment`は`1`でした。これが、初期レンダリングの`onTick`が常に`setCount(0 + 1)`を毎秒呼び出す理由であり、常に`1`が表示される理由です。このようなバグは、複数のコンポーネントに広がると修正が難しくなります。

リンターを無視するよりも良い解決策が常にあります！このコードを修正するには、`onTick`を依存関係リストに追加する必要があります。（インターバルが一度だけ設定されるようにするために、[onTickをEffectイベントにします。](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)）

**依存関係のリンターエラーをコンパイルエラーとして扱うことをお勧めします。抑制しなければ、このようなバグは決して発生しません。** このページの残りの部分では、このケースや他のケースの代替手段を文書化しています。

</DeepDive>

## 不必要な依存関係の削除 {/*removing-unnecessary-dependencies*/}

Effectの依存関係をコードに合わせて調整するたびに、依存関係リストを確認してください。これらの依存関係が変更されたときにEffectが再実行されるのは理にかなっていますか？時々、答えは「いいえ」です：

* 異なる条件下でEffectの*異なる部分*を再実行したい場合があります。
* 依存関係の変更に「反応」するのではなく、最新の値を読み取りたい場合があります。
* 依存関係がオブジェクトや関数であるために*意図せず*頻繁に変更される場合があります。

適切な解決策を見つけるためには、Effectに関するいくつかの質問に答える必要があります。それらを一緒に見ていきましょう。

### このコードはイベントハンドラーに移動すべきですか？ {/*should-this-code-move-to-an-event-handler*/}

最初に考えるべきことは、このコードがEffectであるべきかどうかです。

フォームを想像してください。送信時に`submitted`状態変数を`true`に設定します。POSTリクエストを送信し、通知を表示する必要があります。このロジックを`submitted`が`true`であることに「反応」するEffect内に配置しました：

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 避けるべき：イベント固有のロジックがEffect内にあります
      post('/api/register');
      showNotification('Successfully registered!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted
(true);
  }

  // ...
}
```

後で、現在のテーマに応じて通知メッセージをスタイル設定したいので、現在のテーマを読み取ります。`theme`はコンポーネント本体で宣言されているため、リアクティブな値であり、依存関係として追加します：

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 避けるべき：イベント固有のロジックがEffect内にあります
      post('/api/register');
      showNotification('Successfully registered!', theme);
    }
  }, [submitted, theme]); // ✅ すべての依存関係が宣言されました

  function handleSubmit() {
    setSubmitted(true);
  }  

  // ...
}
```

これによりバグが発生します。フォームを送信してからダークテーマとライトテーマを切り替えると、`theme`が変更され、Effectが再実行され、同じ通知が再度表示されます！

**ここでの問題は、これがそもそもEffectであるべきではないということです。** このPOSTリクエストを送信し、通知を表示するのは*フォームの送信*に応じて行いたいのであり、特定のインタラクションです。特定のインタラクションに応じてコードを実行するには、そのロジックを対応するイベントハンドラーに直接配置します：

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ 良い：イベント固有のロジックがイベントハンドラーから呼び出されます
    post('/api/register');
    showNotification('Successfully registered!', theme);
  }  

  // ...
}
```

コードがイベントハンドラーにあるため、リアクティブではなくなり、ユーザーがフォームを送信したときにのみ実行されます。詳細については、[イベントハンドラーとEffectの選択](/learn/separating-events-from-effects#reactive-values-and-reactive-logic)および[不要なEffectの削除方法](/learn/you-might-not-need-an-effect)を参照してください。

### Effectが複数の無関係なことを行っているか？ {/*is-your-effect-doing-several-unrelated-things*/}

次に自問すべきことは、Effectが複数の無関係なことを行っているかどうかです。

ユーザーが都市と地域を選択する必要がある配送フォームを作成していると想像してください。選択された`country`に応じてサーバーから`cities`のリストを取得し、ドロップダウンに表示します：

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

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
  }, [country]); // ✅ すべての依存関係が宣言されました

  // ...
```

これは[Effectでデータを取得する](/learn/you-might-not-need-an-effect#fetching-data)良い例です。`cities`状態をネットワークと同期させ、`country`プロップに基づいています。`ShippingForm`が表示されるときや`country`が変更されるたびにフェッチする必要があるため、イベントハンドラーではこれを行うことはできません（どのインタラクションが原因であっても）。

次に、現在選択されている`city`の`areas`を取得するための2番目のセレクトボックスを追加するとします。最初に同じEffect内に`areas`のリストを取得するための2番目の`fetch`呼び出しを追加するかもしれません：

```js {15-24,28}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 避けるべき：単一のEffectが2つの独立したプロセスを同期します
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ すべての依存関係が宣言されました

  // ...
```

しかし、Effectが`city`状態変数を使用するようになったため、依存関係リストに`city`を追加する必要がありました。その結果、ユーザーが異なる都市を選択すると、Effectが再実行され、`fetchCities(country)`が呼び出されます。その結果、都市のリストを何度も不必要に再フェッチすることになります。

**このコードの問題は、2つの異なる無関係なことを同期していることです：**

1. `country`プロップに基づいて`cities`状態をネットワークと同期させたい。
1. `city`状態に基づいて`areas`状態をネットワークと同期させたい。

ロジックを2つのEffectに分割し、それぞれが同期する必要があるプロップに反応するようにします：

```js {19-33}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
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
  }, [country]); // ✅ すべての依存関係が宣言されました

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
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
  }, [city]); // ✅ すべての依存関係が宣言されました

  // ...
```

これで最初のEffectは`country`が変更された場合にのみ再実行され、2番目のEffectは`city`が変更された場合に再実行されます。目的ごとに分けられています：2つの異なることが2つの別々のEffectによって同期されます。2つの別々のEffectには2つの別々の依存関係リストがあるため、意図せずに互いにトリガーされることはありません。

最終的なコードは元のコードよりも長くなりますが、これらのEffectを分割することは正しいです。[各Effectは独立した同期プロセスを表すべきです。](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) この例では、1つのEffectを削除しても他のEffectのロジックは壊れません。これは、*異なることを同期している*ことを意味し、分割することが良いです。重複が気になる場合は、[カスタムフックに重複するロジックを抽出することでこのコードを改善できます。](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

### 次の状態を計算するために一部の状態を読み取っていますか？ {/*are-you-reading-some-state-to-calculate-the-next-state*/}

このEffectは、新しいメッセージが到着するたびに`messages`状態変数を新しく作成された配列で更新します：

```js {2,6-8}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

これは、すべての既存のメッセージで始まる新しい配列を作成し、最後に新しいメッセージを追加するために`messages`変数を使用します。しかし、`messages`はEffectによって読み取られるリアクティブな値であるため、依存関係である必要があります：

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ すべての依存関係が宣言されました
  // ...
```

そして、`messages`を依存関係にすることで問題が発生します。

メッセージを受信するたびに、`setMessages()`は受信したメッセージを含む新しい`messages`配列でコンポーネントを再レンダリングします。しかし、このEffectは`messages`に依存しているため、これもEffectを再同期させます。したがって、新しいメッセージが届くたびにチャットが再接続されます。ユーザーはそれを好まないでしょう！

問題を修正するには、Effect内で`messages`を読み取らないようにします。代わりに、`setMessages`に[アップデータ関数](/reference/react/useState#updating-state-based-on-the-previous-state)を渡します：

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ すべての依存関係が宣言されました
  // ...
```

**Effectがもはや`messages`変数を読み取らないことに注意してください。** `msgs => [...msgs, receivedMessage]`のようなアップデータ関数を渡すだけで済みます。Reactは[アップデータ関数をキューに入れ、](/learn/queueing-a-series-of-state-updates)次のレンダリング中に`msgs`引数を提供します。これが、Effect自体がもはや`messages`に依存する必要がない理由です。この修正の結果、チャットメッセージを受信してもチャットが再接続されることはありません。

### 値を読み取りたいが、その変更に「反応」したくないですか？ {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

<Wip>

このセクションでは、**まだ安定版のReactでリリースされていない実験的なAPI**について説明します。

</Wip>

ユーザーが新しいメッセージを受信したときに音を再生したいが、`isMuted`が`true`の場合は再生しないとします：

```js {3,10-12}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

Effectが`isMuted`を使用するようになったため、依存関係として追加する必要があります：

```js {10,15}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ すべての依存関係が宣言されました
  // ...
```

問題は、`isMuted`が変更されるたびに（例えば、ユーザーが「ミュート」トグルを押すと）、Effectが再同期され、チャットが再接続されることです。これは望ましいユーザー体験ではありません！（この例では、リンターを無効にしても機能しません。`isMuted`は古い値のまま「固定」されます。）

この問題を解決するには、リアクティブでないロジックをEffectから抽出する必要があります。このEffectが`isMuted`の変更に「反応」しないようにしたいのです。[この非リアクティブなロジックをEffectイベントに移動します：](/learn/separating-events-from-effects#declaring-an-effect-event)

```js {1,7-12,18,21}
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ すべての依存関係が宣言されました
  // ...
```

Effectイベントを使用すると、Effectをリアクティブな部分（`roomId`やその変更に「反応」するべき部分）と非リアクティブな部分（最新の値のみを読み取る部分、例えば`onMessage`が`isMuted`を読み取る）に分割できます。**Effectイベント内で`isMuted`を読み取るため、Effectの依存関係である必要はありません。** その結果、チャットは「ミュート」設定をオンオフするたびに再接続されなくなり、元の問題が解決されます！

#### プロップからのイベントハンドラーをラップする {/*wrapping-an-event-handler-from-the-props*/}

プロップとしてイベントハンドラーを受け取る場合にも同様の問題が発生することがあります：

```js {1,8,11}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ すべての依存関係が宣言されました
  // ...
```

親コンポーネントが毎回異なる`onReceiveMessage`関数を渡すとします：

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

`onReceiveMessage`が依存関係であるため、親が再レンダリングするたびにEffectが再同期され、チャットが再接続されます。これを解決するには、呼び出しをEffectイベントでラップします：

```js {4-6,12,15}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ すべての依存関係が宣言されました
  // ...
```

Effectイベントはリアクティブではないため、依存関係として指定する必要はありません。その結果、親コンポーネントが毎回異なる関数を渡しても、チャットは再接続されません。

#### リアクティブなコードと非リアクティブなコードを分離する {/*separating-reactive-and-non-reactive-code*/}

この例では、`roomId`が変更されるたびに訪問をログに記録したいとします。現在の`notificationCount`をログに含めたいですが、`notificationCount`の変更がログイベントをトリガーする
ことは望んでいません。

この問題を解決するために、非リアクティブなコードをEffectイベントに分割します：

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ すべての依存関係が宣言されました
  // ...
}
```

`roomId`に関してはリアクティブにしたいので、Effect内で`roomId`を読み取ります。しかし、`notificationCount`の変更が追加の訪問をログに記録することを望んでいないので、Effectイベント内で`notificationCount`を読み取ります。[Effectイベントを使用してEffectから最新のpropsとstateを読み取る方法について詳しく学びます。](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)

### 一部のリアクティブな値が意図せず変更されますか？ {/*does-some-reactive-value-change-unintentionally*/}

時々、Effectが特定の値に「反応」することを望んでいるが、その値がユーザーの視点から意図せず頻繁に変更されることがあります。例えば、コンポーネントの本体で`options`オブジェクトを作成し、そのオブジェクトをEffect内で読み取るとします：

```js {3-6,9}
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

このオブジェクトはコンポーネント本体で宣言されているため、[リアクティブな値](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)です。このようなリアクティブな値をEffect内で読み取ると、依存関係として宣言する必要があります。これにより、Effectがその変更に「反応」することが保証されます：

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ すべての依存関係が宣言されました
  // ...
```

依存関係として宣言することは重要です！例えば、`roomId`が変更された場合、Effectが新しい`options`で再接続することを保証します。しかし、上記のコードには問題もあります。それを確認するために、サンドボックスで入力フィールドに入力してみて、コンソールで何が起こるかを見てください：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // 一時的にリンターを無効にして問題を示します
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

上記のサンドボックスでは、入力フィールドは`message`状態変数のみを更新します。ユーザーの視点からは、これがチャット接続に影響を与えるべきではありません。しかし、`message`を更新するたびに、コンポーネントが再レンダリングされます。コンポーネントが再レンダリングされると、内部のコードが最初から再実行されます。

新しい`options`オブジェクトが`ChatRoom`コンポーネントの再レンダリングごとに最初から作成されます。Reactは、`options`オブジェクトが前回のレンダリングで作成された`options`オブジェクトとは*異なるオブジェクト*であると認識します。これが、Effectが再同期され、入力フィールドに入力するたびにチャットが再接続される理由です。

**この問題はオブジェクトと関数にのみ影響します。JavaScriptでは、新しく作成されたオブジェクトと関数はすべて他のものとは異なると見なされます。内部の内容が同じであっても関係ありません！**

```js {7-8}
// 最初のレンダリング中
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// 次のレンダリング中
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// これらは2つの異なるオブジェクトです！
console.log(Object.is(options1, options2)); // false
```

**オブジェクトと関数の依存関係は、Effectが必要以上に頻繁に再同期される原因となることがあります。**

このため、可能な限り、Effectの依存関係としてオブジェクトや関数を避けるべきです。代わりに、それらをコンポーネントの外、Effectの内部、またはプリミティブ値に抽出します。

#### 静的なオブジェクトと関数をコンポーネントの外に移動する {/*move-static-objects-and-functions-outside-your-component*/}

オブジェクトがpropsやstateに依存しない場合、そのオブジェクトをコンポーネントの外に移動できます：

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ すべての依存関係が宣言されました
  // ...
```

この方法で、リンターにそれがリアクティブでないことを証明します。それは再レンダリングの結果として変更されることができないため、依存関係である必要はありません。これで、`ChatRoom`が再レンダリングされてもEffectが再同期されることはありません。

これは関数にも適用されます：

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ すべての依存関係が宣言されました
  // ...
```

`createOptions`がコンポーネントの外で宣言されているため、それはリアクティブな値ではありません。したがって、Effectの依存関係として指定する必要はなく、Effectが再同期されることもありません。

#### 動的なオブジェクトと関数をEffectの内部に移動する {/*move-dynamic-objects-and-functions-inside-your-effect*/}

オブジェクトが再レンダリングの結果として変更される可能性のあるリアクティブな値（例えば、`roomId`プロップ）に依存する場合、そのオブジェクトをコンポーネントの外に移動することはできません。しかし、その作成をEffectのコード内に移動することはできます：

```js {7-10,11,14}
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
  }, [roomId]); // ✅ すべての依存関係が宣言されました
  // ...
```

これで`options`がEffect内で宣言されているため、それはもはやEffectの依存関係ではありません。代わりに、Effectが使用する唯一のリアクティブな値は`roomId`です。`roomId`はオブジェクトや関数ではないため、それが*意図せず*異なることはありません。JavaScriptでは、数値や文字列はその内容によって比較されます：

```js {7-8}
// 最初のレンダリング中
const roomId1 = 'music';

// 次のレンダリング中
const roomId2 = 'music';

// これらの2つの文字列は同じです！
console.log(Object.is(roomId1, roomId2)); // true
```

この修正のおかげで、入力フィールドを編集してもチャットが再接続されることはありません：

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

しかし、`roomId`ドロップダウンを変更すると、期待通りに再接続されます。

これは関数にも適用されます：

```js {7-12,14}
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
  }, [roomId]); // ✅ すべての依存関係が宣言されました
  // ...
```

Effect内でロジックの部分をグループ化するために独自の関数を書くことができます。Effect内で宣言されている限り、それらはリアクティブな値ではないため、Effectの依存関係である必要はありません。

#### オブジェクトからプリミティブ値を読み取る {/*read-primitive-values-from-objects*/}

時々、プロップからオブジェクトを受け取ることがあります：

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ すべての依存関係が宣言されました
  // ...
```

ここでのリスクは、親コンポーネントがレンダリング中にオブジェクトを作成することです：

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

これにより、親コンポーネントが再レンダリングされるたびにEffectが再接続されます。これを修正するには、Effectの外でオブジェクトから情報を読み取り、オブジェクトや関数の依存関係を避けます：

```js {4,7-8,12}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ すべての依存関係が宣言されました
  // ...
```

ロジックが少し繰り返しになります（オブジェクトから値を読み取り、Effect内で同じ値を持つオブジェクトを作成します）。しかし、Effectが*実際に*依存している情報が非常に明確になります。親コンポーネントが意図せずオブジェクトを再作成しても、チャットは再接続されません。しかし、`options.roomId`や`options.serverUrl`が本当に異なる場合、チャットは再接続されます。

#### 関数からプリミティブ値を計算する {/*calculate-primitive-values-from-functions*/}

同じアプローチは関数にも適用できます。例えば、親コンポーネントが関数を渡すとします：

```js {3-8}
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

依存関係として指定することを避けるために（再レンダリング時に再接続されるのを避けるため）、Effectの外でそれを呼び出します。これにより、オブジェクトではない`roomId`と`serverUrl`の値が得られ、Effect内で読み取ることができます：

```js {1,4}
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ すべての依存関係が宣言されました
  // ...
```

これは[純粋な](/learn/keeping-components-pure)関数に対してのみ機能します。レンダリング中に呼び出しても安全です。関数がイベントハンドラーであり、その変更がEffectを再同期させたくない場合は、[代わりにEffectイベントにラップします。](#do-you-want-to-read-a-value-without-reacting-to-its-changes)

<Recap>

- 依存関係は常にコードに一致するべきです。
- 依存関係に満足できない場合、編集する必要があるのはコードです。
- リンターを抑制すると非常に混乱するバグが発生し、常に避けるべきです。
- 依存関係を削除するには、それが必要ないことをリンターに「証明」する必要があります。
- 特定のインタラクションに応じてコードを実行する必要がある場合、そのコードをイベントハンドラーに移動します。
- Effectの異なる部分が異なる理由で再実行されるべき場合、それを複数のEffect
に分割します。
- 前の状態に基づいて状態を更新したい場合は、アップデータ関数を渡します。
- 最新の値を読み取りたいが「反応」したくない場合は、Effectイベントを抽出します。
- JavaScriptでは、オブジェクトや関数は異なるタイミングで作成された場合、異なると見なされます。
- オブジェクトや関数の依存関係を避けるようにします。それらをコンポーネントの外またはEffectの内部に移動します。

</Recap>

<Challenges>

#### リセットされるインターバルを修正する {/*fix-a-resetting-interval*/}

このEffectは、毎秒ティックするインターバルを設定します。何か奇妙なことが起こっているようです：ティックするたびにインターバルが破棄されて再作成されるようです。インターバルが常に再作成されないようにコードを修正してください。

<Hint>

このEffectのコードは`count`に依存しているようです。この依存関係を必要としない方法はありますか？この値を依存関係に追加せずに`count`状態を更新する方法があるはずです。

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

<Solution>

`count`状態を`count + 1`に更新したいのですが、これによりEffectが`count`に依存することになり、毎回ティックするたびにインターバルが再作成されます。

これを解決するには、[アップデータ関数](/reference/react/useState#updating-state-based-on-the-previous-state)を使用し、`setCount(c => c + 1)`と書く代わりに`setCount(count + 1)`と書きます：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, []);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

Effect内で`count`を読み取る代わりに、Reactに`c => c + 1`という指示（「この数をインクリメントする！」）を渡します。Reactは次のレンダリングでそれを適用します。そして、Effect内で`count`の値を読み取る必要がなくなったため、Effectの依存関係を空（`[]`）に保つことができます。これにより、Effectが毎回ティックするたびにインターバルを再作成することを防ぎます。

</Solution>

#### 再トリガーされるアニメーションを修正する {/*fix-a-retriggering-animation*/}

この例では、「Show」を押すとウェルカムメッセージがフェードインします。アニメーションは1秒かかります。「Remove」を押すと、ウェルカムメッセージがすぐに消えます。フェードインアニメーションのロジックは、`animation.js`ファイル内のプレーンなJavaScript[アニメーションループ](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)として実装されています。そのロジックを変更する必要はありません。それをサードパーティのライブラリとして扱うことができます。EffectはDOMノードの`FadeInAnimation`インスタンスを作成し、アニメーションを制御するために`start(duration)`または`stop()`を呼び出します。`duration`はスライダーで制御されます。スライダーを調整してアニメーションがどのように変わるかを確認してください。

このコードはすでに動作していますが、変更したいことがあります。現在、`duration`状態変数を制御するスライダーを動かすと、アニメーションが再トリガーされます。Effectが`duration`変数に「反応」しないように動作を変更してください。「Show」を押すと、Effectはスライダーの現在の`duration`を使用する必要があります。しかし、スライダー自体を動かすことはアニメーションを再トリガーしないようにします。

<Hint>

Effect内のコードの行の中でリアクティブでないべきものはありますか？非リアクティブなコードをEffectの外に移動する方法はありますか？

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
import { useState, useEffect, useRef } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);

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
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
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
```

</Sandpack>

<Solution>

Effectは最新の`duration`値を読み取る必要がありますが、`duration`の変更に「反応」したくありません。アニメーションを開始するために`duration`を使用しますが、アニメーションの開始はリアクティブではありません。非リアクティブなコード行をEffectイベントに抽出し、その関数をEffectから呼び出します。

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
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
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
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
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
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
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
```

</Sandpack>

Effectイベントのような`onAppear`はリアクティブではないため、`duration`を内部で読み取ってもアニメーションが再トリガーされることはありません。

</Solution>

#### 再接続されるチャットを修正する {/*fix-a-reconnecting-chat*/}

この例では、「Toggle theme」を押すたびにチャットが再接続されます。なぜこれが起こるのでしょうか？サーバーURLを編集したり、別のチャットルームを選択したりしたときにのみチャットが再接続されるように修正してください。

`chat.js`を外部のサードパーティライブラリとして扱い、そのAPIを確認することはできますが、編集しないでください。

<Hint>

これを修正する方法は複数ありますが、最終的にはオブジェクトを依存関係として持たないようにすることが目標です。

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

<Solution>

Effectが再実行されるのは、`options`オブジェクトに依存しているためです。オブジェクトは意図せず再作成される可能性があるため、Effectの依存関係として避けるべきです。

最も侵襲的でない修正は、Effectの外で`roomId`と`serverUrl`を読み取り、それらのプリミティブ値（意図せず変更されることがない）に依存させることです。Effect内でオブジェクトを作成し、それを`createConnection`に渡します：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 実際
の実装ではサーバーに接続します
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

さらに良いのは、`options`オブジェクトのプロップをより具体的な`roomId`と`serverUrl`のプロップに置き換えることです：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
        serverUrl={serverUrl}
      />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

プリミティブなプロップに固執することで、後でコンポーネントを最適化するのが容易になります。

</Solution>

#### 再接続されるチャットを再度修正する {/*fix-a-reconnecting-chat-again*/}

この例では、暗号化ありまたはなしでチャットに接続します。チェックボックスを切り替えると、暗号化がオンとオフのときにコンソールに異なるメッセージが表示されることに気づくでしょう。部屋を変更してみてください。その後、テーマを切り替えてみてください。チャットルームに接続していると、数秒ごとに新しいメッセージが届きます。選択したテーマに一致する色であることを確認してください。

この例では、テーマを変更するたびにチャットが再接続されます。これを修正してください。修正後、テーマを変更してもチャットは再接続されませんが、暗号化設定を切り替えたり部屋を変更したりすると再接続されます。

`chat.js`のコードは変更しないでください。それ以外のコードは、同じ動作をする限り変更しても構いません。例えば、渡されるプロップを変更することが役立つかもしれません。

<Hint>

2つの関数を渡しています：`onMessage`と`createConnection`。これらの関数は`App`が再レンダリングされるたびに新しく作成されます。これらは毎回新しい値と見なされるため、Effectを再トリガーします。

これらの関数の1つはイベントハンドラーです。イベントハンドラーをEffect内で新しい値に「反応」せずに呼び出す方法を知っていますか？それが役立つでしょう！

もう1つの関数は、インポートされたAPIメソッドにいくつかの状態を渡すためだけに存在します。この関数は本当に必要ですか？渡される重要な情報は何ですか？`App.js`から`ChatRoom.js`にいくつかのインポートを移動する必要があるかもしれません。

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
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
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
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
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

正しい解決策は複数ありますが、ここでは1つの可能な解決策を示します。

元の例では、テーマを切り替えると異なる`onMessage`と`createConnection`関数が作成されて渡されました。Effectがこれらの関数に依存していたため、テーマを切り替えるたびにチャットが再接続されました。

`onMessage`の問題を修正するには、それをEffectイベントにラップする必要がありました：

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

`onMessage`プロップとは異なり、`onReceiveMessage`Effectイベントはリアクティブではありません。したがって、Effectの依存関係である必要はありません。その結果、`onMessage`の変更はチャットの再接続を引き起こしません。

`createConnection`については同じことはできません。それは*リアクティブであるべき*です。ユーザーが暗号化接続と非暗号化接続を切り替えたり、現在の部屋を切り替えたりすると、Effectが再トリガーされることを望んでいます。しかし、`createConnection`が関数であるため、それが実際に変更されたかどうかを確認することはできません。これを解決するために、`createConnection`を`App`コンポーネントから渡す代わりに、生の`roomId`と`isEncrypted`の値を渡します：

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

これで、`createConnection`関数を`App`から渡すのではなく、Effect内に移動できます：

```js {1-4,6,10-20}
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }
    // ...
```

これら2つの変更の後、Effectはもはや関数値に依存しません：

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // リアクティブな値
  const onReceiveMessage = useEffectEvent(onMessage); // リアクティブではない

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // リアクティブな値を読み取る
      };
      if (isEncrypted) { // リアクティブな値を読み取る
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ すべての依存関係が宣言されました
```

その結果、チャットは意味のある変更（`roomId`または`isEncrypted`）があった場合にのみ再接続されます：

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
       serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
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
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
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
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

</Solution>

</Challenges>