---
title: createContext
---

<Intro>

`createContext`を使用すると、コンポーネントが提供または読み取ることができる[コンテキスト](/learn/passing-data-deeply-with-context)を作成できます。

```js
const SomeContext = createContext(defaultValue)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `createContext(defaultValue)` {/*createcontext*/}

コンポーネントの外で`createContext`を呼び出してコンテキストを作成します。

```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `defaultValue`: コンテキストを読み取るコンポーネントの上に一致するコンテキストプロバイダーがない場合に、コンテキストに持たせたい値です。意味のあるデフォルト値がない場合は、`null`を指定してください。デフォルト値は「最後の手段」としてのフォールバックとして意図されています。これは静的であり、時間とともに変わることはありません。

#### 戻り値 {/*returns*/}

`createContext`はコンテキストオブジェクトを返します。

**コンテキストオブジェクト自体は情報を保持しません。** これは他のコンポーネントが読み取るまたは提供する_どの_コンテキストを表します。通常、上位のコンポーネントで[`SomeContext.Provider`](#provider)を使用してコンテキスト値を指定し、下位のコンポーネントで[`useContext(SomeContext)`](/reference/react/useContext)を呼び出して読み取ります。コンテキストオブジェクトにはいくつかのプロパティがあります：

* `SomeContext.Provider`はコンテキスト値をコンポーネントに提供します。
* `SomeContext.Consumer`はコンテキスト値を読み取るための代替手段であり、ほとんど使用されません。

---

### `SomeContext.Provider` {/*provider*/}

コンポーネントをコンテキストプロバイダーでラップして、このコンテキストの値を内部のすべてのコンポーネントに指定します：

```js
function App() {
  const [theme, setTheme] = useState('light');
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}
```

#### プロパティ {/*provider-props*/}

* `value`: このプロバイダー内のコンテキストを読み取るすべてのコンポーネントに渡したい値です。コンテキスト値は任意の型にすることができます。プロバイダー内で[`useContext(SomeContext)`](/reference/react/useContext)を呼び出すコンポーネントは、上位の最も内側の対応するコンテキストプロバイダーの`value`を受け取ります。

---

### `SomeContext.Consumer` {/*consumer*/}

`useContext`が存在する前は、コンテキストを読み取るための古い方法がありました：

```js
function Button() {
  // 🟡 レガシーな方法（推奨されません）
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```

この古い方法はまだ機能しますが、**新しく書かれたコードは代わりに[`useContext()`](/reference/react/useContext)を使用してコンテキストを読み取るべきです：**

```js
function Button() {
  // ✅ 推奨される方法
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

#### プロパティ {/*consumer-props*/}

* `children`: 関数です。Reactは、現在のコンテキスト値を[`useContext()`](/reference/react/useContext)と同じアルゴリズムで決定し、その関数に渡して、関数から返される結果をレンダリングします。親コンポーネントからのコンテキストが変更されるたびに、この関数を再実行してUIを更新します。

---

## 使用法 {/*usage*/}

### コンテキストの作成 {/*creating-context*/}

コンテキストを使用すると、コンポーネントが[情報を深く渡す](/learn/passing-data-deeply-with-context)ことができます。

コンポーネントの外で`createContext`を呼び出して、1つ以上のコンテキストを作成します。

```js [[1, 3, "ThemeContext"], [1, 4, "AuthContext"], [3, 3, "'light'"], [3, 4, "null"]]
import { createContext } from 'react';

const ThemeContext = createContext('light');
const AuthContext = createContext(null);
```

`createContext`は<CodeStep step={1}>コンテキストオブジェクト</CodeStep>を返します。コンポーネントはこれを[`useContext()`](/reference/react/useContext)に渡してコンテキストを読み取ることができます：

```js [[1, 2, "ThemeContext"], [1, 7, "AuthContext"]]
function Button() {
  const theme = useContext(ThemeContext);
  // ...
}

function Profile() {
  const currentUser = useContext(AuthContext);
  // ...
}
```

デフォルトでは、これらのコンポーネントが受け取る値は、コンテキストを作成するときに指定した<CodeStep step={3}>デフォルト値</CodeStep>です。しかし、これだけではデフォルト値は決して変わらないため、役に立ちません。

コンテキストは、**コンポーネントから他の動的な値を提供できるため**に役立ちます：

```js {8-9,11-12}
function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

  // ...

  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

これで、`Page`コンポーネントとその内部のすべてのコンポーネントは、渡されたコンテキスト値を「見る」ことができます。渡されたコンテキスト値が変更されると、Reactはコンテキストを読み取るコンポーネントも再レンダリングします。

[コンテキストの読み取りと提供についてさらに読むと、例を参照してください。](/reference/react/useContext)

---

### ファイルからのコンテキストのインポートとエクスポート {/*importing-and-exporting-context-from-a-file*/}

多くの場合、異なるファイルのコンポーネントが同じコンテキストにアクセスする必要があります。これが、コンテキストを別のファイルに宣言するのが一般的な理由です。その後、[`export`文](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export)を使用して、他のファイルでコンテキストを利用できるようにします：

```js {4-5}
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
```

他のファイルで宣言されたコンポーネントは、[`import`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/import)文を使用してこのコンテキストを読み取ったり提供したりできます：

```js {2}
// Button.js
import { ThemeContext } from './Contexts.js';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

```js {2}
// App.js
import { ThemeContext, AuthContext } from './Contexts.js';

function App() {
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

これは[コンポーネントのインポートとエクスポート](/learn/importing-and-exporting-components)と同様に機能します。

---

## トラブルシューティング {/*troubleshooting*/}

### コンテキスト値を変更する方法が見つかりません {/*i-cant-find-a-way-to-change-the-context-value*/}

このようなコードは*デフォルト*のコンテキスト値を指定します：

```js
const ThemeContext = createContext('light');
```

この値は決して変わりません。Reactは一致するプロバイダーが上に見つからない場合にのみ、この値をフォールバックとして使用します。

コンテキストを時間とともに変更するには、[状態を追加し、コンポーネントをコンテキストプロバイダーでラップします。](/reference/react/useContext#updating-data-passed-via-context)