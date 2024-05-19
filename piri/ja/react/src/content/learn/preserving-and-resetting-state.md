---
title: 状態の保持とリセット
---

<Intro>

状態はコンポーネント間で分離されています。ReactはUIツリー内の位置に基づいて、どの状態がどのコンポーネントに属するかを追跡します。再レンダリング間で状態を保持するかリセットするかを制御できます。

</Intro>

<YouWillLearn>

* Reactが状態を保持するかリセットするかを選択するタイミング
* Reactにコンポーネントの状態をリセットさせる方法
* キーとタイプが状態の保持にどのように影響するか

</YouWillLearn>

## 状態はレンダーツリー内の位置に結びついている {/*state-is-tied-to-a-position-in-the-tree*/}

ReactはUI内のコンポーネント構造のために[レンダーツリー](learn/understanding-your-ui-as-a-tree#the-render-tree)を構築します。

コンポーネントに状態を与えると、その状態がコンポーネント内に「存在する」と考えるかもしれません。しかし、実際には状態はReact内に保持されています。Reactは保持している各状態を、そのコンポーネントがレンダーツリー内のどこにあるかによって正しいコンポーネントに関連付けます。

ここでは、1つの`<Counter />` JSXタグしかありませんが、2つの異なる位置にレンダリングされています：

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

これらがツリーとしてどのように見えるかを示します：

<DiagramGroup>

<Diagram name="preserving_state_tree" height={248} width={395} alt="Reactコンポーネントのツリーの図。ルートノードは'div'とラベル付けされ、2つの子を持っています。各子は'Counter'とラベル付けされ、両方とも値0の'state'バブルを含んでいます。">

Reactツリー

</Diagram>

</DiagramGroup>

**これらはツリー内のそれぞれの位置にレンダリングされているため、2つの別々のカウンターです。** Reactを使用するためにこれらの位置について通常は考える必要はありませんが、どのように機能するかを理解することは役立ちます。

Reactでは、画面上の各コンポーネントは完全に分離された状態を持っています。例えば、2つの`Counter`コンポーネントを並べてレンダリングすると、それぞれが独自の独立した`score`と`hover`状態を持ちます。

両方のカウンターをクリックして、それらが互いに影響しないことを確認してください：

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

ご覧の通り、1つのカウンターが更新されると、そのコンポーネントの状態のみが更新されます：

<DiagramGroup>

<Diagram name="preserving_state_increment" height={248} width={441} alt="Reactコンポーネントのツリーの図。ルートノードは'div'とラベル付けされ、2つの子を持っています。左の子は'Counter'とラベル付けされ、値0の'state'バブルを含んでいます。右の子は'Counter'とラベル付けされ、値1の'state'バブルを含んでいます。右の子の'state'バブルは、その値が更新されたことを示すために黄色でハイライトされています。">

状態の更新

</Diagram>

</DiagramGroup>

Reactは、同じコンポーネントをツリー内の同じ位置にレンダリングしている限り、状態を保持します。これを確認するために、両方のカウンターをインクリメントし、次に「2番目のカウンターをレンダリングする」チェックボックスをオフにして2番目のコンポーネントを削除し、再度オンにして追加してください：

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />} 
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        Render the second counter
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

2番目のカウンターのレンダリングを停止した瞬間に、その状態が完全に消えることに注意してください。これは、Reactがコンポーネントを削除すると、その状態を破棄するためです。

<DiagramGroup>

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="Reactコンポーネントのツリーの図。ルートノードは'div'とラベル付けされ、2つの子を持っています。左の子は'Counter'とラベル付けされ、値0の'state'バブルを含んでいます。右の子は欠けており、その代わりに黄色の'poof'画像があり、コンポーネントがツリーから削除されたことを強調しています。">

コンポーネントの削除

</Diagram>

</DiagramGroup>

「2番目のカウンターをレンダリングする」をチェックすると、2番目の`Counter`とその状態が最初から初期化され（`score = 0`）、DOMに追加されます。

