---
title: Hooksのルール
---

<Intro>
HooksはJavaScript関数を使用して定義されますが、呼び出せる場所に制限がある特別な種類の再利用可能なUIロジックを表します。
</Intro>

<InlineToc />

---

##  Hooksはトップレベルでのみ呼び出す {/*only-call-hooks-at-the-top-level*/}

名前が`use`で始まる関数はReactでは[*Hooks*](/reference/react)と呼ばれます。

**Hooksをループ、条件、ネストされた関数、または`try`/`catch`/`finally`ブロック内で呼び出さないでください。** 代わりに、常にReact関数のトップレベルで、早期リターンの前にHooksを使用してください。HooksはReactが関数コンポーネントをレンダリングしている間にのみ呼び出すことができます：

* ✅ [関数コンポーネント](/learn/your-first-component)の本体のトップレベルで呼び出す。
* ✅ [カスタムHook](/learn/reusing-logic-with-custom-hooks)の本体のトップレベルで呼び出す。

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

他のケースでHooks（`use`で始まる関数）を呼び出すことは**サポートされていません**。例えば：

* 🔴 条件やループ内でHooksを呼び出さないでください。
* 🔴 条件付きの`return`文の後でHooksを呼び出さないでください。
* 🔴 イベントハンドラ内でHooksを呼び出さないでください。
* 🔴 クラスコンポーネント内でHooksを呼び出さないでください。
* 🔴 `useMemo`、`useReducer`、または`useEffect`に渡された関数内でHooksを呼び出さないでください。
* 🔴 `try`/`catch`/`finally`ブロック内でHooksを呼び出さないでください。

これらのルールを破ると、このエラーが表示されることがあります。

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 悪い: 条件内（修正するには、外に移動してください！）
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 悪い: ループ内（修正するには、外に移動してください！）
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 悪い: 条件付きのreturnの後（修正するには、returnの前に移動してください！）
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 悪い: イベントハンドラ内（修正するには、外に移動してください！）
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 悪い: useMemo内（修正するには、外に移動してください！）
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 悪い: クラスコンポーネント内（修正するには、クラスの代わりに関数コンポーネントを書いてください！）
    useEffect(() => {})
    // ...
  }
}

function Bad() {
  try {
    // 🔴 悪い: try/catch/finallyブロック内（修正するには、外に移動してください！）
    const [x, setX] = useState(0);
  } catch {
    const [x, setX] = useState(1);
  }
}
```

これらのミスをキャッチするために[`eslint-plugin-react-hooks`プラグイン](https://www.npmjs.com/package/eslint-plugin-react-hooks)を使用できます。

<Note>

[カスタムHooks](/learn/reusing-logic-with-custom-hooks)は他のHooksを呼び出す*ことができます*（それが彼らの目的です）。これは、カスタムHooksも関数コンポーネントがレンダリングされている間にのみ呼び出されることが前提だからです。

</Note>

---

## React関数からのみHooksを呼び出す {/*only-call-hooks-from-react-functions*/}

通常のJavaScript関数からHooksを呼び出さないでください。代わりに、次のようにします：

✅ React関数コンポーネントからHooksを呼び出す。
✅ [カスタムHooks](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component)からHooksを呼び出す。

このルールに従うことで、コンポーネント内のすべての状態管理ロジックがソースコードから明確に見えるようになります。

```js {2,5}
function FriendList() {
  const [onlineStatus, setOnlineStatus] = useOnlineStatus(); // ✅
}

function setOnlineStatus() { // ❌ コンポーネントやカスタムHookではありません！
  const [onlineStatus, setOnlineStatus] = useOnlineStatus();
}
```