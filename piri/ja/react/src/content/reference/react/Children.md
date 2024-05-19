---
title: Children
---

<Pitfall>

`Children`を使用することは一般的ではなく、脆弱なコードにつながる可能性があります。[一般的な代替案を参照してください。](#alternatives)

</Pitfall>

<Intro>

`Children`を使用すると、[`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)として受け取ったJSXを操作および変換できます。

```js
const mappedChildren = Children.map(children, child =>
  <div className="Row">
    {child}
  </div>
);

```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `Children.count(children)` {/*children-count*/}

`Children.count(children)`を呼び出して、`children`データ構造内の子の数を数えます。

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <>
      <h1>Total rows: {Children.count(children)}</h1>
      ...
    </>
  );
}
```

[以下の例を参照してください。](#counting-children)

#### パラメータ {/*children-count-parameters*/}

* `children`: コンポーネントが受け取る[`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)の値。

#### 戻り値 {/*children-count-returns*/}

これらの`children`内のノードの数。

#### 注意点 {/*children-count-caveats*/}

- 空のノード（`null`、`undefined`、およびブール値）、文字列、数値、および[React要素](/reference/react/createElement)は個別のノードとしてカウントされます。配列は個別のノードとしてカウントされませんが、その子はカウントされます。**トラバーサルはReact要素より深くは行きません:** それらはレンダリングされず、その子もトラバースされません。[フラグメント](/reference/react/Fragment)はトラバースされません。

---

### `Children.forEach(children, fn, thisArg?)` {/*children-foreach*/}

`Children.forEach(children, fn, thisArg?)`を呼び出して、`children`データ構造内の各子に対してコードを実行します。

```js src/RowList.js active
import { Children } from 'react';

function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  // ...
```

[以下の例を参照してください。](#running-some-code-for-each-child)

#### パラメータ {/*children-foreach-parameters*/}

* `children`: コンポーネントが受け取る[`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)の値。
* `fn`: 実行したい関数。これは[配列の`forEach`メソッド](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)のコールバックに似ています。最初の引数として子が渡され、2番目の引数としてそのインデックスが渡されます。インデックスは`0`から始まり、各呼び出しでインクリメントされます。
* **オプション** `thisArg`: `fn`関数が呼び出されるときの[`this`値](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)。省略された場合は`undefined`です。

#### 戻り値 {/*children-foreach-returns*/}

`Children.forEach`は`undefined`を返します。

#### 注意点 {/*children-foreach-caveats*/}

- 空のノード（`null`、`undefined`、およびブール値）、文字列、数値、および[React要素](/reference/react/createElement)は個別のノードとしてカウントされます。配列は個別のノードとしてカウントされませんが、その子はカウントされます。**トラバーサルはReact要素より深くは行きません:** それらはレンダリングされず、その子もトラバースされません。[フラグメント](/reference/react/Fragment)はトラバースされません。

---

### `Children.map(children, fn, thisArg?)` {/*children-map*/}

`Children.map(children, fn, thisArg?)`を呼び出して、`children`データ構造内の各子をマップまたは変換します。

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

[以下の例を参照してください。](#transforming-children)

#### パラメータ {/*children-map-parameters*/}

* `children`: コンポーネントが受け取る[`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)の値。
* `fn`: マッピング関数。これは[配列の`map`メソッド](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)のコールバックに似ています。最初の引数として子が渡され、2番目の引数としてそのインデックスが渡されます。インデックスは`0`から始まり、各呼び出しでインクリメントされます。この関数からReactノードを返す必要があります。これは空のノード（`null`、`undefined`、またはブール値）、文字列、数値、React要素、または他のReactノードの配列である可能性があります。
* **オプション** `thisArg`: `fn`関数が呼び出されるときの[`this`値](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)。省略された場合は`undefined`です。

#### 戻り値 {/*children-map-returns*/}

`children`が`null`または`undefined`の場合、同じ値を返します。

それ以外の場合、`fn`関数から返されたノードで構成されるフラットな配列を返します。返された配列には、`null`および`undefined`を除くすべてのノードが含まれます。

#### 注意点 {/*children-map-caveats*/}

- 空のノード（`null`、`undefined`、およびブール値）、文字列、数値、および[React要素](/reference/react/createElement)は個別のノードとしてカウントされます。配列は個別のノードとしてカウントされませんが、その子はカウントされます。**トラバーサルはReact要素より深くは行きません:** それらはレンダリングされず、その子もトラバースされません。[フラグメント](/reference/react/Fragment)はトラバースされません。

- `fn`からキーを持つ要素または要素の配列を返す場合、**返された要素のキーは、`children`の対応する元のアイテムのキーと自動的に組み合わされます。** `fn`から配列で複数の要素を返す場合、それらのキーは相互にローカルで一意である必要があります。

---

### `Children.only(children)` {/*children-only*/}

`Children.only(children)`を呼び出して、`children`が単一のReact要素であることを確認します。

```js
function Box({ children }) {
  const element = Children.only(children);
  // ...
```

#### パラメータ {/*children-only-parameters*/}

* `children`: コンポーネントが受け取る[`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)の値。

#### 戻り値 {/*children-only-returns*/}

`children`が[有効な要素である場合、](/reference/react/isValidElement)その要素を返します。

それ以外の場合、エラーをスローします。

#### 注意点 {/*children-only-caveats*/}

- このメソッドは常に**`children`として配列（例えば`Children.map`の戻り値）を渡すとスローします。** 言い換えれば、`children`が単一のReact要素であることを強制します。配列に単一の要素が含まれていることを強制するわけではありません。

---

### `Children.toArray(children)` {/*children-toarray*/}

`Children.toArray(children)`を呼び出して、`children`データ構造から配列を作成します。

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  // ...
```

#### パラメータ {/*children-toarray-parameters*/}

* `children`: コンポーネントが受け取る[`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)の値。

#### 戻り値 {/*children-toarray-returns*/}

`children`内の要素のフラットな配列を返します。

#### 注意点 {/*children-toarray-caveats*/}

- 空のノード（`null`、`undefined`、およびブール値）は返される配列に含まれません。**返される要素のキーは、元の要素のキーとそのネストレベルおよび位置から計算されます。** これにより、配列をフラット化しても動作に変更が生じないことが保証されます。

---

## 使用法 {/*usage*/}

### 子の変換 {/*transforming-children*/}

コンポーネントが[`children` propとして受け取るJSXを変換するには、](/learn/passing-props-to-a-component#passing-jsx-as-children)`Children.map`を呼び出します。

```js {6,10}
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

上記の例では、`RowList`は受け取ったすべての子を`<div className="Row">`コンテナにラップします。例えば、親コンポーネントが`RowList`に`children` propとして3つの`<p>`タグを渡すとします：

```js
<RowList>
  <p>This is the first item.</p>
  <p>This is the second item.</p>
  <p>This is the third item.</p>
</RowList>
```

次に、上記の`RowList`の実装により、最終的なレンダリング結果は次のようになります：

```js
<div className="RowList">
  <div className="Row">
    <p>This is the first item.</p>
  </div>
  <div className="Row">
    <p>This is the second item.</p>
  </div>
  <div className="Row">
    <p>This is the third item.</p>
  </div>
</div>
```

`Children.map`は[配列の`map()`を使った変換](/learn/rendering-lists)に似ています。違いは、`children`データ構造が*不透明*と見なされることです。これは、時々配列であっても、それが配列であると仮定してはならないことを意味します。変換が必要な場合は、`Children.map`を使用する必要があります。

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
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
```

</Sandpack>

<DeepDive>

#### なぜchildren propは常に配列ではないのですか？ {/*why-is-the-children-prop-not-always-an-array*/}

Reactでは、`children` propは*不透明*なデータ構造と見なされます。これは、その構造に依存しないようにすることを意味します。変換、フィルタリング、または子のカウントを行うには、`Children`メソッドを使用する必要があります。

実際には、`children`データ構造は内部的に配列として表現されることがよくあります。しかし、子が1つだけの場合、Reactは余分な配列を作成しません。これは不要なメモリオーバーヘッドを引き起こすためです。`Children`メソッドを使用する限り、Reactがデータ構造を実際にどのように実装しても、コードは壊れません。

`children`が配列である場合でも、`Children.map`には便利な特別な動作があります。例えば、`Children.map`は、返された要素の[キー](/learn/rendering-lists#keeping-list-items-in-order-with-key)を、渡された`children`のキーと組み合わせます。これにより、元のJSX子がラップされてもキーが「失われない」ことが保証されます。

</DeepDive>

<Pitfall>

`children`データ構造には、渡されたコンポーネントのレンダリング結果は**含まれません**。以下の例では、`RowList`が受け取る`children`には3つではなく2つのアイテムしか含まれていません：

1. `<p>This is the first item.</p>`
2. `<MoreRows />`

このため、この例では2つの行ラッパーしか生成されません：

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </>
  );
}
```

```js src/RowList.js
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
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
```

</Sandpack>

**内部コンポーネントのレンダリング結果を取得する方法はありません**。これが[通常は代替ソリューションを使用する方が良い理由です。](#alternatives)

</Pitfall>

---

### 各子に対してコードを実行する {/*running-some-code-for-each-child*/}

`Children.forEach`を呼び出して、`children`データ構造内の各子を反復処理します。これは値を返さず、[配列の`forEach`メソッド](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)に似ています。カスタムロジックを実行して独自の配列を構築するために使用できます。

<Sandpack>

```js
import SeparatorList from './SeparatorList.js';

export default function App() {
  return (
    <SeparatorList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </SeparatorList>
  );
}
```

```js src/SeparatorList.js active
import { Children } from 'react';

export default function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  result.pop(); // 最後のセパレーターを削除
  return result;
}
```

</Sandpack>

<Pitfall>

前述のように、`children`を操作する際に内部コンポーネントのレンダリング結果を取得する方法はありません。これが[通常は代替ソリューションを使用する方が良い理由です。](#alternatives)

</Pitfall>

---

### 子のカウント {/*counting-children*/}

`Children.count(children)`を呼び出して、子の数を計算します。

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {Children.count(children)}
      </h1>
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<Pitfall>

前述のように、`children`を操作する際に内部コンポーネントのレンダリング結果を取得する方法はありません。これが[通常は代替ソリューションを使用する方が良い理由です。](#alternatives)

</Pitfall>

---

### 子を配列に変換する {/*converting-children-to-an-array*/}

`Children.toArray(children)`を呼び出して、`children`データ構造を通常のJavaScript配列に変換します。これにより、組み込みの配列メソッド（[`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)、[`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)、または[`reverse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)など）を使用して配列を操作できます。

<Sandpack>

```js
import ReversedList from './ReversedList.js';

export default function App() {
  return (
    <ReversedList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </ReversedList>
  );
}
```

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  return result;
}
```

</Sandpack>

<Pitfall>

前述のように、`children`を操作する際に内部コンポーネントのレンダリング結果を取得する方法はありません。これが[通常は代替ソリューションを使用する方が良い理由です。](#alternatives)

</Pitfall>

---

## 代替案 {/*alternatives*/}

<Note>

このセクションでは、次のようにインポートされる`Children` API（大文字の`C`）の代替案について説明します：

```js
import { Children } from 'react';
```

これは[小文字の`c`である`children` propを使用すること](/learn/passing-props-to-a-component#passing-jsx-as-children)と混同しないでください。これは良いことであり、推奨されます。

</Note>

### 複数のコンポーネントを公開する {/*exposing-multiple-components*/}

`Children`メソッドを使用して子を操作することは、脆弱なコードにつながることがよくあります。JSXでコンポーネントに子を渡すとき、通常はコンポーネントが個々の子を操作または変換することを期待しません。

可能な場合は、`Children`メソッドの使用を避けるようにしてください。例えば、`RowList`のすべての子を`<div className="Row">`でラップしたい場合、`Row`コンポーネントをエクスポートし、手動で各行をラップします：

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <Row>
        <p>This is the second item。</p>
      </Row>
      <Row>
        <p>This is the third item。</p>
      </Row>
    </RowList>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
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
```

</Sandpack>

`Children.map`を使用する場合とは異なり、このアプローチではすべての子が自動的にラップされるわけではありません。**しかし、このアプローチには、[以前の`Children.map`の例](#transforming-children)と比較して重要な利点があります。** それは、さらにコンポーネントを抽出しても機能することです。例えば、独自の`MoreRows`コンポーネントを抽出しても機能します：

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item。</p>
      </Row>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <Row>
        <p>This is the second item。</p>
      </Row>
      <Row>
        <p>This is the third item。</p>
      </Row>
    </>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
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
```

</Sandpack>

これは`Children.map`では機能しません。なぜなら、`<MoreRows />`を単一の子（および単一の行）として「見る」からです。

---

### オブジェクトの配列をpropとして受け入れる {/*accepting-an-array-of-objects-as-a-prop*/}

明示的に配列をpropとして渡すこともできます。例えば、この`RowList`は`rows`配列をpropとして受け入れます：

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList rows={[
      { id: 'first', content: <p>This is the first item。</p> },
      { id: 'second', content: <p>This is the second item。</p> },
      { id: 'third', content: <p>This is the third item。</p> }
    ]} />
  );
}
```

```js src/RowList.js
export function RowList({ rows }) {
  return (
    <div className="RowList">
      {rows.map(row => (
        <div className="Row" key={row.id}>
          {row.content}
        </div>
      ))}
    </div>
  );
}
```

```css
.RowList {
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
```

</Sandpack>

`rows`は通常のJavaScript配列であるため、`RowList`コンポーネントは組み込みの配列メソッド（[`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)など）を使用できます。

このパターンは、子と一緒に追加情報を構造化データとして渡したい場合に特に便利です。以下の例では、`TabSwitcher`コンポーネントは`tabs` propとしてオブジェクトの配列を受け取ります：

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher tabs={[
      {
        id: 'first',
        header: 'First',
        content: <p>This is the first item。</p>
      },
      {
        id: 'second',
        header: 'Second',
        content: <p>This is the second item。</p>
      },
      {
        id: 'third',
        header: 'Third',
        content: <p>This is the third item。</p>
      }
    ]} />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabs }) {
  const [selectedId, setSelectedId] = useState(tabs[0].id);
  const selectedTab = tabs.find(tab => tab.id === selectedId);
  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setSelectedId(tab.id)}
        >
          {tab.header}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{selectedTab.header}</h3>
        {selectedTab.content}
      </div>
    </>
  );
}
```

</Sandpack>

JSXとして子を渡す場合とは異なり、このアプローチでは各アイテムに`header`のような追加データを関連付けることができます。`tabs`を直接操作するため、`Children`メソッドは必要ありません。

---

### レンダープロップを呼び出してレンダリングをカスタマイズする {/*calling-a-render-prop-to-customize-rendering*/}

各アイテムのJSXを生成する代わりに、JSXを返す関数を渡し、必要に応じてその関数を呼び出すこともできます。この例では、`App`コンポーネントは`renderContent`関数を`TabSwitcher`コンポーネントに渡します。`TabSwitcher`コンポーネントは選択されたタブに対してのみ`renderContent`を呼び出します：

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher
      tabIds={['first', 'second', 'third']}
      getHeader={tabId => {
        return tabId[0].toUpperCase() + tabId.slice(1);
      }}
      renderContent={tabId => {
        return <p>This is the {tabId} item。</p>;
      }}
    />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabIds, getHeader, renderContent }) {
  const [selectedId, setSelectedId] = useState(tabIds[0]);
  return (
    <>
      {tabIds.map((tabId) => (
        <button
          key={tabId}
          onClick={() => setSelectedId(tabId)}
        >
          {getHeader(tabId)}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{getHeader(selectedId)}</h3>
        {renderContent(selectedId)}
      </div>
    </>
  );
}
```

</Sandpack>

`renderContent`のようなプロップは*レンダープロップ*と呼ばれます。これは、ユーザーインターフェースの一部をどのようにレンダリングするかを指定するプロップです。しかし、特別なものではなく、単なる関数である通常のプロップです。

レンダープロップは関数であるため、情報を渡すことができます。例えば、この`RowList`コンポーネントは`renderRow`レンダープロップに各行の`id`と`index`を渡し、`index`を使用して偶数行をハイライトします：

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList
      rowIds={['first', 'second', 'third']}
      renderRow={(id, index) => {
        return (
          <Row isHighlighted={index % 2 === 0}>
            <p>This is the {id} item。</p>
          </Row> 
        );
      }}
    />
  );
}
```

```js src/RowList.js
import { Fragment } from 'react';

export function RowList({ rowIds, renderRow }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {rowIds.length}
      </h1>
      {rowIds.map((rowId, index) =>
        <Fragment key={rowId}>
          {renderRow(rowId, index)}
        </Fragment>
      )}
    </div>
  );
}

export function Row({ children, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}
```

</Sandpack>

これは、親コンポーネントと子コンポーネントが子を操作せずに協力するもう一つの例です。

---

## トラブルシューティング {/*troubleshooting*/}

### カスタムコンポーネントを渡していますが、`Children`メソッドはそのレンダリング結果を表示しません {/*i-pass-a-custom-component-but-the-children-methods-dont-show-its-render-result*/}

例えば、次のようにして`RowList`に2つの子を渡すとします：

```js
<RowList>
  <p>First item</p>
  <MoreRows />
</RowList>
```

`RowList`内で`Children.count(children)`を実行すると、`2`が返されます。`MoreRows`が10個の異なるアイテムをレンダリングする場合でも、または`null`を返す場合でも、`Children.count(children)`は`2`のままです。`RowList`の視点からは、受け取ったJSXしか「見えません」。`MoreRows`コンポーネントの内部は「見えません」。

この制限により、コンポーネントの抽出が難しくなります。これが[代替案](#alternatives)が`Children`の使用に優先される理由です。