<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="Reactコンポーネントのツリーの図。ルートノードは'div'とラベル付けされ、2つの子を持っています。左の子は'Counter'とラベル付けされ、値0の'state'バブルを含んでいます。右の子は'Counter'とラベル付けされ、値0の'state'バブルを含んでいます。右の子ノード全体が黄色でハイライトされており、ツリーに追加されたことを示しています。">

コンポーネントの追加

</Diagram>

</DiagramGroup>

**Reactは、UIツリー内の位置にレンダリングされている限り、コンポーネントの状態を保持します。** それが削除されるか、同じ位置に異なるコンポーネントがレンダリングされると、Reactはその状態を破棄します。

## 同じ位置にある同じコンポーネントは状態を保持する {/*same-component-at-the-same-position-preserves-state*/}

この例では、2つの異なる`<Counter />`タグがあります：

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

チェックボックスをオンまたはオフにすると、カウンターの状態はリセットされません。`isFancy`が`true`であろうと`false`であろうと、常にルート`App`コンポーネントから返される`div`の最初の子として`<Counter />`があります：

<DiagramGroup>

<Diagram name="preserving_state_same_component" height={461} width={600} alt="2つのセクションが矢印で区切られた図。各セクションには、親が'isFancy'という状態バブルを持つ'App'とラベル付けされたコンポーネントのレイアウトが含まれています。このコンポーネントには1つの子があり、'div'とラベル付けされ、その下に'isFancy'（紫色でハイライト）というプロップバブルが渡されます。最後の子は'Counter'とラベル付けされ、両方の図で値3の'state'バブルを含んでいます。左のセクションでは、何もハイライトされておらず、親のisFancy状態値はfalseです。右のセクションでは、親のisFancy状態値がtrueに変わり、黄色でハイライトされています。">

`App`の状態を更新しても、`Counter`は同じ位置にあるためリセットされません

</Diagram>

</DiagramGroup>

同じ位置にある同じコンポーネントなので、Reactの視点からは同じカウンターです。

<Pitfall>

**Reactにとって重要なのは、JSXマークアップ内の位置ではなく、UIツリー内の位置です！** このコンポーネントには、`if`の内外に異なる`<Counter />` JSXタグを持つ2つの`return`句があります：

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Use fancy styling
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

チェックボックスをオンにすると状態がリセットされると予想するかもしれませんが、そうではありません！ これは、**これらの`<Counter />`タグが同じ位置にレンダリングされているためです。** Reactは関数内の条件の配置場所を認識しません。Reactが「見る」のは返されるツリーだけです。

どちらの場合も、`App`コンポーネントは最初の子として`<Counter />`を持つ`<div>`を返します。Reactにとって、これらの2つのカウンターは同じ「アドレス」を持っています：ルートの最初の子の最初の子です。これが、前回のレンダリングと次回のレンダリングの間でそれらを一致させる方法です。ロジックの構造に関係なく。

</Pitfall>

## 同じ位置にある異なるコンポーネントは状態をリセットする {/*different-components-at-the-same-position-reset-state*/}

この例では、チェックボックスをオンにすると`<Counter>`が`<p>`に置き換わります：

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>See you later!</p> 
      ) : (
        <Counter /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        Take a break
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text
-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

ここでは、同じ位置に異なるコンポーネントタイプを切り替えています。最初は、`<div>`の最初の子に`Counter`が含まれていました。しかし、`p`を挿入すると、Reactは`Counter`をUIツリーから削除し、その状態を破棄します。

<DiagramGroup>

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="Reactコンポーネントのツリーの図。最初のセクションには、'div'とラベル付けされたReactコンポーネントがあり、1つの子があり、'Counter'とラベル付けされ、値3の'state'バブルを含んでいます。中央のセクションでは、同じ'div'親がありますが、子コンポーネントは削除され、黄色の'poof'画像で示されています。最後のセクションでは、同じ'div'親があり、新しい子が追加され、黄色でハイライトされています。新しい子は'p'とラベル付けされています。">

`Counter`が`p`に変わると、`Counter`が削除され、`p`が追加されます

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="Reactコンポーネントのツリーの図。最初のセクションには、'p'とラベル付けされたReactコンポーネントがあります。中央のセクションでは、同じ'div'親がありますが、子コンポーネントは削除され、黄色の'poof'画像で示されています。最後のセクションでは、同じ'div'親があり、新しい子が追加され、黄色でハイライトされています。新しい子は'Counter'とラベル付けされ、値0の'state'バブルを含んでいます。">

切り替えると、`p`が削除され、`Counter`が追加されます

</Diagram>

</DiagramGroup>

また、**同じ位置に異なるコンポーネントをレンダリングすると、そのサブツリー全体の状態がリセットされます。** これがどのように機能するかを見るために、カウンターをインクリメントしてからチェックボックスをオンにしてください：

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} /> 
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

