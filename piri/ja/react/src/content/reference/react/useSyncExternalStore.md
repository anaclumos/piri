---
title: useSyncExternalStore
---

<Intro>

`useSyncExternalStore`は、外部ストアにサブスクライブするためのReact Hookです。

```js
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` {/*usesyncexternalstore*/}

コンポーネントのトップレベルで`useSyncExternalStore`を呼び出して、外部データストアから値を読み取ります。

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

これはストア内のデータのスナップショットを返します。引数として2つの関数を渡す必要があります：

1. `subscribe`関数はストアにサブスクライブし、サブスクライブを解除する関数を返す必要があります。
2. `getSnapshot`関数はストアからデータのスナップショットを読み取る必要があります。

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `subscribe`: 単一の`callback`引数を取り、それをストアにサブスクライブする関数。ストアが変更されたときに、提供された`callback`を呼び出す必要があります。これにより、コンポーネントが再レンダリングされます。`subscribe`関数はサブスクリプションをクリーンアップする関数を返す必要があります。

* `getSnapshot`: コンポーネントが必要とするストア内のデータのスナップショットを返す関数。ストアが変更されていない間は、`getSnapshot`の繰り返し呼び出しは同じ値を返す必要があります。ストアが変更され、返される値が異なる場合（[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)で比較）、Reactはコンポーネントを再レンダリングします。

* **オプション** `getServerSnapshot`: ストア内のデータの初期スナップショットを返す関数。これはサーバーレンダリング中およびクライアントでのサーバーレンダリングコンテンツのハイドレーション中にのみ使用されます。サーバースナップショットはクライアントとサーバーの間で同じでなければならず、通常はシリアル化されてサーバーからクライアントに渡されます。この引数を省略すると、サーバーでコンポーネントをレンダリングする際にエラーが発生します。

#### 戻り値 {/*returns*/}

レンダリングロジックで使用できるストアの現在のスナップショット。

#### 注意点 {/*caveats*/}

* `getSnapshot`によって返されるストアスナップショットは不変でなければなりません。基礎となるストアに可変データがある場合、データが変更された場合は新しい不変スナップショットを返します。それ以外の場合は、最後のスナップショットをキャッシュして返します。

* 再レンダリング中に異なる`subscribe`関数が渡された場合、Reactは新しく渡された`subscribe`関数を使用してストアに再サブスクライブします。これを防ぐには、`subscribe`をコンポーネントの外で宣言します。

* ストアが[非ブロッキングのトランジション更新](/reference/react/useTransition)中に変更された場合、Reactはその更新をブロッキングとして実行することに戻ります。具体的には、すべてのトランジション更新に対して、ReactはDOMに変更を適用する直前に`getSnapshot`を再度呼び出します。最初に呼び出されたときと異なる値を返す場合、Reactは更新を最初からやり直し、今回はブロッキング更新として適用して、画面上のすべてのコンポーネントがストアの同じバージョンを反映するようにします。

* `useSyncExternalStore`によって返されるストア値に基づいてレンダリングを_サスペンド_することは推奨されません。理由は、外部ストアへの変更は[非ブロッキングのトランジション更新](/reference/react/useTransition)としてマークできないため、最寄りの[`Suspense`フォールバック](/reference/react/Suspense)をトリガーし、画面上の既にレンダリングされたコンテンツをローディングスピナーに置き換えるためです。これは通常、悪いUXを引き起こします。

  例えば、以下のようなコードは推奨されません：

  ```js
  const LazyProductDetailPage = lazy(() => import('./ProductDetailPage.js'));

  function ShoppingApp() {
    const selectedProductId = useSyncExternalStore(...);

    // ❌ `selectedProductId`に依存するPromiseを使って`use`を呼び出す
    const data = use(fetchItem(selectedProductId))

    // ❌ `selectedProductId`に基づいて遅延コンポーネントを条件付きでレンダリングする
    return selectedProductId != null ? <LazyProductDetailPage /> : <FeaturedProducts />;
  }
  ```

---

## 使用法 {/*usage*/}

### 外部ストアへのサブスクライブ {/*subscribing-to-an-external-store*/}

ほとんどのReactコンポーネントは、[props,](/learn/passing-props-to-a-component) [state,](/reference/react/useState) および [context](/reference/react/useContext) からデータを読み取るだけです。しかし、時々、コンポーネントはReactの外部にあるストアからデータを読み取る必要があります。これには以下が含まれます：

