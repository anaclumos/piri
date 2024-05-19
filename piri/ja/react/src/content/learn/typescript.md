---
title: TypeScriptの使用
re: https://github.com/reactjs/react.dev/issues/5960
---

<Intro>

TypeScriptは、JavaScriptコードベースに型定義を追加するための人気のある方法です。TypeScriptは[JSXをサポート](/learn/writing-markup-with-jsx)しており、プロジェクトに[`@types/react`](https://www.npmjs.com/package/@types/react)と[`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom)を追加することで、完全なReact Webサポートを得ることができます。

</Intro>

<YouWillLearn>

* [TypeScriptとReactコンポーネント](/learn/typescript#typescript-with-react-components)
* [Hooksを使った型付けの例](/learn/typescript#example-hooks)
* [`@types/react`の一般的な型](/learn/typescript/#useful-types)
* [さらなる学習場所](/learn/typescript/#further-learning)

</YouWillLearn>

## インストール {/*installation*/}

すべての[プロダクショングレードのReactフレームワーク](/learn/start-a-new-react-project#production-grade-react-frameworks)は、TypeScriptの使用をサポートしています。インストールのためのフレームワーク固有のガイドに従ってください：

- [Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### 既存のReactプロジェクトにTypeScriptを追加する {/*adding-typescript-to-an-existing-react-project*/}

最新バージョンのReactの型定義をインストールするには：

<TerminalBlock>
npm install @types/react @types/react-dom
</TerminalBlock>

次のコンパイラオプションを`tsconfig.json`に設定する必要があります：

1. [`lib`](https://www.typescriptlang.org/tsconfig/#lib)に`dom`を含める必要があります（注：`lib`オプションが指定されていない場合、`dom`はデフォルトで含まれます）。
1. [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx)は有効なオプションのいずれかに設定する必要があります。ほとんどのアプリケーションでは`preserve`で十分です。
  ライブラリを公開する場合は、どの値を選択するかについて[`jsx`のドキュメント](https://www.typescriptlang.org/tsconfig/#jsx)を参照してください。

## TypeScriptとReactコンポーネント {/*typescript-with-react-components*/}

<Note>

JSXを含むすべてのファイルは`.tsx`ファイル拡張子を使用する必要があります。これは、このファイルにJSXが含まれていることをTypeScriptに伝えるTypeScript固有の拡張子です。

</Note>

TypeScriptでReactを書くことは、JavaScriptでReactを書くことと非常に似ています。コンポーネントを操作する際の主な違いは、コンポーネントのプロップに型を提供できることです。これらの型は、正確性のチェックやエディタ内のインラインドキュメントの提供に使用できます。

[クイックスタート](/learn)ガイドから[`MyButton`コンポーネント](/learn#components)を取り上げ、ボタンの`title`を記述する型を追加します：

<Sandpack>

```tsx src/App.tsx active
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a button" />
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```
</Sandpack>

<Note>

これらのサンドボックスはTypeScriptコードを処理できますが、型チェッカーは実行しません。これは、学習のためにTypeScriptサンドボックスを修正できることを意味しますが、型エラーや警告は表示されません。型チェックを行うには、[TypeScript Playground](https://www.typescriptlang.org/play)を使用するか、より機能豊富なオンラインサンドボックスを使用してください。

</Note>

このインライン構文は、コンポーネントに型を提供する最も簡単な方法ですが、いくつかのフィールドを記述し始めると扱いにくくなることがあります。代わりに、コンポーネントのプロップを記述するために`interface`や`type`を使用できます：

<Sandpack>

```tsx src/App.tsx active
interface MyButtonProps {
  /** ボタン内に表示するテキスト */
  title: string;
  /** ボタンが操作可能かどうか */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
    <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a disabled button" disabled={true}/>
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

コンポーネントのプロップを記述する型は、必要に応じてシンプルにも複雑にもできますが、`type`または`interface`で記述されたオブジェクト型である必要があります。TypeScriptがオブジェクトをどのように記述するかについては[オブジェクト型](https://www.typescriptlang.org/docs/handbook/2/objects.html)で学ぶことができますが、プロップがいくつかの異なる型のいずれかであることを記述するために[ユニオン型](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)を使用することや、より高度な使用例のために[型から型を作成する](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)ガイドを使用することにも興味があるかもしれません。

## Hooksの例 {/*example-hooks*/}

`@types/react`からの型定義には、組み込みのHooksの型が含まれているため、追加の設定なしでコンポーネント内で使用できます。これらはコンポーネント内で書いたコードを考慮して構築されているため、多くの場合、[推論された型](https://www.typescriptlang.org/docs/handbook/type-inference.html)を取得し、型を提供する細かい点を処理する必要は理想的にはありません。

しかし、Hooksに型を提供する方法のいくつかの例を見てみましょう。

### `useState` {/*typing-usestate*/}

[`useState` Hook](/reference/react/useState)は、初期状態として渡された値を再利用して、値の型を決定します。例えば：

```ts
// 型を"boolean"として推論
const [enabled, setEnabled] = useState(false);
```

これにより、`enabled`の型は`boolean`に割り当てられ、`setEnabled`は`boolean`引数を受け取る関数、または`boolean`を返す関数になります。状態の型を明示的に提供したい場合は、`useState`呼び出しに型引数を提供することで可能です：

```ts 
// 型を"boolean"として明示的に設定
const [enabled, setEnabled] = useState<boolean>(false);
```

この場合はあまり役に立ちませんが、型を提供したい一般的なケースは、ユニオン型を持つ場合です。例えば、ここでの`status`は、いくつかの異なる文字列のいずれかです：

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

または、[状態の構造を選択するための原則](/learn/choosing-the-state-structure#principles-for-structuring-state)で推奨されているように、関連する状態をオブジェクトとしてグループ化し、オブジェクト型を通じて異なる可能性を記述することができます：

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer` {/*typing-usereducer*/}

[`useReducer` Hook](/reference/react/useReducer)は、リデューサ関数と初期状態を取るより複雑なHookです。リデューサ関数の型は初期状態から推論されます。状態の型を提供するために`useReducer`呼び出しに型引数をオプションで提供できますが、初期状態に型を設定する方が良いことが多いです：

<Sandpack>

```tsx src/App.tsx active
import {useReducer} from 'react';

interface State {
   count: number 
};

type CounterAction =
  | { type: "reset" }
  | { type: "setCount"; value: State["count"] }

const initialState: State = { count: 0 };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setCount":
      return { ...state, count: action.value };
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>Welcome to my counter</h1>

      <p>Count: {state.count}</p>
      <button onClick={addFive}>Add 5</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

TypeScriptをいくつかの重要な場所で使用しています：

 - `interface State`はリデューサの状態の形状を記述します。
 - `type CounterAction`はリデューサにディスパッチできるさまざまなアクションを記述します。
 - `const initialState: State`は初期状態の型を提供し、デフォルトで`useReducer`が使用する型も提供します。
 - `stateReducer(state: State, action: CounterAction): State`はリデューサ関数の引数と戻り値の型を設定します。

`initialState`に型を設定するよりも明示的な代替手段は、`useReducer`に型引数を提供することです：

```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext` {/*typing-usecontext*/}

[`useContext` Hook](/reference/react/useContext)は、コンポーネントを通じてプロップを渡さずにデータをコンポーネントツリーに渡すための技術です。プロバイダコンポーネントを作成し、子コンポーネントで値を消費するためのHookを作成することで使用されます。

コンテキストによって提供される値の型は、`createContext`呼び出しに渡された値から推論されます：

<Sandpack>

```tsx src/App.tsx active
import { createContext, useContext, useState } from 'react';

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<Theme>("system");

const useGetTheme = () => useContext(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext.Provider value={theme}>
      <MyComponent />
    </ThemeContext.Provider>
  )
}

function MyComponent() {
  const theme = useGetTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
    </div>
  )
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

この技術は、意味のあるデフォルト値がある場合に機能しますが、場合によってはデフォルト値がない場合もあり、その場合`null`が合理的なデフォルト値と感じることがあります。しかし、型システムがコードを理解できるようにするためには、`createContext`に`ContextShape | null`を明示的に設定する必要があります。

これにより、コンテキスト消費者の型から`| null`を排除する必要が生じます。私たちの推奨は、Hookが存在をランタイムチェックし、存在しない場合にエラーをスローすることです：

```js {5, 16-20}
import { createContext, useContext, useState, useMemo } from 'react';

// これは簡単な例ですが、ここでより複雑なオブジェクトを想像することができます
type ComplexObject = {
  kind: string
};

// コンテキストは、デフォルト値を正確に反映するために`| null`を型に含めて作成されます。
const Context = createContext<ComplexObject | null>(null);

// Hook内のチェックを通じて`| null`が削除されます。
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("useGetComplexObject must be used within a Provider") }
  return object;
}

export default function MyApp() {
  const object = useMemo(() => ({ kind: "complex" }), []);

  return (
    <Context.Provider value={object}>
      <MyComponent />
    </Context.Provider>
  )
}

function MyComponent() {
  const object = useGetComplexObject();

  return (
    <div>
      <p>Current object: {object.kind}</p>
    </div>
  )
}
```

### `useMemo` {/*typing-usememo*/}

[`useMemo`](/reference/react/useMemo) Hooksは、関数呼び出しからメモ化された値を作成/再アクセスし、2番目のパラメータとして渡された依存関係が変更されたときにのみ関数を再実行します。Hookの呼び出しの結果は、最初のパラメータの関数の戻り値から推論されます。Hookに型引数を提供することで、より明示的にすることができます。

```ts
// visibleTodosの型はfilterTodosの戻り値から推論されます
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```

### `useCallback` {/*typing-usecallback*/}

[`useCallback`](/reference/react/useCallback)は、依存関係が同じである限り、関数への安定した参照を提供します。`useMemo`と同様に、関数の型は最初のパラメータの関数の戻り値から推論され、Hookに型引数を提供することで、より明示的にすることができます。

```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

TypeScriptの厳密モードで作業する場合、`useCallback`はコールバックのパラメータに型を追加する必要があります。これは、コールバックの型が関数の戻り値から推論され、パラメータがないと型が完全に理解できないためです。

コードスタイルの好みに応じて、Reactの型から`*EventHandler`関数を使用して、コールバックを定義すると同時にイベントハンドラの型を提供することができます：

```ts
import { useState, useCallback } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])
  
  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

## 便利な型 {/*useful-types*/}

`@types/react`パッケージから提供される型は非常に広範囲にわたります。ReactとTypeScriptの相互作用に慣れたら、一読する価値があります。これらの型は[DefinitelyTypedのReactフォルダ](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts)にあります。ここでは、より一般的な型のいくつかを紹介します。

### DOMイベント {/*typing-dom-events*/}

ReactでDOMイベントを操作する場合、イベントの型はイベントハンドラから推論されることがよくあります。しかし、イベントハンドラに渡す関数を抽出したい場合は、イベントの型を明示的に設定する必要があります。

<Sandpack>

```tsx src/App.tsx active
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Reactの型には多くの種類のイベントが提供されています。完全なリストは[こちら](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373)にあり、これは[DOMの最も人気のあるイベント](https://developer.mozilla.org/en-US/docs/Web/Events)に基づいています。

探している型を決定する際には、使用しているイベントハンドラのホバー情報を最初に確認することができます。これにより、イベントの型が表示されます。

このリストに含まれていないイベントを使用する必要がある場合は、`React.SyntheticEvent`型を使用できます。これはすべてのイベントの基本型です。

### 子要素 {/*typing-children*/}

コンポーネントの子要素を記述するための一般的な方法は2つあります。最初の方法は、JSXで子要素として渡すことができるすべての可能な型のユニオンである`React.ReactNode`型を使用することです：

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

これは非常に広範な子要素の定義です。2つ目の方法は、JavaScriptのプリミティブ（文字列や数値など）ではなく、JSX要素のみを含む`React.ReactElement`型を使用することです：

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

注意点として、TypeScriptを使用して特定のタイプのJSX要素のみを子要素として受け入れるコンポーネントを記述することはできません。したがって、`<li>`子要素のみを受け入れるコンポーネントを型システムで記述することはできません。

`React.ReactNode`と`React.ReactElement`の両方の例を型チェッカーとともに[このTypeScriptプレイグラウンド](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFf39deFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA)で確認できます。

### スタイルプロップ {/*typing-style-props*/}

Reactでインラインスタイルを使用する場合、`React.CSSProperties`を使用して`style`プロップに渡されるオブジェクトを記述できます。この型はすべての可能なCSSプロパティのユニオンであり、`style`プロップに有効なCSSプロパティを渡していることを確認し、エディタで自動補完を取得するための良い方法です。

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## さらなる学習 {/*further-learning*/}

このガイドでは、TypeScriptとReactを使用する基本をカバーしましたが、学ぶべきことはまだたくさんあります。
ドキュメントの個々のAPIページには、TypeScriptを使用する方法に関するより詳細なドキュメントが含まれている場合があります。

以下のリソースをお勧めします：

 - [TypeScriptハンドブック](https://www.typescriptlang.org/docs/handbook/)は、TypeScriptの公式ドキュメントであり、主要な言語機能のほとんどをカバーしています。

 - [TypeScriptリリースノート](https://devblogs.microsoft.com/typescript/)は、新機能を詳細にカバーしています。

 - [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)は、TypeScriptとReactを使用するためのコミュニティが維持するチートシートであり、多くの有用なエッジケースをカバーし、このドキュメントよりも広範な情報を提供しています。

 - [TypeScript Community Discord](https://discord.com/invite/typescript)は、TypeScriptとReactの問題について質問し、助けを得るための素晴らしい場所です。