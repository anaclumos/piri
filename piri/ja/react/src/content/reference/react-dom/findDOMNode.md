---
title: findDOMNode
---

<Deprecated>

このAPIは将来のReactのメジャーバージョンで削除されます。[代替案を参照してください。](#alternatives)

</Deprecated>

<Intro>

`findDOMNode`は、Reactの[class component](/reference/react/Component)インスタンスに対してブラウザのDOMノードを見つけます。

```js
const domNode = findDOMNode(componentInstance)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `findDOMNode(componentInstance)` {/*finddomnode*/}

`findDOMNode`を呼び出して、指定されたReactの[class component](/reference/react/Component)インスタンスに対するブラウザのDOMノードを見つけます。

```js
import { findDOMNode } from 'react-dom';

const domNode = findDOMNode(componentInstance);
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `componentInstance`: [`Component`](/reference/react/Component)サブクラスのインスタンス。例えば、クラスコンポーネント内の`this`。

#### 戻り値 {/*returns*/}

`findDOMNode`は、指定された`componentInstance`内の最初の最も近いブラウザのDOMノードを返します。コンポーネントが`null`をレンダリングする場合、または`false`をレンダリングする場合、`findDOMNode`は`null`を返します。コンポーネントが文字列をレンダリングする場合、`findDOMNode`はその値を含むテキストDOMノードを返します。

#### 注意点 {/*caveats*/}

* コンポーネントは複数の子を持つ配列や[Fragment](/reference/react/Fragment)を返すことがあります。その場合、`findDOMNode`は最初の非空の子に対応するDOMノードを返します。

* `findDOMNode`はマウントされたコンポーネント（つまり、DOMに配置されたコンポーネント）でのみ動作します。まだマウントされていないコンポーネント（例えば、`render()`内で`findDOMNode()`を呼び出すなど）に対してこれを呼び出そうとすると、例外がスローされます。

* `findDOMNode`は呼び出し時点での結果のみを返します。子コンポーネントが後で異なるノードをレンダリングする場合、その変更について通知を受ける方法はありません。

* `findDOMNode`はクラスコンポーネントのインスタンスを受け入れるため、関数コンポーネントでは使用できません。

---

## 使用法 {/*usage*/}

### クラスコンポーネントのルートDOMノードを見つける {/*finding-the-root-dom-node-of-a-class-component*/}

`findDOMNode`を[class component](/reference/react/Component)インスタンス（通常は`this`）で呼び出して、レンダリングされたDOMノードを見つけます。

```js {3}
class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }

  render() {
    return <input defaultValue="Hello" />
  }
}
```

ここで、`input`変数は`<input>`DOM要素に設定されます。これにより、何かを行うことができます。例えば、以下の「Show example」をクリックして入力をマウントすると、[`input.select()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select)が入力内のすべてのテキストを選択します：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }

  render() {
    return <input defaultValue="Hello" />
  }
}

export default AutoselectingInput;
```

</Sandpack>

---

## 代替案 {/*alternatives*/}

### refからコンポーネント自身のDOMノードを読み取る {/*reading-components-own-dom-node-from-a-ref*/}

`findDOMNode`を使用するコードは脆弱です。なぜなら、JSXノードと対応するDOMノードを操作するコードとの間の接続が明示的ではないからです。例えば、この`<input />`を`<div>`でラップしてみてください：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }
  render() {
    return <input defaultValue="Hello" />
  }
}

export default AutoselectingInput;
```

</Sandpack>

これによりコードが壊れます。なぜなら、`findDOMNode(this)`が`<div>`DOMノードを見つけるようになり、コードは`<input>`DOMノードを期待しているからです。このような問題を避けるために、特定のDOMノードを管理するために[`createRef`](/reference/react/createRef)を使用します。

この例では、`findDOMNode`はもはや使用されません。代わりに、`inputRef = createRef(null)`がクラスのインスタンスフィールドとして定義されます。これからDOMノードを読み取るには、`this.inputRef.current`を使用できます。これをJSXにアタッチするには、`<input ref={this.inputRef} />`をレンダリングします。これにより、DOMノードを使用するコードがそのJSXに接続されます：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { createRef, Component } from 'react';

class AutoselectingInput extends Component {
  inputRef = createRef(null);

  componentDidMount() {
    const input = this.inputRef.current;
    input.select()
  }

  render() {
    return (
      <input ref={this.inputRef} defaultValue="Hello" />
    );
  }
}

export default AutoselectingInput;
```

