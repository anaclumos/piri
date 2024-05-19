---
title: レンダーとコミット
---

<Intro>

コンポーネントが画面に表示される前に、Reactによってレンダリングされる必要があります。このプロセスのステップを理解することで、コードの実行方法を考え、その動作を説明するのに役立ちます。

</Intro>

<YouWillLearn>

* Reactにおけるレンダリングの意味
* Reactがコンポーネントをレンダリングするタイミングと理由
* コンポーネントを画面に表示するためのステップ
* レンダリングが必ずしもDOMの更新を引き起こさない理由

</YouWillLearn>

コンポーネントがキッチンで料理を作るコックだと想像してください。このシナリオでは、Reactは顧客からのリクエストを受け取り、それを提供するウェイターです。このUIのリクエストと提供のプロセスには3つのステップがあります：

1. レンダリングの**トリガー**（ゲストの注文をキッチンに届ける）
2. コンポーネントの**レンダリング**（キッチンで注文を準備する）
3. DOMへの**コミット**（注文をテーブルに置く）

<IllustrationBlock sequential>
  <Illustration caption="Trigger" alt="レストランでサーバーとしてのReactがユーザーからの注文を取得し、コンポーネントキッチンに届ける。" src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="カードシェフがReactに新鮮なカードコンポーネントを渡す。" src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="Reactがテーブルでユーザーにカードを提供する。" src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

## Step 1: レンダリングのトリガー {/*step-1-trigger-a-render*/}

コンポーネントがレンダリングされる理由は2つあります：

1. コンポーネントの**初期レンダリング**。
2. コンポーネント（またはその祖先の1つ）の**状態が更新された**。

### 初期レンダリング {/*initial-render*/}

アプリが起動すると、初期レンダリングをトリガーする必要があります。フレームワークやサンドボックスはこのコードを隠すことがありますが、これはターゲットDOMノードで[`createRoot`](/reference/react-dom/client/createRoot)を呼び出し、その後コンポーネントでその`render`メソッドを呼び出すことで行われます：

<Sandpack>

```js src/index.js active
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```

