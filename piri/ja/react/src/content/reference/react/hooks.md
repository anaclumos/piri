---
title: 組み込みのReactフック
---

<Intro>

*Hooks*を使用すると、コンポーネントからさまざまなReactの機能を利用できます。組み込みのHooksを使用することも、組み合わせて独自のHooksを作成することもできます。このページでは、Reactのすべての組み込みHooksを一覧表示しています。

</Intro>

---

## State Hooks {/*state-hooks*/}

*State*は、コンポーネントが[ユーザー入力のような情報を「記憶」する](/learn/state-a-components-memory)ことを可能にします。例えば、フォームコンポーネントは入力値を保存するためにstateを使用し、画像ギャラリーコンポーネントは選択された画像のインデックスを保存するためにstateを使用できます。

コンポーネントにstateを追加するには、次のHooksのいずれかを使用します：

* [`useState`](/reference/react/useState)は、直接更新できるstate変数を宣言します。
* [`useReducer`](/reference/react/useReducer)は、[reducer関数](/learn/extracting-state-logic-into-a-reducer)内に更新ロジックを持つstate変数を宣言します。

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## Context Hooks {/*context-hooks*/}

*Context*は、コンポーネントが[propsとして渡さずに遠くの親から情報を受け取る](/learn/passing-props-to-a-component)ことを可能にします。例えば、アプリのトップレベルコンポーネントが現在のUIテーマをすべての下位コンポーネントに渡すことができます。

* [`useContext`](/reference/react/useContext)は、コンテキストを読み取り、購読します。

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Ref Hooks {/*ref-hooks*/}

*Refs*は、コンポーネントが[レンダリングに使用されない情報を保持する](/learn/referencing-values-with-refs)ことを可能にします。例えば、DOMノードやタイムアウトIDなどです。stateとは異なり、refを更新してもコンポーネントは再レンダリングされません。RefsはReactのパラダイムからの「エスケープハッチ」です。非Reactシステム（組み込みのブラウザAPIなど）を扱う場合に役立ちます。

* [`useRef`](/reference/react/useRef)は、refを宣言します。任意の値を保持できますが、最も一般的にはDOMノードを保持するために使用されます。
* [`useImperativeHandle`](/reference/react/useImperativeHandle)は、コンポーネントが公開するrefをカスタマイズします。これはほとんど使用されません。

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## Effect Hooks {/*effect-hooks*/}

*Effects*は、コンポーネントが[外部システムと接続し、同期する](/learn/synchronizing-with-effects)ことを可能にします。これには、ネットワーク、ブラウザDOM、アニメーション、異なるUIライブラリで書かれたウィジェット、その他の非Reactコードの処理が含まれます。

* [`useEffect`](/reference/react/useEffect)は、コンポーネントを外部システムに接続します。

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```

EffectsはReactのパラダイムからの「エスケープハッチ」です。Effectsを使用してアプリケーションのデータフローを調整しないでください。外部システムとやり取りしていない場合は、[Effectが不要かもしれません。](/learn/you-might-not-need-an-effect)

`useEffect`には、タイミングに違いがある2つのあまり使用されないバリエーションがあります：

* [`useLayoutEffect`](/reference/react/useLayoutEffect)は、ブラウザが画面を再描画する前に発火します。ここでレイアウトを測定できます。
* [`useInsertionEffect`](/reference/react/useInsertionEffect)は、ReactがDOMに変更を加える前に発火します。ライブラリはここで動的CSSを挿入できます。

---

## Performance Hooks {/*performance-hooks*/}

再レンダリングのパフォーマンスを最適化する一般的な方法は、不要な作業をスキップすることです。例えば、Reactにキャッシュされた計算結果を再利用するように指示したり、前回のレンダリング以降データが変更されていない場合は再レンダリングをスキップすることができます。

計算と不要な再レンダリングをスキップするには、次のHooksのいずれかを使用します：

- [`useMemo`](/reference/react/useMemo)は、高コストの計算結果をキャッシュします。
- [`useCallback`](/reference/react/useCallback)は、最適化されたコンポーネントに渡す前に関数定義をキャッシュします。

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

画面を実際に更新する必要があるため、再レンダリングをスキップできない場合もあります。その場合、同期的でなければならないブロッキング更新（入力へのタイピングなど）と、ユーザーインターフェースをブロックする必要のない非ブロッキング更新（チャートの更新など）を分離することでパフォーマンスを向上させることができます。

レンダリングを優先するには、次のHooksのいずれかを使用します：

- [`useTransition`](/reference/react/useTransition)は、状態遷移を非ブロッキングとしてマークし、他の更新がそれを中断できるようにします。
- [`useDeferredValue`](/reference/react/useDeferredValue)は、UIの非重要部分の更新を遅らせ、他の部分を先に更新できるようにします。

---

## Other Hooks {/*other-hooks*/}

これらのHooksは主にライブラリの作成者にとって有用であり、アプリケーションコードではあまり使用されません。

- [`useDebugValue`](/reference/react/useDebugValue)は、カスタムHookのためにReact DevToolsが表示するラベルをカスタマイズします。
- [`useId`](/reference/react/useId)は、コンポーネントが一意のIDを自分自身に関連付けることを可能にします。通常、アクセシビリティAPIと共に使用されます。
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore)は、コンポーネントが外部ストアに購読することを可能にします。
* [`useActionState`](/reference/react/useActionState)は、アクションの状態を管理することを可能にします。

---

## Your own Hooks {/*your-own-hooks*/}

JavaScript関数として[独自のカスタムHooksを定義する](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component)こともできます。