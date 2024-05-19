---
title: PureComponent
---

<Pitfall>

コンポーネントをクラスではなく関数として定義することをお勧めします。[移行方法はこちら。](#alternatives)

</Pitfall>

<Intro>

`PureComponent`は[`Component`](/reference/react/Component)に似ていますが、同じpropsとstateの場合に再レンダリングをスキップします。クラスコンポーネントはReactによってまだサポートされていますが、新しいコードでは使用をお勧めしません。

```js
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## 参照 {/*reference*/}

### `PureComponent` {/*purecomponent*/}

同じpropsとstateの場合にクラスコンポーネントの再レンダリングをスキップするには、[`Component`](/reference/react/Component)の代わりに`PureComponent`を拡張します：

```js
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`PureComponent`は`Component`のサブクラスであり、[すべての`Component` APIをサポートします。](/reference/react/Component#reference) `PureComponent`を拡張することは、propsとstateを浅く比較するカスタム[`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate)メソッドを定義することと同等です。

[以下の例を参照してください。](#usage)

---

## 使用法 {/*usage*/}

### クラスコンポーネントの不要な再レンダリングをスキップする {/*skipping-unnecessary-re-renders-for-class-components*/}

Reactは通常、親が再レンダリングされるたびにコンポーネントを再レンダリングします。最適化として、親が再レンダリングされても新しいpropsとstateが古いpropsとstateと同じである限り、Reactが再レンダリングしないコンポーネントを作成できます。[クラスコンポーネント](/reference/react/Component)は`PureComponent`を拡張することでこの動作を選択できます：

```js {1}
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

Reactコンポーネントは常に[純粋なレンダリングロジック](/learn/keeping-components-pure)を持つべきです。これは、props、state、およびcontextが変更されていない場合に同じ出力を返す必要があることを意味します。`PureComponent`を使用することで、コンポーネントがこの要件を満たしていることをReactに伝え、propsとstateが変更されない限り再レンダリングする必要がないことを示します。ただし、使用しているcontextが変更された場合、コンポーネントは再レンダリングされます。

この例では、`Greeting`コンポーネントは`name`が変更されるたびに再レンダリングされます（それがpropsの一つだからです）が、`address`が変更されても再レンダリングされません（`Greeting`にpropsとして渡されていないからです）：

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Pitfall>

コンポーネントをクラスではなく関数として定義することをお勧めします。[移行方法はこちら。](#alternatives)

</Pitfall>

---

## 代替案 {/*alternatives*/}

### `PureComponent`クラスコンポーネントから関数への移行 {/*migrating-from-a-purecomponent-class-component-to-a-function*/}

新しいコードでは[クラスコンポーネント](/reference/react/Component)の代わりに関数コンポーネントを使用することをお勧めします。`PureComponent`を使用している既存のクラスコンポーネントがある場合は、次のように変換できます。これは元のコードです：

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

このコンポーネントを[クラスから関数に変換する](/reference/react/Component#alternatives)ときは、[`memo`](/reference/react/memo)でラップします：

<Sandpack>

```js
import { memo, useState } from 'react';

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

`PureComponent`とは異なり、[`memo`](/reference/react/memo)は新しいstateと古いstateを比較しません。関数コンポーネントでは、[`set`関数](/reference/react/useState#setstate)を同じstateで呼び出すことは、`memo`なしでも[デフォルトで再レンダリングを防ぎます。](/reference/react/memo#updating-a-memoized-component-using-state)

</Note>