---
title: コンポーネントとフックは純粋でなければなりません
---

<Intro>
純粋関数は計算のみを行い、それ以外のことはしません。これにより、コードの理解やデバッグが容易になり、ReactがコンポーネントやHooksを自動的に最適化できるようになります。
</Intro>

<Note>
このリファレンスページは高度なトピックを扱っており、[コンポーネントを純粋に保つ](/learn/keeping-components-pure)ページでカバーされている概念に精通していることが前提です。
</Note>

<InlineToc />

### なぜ純粋性が重要なのか？ {/*why-does-purity-matter*/}

ReactをReactたらしめる重要な概念の一つが純粋性です。純粋なコンポーネントやフックは以下の特徴を持ちます：

* **冪等性** – 同じ入力（コンポーネントの入力としてのprops、state、context、フックの入力としての引数）で実行するたびに[常に同じ結果が得られる](/learn/keeping-components-pure#purity-components-as-formulas)。
* **レンダー中に副作用がない** – 副作用のあるコードは[レンダリングとは別に](#how-does-react-run-your-code)実行されるべきです。例えば、ユーザーがUIと対話して更新を引き起こす[イベントハンドラー](/learn/responding-to-events)や、レンダー後に実行される[Effect](/reference/react/useEffect)などです。
* **非ローカルな値を変更しない** – コンポーネントやフックは[ローカルで作成されていない値を変更してはいけません](#mutation)。

レンダーが純粋に保たれると、Reactはユーザーにとって最も重要な更新を優先的に表示する方法を理解できます。これはレンダーの純粋性のおかげで可能になります。コンポーネントが[レンダー中に](#how-does-react-run-your-code)副作用を持たないため、Reactは重要でないコンポーネントのレンダリングを一時停止し、必要なときにのみそれらに戻ることができます。

具体的には、レンダリングロジックを複数回実行することで、Reactがユーザーに快適なユーザーエクスペリエンスを提供できるようになります。しかし、コンポーネントが追跡されていない副作用を持つ場合（例えば、[レンダー中に](#how-does-react-run-your-code)グローバル変数の値を変更するなど）、Reactが再度レンダリングコードを実行すると、副作用が意図しない形でトリガーされ、予期しないバグが発生し、アプリのユーザーエクスペリエンスが低下することがあります。[コンポーネントを純粋に保つページの例](/learn/keeping-components-pure#side-effects-unintended-consequences)でこれを見ることができます。

#### Reactはどのようにコードを実行するのか？ {/*how-does-react-run-your-code*/}

Reactは宣言的です。Reactに「何を」レンダリングするかを伝えると、Reactはそれをユーザーに最適に表示する方法を見つけます。これを行うために、Reactはいくつかのフェーズでコードを実行します。Reactをうまく使うためにこれらのフェーズすべてを知る必要はありませんが、高レベルでは、_レンダー_中に実行されるコードとその外で実行されるコードについて知っておくべきです。

_レンダリング_とは、次のバージョンのUIがどのように見えるべきかを計算することを指します。レンダリング後、[Effects](/reference/react/useEffect)が_フラッシュ_され（つまり、残りがなくなるまで実行され）、レイアウトに影響を与える場合は計算が更新されることがあります。Reactはこの新しい計算を前のバージョンのUIを作成するために使用された計算と比較し、最新バージョンに追いつくために[DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)（ユーザーが実際に見るもの）に必要最小限の変更を_コミット_します。

<DeepDive>

#### コードがレンダー中に実行されるかどうかを判断する方法 {/*how-to-tell-if-code-runs-in-render*/}

コードがレンダー中に実行されるかどうかを判断するための簡単なヒューリスティックは、その場所を調べることです。以下の例のようにトップレベルに書かれている場合、それがレンダー中に実行される可能性が高いです。

```js {2}
function Dropdown() {
  const selectedItems = new Set(); // レンダー中に作成される
  // ...
}
```

イベントハンドラーやEffectsはレンダー中に実行されません：

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  const onSelect = (item) => {
    // このコードはイベントハンドラー内にあるため、ユーザーがこれをトリガーしたときにのみ実行される
    selectedItems.add(item);
  }
}
```

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  useEffect(() => {
    // このコードはEffect内にあるため、レンダリング後にのみ実行される
    logForAnalytics(selectedItems);
  }, [selectedItems]);
}
```
</DeepDive>

---

## コンポーネントとフックは冪等でなければならない {/*components-and-hooks-must-be-idempotent*/}

コンポーネントは、入力（props、state、context）に対して常に同じ出力を返さなければなりません。これは冪等性として知られています。[冪等性](https://en.wikipedia.org/wiki/Idempotence)は関数型プログラミングで広まった用語で、同じ入力でそのコードを実行するたびに[常に同じ結果が得られる](learn/keeping-components-pure)という考えを指します。

これは、[レンダー中に](#how-does-react-run-your-code)実行される_すべて_のコードもこのルールを守るために冪等でなければならないことを意味します。例えば、次のコードは冪等ではありません（したがって、コンポーネントも冪等ではありません）：

```js {2}
function Clock() {
  const time = new Date(); // 🔴 悪い例: 常に異なる結果を返す！
  return <span>{time.toLocaleString()}</span>
}
```

`new Date()`は冪等ではなく、常に現在の日付を返し、呼び出されるたびに結果が変わります。上記のコンポーネントをレンダリングすると、画面に表示される時間はコンポーネントがレンダリングされた時点の時間に固定されます。同様に、`Math.random()`のような関数も冪等ではありません。なぜなら、同じ入力でも呼び出されるたびに異なる結果を返すからです。

これは`new Date()`のような非冪等関数を_全く_使用してはいけないという意味ではありません。単に[レンダー中に](#how-does-react-run-your-code)使用しないようにするべきです。この場合、最新の日付をこのコンポーネントに同期させるために[Effect](/reference/react/useEffect)を使用できます：

<Sandpack>

```js
import { useState, useEffect } from 'react';

function useTime() {
  // 1. 現在の日付の状態を追跡します。`useState`は初期状態として初期化関数を受け取ります。
  //    フックが呼び出されたときに一度だけ実行されるため、フックが呼び出された時点の現在の日付が最初に設定されます。
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    // 2. `setInterval`を使用して現在の日付を毎秒更新します。
    const id = setInterval(() => {
      setTime(new Date()); // ✅ 良い例: 非冪等コードはレンダー中に実行されなくなった
    }, 1000);
    // 3. `setInterval`タイマーをリークしないようにクリーンアップ関数を返します。
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function Clock() {
  const time = useTime();
  return <span>{time.toLocaleString()}</span>;
}
```

</Sandpack>

非冪等な`new Date()`呼び出しをEffectにラップすることで、その計算を[レンダリングの外](#how-does-react-run-your-code)に移動させます。

Reactと外部状態を同期させる必要がない場合、ユーザーの操作に応じて更新する必要がある場合は[イベントハンドラー](/learn/responding-to-events)を使用することも検討できます。

---

## 副作用はレンダーの外で実行されなければならない {/*side-effects-must-run-outside-of-render*/}

[副作用](/learn/keeping-components-pure#side-effects-unintended-consequences)は[レンダー中に](#how-does-react-run-your-code)実行されるべきではありません。Reactは最適なユーザーエクスペリエンスを提供するためにコンポーネントを複数回レンダリングすることができます。

<Note>
副作用はEffectよりも広い用語です。Effectは`useEffect`でラップされたコードを指しますが、副作用は呼び出し元に値を返すという主な結果以外の観察可能な効果を持つコードの一般的な用語です。

副作用は通常、[イベントハンドラー](/learn/responding-to-events)やEffect内に書かれますが、レンダー中には決して実行されません。
</Note>

レンダーは純粋に保たれるべきですが、副作用はアプリが画面に何かを表示するなど、興味深いことを行うために必要です。このルールの重要な点は、副作用が[レンダー中に](#how-does-react-run-your-code)実行されるべきではないということです。Reactはコンポーネントを複数回レンダリングすることができます。ほとんどの場合、副作用を処理するために[イベントハンドラー](learn/responding-to-events)を使用します。イベントハンドラーを使用することで、このコードがレンダー中に実行される必要がないことをReactに明示的に伝え、レンダーを純粋に保ちます。すべてのオプションを使い果たした場合 – そして最後の手段としてのみ – `useEffect`を使用して副作用を処理することもできます。

### いつミューテーションが許されるのか？ {/*mutation*/}

#### ローカルミューテーション {/*local-mutation*/}
副作用の一般的な例の一つはミューテーションで、これはJavaScriptでは非[プリミティブ](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)値の値を変更することを指します。一般的に、Reactではミューテーションは慣用的ではありませんが、_ローカル_なミューテーションは全く問題ありません：

```js {2,7}
function FriendList({ friends }) {
  const items = []; // ✅ 良い例: ローカルで作成された
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // ✅ 良い例: ローカルミューテーションは問題ない
  }
  return <section>{items}</section>;
}
```

ローカルミューテーションを避けるためにコードをねじ曲げる必要はありません。簡潔さのために[`Array.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)を使用することもできますが、ローカル配列を作成し、[レンダー中に](#how-does-react-run-your-code)アイテムをプッシュすることには何の問題もありません。

`items`をミューテートしているように見えますが、重要な点はこのコードが_ローカルに_のみ行われることです。ミューテーションはコンポーネントが再度レンダリングされるときに「記憶されない」ことです。言い換えれば、`items`はコンポーネントが存在する限りのみ存在します。`items`は毎回`<FriendList />`がレンダリングされるたびに_再作成_されるため、コンポーネントは常に同じ結果を返します。

一方、`items`がコンポーネントの外で作成された場合、それは以前の値を保持し、変更を記憶します：

```js {1,7}
const items = []; // 🔴 悪い例: コンポーネントの外で作成された
function FriendList({ friends }) {
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // 🔴 悪い例: レンダーの外で作成された値をミューテートしている
  }
  return <section>{items}</section>;
}
```

`<FriendList />`が再度実行されると、コンポーネントが実行されるたびに`friends`を`items`に追加し続け、複数の重複した結果が生じます。このバージョンの`<FriendList />`は[レンダー中に](#how-does-react-run-your-code)観察可能な副作用を持ち、**ルールを破ります**。

#### 遅延初期化 {/*lazy-initialization*/}

遅延初期化も完全に「純粋」ではないにもかかわらず問題ありません：

```js {2}
function ExpenseForm() {
  SuperCalculator.initializeIfNotReady(); // ✅ 良い例: 他のコンポーネントに影響を与えない場合
  // レンダリングを続ける...
}
```

#### DOMの変更 {/*changing-the-dom*/}

ユーザーに直接見える副作用はReactコンポーネントのレンダーロジック内で許可されていません。言い換えれば、コンポーネント関数を呼び出すだけで画面に変化が生じるべきではありません。

```js {2}
function ProductDetailPage({ product }) {
  document.window.title = product.title; // 🔴 悪い例: DOMを変更している
}
```

`window.title`をレンダーの外で更新するための一つの方法は、[コンポーネントを`window`と同期させる](/learn/synchronizing-with-effects)ことです。

コンポーネントを複数回呼び出しても安全で、他のコンポーネントのレンダリングに影響を与えない限り、Reactはそれが厳密な関数型プログラミングの意味で100%純粋であるかどうかを気にしません。より重要なのは[コンポーネントが冪等でなければならない](/reference/rules/components-and-hooks-must-be-pure)ことです。

---

## Propsとstateは不変である {/*props-and-state-are-immutable*/}

コンポーネントのpropsとstateは不変の[スナップショット](learn/state-as-a-snapshot)です。直接ミューテートしないでください。代わりに新しいpropsを渡し、`useState`のセッター関数を使用します。

propsとstateの値はレンダリング後に更新されるスナップショットと考えることができます。このため、propsやstate変数を直接変更するのではなく、新しいpropsを渡すか、提供されたセッター関数を使用して次回コンポーネントがレンダリングされるときにstateが更新されるようにReactに伝えます。

### Propsをミューテートしない {/*props*/}
propsは不変です。propsをミューテートすると、アプリケーションが一貫性のない出力を生成し、状況によっては動作するかどうかが異なるため、デバッグが難しくなります。

```js {2}
function Post({ item }) {
  item.url = new Url(item.url, base); // 🔴 悪い例: propsを直接ミューテートしない
  return <Link url={item.url}>{item.title}</Link>;
}
```

```js {2}
function Post({ item }) {
  const url = new Url(item.url, base); // ✅ 良い例: コピーを作成する
  return <Link url={url}>{item.title}</Link>;
}
```

### Stateをミューテートしない {/*state*/}
`useState`はstate変数とそのstateを更新するためのセッターを返します。

```js
const [stateVariable, setter] = useState(0);
```

state変数をその場で更新するのではなく、`useState`から返されるセッター関数を使用して更新する必要があります。state変数の値を変更してもコンポーネントは更新されず、ユーザーには古いUIが表示されます。セッター関数を使用することで、Reactにstateが変更されたことを通知し、UIを更新するために再レンダリングをキューに入れることができます。

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    count = count + 1; // 🔴 悪い例: stateを直接ミューテートしない
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1); // ✅ 良い例: useStateから返されるセッター関数を使用する
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

---

## フックの引数と戻り値は不変である {/*return-values-and-arguments-to-hooks-are-immutable*/}

一度フックに値を渡したら、それを変更してはいけません。JSXのpropsと同様に、フックに渡された値は不変になります。

```js {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  if (icon.enabled) {
    icon.className = computeStyle(icon, theme); // 🔴 悪い例: フックの引数を直接ミューテートしない
  }
  return icon;
}
```

```js {3}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  const newIcon = { ...icon }; // ✅ 良い例: コピーを作成する
  if (icon.enabled) {
    newIcon.className = computeStyle(icon, theme);
  }
  return newIcon;
}
```

Reactの重要な原則の一つは_ローカルな推論_です。これは、コンポーネントやフックが何をするかをそのコードを見て理解できる能力を指します。フックは呼び出されたときに「ブラックボックス」として扱われるべきです。例えば、カスタムフックはその引数を依存関係として使用して内部で値をメモ化しているかもしれません：

```js {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);

  return useMemo(() => {
    const newIcon = { ...icon };
    if (icon.enabled) {
      newIcon.className = computeStyle(icon, theme);
    }
    return newIcon;
  }, [icon, theme]);
}
```

フックの引数をミューテートすると、カスタムフックのメモ化が正しく機能しなくなるため、それを避けることが重要です。

```js {4}
style = useIconStyle(icon);         // `style`は`icon`に基づいてメモ化される
icon.enabled = false;               // 悪い例: 🔴 フックの引数を直接ミューテートしない
style = useIconStyle(icon);         // 以前にメモ化された結果が返される
```

```js {4}
style = useIconStyle(icon);         // `style`は`icon`に基づいてメモ化される
icon = { ...icon, enabled: false }; // 良い例: ✅ コピーを作成する
style = useIconStyle(icon);         // `style`の新しい値が計算される
```

同様に、フックの戻り値を変更しないことも重要です。これらはメモ化されている可能性があります。

---

## JSXに渡された値は不変である {/*values-are-immutable-after-being-passed-to-jsx*/}

JSXに使用された後に値をミューテートしないでください。ミューテーションをJSXが作成される前に移動させます。

JSXを式で使用する場合、Reactはコンポーネントがレンダリングを完了する前にJSXを積極的に評価することがあります。これは、JSXに渡された後に値をミューテートすると、Reactがコンポーネントの出力を更新することを知らないため、古いUIが表示される可能性があることを意味します。

```js {4}
function Page({ colour }) {
  const styles = { colour, size: "large" };
  const header = <Header styles={styles} />;
  styles.size = "small"; // 🔴 悪い例: stylesはすでに上記のJSXで使用されている
  const footer = <Footer styles={styles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```

```js {4}
function Page({ colour }) {
  const headerStyles = { colour, size: "large" };
  const header = <Header styles={headerStyles} />;
  const footerStyles = { colour, size: "small" }; // ✅ 良い例: 新しい値を作成した
  const footer = <Footer styles={footerStyles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```