---
title: useDebugValue
---

<Intro>

`useDebugValue` は、[React DevTools](/learn/react-developer-tools) でカスタムフックにラベルを追加できるReact Hookです。

```js
useDebugValue(value, format?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useDebugValue(value, format?)` {/*usedebugvalue*/}

読みやすいデバッグ値を表示するために、[カスタムフック](/learn/reusing-logic-with-custom-hooks) のトップレベルで `useDebugValue` を呼び出します:

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `value`: React DevTools に表示したい値。任意の型を持つことができます。
* **オプション** `format`: フォーマット関数。コンポーネントが検査されると、React DevTools は `value` を引数としてフォーマット関数を呼び出し、返されたフォーマット済みの値（任意の型を持つことができます）を表示します。フォーマット関数を指定しない場合、元の `value` 自体が表示されます。

#### 戻り値 {/*returns*/}

`useDebugValue` は何も返しません。

## 使用法 {/*usage*/}

### カスタムフックにラベルを追加する {/*adding-a-label-to-a-custom-hook*/}

読みやすい<CodeStep step={1}>デバッグ値</CodeStep>を表示するために、[カスタムフック](/learn/reusing-logic-with-custom-hooks) のトップレベルで `useDebugValue` を呼び出します。

```js [[1, 5, "isOnline ? 'Online' : 'Offline'"]]
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

これにより、`useOnlineStatus` を呼び出すコンポーネントは、検査時に `OnlineStatus: "Online"` のようなラベルを持つことになります。

![React DevTools のスクリーンショット、デバッグ値を表示](/images/docs/react-devtools-usedebugvalue.png)

`useDebugValue` 呼び出しがない場合、基礎データ（この例では `true`）のみが表示されます。

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

export default function App() {
  return <StatusBar />;
}
```

```js src/useOnlineStatus.js active
import { useSyncExternalStore, useDebugValue } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
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

<Note>

すべてのカスタムフックにデバッグ値を追加しないでください。これは、共有ライブラリの一部であり、内部データ構造が複雑で検査が難しいカスタムフックにとって最も価値があります。

</Note>

---

### デバッグ値のフォーマットを遅延させる {/*deferring-formatting-of-a-debug-value*/}

`useDebugValue` の第二引数としてフォーマット関数を渡すこともできます:

```js [[1, 1, "date", 18], [2, 1, "date.toDateString()"]]
useDebugValue(date, date => date.toDateString());
```

フォーマット関数は<CodeStep step={1}>デバッグ値</CodeStep>をパラメータとして受け取り、<CodeStep step={2}>フォーマット済みの表示値</CodeStep>を返す必要があります。コンポーネントが検査されると、React DevTools はこの関数を呼び出し、その結果を表示します。

これにより、コンポーネントが実際に検査されるまで、潜在的に高コストなフォーマットロジックの実行を避けることができます。例えば、`date` が Date 値である場合、これにより毎回のレンダリングで `toDateString()` を呼び出すことを避けることができます。