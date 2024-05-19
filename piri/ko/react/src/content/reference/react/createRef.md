---
title: createRef
---

<Pitfall>

`createRef`는 주로 [클래스 컴포넌트](/reference/react/Component)에서 사용됩니다. 함수 컴포넌트는 일반적으로 [`useRef`](/reference/react/useRef)를 대신 사용합니다.

</Pitfall>

<Intro>

`createRef`는 임의의 값을 포함할 수 있는 [ref](/learn/referencing-values-with-refs) 객체를 생성합니다.

```js
class MyInput extends Component {
  inputRef = createRef();
  // ...
}
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `createRef()` {/*createref*/}

[클래스 컴포넌트](/reference/react/Component) 내부에 [ref](/learn/referencing-values-with-refs)를 선언하려면 `createRef`를 호출하세요.

```js
import { createRef, Component } from 'react';

class MyComponent extends Component {
  intervalRef = createRef();
  inputRef = createRef();
  // ...
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### Parameters {/*parameters*/}

`createRef`는 매개변수를 받지 않습니다.

#### Returns {/*returns*/}

`createRef`는 단일 속성을 가진 객체를 반환합니다:

* `current`: 초기에는 `null`로 설정됩니다. 나중에 다른 값으로 설정할 수 있습니다. ref 객체를 JSX 노드의 `ref` 속성으로 React에 전달하면, React는 `current` 속성을 설정합니다.

#### Caveats {/*caveats*/}

* `createRef`는 항상 *다른* 객체를 반환합니다. 이는 `{ current: null }`을 직접 작성하는 것과 동일합니다.
* 함수 컴포넌트에서는 항상 동일한 객체를 반환하는 [`useRef`](/reference/react/useRef)를 사용하는 것이 좋습니다.
* `const ref = useRef()`는 `const [ref, _] = useState(() => createRef(null))`와 동일합니다.

---

## Usage {/*usage*/}

### 클래스 컴포넌트에서 ref 선언하기 {/*declaring-a-ref-in-a-class-component*/}

[클래스 컴포넌트](/reference/react/Component) 내부에 ref를 선언하려면 `createRef`를 호출하고 그 결과를 클래스 필드에 할당하세요:

```js {4}
import { Component, createRef } from 'react';

class Form extends Component {
  inputRef = createRef();

  // ...
}
```

이제 JSX에서 `<input>`에 `ref={this.inputRef}`를 전달하면, React는 `this.inputRef.current`를 input DOM 노드로 채웁니다. 예를 들어, 입력란에 포커스를 맞추는 버튼을 만드는 방법은 다음과 같습니다:

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

`createRef`는 주로 [클래스 컴포넌트](/reference/react/Component)에서 사용됩니다. 함수 컴포넌트는 일반적으로 [`useRef`](/reference/react/useRef)를 대신 사용합니다.

</Pitfall>

---

## Alternatives {/*alternatives*/}

### `createRef`를 사용하는 클래스에서 `useRef`를 사용하는 함수로 마이그레이션하기 {/*migrating-from-a-class-with-createref-to-a-function-with-useref*/}

새로운 코드에서는 [클래스 컴포넌트](/reference/react/Component) 대신 함수 컴포넌트를 사용하는 것을 권장합니다. `createRef`를 사용하는 기존 클래스 컴포넌트가 있다면, 다음과 같이 변환할 수 있습니다. 이것이 원래 코드입니다:

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

이 컴포넌트를 [클래스에서 함수로 변환할 때,](/reference/react/Component#alternatives) `createRef` 호출을 [`useRef`](/reference/react/useRef) 호출로 대체하세요:

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