</Sandpack>

クラスコンポーネントを使用しないモダンなReactでは、同等のコードは[`useRef`](/reference/react/useRef)を呼び出します：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { useRef, useEffect } from 'react';

export default function AutoselectingInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    input.select();
  }, []);

  return <input ref={inputRef} defaultValue="Hello" />
}
```

</Sandpack>

[refsを使用してDOMを操作する方法についてさらに読む。](/learn/manipulating-the-dom-with-refs)

---

### フォワードされたrefから子コンポーネントのDOMノードを読み取る {/*reading-a-child-components-dom-node-from-a-forwarded-ref*/}

この例では、`findDOMNode(this)`は別のコンポーネントに属するDOMノードを見つけます。`AutoselectingInput`は`MyInput`をレンダリングし、これはブラウザの`<input>`をレンダリングするあなた自身のコンポーネントです。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';
import MyInput from './MyInput.js';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }
  render() {
    return <MyInput />;
  }
}

export default AutoselectingInput;
```

```js src/MyInput.js
export default function MyInput() {
  return <input defaultValue="Hello" />;
}
```

</Sandpack>

`AutoselectingInput`内で`findDOMNode(this)`を呼び出すと、依然としてDOMの`<input>`が得られます--この`<input>`のJSXが`MyInput`コンポーネント内に隠れているにもかかわらず。これは上記の例では便利ですが、脆弱なコードにつながります。後で`MyInput`を編集してラッパー`<div>`を追加したいと想像してください。これにより、`<input>`を見つけることを期待している`AutoselectingInput`のコードが壊れます。

この例で`findDOMNode`を置き換えるには、2つのコンポーネントが協調する必要があります：

1. `AutoSelectingInput`は、[前の例](#reading-components-own-dom-node-from-a-ref)のようにrefを宣言し、それを`<MyInput>`に渡すべきです。
2. `MyInput`は[`forwardRef`](/reference/react/forwardRef)を使用して宣言し、そのrefを受け取り、`<input>`ノードに転送する必要があります。

このバージョンでは、もはや`findDOMNode`は必要ありません：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { createRef, Component } from 'react';
import MyInput from './MyInput.js';

class AutoselectingInput extends Component {
  inputRef = createRef(null);

  componentDidMount() {
    const input = this.inputRef.current;
    input.select()
  }

  render() {
    return (
      <MyInput ref={this.inputRef} />
    );
  }
}

export default AutoselectingInput;
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} defaultValue="Hello" />;
});

export default MyInput;
```

</Sandpack>

ここでは、クラスの代わりに関数コンポーネントを使用した場合のコードの例を示します：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { useRef, useEffect } from 'react';
import MyInput from './MyInput.js';

export default function AutoselectingInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    input.select();
  }, []);

  return <MyInput ref={inputRef} defaultValue="Hello" />
}
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} defaultValue="Hello" />;
});

export default MyInput;
```

</Sandpack>

---

### ラッパー`<div>`要素を追加する {/*adding-a-wrapper-div-element*/}

時々、コンポーネントはその子の位置とサイズを知る必要があります。これにより、`findDOMNode(this)`を使用して子を見つけ、[`getBoundingClientRect`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)のようなDOMメソッドを使用して測定することが魅力的になります。

このユースケースに対する直接的な同等物は現在ありません。これが`findDOMNode`が非推奨になっているが、完全にReactから削除されていない理由です。その間、コンテンツの周りにラッパー`<div>`ノードをレンダリングし、そのノードにrefを取得することを試みることができます。ただし、余分なラッパーはスタイリングを壊す可能性があります。

```js
<div ref={someRef}>
  {children}
</div>
```

これは、任意の子にフォーカスを合わせたりスクロールしたりする場合にも適用されます。