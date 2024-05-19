---
title: PureComponent
---

<Pitfall>

컴포넌트를 클래스 대신 함수로 정의하는 것을 권장합니다. [마이그레이션 방법을 참조하세요.](#alternatives)

</Pitfall>

<Intro>

`PureComponent`는 [`Component`](/reference/react/Component)와 유사하지만 동일한 props와 state에 대해 다시 렌더링을 건너뜁니다. 클래스 컴포넌트는 여전히 React에서 지원되지만, 새로운 코드에서는 사용을 권장하지 않습니다.

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

## Reference {/*reference*/}

### `PureComponent` {/*purecomponent*/}

동일한 props와 state에 대해 클래스 컴포넌트의 다시 렌더링을 건너뛰려면 [`Component`](/reference/react/Component) 대신 `PureComponent`를 확장하세요:

```js
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`PureComponent`는 `Component`의 하위 클래스이며 [모든 `Component` API를 지원합니다.](/reference/react/Component#reference) `PureComponent`를 확장하는 것은 props와 state를 얕게 비교하는 사용자 정의 [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) 메서드를 정의하는 것과 동일합니다.

[아래에서 더 많은 예제를 참조하세요.](#usage)

---

## Usage {/*usage*/}

### 클래스 컴포넌트의 불필요한 다시 렌더링 건너뛰기 {/*skipping-unnecessary-re-renders-for-class-components*/}

React는 일반적으로 부모가 다시 렌더링될 때마다 컴포넌트를 다시 렌더링합니다. 최적화를 위해, 새로운 props와 state가 이전 props와 state와 동일한 한 부모가 다시 렌더링될 때 React가 컴포넌트를 다시 렌더링하지 않도록 할 수 있습니다. [클래스 컴포넌트](/reference/react/Component)는 `PureComponent`를 확장하여 이 동작을 선택할 수 있습니다:

```js {1}
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React 컴포넌트는 항상 [순수한 렌더링 로직을 가져야 합니다.](/learn/keeping-components-pure) 이는 props, state, 그리고 context가 변경되지 않았다면 동일한 출력을 반환해야 함을 의미합니다. `PureComponent`를 사용함으로써, 컴포넌트가 이 요구 사항을 준수한다고 React에 알리게 되며, props와 state가 변경되지 않는 한 React는 다시 렌더링할 필요가 없습니다. 그러나 사용 중인 context가 변경되면 컴포넌트는 여전히 다시 렌더링됩니다.

이 예제에서, `Greeting` 컴포넌트는 `name`이 변경될 때마다 다시 렌더링되지만(이는 props 중 하나이기 때문), `address`가 변경될 때는 다시 렌더링되지 않습니다(이는 `Greeting`에 props로 전달되지 않기 때문):

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

컴포넌트를 클래스 대신 함수로 정의하는 것을 권장합니다. [마이그레이션 방법을 참조하세요.](#alternatives)

</Pitfall>

---

## Alternatives {/*alternatives*/}

### `PureComponent` 클래스 컴포넌트를 함수로 마이그레이션하기 {/*migrating-from-a-purecomponent-class-component-to-a-function*/}

새로운 코드에서는 [클래스 컴포넌트](/reference/react/Component) 대신 함수 컴포넌트를 사용하는 것을 권장합니다. `PureComponent`를 사용하는 기존 클래스 컴포넌트가 있다면, 다음과 같이 변환할 수 있습니다. 이것이 원래 코드입니다:

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

이 컴포넌트를 [클래스에서 함수로 변환할 때,](/reference/react/Component#alternatives) [`memo`](/reference/react/memo)로 감싸세요:

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

`PureComponent`와 달리, [`memo`](/reference/react/memo)는 새로운 state와 이전 state를 비교하지 않습니다. 함수 컴포넌트에서는 [`set` 함수](/reference/react/useState#setstate)를 동일한 state로 호출하는 것이 `memo` 없이도 [기본적으로 다시 렌더링을 방지합니다.](/reference/react/memo#updating-a-memoized-component-using-state)

</Note>