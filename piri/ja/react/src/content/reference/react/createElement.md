---
title: createElement
---

<Intro>

`createElement`を使用すると、React要素を作成できます。これは[JSX](/learn/writing-markup-with-jsx)を書く代わりの方法として機能します。

```js
const element = createElement(type, props, ...children)
```

</Intro>

<InlineToc />

---

## 参照 {/*reference*/}

### `createElement(type, props, ...children)` {/*createelement*/}

`createElement`を呼び出して、指定された`type`、`props`、および`children`を持つReact要素を作成します。

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello'
  );
}
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `type`: `type`引数は有効なReactコンポーネントタイプでなければなりません。例えば、タグ名の文字列（`'div'`や`'span'`など）や、Reactコンポーネント（関数、クラス、または[`Fragment`](/reference/react/Fragment)のような特別なコンポーネント）である可能性があります。

* `props`: `props`引数はオブジェクトまたは`null`でなければなりません。`null`を渡すと、空のオブジェクトと同じように扱われます。Reactは渡された`props`に一致するプロパティを持つ要素を作成します。`props`オブジェクトの`ref`と`key`は特別であり、返された要素の`element.props.ref`および`element.props.key`としては利用できません。これらは`element.ref`および`element.key`として利用できます。

* **オプション** `...children`: 0個以上の子ノード。これらはReact要素、文字列、数値、[ポータル](/reference/react-dom/createPortal)、空のノード（`null`、`undefined`、`true`、`false`）、およびReactノードの配列を含む任意のReactノードである可能性があります。

#### 戻り値 {/*returns*/}

`createElement`は、いくつかのプロパティを持つReact要素オブジェクトを返します：

* `type`: 渡された`type`。
* `props`: 渡された`props`（`ref`と`key`を除く）。`type`がレガシーな`type.defaultProps`を持つコンポーネントである場合、欠落しているまたは未定義の`props`は`type.defaultProps`の値を取得します。
* `ref`: 渡された`ref`。欠落している場合は`null`。
* `key`: 渡された`key`。文字列に強制変換されます。欠落している場合は`null`。

通常、要素をコンポーネントから返すか、別の要素の子として作成します。要素のプロパティを読み取ることはできますが、作成後はすべての要素を不透明なものとして扱い、レンダリングのみに使用するのが最善です。

#### 注意点 {/*caveats*/}

* **React要素とそのpropsを[不変](https://en.wikipedia.org/wiki/Immutable_object)として扱い、作成後にその内容を変更しない**必要があります。開発中は、Reactは返された要素とその`props`プロパティを浅く[凍結](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)してこれを強制します。

* JSXを使用する場合、**独自のカスタムコンポーネントをレンダリングするにはタグを大文字で始める必要があります。** つまり、`<Something />`は`createElement(Something)`と同等ですが、`<something />`（小文字）は`createElement('something')`（文字列であることに注意）と同等であり、組み込みのHTMLタグとして扱われます。

* **すべての子が静的に知られている場合にのみ、複数の引数として`createElement`に子を渡す**必要があります。例えば、`createElement('h1', {}, child1, child2, child3)`のように。子が動的である場合、配列全体を3番目の引数として渡します：`createElement('ul', {}, listItems)`。これにより、Reactは動的リストの欠落している`key`について[警告します](/learn/rendering-lists#keeping-list-items-in-order-with-key)。静的リストの場合、再順序付けされないためこれは必要ありません。

---

## 使用法 {/*usage*/}

### JSXなしで要素を作成する {/*creating-an-element-without-jsx*/}

[JSX](/learn/writing-markup-with-jsx)が好きでない場合や、プロジェクトで使用できない場合、`createElement`を代替として使用できます。

JSXなしで要素を作成するには、いくつかの<CodeStep step={1}>type</CodeStep>、<CodeStep step={2}>props</CodeStep>、および<CodeStep step={3}>children</CodeStep>を使用して`createElement`を呼び出します：

```js [[1, 5, "'h1'"], [2, 6, "{ className: 'greeting' }"], [3, 7, "'Hello ',"], [3, 8, "createElement('i', null, name),"], [3, 9, "'. Welcome!'"]]
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}
```

<CodeStep step={3}>children</CodeStep>はオプションであり、必要に応じていくつでも渡すことができます（上記の例では3つの子があります）。このコードは挨拶の`<h1>`ヘッダーを表示します。比較のために、同じ例をJSXで書き直したものを以下に示します：

```js [[1, 3, "h1"], [2, 3, "className=\\"greeting\\""], [3, 4, "Hello <i>{name}</i>. Welcome!"], [1, 5, "h1"]]
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}
```

独自のReactコンポーネントをレンダリングするには、文字列の代わりに<CodeStep step={1}>type</CodeStep>として`Greeting`のような関数を渡します：

```js [[1, 2, "Greeting"], [2, 2, "{ name: 'Taylor' }"]]
export default function App() {
  return createElement(Greeting, { name: 'Taylor' });
}
```

JSXを使用すると、次のようになります：

```js [[1, 2, "Greeting"], [2, 2, "name=\\"Taylor\\""]]
export default function App() {
  return <Greeting name="Taylor" />;
}
```

以下は`createElement`を使用して書かれた完全な例です：

<Sandpack>

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}

export default function App() {
  return createElement(
    Greeting,
    { name: 'Taylor' }
  );
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

そして、JSXを使用して書かれた同じ例がこちらです：

<Sandpack>

```js
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}

export default function App() {
  return <Greeting name="Taylor" />;
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

どちらのコーディングスタイルも問題ないので、プロジェクトに適したものを使用できます。`createElement`と比較してJSXを使用する主な利点は、どの閉じタグがどの開きタグに対応しているかを簡単に確認できることです。

<DeepDive>

#### React要素とは正確には何ですか？ {/*what-is-a-react-element-exactly*/}

要素は、ユーザーインターフェイスの一部の軽量な説明です。例えば、`<Greeting name="Taylor" />`と`createElement(Greeting, { name: 'Taylor' })`の両方が次のようなオブジェクトを生成します：

```js
// 少し簡略化
{
  type: Greeting,
  props: {
    name: 'Taylor'
  },
  key: null,
  ref: null,
}
```

**このオブジェクトを作成することは、`Greeting`コンポーネントをレンダリングしたり、DOM要素を作成したりすることではないことに注意してください。**

React要素は、`Greeting`コンポーネントを後でレンダリングするための説明、つまり指示のようなものです。このオブジェクトを`App`コンポーネントから返すことで、Reactに次に何をすべきかを指示します。

要素の作成は非常に安価なので、最適化や回避を試みる必要はありません。

</DeepDive>