チェックボックスをクリックすると、カウンターの状態がリセットされます。`Counter`をレンダリングしているにもかかわらず、`div`の最初の子が`div`から`section`に変わります。子の`div`がDOMから削除されると、その下のツリー全体（`Counter`とその状態を含む）が破壊されます。

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Reactコンポーネントのツリーの図。最初のセクションには、'div'とラベル付けされたReactコンポーネントがあり、1つの子があり、'section'とラベル付けされ、その中に'Counter'があり、値3の'state'バブルを含んでいます。中央のセクションでは、同じ'div'親がありますが、子コンポーネントは削除され、黄色の'poof'画像で示されています。最後のセクションでは、同じ'div'親があり、新しい子が追加され、黄色でハイライトされています。新しい子は'div'とラベル付けされ、その中に'Counter'があり、値0の'state'バブルを含んでいます。">

`section`が`div`に変わると、`section`が削除され、新しい`div`が追加されます

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="Reactコンポーネントのツリーの図。最初のセクションには、'div'とラベル付けされたReactコンポーネントがあり、1つの子があり、'div'とラベル付けされ、その中に'Counter'があり、値0の'state'バブルを含んでいます。中央のセクションでは、同じ'div'親がありますが、子コンポーネントは削除され、黄色の'poof'画像で示されています。最後のセクションでは、同じ'div'親があり、新しい子が追加され、黄色でハイライトされています。新しい子は'section'とラベル付けされ、その中に'Counter'があり、値0の'state'バブルを含んでいます。">

切り替えると、`div`が削除され、新しい`section`が追加されます

</Diagram>

</DiagramGroup>

経験則として、**再レンダリング間で状態を保持したい場合、ツリーの構造が一致する必要があります。** 構造が異なる場合、Reactはコンポーネントをツリーから削除すると状態を破棄するため、状態が破壊されます。

<Pitfall>

これが、コンポーネント関数の定義をネストしない理由です。

ここでは、`MyTextField`コンポーネント関数が`MyComponent`の内部に定義されています：

<Sandpack>

```js
import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>Clicked {counter} times</button>
    </>
  );
}
```

</Sandpack>

ボタンをクリックするたびに、入力状態が消えます！ これは、`MyComponent`の各レンダリングに対して異なる`MyTextField`関数が作成されるためです。同じ位置に異なるコンポーネントをレンダリングしているため、Reactはその下のすべての状態をリセットします。これによりバグやパフォーマンスの問題が発生します。この問題を回避するために、**常にコンポーネント関数をトップレベルで宣言し、その定義をネストしないでください。**

</Pitfall>

## 同じ位置で状態をリセットする {/*resetting-state-at-the-same-position*/}

デフォルトでは、Reactは同じ位置にあるコンポーネントの状態を保持します。通常、これはまさに望むものであり、デフォルトの動作として理にかなっています。しかし、時にはコンポーネントの状態をリセットしたい場合もあります。このアプリでは、2人のプレイヤーが各ターンのスコアを追跡できます：

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Taylor" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

現在、プレイヤーを変更するとスコアが保持されます。2つの`Counter`は同じ位置に表示されるため、Reactはそれらを*同じ*`Counter`と見なし、その`person`プロップが変更されたと認識します。

