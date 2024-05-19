---
title: cloneElement
---

<Pitfall>

`cloneElement`を使用することは一般的ではなく、脆弱なコードにつながる可能性があります。[一般的な代替案を参照してください。](#alternatives)

</Pitfall>

<Intro>

`cloneElement`を使用すると、別の要素を出発点として新しいReact要素を作成できます。

```js
const clonedElement = cloneElement(element, props, ...children)
```

</Intro>

<InlineToc />

---

## 参照 {/*reference*/}

### `cloneElement(element, props, ...children)` {/*cloneelement*/}

`cloneElement`を呼び出して、`element`に基づいてReact要素を作成しますが、異なる`props`と`children`を使用します：

```js
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage">
    Hello
  </Row>,
  { isHighlighted: true },
  'Goodbye'
);

console.log(clonedElement); // <Row title="Cabbage" isHighlighted={true}>Goodbye</Row>
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `element`: `element`引数は有効なReact要素でなければなりません。例えば、JSXノードのような`<Something />`、[`createElement`](/reference/react/createElement)の呼び出し結果、または別の`cloneElement`呼び出しの結果などです。

* `props`: `props`引数はオブジェクトまたは`null`でなければなりません。`null`を渡すと、クローンされた要素は元の`element.props`をすべて保持します。そうでない場合、`props`オブジェクト内のすべてのプロップに対して、返される要素は`element.props`の値よりも`props`の値を「優先」します。残りのプロップは元の`element.props`から埋められます。`props.key`または`props.ref`を渡すと、それらは元のものを置き換えます。

* **オプション** `...children`: 0個以上の子ノード。これらはReact要素、文字列、数値、[ポータル](/reference/react-dom/createPortal)、空のノード（`null`、`undefined`、`true`、`false`）、およびReactノードの配列を含む任意のReactノードである可能性があります。`...children`引数を渡さない場合、元の`element.props.children`が保持されます。

#### 戻り値 {/*returns*/}

`cloneElement`は、いくつかのプロパティを持つReact要素オブジェクトを返します：

* `type`: `element.type`と同じ。
* `props`: `element.props`と渡された`props`を浅くマージした結果。
* `ref`: 元の`element.ref`、ただし`props.ref`で上書きされていない場合。
* `key`: 元の`element.key`、ただし`props.key`で上書きされていない場合。

通常、要素をコンポーネントから返すか、別の要素の子として作成します。要素のプロパティを読み取ることはできますが、作成後はすべての要素を不透明として扱い、レンダリングのみに使用するのが最善です。

#### 注意点 {/*caveats*/}

* 要素をクローンしても、**元の要素は変更されません。**

* **すべての子が静的に既知である場合にのみ、`cloneElement`に複数の引数として子を渡すべきです。** 例えば、`cloneElement(element, null, child1, child2, child3)`のように。子が動的である場合、配列全体を3番目の引数として渡します：`cloneElement(element, null, listItems)`。これにより、Reactは動的リストの欠落している`key`について[警告します](/learn/rendering-lists#keeping-list-items-in-order-with-key)。静的リストの場合、再順序付けされないため、これは必要ありません。

* `cloneElement`はデータフローを追跡しにくくするため、**[代替案](#alternatives)を試してください。**

---

## 使用法 {/*usage*/}

### 要素のプロップを上書きする {/*overriding-props-of-an-element*/}

いくつかの<CodeStep step={1}>React要素</CodeStep>のプロップを上書きするには、それを`cloneElement`に渡し、<CodeStep step={2}>上書きしたいプロップ</CodeStep>を指定します：

```js [[1, 5, "<Row title=\\"Cabbage\\" />"], [2, 6, "{ isHighlighted: true }"], [3, 4, "clonedElement"]]
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage" />,
  { isHighlighted: true }
);
```

ここで、結果の<CodeStep step={3}>クローンされた要素</CodeStep>は`<Row title="Cabbage" isHighlighted={true} />`になります。

**いつ役立つかを確認するために例を見てみましょう。**

選択可能な行のリストとして[`children`](/learn/passing-props-to-a-component#passing-jsx-as-children)をレンダリングし、選択された行を変更する「次へ」ボタンを持つ`List`コンポーネントを想像してください。`List`コンポーネントは選択された`Row`を異なる方法でレンダリングする必要があるため、受け取ったすべての`<Row>`子をクローンし、追加の`isHighlighted: true`または`isHighlighted: false`プロップを追加します：

```js {6-8}
export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
```

受け取った元のJSXが次のように見えるとしましょう：

```js {2-4}
<List>
  <Row title="Cabbage" />
  <Row title="Garlic" />
  <Row title="Apple" />