```js src/Image.js
export default function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

</Sandpack>

`root.render()`の呼び出しをコメントアウトして、コンポーネントが消えるのを確認してみてください！

### 状態が更新されたときの再レンダリング {/*re-renders-when-state-updates*/}

コンポーネントが初期レンダリングされた後、状態を[`set`関数](/reference/react/useState#setstate)で更新することでさらにレンダリングをトリガーできます。コンポーネントの状態を更新すると、自動的にレンダリングがキューに入ります。（これは、レストランのゲストが最初の注文を出した後、状態に応じてお茶やデザートなどを注文するのと同じです。）

<IllustrationBlock sequential>
  <Illustration caption="State update..." alt="レストランでサーバーとしてのReactがユーザーにカードUIを提供し、ユーザーが黒ではなくピンクのカードを欲しがっていることを表現している。" src="/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="...triggers..." alt="Reactがコンポーネントキッチンに戻り、カードシェフにピンクのカードが必要だと伝える。" src="/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="...render!" alt="カードシェフがReactにピンクのカードを渡す。" src="/images/docs/illustrations/i_rerender3.png" />
</IllustrationBlock>

## Step 2: Reactがコンポーネントをレンダリングする {/*step-2-react-renders-your-components*/}

レンダリングをトリガーした後、Reactはコンポーネントを呼び出して画面に表示する内容を決定します。**「レンダリング」とは、Reactがコンポーネントを呼び出すことです。**

* **初期レンダリングでは、** Reactはルートコンポーネントを呼び出します。
* **その後のレンダリングでは、** 状態更新がレンダリングをトリガーした関数コンポーネントを呼び出します。

このプロセスは再帰的です：更新されたコンポーネントが他のコンポーネントを返す場合、Reactは次にそのコンポーネントをレンダリングし、そのコンポーネントも何かを返す場合、次にそのコンポーネントをレンダリングします。このプロセスは、ネストされたコンポーネントがなくなり、Reactが画面に表示する内容を完全に把握するまで続きます。

次の例では、Reactは`Gallery()`と`Image()`を何度も呼び出します：

<Sandpack>

```js src/Gallery.js active
export default function Gallery() {
  return (
    <section>
      <h1>Inspiring Sculptures</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

```js src/index.js
import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Gallery />);
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

* **初期レンダリング中に、** Reactは`<section>`、`<h1>`、および3つの`<img>`タグのための[DOMノードを作成](https://developer.mozilla.org/docs/Web/API/Document/createElement)します。
* **再レンダリング中に、** Reactは前回のレンダリング以降にプロパティが変更されたかどうかを計算します。その情報を次のステップであるコミットフェーズまで何もしません。

<Pitfall>

レンダリングは常に[純粋な計算](/learn/keeping-components-pure)でなければなりません：

* **同じ入力、同じ出力。** 同じ入力が与えられた場合、コンポーネントは常に同じJSXを返すべきです。（誰かがトマト入りのサラダを注文した場合、玉ねぎ入りのサラダを受け取るべきではありません！）
* **自分のことに専念する。** レンダリング前に存在していたオブジェクトや変数を変更してはいけません。（1つの注文が他の誰かの注文を変更してはいけません。）

そうしないと、コードベースが複雑になるにつれて混乱するバグや予測不可能な動作に遭遇する可能性があります。「Strict Mode」で開発する場合、Reactは各コンポーネントの関数を2回呼び出し、不純な関数によるミスを表面化させるのに役立ちます。

</Pitfall>

<DeepDive>

#### パフォーマンスの最適化 {/*optimizing-performance*/}

更新されたコンポーネント内にネストされたすべてのコンポーネントをレンダリングするデフォルトの動作は、ツリーの非常に高い位置にある更新されたコンポーネントの場合、パフォーマンスに最適ではありません。パフォーマンスの問題に直面した場合、[パフォーマンス](https://reactjs.org/docs/optimizing-performance.html)セクションで説明されているいくつかのオプトイン方法で解決できます。**早期に最適化しないでください！**

</DeepDive>

## Step 3: ReactがDOMに変更をコミットする {/*step-3-react-commits-changes-to-the-dom*/}

コンポーネントをレンダリング（呼び出し）した後、ReactはDOMを変更します。

* **初期レンダリングの場合、** Reactは[`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) DOM APIを使用して、作成したすべてのDOMノードを画面に表示します。
* **再レンダリングの場合、** ReactはDOMを最新のレンダリング出力に一致させるために必要な最小限の操作（レンダリング中に計算されたもの）を適用します。

**Reactはレンダリング間に違いがある場合にのみDOMノードを変更します。** 例えば、親から渡される異なるプロップで毎秒再レンダリングされるコンポーネントがあります。`<input>`にテキストを追加してその`value`を更新できますが、コンポーネントが再レンダリングされてもテキストは消えません：

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time.toLocaleTimeString()} />
  );
}
```

</Sandpack>

これは、最後のステップでReactが新しい`time`で`<h1>`の内容のみを更新するためです。`<input>`が前回と同じ場所にJSXに表示されていることを確認し、Reactは`<input>`やその`value`に触れません！
## エピローグ: ブラウザのペイント {/*epilogue-browser-paint*/}

レンダリングが完了し、ReactがDOMを更新した後、ブラウザは画面を再描画します。このプロセスは「ブラウザレンダリング」として知られていますが、混乱を避けるためにドキュメント全体で「ペイント」と呼びます。

<Illustration alt="ブラウザが「カード要素の静物画」を描いている。" src="/images/docs/illustrations/i_browser-paint.png" />

<Recap>

* Reactアプリの画面更新は3つのステップで行われます：
  1. トリガー
  2. レンダリング
  3. コミット
* Strict Modeを使用してコンポーネントのミスを見つけることができます
* レンダリング結果が前回と同じ場合、ReactはDOMに触れません

</Recap>