しかし、このアプリでは概念的には2つの別々のカウンターであるべきです。UIの同じ場所に表示されるかもしれませんが、1つはTaylorのカウンターであり、もう1つはSarahのカウンターです。

それらを切り替えるときに状態をリセットする方法は2つあります：

1. 異なる位置にコンポーネントをレンダリングする
2. 各コンポーネントに`key`を使って明示的な識別子を与える

### オプション1: 異なる位置にコンポーネントをレンダリングする {/*option-1-rendering-a-component-in-different-positions*/}

これらの2つの`Counter`を独立させたい場合は、異なる位置にレンダリングできます：

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

* 最初は、`isPlayerA`が`true`です。したがって、最初の位置には`Counter`の状態があり、2番目の位置は空です。
* 「Next player」ボタンをクリックすると、最初の位置がクリアされ、2番目の位置に`Counter`が表示されます。

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="Reactコンポーネントのツリーの図。親は'Scoreboard'とラベル付けされ、'isPlayerA'という状態バブルを持っています。唯一の子は左に配置され、'Counter'とラベル付けされ、値0の'state'バブルを含んでいます。左の子全体が黄色でハイライトされ、追加されたことを示しています。">

初期状態

</Diagram>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="Reactコンポーネントのツリーの図。親は'Scoreboard'とラベル付けされ、'isPlayerA'という状態バブルを持っています。状態バブルは黄色でハイライトされ、変更されたことを示しています。左の子は黄色の'poof'画像で置き換えられ、削除されたことを示しています。右には新しい子があり、黄色でハイライトされ、追加されたことを示しています。新しい子は'Counter'とラベル付けされ、値0の'state'バブルを含んでいます。">

「Next」をクリック

</Diagram>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="Reactコンポーネントのツリーの図。親は'Scoreboard'とラベル付けされ、'isPlayerA'という状態バブルを持っています。状態バブルは黄色でハイライトされ、変更されたことを示しています。左には新しい子があり、黄色でハイライトされ、追加されたことを示しています。新しい子は'Counter'とラベル付けされ、値0の'state'バブルを含んでいます。右の子は黄色の'poof'画像で置き換えられ、削除されたことを示しています。">

再度「Next」をクリック

</Diagram>

</DiagramGroup>

各`Counter`の状態は、DOMから削除されるたびに破壊されます。これが、ボタンをクリックするたびにリセットされる理由です。

この解決策は、同じ場所にレンダリングされる独立したコンポーネントが少数しかない場合に便利です。この例では、2つしかないため、JSXでそれぞれを別々にレンダリングするのは手間ではありません。

### オプション2: `key`を使って状態をリセットする {/*option-2-resetting-state-with-a-key*/}

状態をリセットするためのもう1つの汎用的な方法もあります。

