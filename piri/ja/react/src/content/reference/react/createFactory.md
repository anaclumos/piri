---
title: createFactory
---

<Deprecated>

このAPIは将来のReactのメジャーバージョンで削除されます。[代替案を参照してください。](#alternatives)

</Deprecated>

<Intro>

`createFactory`を使用すると、指定されたタイプのReact要素を生成する関数を作成できます。

```js
const factory = createFactory(type)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `createFactory(type)` {/*createfactory*/}

`createFactory(type)`を呼び出して、指定された`type`のReact要素を生成するファクトリ関数を作成します。

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

次に、JSXを使用せずにReact要素を作成するために使用できます：

```js
export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `type`: `type`引数は有効なReactコンポーネントタイプでなければなりません。例えば、タグ名の文字列（`'div'`や`'span'`など）やReactコンポーネント（関数、クラス、または[`Fragment`](/reference/react/Fragment)のような特別なコンポーネント）などです。

#### 戻り値 {/*returns*/}

ファクトリ関数を返します。そのファクトリ関数は、最初の引数として`props`オブジェクトを受け取り、続いて`...children`引数のリストを受け取り、指定された`type`、`props`、および`children`を持つReact要素を返します。

---

## 使用法 {/*usage*/}

### ファクトリを使用してReact要素を作成する {/*creating-react-elements-with-a-factory*/}

ほとんどのReactプロジェクトはユーザーインターフェースを記述するために[JSX](/learn/writing-markup-with-jsx)を使用しますが、JSXは必須ではありません。過去には、`createFactory`はJSXを使用せずにユーザーインターフェースを記述する方法の一つでした。

`createFactory`を呼び出して、特定の要素タイプ（例えば`'button'`）の*ファクトリ関数*を作成します：

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

そのファクトリ関数を呼び出すと、提供されたpropsとchildrenを持つReact要素が生成されます：

<Sandpack>

```js src/App.js
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

</Sandpack>

これは、JSXの代替として`createFactory`が使用された方法です。しかし、`createFactory`は非推奨であり、新しいコードでは`createFactory`を呼び出すべきではありません。以下に`createFactory`から移行する方法を示します。

---

## 代替案 {/*alternatives*/}

### `createFactory`をプロジェクトにコピーする {/*copying-createfactory-into-your-project*/}

プロジェクトに多くの`createFactory`呼び出しがある場合、この`createFactory.js`実装をプロジェクトにコピーします：

<Sandpack>

```js src/App.js
import { createFactory } from './createFactory.js';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

```js src/createFactory.js
import { createElement } from 'react';

export function createFactory(type) {
  return createElement.bind(null, type);
}
```

</Sandpack>

これにより、インポート以外のすべてのコードを変更せずに済みます。

---

### `createFactory`を`createElement`に置き換える {/*replacing-createfactory-with-createelement*/}

手動で移植するのが苦にならない少数の`createFactory`呼び出しがあり、JSXを使用したくない場合は、すべてのファクトリ関数呼び出しを[`createElement`](/reference/react/createElement)呼び出しに置き換えることができます。例えば、このコードを：

```js {1,3,6}
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

このコードに置き換えます：

```js {1,4}
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

これはJSXを使用せずにReactを使用する完全な例です：

<Sandpack>

```js src/App.js
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

</Sandpack>

---

### `createFactory`をJSXに置き換える {/*replacing-createfactory-with-jsx*/}

最後に、`createFactory`の代わりにJSXを使用できます。これはReactを使用する最も一般的な方法です：

<Sandpack>

```js src/App.js
export default function App() {
  return (
    <button onClick={() => {
      alert('Clicked!');
    }}>
      Click me
    </button>
  );
};
```

</Sandpack>

<Pitfall>

既存のコードが定数ではなく変数を`type`として渡す場合があります：

```js {3}
function Heading({ isSubheading, ...props }) {
  const type = isSubheading ? 'h2' : 'h1';
  const factory = createFactory(type);
  return factory(props);
}
```

JSXで同じことを行うには、変数名を`Type`のように大文字で始める必要があります：

```js {2,3}
function Heading({ isSubheading, ...props }) {
  const Type = isSubheading ? 'h2' : 'h1';
  return <Type {...props} />;
}
```

そうしないと、Reactは小文字の`<type>`を組み込みのHTMLタグとして解釈します。

</Pitfall>