* Reactの外部に状態を保持するサードパーティの状態管理ライブラリ。
* 変更にサブスクライブするための可変値とイベントを公開するブラウザAPI。

コンポーネントのトップレベルで`useSyncExternalStore`を呼び出して、外部データストアから値を読み取ります。

```js [[1, 5, "todosStore.subscribe"], [2, 5, "todosStore.getSnapshot"], [3, 5, "todos", 0]]
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

これはストア内のデータの<CodeStep step={3}>スナップショット</CodeStep>を返します。引数として2つの関数を渡す必要があります：

1. <CodeStep step={1}>`subscribe`関数</CodeStep>はストアにサブスクライブし、サブスクライブを解除する関数を返す必要があります。
2. <CodeStep step={2}>`getSnapshot`関数</CodeStep>はストアからデータのスナップショットを読み取る必要があります。

Reactはこれらの関数を使用して、コンポーネントをストアにサブスクライブし、変更時に再レンダリングします。

例えば、以下のサンドボックスでは、`todosStore`はReactの外部にデータを保持する外部ストアとして実装されています。`TodosApp`コンポーネントは`useSyncExternalStore`フックを使用してその外部ストアに接続します。

<Sandpack>

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

export default function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Add todo</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todoStore.js
// これはReactと統合する必要があるサードパーティのストアの例です。

// アプリが完全にReactで構築されている場合は、Reactの状態を使用することをお勧めします。

let nextId = 0;
let todos = [{ id: nextId++, text: 'Todo #1' }];
let listeners = [];

export const todosStore = {
  addTodo() {
    todos = [...todos, { id: nextId++, text: 'Todo #' + nextId }]
    emitChange();
  },
  subscribe(listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot() {
    return todos;
  }
};

function emitChange() {
  for (let listener of listeners) {
    listener();
  }
}
```

</Sandpack>

<Note>

可能であれば、[`useState`](/reference/react/useState)や[`useReducer`](/reference/react/useReducer)などの組み込みのReact状態を使用することをお勧めします。`useSyncExternalStore` APIは、既存の非Reactコードと統合する必要がある場合に主に役立ちます。

</Note>

---

### ブラウザAPIへのサブスクライブ {/*subscribing-to-a-browser-api*/}