リストをレンダリングする際に`key`を見たことがあるかもしれません。[リストをレンダリングする際に](/learn/rendering-lists#keeping-list-items-in-order-with-key) キーはリストだけのものではありません！ キーを使ってReactに任意のコンポーネントを区別させることができます。デフォルトでは、Reactは親内の順序（「最初のカウンター」、「2番目のカウンター」）を使ってコンポーネントを区別します。しかし、キーを使うことで、これは単なる*最初の*カウンターや*2番目の*カウンターではなく、特定のカウンター、例えば*Taylorの*カウンターであることをReactに伝えることができます。このようにして、Reactはツリー内のどこに現れても*Taylorの*カウンターを認識します！

この例では、2つの`<Counter />`は同じ場所に表示されても状態を共有しません：

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [
hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

TaylorとSarahを切り替えると、状態は保持されません。これは、**異なる`key`を与えたためです：**

```js
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```

`key`を指定することで、Reactに位置の一部として`key`自体を使用するように指示します。これにより、JSX内で同じ場所にレンダリングされても、Reactはそれらを2つの異なるカウンターとして認識し、状態を共有することはありません。カウンターが画面に表示されるたびに、その状態が作成されます。削除されるたびに、その状態が破壊されます。切り替えるたびに状態がリセットされます。

<Note>

キーはグローバルに一意ではないことを覚えておいてください。キーは親内の位置を指定するだけです。

</Note>

### フォームをキーでリセットする {/*resetting-a-form-with-a-key*/}

キーを使って状態をリセットすることは、フォームを扱う際に特に便利です。

このチャットアプリでは、`<Chat>`コンポーネントがテキスト入力の状態を含んでいます：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

入力に何かを入力してから、別の受信者を選択するために「Alice」や「Bob」を押してみてください。入力状態が保持されることに気付くでしょう。これは、`<Chat>`がツリー内の同じ位置にレンダリングされているためです。

**多くのアプリでは、これは望ましい動作かもしれませんが、チャットアプリではそうではありません！** ユーザーが誤ってクリックしたために、既に入力したメッセージを間違った人に送信することを防ぎたいのです。これを修正するために、`key`を追加します：

```js
<Chat key={to.id} contact={to} />
```

これにより、異なる受信者を選択すると、`Chat`コンポーネントが最初から再作成され、その下のツリー内の状態も含まれます。ReactはDOM要素も再作成し、再利用しません。

これで、受信者を切り替えると常にテキストフィールドがクリアされます：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<DeepDive>

#### 削除されたコンポーネントの状態を保持する {/*preserving-state-for-removed-components*/}

実際のチャットアプリでは、ユーザーが以前の受信者を再選択したときに入力状態を回復したいと思うでしょう。表示されなくなったコンポーネントの状態を「生かしておく」方法はいくつかあります：

- すべてのチャットをレンダリングし、CSSで他のすべてを非表示にすることができます。チャットはツリーから削除されないため、そのローカル状態は保持されます。この解決策はシンプルなUIに最適です。しかし、非表示のツリーが大きく、DOMノードが多い場合は非常に遅くなる可能性があります。
- 状態を上に持ち上げ、各受信者の保留中のメッセージを親コンポーネントに保持することができます。この方法では、子コンポーネントが削除されても重要な情報は親が保持しているため問題ありません。これが最も一般的な解決策です。
- Reactの状態に加えて別のソースを使用することもできます。例えば、ユーザーがページを誤って閉じてもメッセージの下書きを保持したい場合があります。これを実装するには、`Chat`コンポーネントが[`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)から読み取って状態を初期化し、下書きをそこに保存することができます。

どの戦略を選んでも、AliceとのチャットはBobとのチャットとは概念的に異なるため、現在の受信者に基づいて`<Chat>`ツリーにキーを与えることが理にかなっています。

</DeepDive>

<Recap>

- Reactは、同じコンポーネントが同じ位置にレンダリングされている限り、状態を保持します。
- 状態はJSXタグに保持されていません。それを配置したツリーの位置に関連付けられています。
- 異なるキーを与えることで、サブツリーの状態をリセットできます。
- コンポーネント定義をネストしないでください。そうしないと、状態が誤ってリセットされます。

</Recap>

<Challenges>

#### 消える入力テキストを修正する {/*fix-disappearing-input-text*/}

この例では、ボタンを押すとメッセージが表示されます。しかし、ボタンを押すと入力も誤ってリセットされます。なぜこれが起こるのでしょうか？ボタンを押しても入力テキストがリセットされないように修正してください。

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

問題は、`Form`が異なる位置にレンダリングされていることです。`if`ブランチでは、`<div>`の2番目の子ですが、`else`ブランチでは最初の子です。したがって、各位置のコンポーネントタイプが変わります。最初の位置は`p`と`Form`の間で変わり、2番目の位置は`Form`と`button`の間で変わります。Reactはコンポーネントタイプが変わるたびに状態をリセットします。

最も簡単な解決策は、ブランチを統一して`Form`が常に同じ位置にレンダリングされるようにすることです：

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      {showHint &&
        <p><i>Hint: Your favorite city?</i></p>
      }
      <Form />
      {showHint ? (
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      ) : (
        <button onClick={() => {
          setShowHint(true);
        }}>Show hint</button>
      )}
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

技術的には、`else`ブランチに`<Form />`の前に`null`を追加して`if`ブランチの構造に一致させることもできます：

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      {null}
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

この方法では、`Form`が常に2番目の子であるため、同じ位置に留まり、その状態を保持します。しかし、このアプローチはあまり明白ではなく、他の誰かがその`null`を削除するリスクがあります。

</Solution>

#### 2つのフォームフィールドを入れ替える {/*swap-two-form-fields*/}

このフォームでは、名前と姓を入力できます。また、どのフィールドが最初に表示されるかを制御するチェックボックスがあります。チェックボックスをオンにすると、「姓」フィールドが「名前」フィールドの前に表示されます。

ほぼ動作しますが、バグがあります。「名前」入力に入力してからチェックボックスをオンにすると、テキストが最初の入力（現在は「姓」）に残ります。順序を逆にするときに入力テキストも移動するように修正してください。

<Hint>

これらのフィールドにとって、親内の位置だけでは不十分なようです。再レンダリング間で状態を一致させる方法はありますか？

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field label="Last name" /> 
        <Field label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field label="First name" /> 
        <Field label="Last name" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

両方の`<Field>`コンポーネントに`key`を与えます。これにより、親内の順序が変わっても、Reactが各`<Field>`の正しい状態を「一致させる」方法を指示します：

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field key="lastName" label="Last name" /> 
        <Field key="firstName" label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field key="firstName" label="First name" /> 
        <Field key="lastName" label="Last name" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

</Solution>

#### 詳細フォームをリセットする {/*reset-a-detail-form*/}

これは編集可能な連絡先リストです。選択した連絡先の詳細を編集し、「保存」を押して更新するか、「リセット」を押して変更を元に戻すことができます。

異なる連絡先（例えば、Alice）を選択すると、状態は更新されますが、フォームには前の連絡先の詳細が表示されたままです。選択した連絡先が変更されたときにフォームがリセットされるように修正してください。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

`EditContact`コンポーネントに`key={selectedId}`を与えます。これにより、異なる連絡先に切り替えるとフォームがリセットされます：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        key={selectedId}
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### 画像の読み込み中にクリアする {/*clear-an-image-while-its-loading*/}

「Next」を押すと、ブラウザは次の画像の読み込みを開始します。しかし、同じ`<img>`タグに表示されるため、デフォルトでは次の画像が読み込まれるまで前の画像が表示されたままです。テキストが常に画像と一致することが重要な場合、これは望ましくないかもしれません。「Next」を押した瞬間に前の画像がすぐにクリアされるように変更してください。

<Hint>

ReactにDOMを再利用せずに再作成するように指示する方法はありますか？

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

<Solution>

`<img>`タグに`key`を提供できます。その`key`が変わると、Reactは`<img>` DOMノードを最初から再作成します。これにより、各画像が読み込まれるときに一瞬のフラッシュが発生するため、アプリ内のすべての画像に対して行うことはお勧めしません。しかし、画像が常にテキストと一致することを保証したい場合には理にかなっています。

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img key={image.src} src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

</Solution>

#### リスト内の誤った状態を修正する {/*fix-misplaced-state-in-the-list*/}

このリストでは、各`Contact`には「Show email」が押されたかどうかを決定する状態があります。Aliceの「Show email」を押してから「Show in reverse order」チェックボックスをオンにすると、今度はTaylorのメールが展開され、Aliceのメールは折りたたまれたままです。

選択した順序に関係なく、展開状態が各連絡先に関連付けられるように修正してください。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map((contact, i) =>
          <li key={i}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js src/Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

問題は、この例がインデックスを`key`として使用していたことです：

```js
{displayedContacts.map((contact, i) =>
  <li key={i}>
```

しかし、状態を各連絡先に関連付けたいのです。

連絡先IDを`key`として使用することで問題が解決します：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map(contact =>
          <li key={contact.id}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js src/Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

状態はツリーの位置に関連付けられています。`key`を使用すると、順序に依存せずに名前付きの位置を指定できます。

</Solution>

</Challenges>