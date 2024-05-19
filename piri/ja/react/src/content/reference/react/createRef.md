---
title: createRef
---

<Pitfall>

`createRef`は主に[クラスコンポーネント](/reference/react/Component)で使用されます。関数コンポーネントは通常、代わりに[`useRef`](/reference/react/useRef)を使用します。

</Pitfall>

<Intro>

`createRef`は任意の値を含むことができる[ref](/learn/referencing-values-with-refs)オブジェクトを作成します。

```js
class MyInput extends Component {
  inputRef = createRef();
  // ...
}
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `createRef()` {/*createref*/}

[クラスコンポーネント](/reference/react/Component)内で[ref](/learn/referencing-values-with-refs)を宣言するために`createRef`を呼び出します。

```js
import { createRef, Component } from 'react';

class MyComponent extends Component {
  intervalRef = createRef();
  inputRef = createRef();
  // ...
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

`createRef`はパラメータを取りません。

#### 戻り値 {/*returns*/}

`createRef`は単一のプロパティを持つオブジェクトを返します：

* `current`: 初期状態では`null`に設定されています。後で別の値に設定することができます。refオブジェクトをJSXノードの`ref`属性としてReactに渡すと、Reactはその`current`プロパティを設定します。

#### 注意点 {/*caveats*/}

* `createRef`は常に*異なる*オブジェクトを返します。これは自分で`{ current: null }`を書くのと同等です。
* 関数コンポーネントでは、代わりに常に同じオブジェクトを返す[`useRef`](/reference/react/useRef)を使用することをお勧めします。
* `const ref = useRef()`は`const [ref, _] = useState(() => createRef(null))`と同等です。

---

## 使用法 {/*usage*/}

### クラスコンポーネントでrefを宣言する {/*declaring-a-ref-in-a-class-component*/}

[クラスコンポーネント](/reference/react/Component)内でrefを宣言するには、`createRef`を呼び出し、その結果をクラスフィールドに割り当てます：

```js {4}
import { Component, createRef } from 'react';

class Form extends Component {
  inputRef = createRef();

  // ...
}
```

今、JSX内の`<input>`に`ref={this.inputRef}`を渡すと、Reactは`this.inputRef.current`にinput DOMノードを設定します。例えば、入力フィールドにフォーカスを当てるボタンを作成する方法は次の通りです：

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

</Sandpack>

<Pitfall>

`createRef`は主に[クラスコンポーネント](/reference/react/Component)で使用されます。関数コンポーネントは通常、代わりに[`useRef`](/reference/react/useRef)を使用します。

</Pitfall>

---

## 代替案 {/*alternatives*/}

### `createRef`を使用したクラスから`useRef`を使用した関数への移行 {/*migrating-from-a-class-with-createref-to-a-function-with-useref*/}

新しいコードでは、[クラスコンポーネント](/reference/react/Component)の代わりに関数コンポーネントを使用することをお勧めします。既存のクラスコンポーネントで`createRef`を使用している場合、それらを変換する方法は次の通りです。これは元のコードです：

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

</Sandpack>

このコンポーネントを[クラスから関数に変換する](/reference/react/Component#alternatives)際、`createRef`の呼び出しを[`useRef`](/reference/react/useRef)の呼び出しに置き換えます：

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>