`useSyncExternalStore`を追加するもう一つの理由は、時間とともに変化するブラウザによって公開される値にサブスクライブしたい場合です。例えば、ネットワーク接続がアクティブかどうかを表示するコンポーネントを作成したいとします。ブラウザはこの情報を[`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)というプロパティを通じて公開しています。

この値はReactの知識なしに変化する可能性があるため、`useSyncExternalStore`を使用して読み取る必要があります。

```js
import { useSyncExternalStore } from 'react';

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

`getSnapshot`関数を実装するには、ブラウザAPIから現在の値を読み取ります：

```js
function getSnapshot() {
  return navigator.onLine;
}
```

次に、`subscribe`関数を実装する必要があります。例えば、`navigator.onLine`が変化すると、ブラウザは`window`オブジェクトで[`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event)および[`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event)イベントを発生させます。`callback`引数を対応するイベントにサブスクライブし、サブスクリプションをクリーンアップする関数を返す必要があります：

```js
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

これでReactは外部の`navigator.onLine` APIから値を読み取り、その変更にサブスクライブする方法を知っています。デバイスをネットワークから切断し、コンポーネントが応答して再レンダリングされることを確認してください：

<Sandpack>

```js
import { useSyncExternalStore } from 'react';

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### ロジックをカスタムフックに抽出する {/*extracting-the-logic-to-a-custom-hook*/}

通常、`useSyncExternalStore`を直接コンポーネントに書くことはありません。代わりに、独自のカスタムフックから呼び出すことが一般的です。これにより、異なるコンポーネントから同じ外部ストアを使用できます。

例えば、このカスタム`useOnlineStatus`フックはネットワークがオンラインかどうかを追跡します：

```js {3,6}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  // ...
}

function subscribe(callback) {
  // ...
}
```

これで異なるコンポーネントが`useOnlineStatus`を呼び出して、基礎となる実装を繰り返すことなく使用できます：

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
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### サーバーレンダリングのサポートを追加する {/*adding-support-for-server-rendering*/}

Reactアプリが[サーバーレンダリング](/reference/react-dom/server)を使用している場合、Reactコンポーネントは初期HTMLを生成するためにブラウザ環境の外でも実行されます。これにより、外部ストアに接続する際にいくつかの課題が生じます：

- ブラウザ専用のAPIに接続している場合、それはサーバー上では動作しません。
- サードパーティのデータストアに接続している場合、そのデータはサーバーとクライアントの間で一致する必要があります。

これらの問題を解決するために、`useSyncExternalStore`の第3引数として`getServerSnapshot`関数を渡します：

```js {4,12-14}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // サーバー生成HTMLのために常に「オンライン」を表示
}

function subscribe(callback) {
  // ...
}
```

`getServerSnapshot`関数は`getSnapshot`に似ていますが、次の2つの状況でのみ実行されます：

- HTMLを生成する際にサーバー上で実行されます。
- [ハイドレーション](/reference/react-dom/client/hydrateRoot)中、つまりReactがサーバーHTMLを取得してインタラクティブにする際にクライアントで実行されます。

これにより、アプリがインタラクティブになる前に使用される初期スナップショット値を提供できます。サーバーレンダリングに意味のある初期値がない場合、この引数を省略して[クライアントでのレンダリングを強制](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)します。

<Note>

`getServerSnapshot`がサーバーで返したのと同じ正確なデータを初期クライアントレンダリングで返すことを確認してください。例えば、`getServerSnapshot`がサーバーで事前に入力されたストアコンテンツを返した場合、このコンテンツをクライアントに転送する必要があります。これを行う一つの方法は、サーバーレンダリング中に`window.MY_STORE_DATA`のようなグローバルを設定する`<script>`タグを出力し、クライアントの`getServerSnapshot`でそのグローバルから読み取ることです。外部ストアはその方法についての指示を提供するべきです。

</Note>

---

## トラブルシューティング {/*troubleshooting*/}

### エラーが発生しています：「`getSnapshot`の結果はキャッシュされるべきです」 {/*im-getting-an-error-the-result-of-getsnapshot-should-be-cached*/}

このエラーは、`getSnapshot`関数が呼び出されるたびに新しいオブジェクトを返していることを意味します。例えば：

```js```js {2-5}
function getSnapshot() {
  // 🔴 `getSnapshot`から常に異なるオブジェクトを返さないでください
  return {
    todos: myStore.todos
  };
}
```

`getSnapshot`の返り値が前回と異なる場合、Reactはコンポーネントを再レンダリングします。したがって、常に異なる値を返すと、無限ループに入り、このエラーが発生します。

`getSnapshot`オブジェクトは、実際に何かが変更された場合にのみ異なるオブジェクトを返すべきです。ストアが不変データを含む場合、そのデータを直接返すことができます：

```js {2-3}
function getSnapshot() {
  // ✅ 不変データを返すことができます
  return myStore.todos;
}
```

ストアデータが可変である場合、`getSnapshot`関数はその不変スナップショットを返すべきです。これは新しいオブジェクトを作成する必要がありますが、すべての呼び出しに対してではありません。代わりに、最後に計算されたスナップショットを保存し、ストア内のデータが変更されていない場合は同じスナップショットを返すべきです。可変ストアのデータが変更されたかどうかを判断する方法は、可変ストアによります。

---

### `subscribe`関数が毎回の再レンダリング後に呼び出されます {/*my-subscribe-function-gets-called-after-every-re-render*/}

この`subscribe`関数はコンポーネント内で定義されているため、再レンダリングごとに異なります：

```js {4-7}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // 🚩 常に異なる関数なので、Reactは再レンダリングごとに再サブスクライブします
  function subscribe() {
    // ...
  }

  // ...
}
```
  
再レンダリング間で異なる`subscribe`関数を渡すと、Reactはストアに再サブスクライブします。これがパフォーマンスの問題を引き起こし、再サブスクライブを避けたい場合は、`subscribe`関数を外に移動します：

```js {6-9}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}

// ✅ 常に同じ関数なので、Reactは再サブスクライブする必要がありません
function subscribe() {
  // ...
}
```

または、[`useCallback`](/reference/react/useCallback)を使用して`subscribe`をラップし、引数が変更されたときにのみ再サブスクライブします：

```js {4-8}
function ChatIndicator({ userId }) {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // ✅ userIdが変更されない限り同じ関数
  const subscribe = useCallback(() => {
    // ...
  }, [userId]);

  // ...
}
```