</List>
```

子をクローンすることで、`List`は内部のすべての`Row`に追加情報を渡すことができます。結果は次のようになります：

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

「次へ」を押すと`List`の状態が更新され、異なる行がハイライトされることに注意してください：

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List>
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title} 
        />
      )}
    </List>
  );
}
```

```js src/List.js active
import { Children, cloneElement, useState } from 'react';

export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % Children.count(children)
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

要約すると、`List`は受け取った`<Row />`要素をクローンし、追加のプロップを追加しました。

<Pitfall>

子をクローンすると、アプリのデータフローを把握するのが難しくなります。代わりに[代替案](#alternatives)を試してください。

</Pitfall>

---

## 代替案 {/*alternatives*/}

### レンダープロップでデータを渡す {/*passing-data-with-a-render-prop*/}

`cloneElement`を使用する代わりに、`renderItem`のような*レンダープロップ*を受け入れることを検討してください。ここで、`List`は`renderItem`をプロップとして受け取ります。`List`は各アイテムに対して`renderItem`を呼び出し、`isHighlighted`を引数として渡します：

```js {1,7}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
```

`renderItem`プロップは「レンダープロップ」と呼ばれます。なぜなら、それが何かをレンダリングする方法を指定するプロップだからです。例えば、与えられた`isHighlighted`値で`<Row>`をレンダリングする`renderItem`実装を渡すことができます：

```js {3,7}
<List
  items={products}
  renderItem={(product, isHighlighted) =>
    <Row
      key={product.id}
      title={product.title}
      isHighlighted={isHighlighted}
    />
  }
/>
```

最終結果は`cloneElement`を使用した場合と同じです：

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

しかし、`isHighlighted`値がどこから来ているのかを明確に追跡できます。

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product, isHighlighted) =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={isHighlighted}
        />
      }
    />
  );
}
```

```js src/List.js active
import { useState } from 'react';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

このパターンは`cloneElement`よりも明示的であるため、推奨されます。

---

### コンテキストを通じてデータを渡す {/*passing-data-through-context*/}

`cloneElement`のもう一つの代替案は、[コンテキストを通じてデータを渡すこと](/learn/passing-data-deeply-with-context)です。

例えば、[`createContext`](/reference/react/createContext)を呼び出して`HighlightContext`を定義できます：

```js
export const HighlightContext = createContext(false);
```

`List`コンポーネントは、レンダリングする各アイテムを`HighlightContext`プロバイダーにラップできます：

```js {8,10}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider key={item.id} value={isHighlighted}>
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
```

このアプローチでは、`Row`は`isHighlighted`プロップを受け取る必要はありません。代わりに、コンテキストを読み取ります：

```js src/Row.js {2}
export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  // ...
```

これにより、呼び出し元のコンポーネントは`<Row>`に`isHighlighted`を渡すことを知らなくても心配する必要がなくなります：

```js {4}
<List
  items={products}
  renderItem={product =>
    <Row title={product.title} />
  }
/>
```

代わりに、`List`と`Row`はコンテキストを通じてハイライトロジックを調整します。

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product) =>
        <Row title={product.title} />
      }
    />
  );
}
```

```js src/List.js active
import { useState } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider
            key={item.id}
            value={isHighlighted}
          >
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
import { useContext } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/HighlightContext.js
import { createContext } from 'react';

export const HighlightContext = createContext(false);
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

[コンテキストを通じてデータを渡す方法について詳しく学びましょう。](/reference/react/useContext#passing-data-deeply-into-the-tree)

---

### カスタムフックにロジックを抽出する {/*extracting-logic-into-a-custom-hook*/}

試すことができるもう一つのアプローチは、「非視覚的」ロジックを独自のフックに抽出し、そのフックから返される情報を使用して何をレンダリングするかを決定することです。例えば、次のような`useList`カスタムフックを書くことができます：

```js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

次のように使用できます：

```js {2,9,13}
export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

データフローは明示的ですが、状態はどのコンポーネントからでも使用できる`useList`カスタムフックの中にあります：

<Sandpack>

```js
import Row from './Row.js';
import useList from './useList.js';
import { products } from './data.js';

export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

```js src/useList.js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

このアプローチは、異なるコンポーネント間でこのロジックを再利用したい場合に特に有用です。