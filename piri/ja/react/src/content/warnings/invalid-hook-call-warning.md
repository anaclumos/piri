---
title: Hooksのルール
---

おそらく、次のエラーメッセージが表示されたため、ここに来たのでしょう:

<ConsoleBlock level="error">

Hooksは関数コンポーネントの本体内でのみ呼び出すことができます。

</ConsoleBlock>

このエラーが表示される一般的な理由は3つあります:

1. **Hooksのルールを破っている**可能性があります。
2. ReactとReact DOMの**バージョンが一致していない**可能性があります。
3. 同じアプリに**複数のReactのコピー**が存在する可能性があります。

これらのケースをそれぞれ見ていきましょう。

## Hooksのルールを破る {/*breaking-rules-of-hooks*/}

名前が`use`で始まる関数は、Reactでは[*Hooks*](/reference/react)と呼ばれます。

**ループ、条件、またはネストされた関数内でHooksを呼び出さないでください。** 代わりに、常にReact関数のトップレベルで、早期リターンの前にHooksを使用してください。Reactが関数コンポーネントをレンダリングしている間にのみHooksを呼び出すことができます:

* ✅ [関数コンポーネント](/learn/your-first-component)の本体のトップレベルで呼び出します。
* ✅ [カスタムHook](/learn/reusing-logic-with-custom-hooks)の本体のトップレベルで呼び出します。

```js{2-3,8-9}
function Counter() {
  // ✅ 良い: 関数コンポーネントのトップレベル
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ 良い: カスタムHookのトップレベル
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

他のケースでHooks（`use`で始まる関数）を呼び出すことは**サポートされていません**。例えば:

* 🔴 条件やループ内でHooksを呼び出さないでください。
* 🔴 条件付きの`return`文の後でHooksを呼び出さないでください。
* 🔴 イベントハンドラ内でHooksを呼び出さないでください。
* 🔴 クラスコンポーネント内でHooksを呼び出さないでください。
* 🔴 `useMemo`、`useReducer`、または`useEffect`に渡された関数内でHooksを呼び出さないでください。

これらのルールを破ると、このエラーが表示される可能性があります。

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 悪い: 条件内 (修正するには、外に移動してください！)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 悪い: ループ内 (修正するには、外に移動してください！)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 悪い: 条件付きのreturnの後 (修正するには、returnの前に移動してください！)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 悪い: イベントハンドラ内 (修正するには、外に移動してください！)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 悪い: useMemo内 (修正するには、外に移動してください！)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 悪い: クラスコンポーネント内 (修正するには、クラスの代わりに関数コンポーネントを書いてください！)
    useEffect(() => {})
    // ...
  }
}
```

これらのミスをキャッチするために、[`eslint-plugin-react-hooks`プラグイン](https://www.npmjs.com/package/eslint-plugin-react-hooks)を使用できます。

<Note>

[カスタムHooks](/learn/reusing-logic-with-custom-hooks)は他のHooksを呼び出すことが*できます*（それが彼らの目的です）。これは、カスタムHooksも関数コンポーネントがレンダリングされている間にのみ呼び出されることが前提だからです。

</Note>

## ReactとReact DOMのバージョンが一致していない {/*mismatching-versions-of-react-and-react-dom*/}

`react-dom` (< 16.8.0) または `react-native` (< 0.59) のバージョンを使用している場合、Hooksをサポートしていない可能性があります。アプリケーションフォルダで`npm ls react-dom`または`npm ls react-native`を実行して、使用しているバージョンを確認できます。複数のバージョンが見つかった場合、これも問題を引き起こす可能性があります（詳細は以下を参照）。

## 重複したReact {/*duplicate-react*/}

Hooksが機能するためには、アプリケーションコードからの`react`インポートが`react-dom`パッケージ内の`react`インポートと同じモジュールに解決される必要があります。

これらの`react`インポートが異なるエクスポートオブジェクトに解決されると、この警告が表示されます。これは、**誤って2つの`react`パッケージのコピーを持ってしまった場合**に発生する可能性があります。

パッケージ管理にNodeを使用している場合、プロジェクトフォルダでこのチェックを実行できます:

<TerminalBlock>

npm ls react

</TerminalBlock>

複数のReactが表示された場合、その原因を特定し、依存関係ツリーを修正する必要があります。例えば、使用しているライブラリが`react`を依存関係として誤って指定している可能性があります（ピア依存関係ではなく）。そのライブラリが修正されるまで、[Yarn resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/)が一つの回避策です。

また、いくつかのログを追加して開発サーバーを再起動することで、この問題をデバッグすることもできます:

```js
// node_modules/react-dom/index.jsにこれを追加
window.React1 = require('react');

// コンポーネントファイルにこれを追加
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

`false`と表示された場合、2つのReactが存在する可能性があり、その原因を特定する必要があります。[この問題](https://github.com/facebook/react/issues/13991)には、コミュニティが遭遇した一般的な理由が含まれています。

この問題は、`npm link`や同等のものを使用する場合にも発生する可能性があります。その場合、バンドラーが2つのReactを「見る」ことがあります。1つはアプリケーションフォルダにあり、もう1つはライブラリフォルダにあります。`myapp`と`mylib`が兄弟フォルダであると仮定すると、1つの解決策は`mylib`から`npm link ../myapp/node_modules/react`を実行することです。これにより、ライブラリがアプリケーションのReactコピーを使用するようになります。

<Note>

一般的に、Reactは1ページに複数の独立したコピーを使用することをサポートしています（例えば、アプリとサードパーティのウィジェットの両方が使用する場合）。`require('react')`がコンポーネントとそれがレンダリングされた`react-dom`コピーの間で異なる解決をする場合にのみ問題が発生します。

</Note>

## その他の原因 {/*other-causes*/}

これらのどれもがうまくいかない場合は、[この問題](https://github.com/facebook/react/issues/13991)にコメントしてください。お手伝いします。小さな再現例を作成してみてください。作成中に問題を発見するかもしれません。