---
title: findDOMNode
---

<Deprecated>

이 API는 향후 React의 주요 버전에서 제거될 예정입니다. [대안을 참조하세요.](#alternatives)

</Deprecated>

<Intro>

`findDOMNode`는 React [클래스 컴포넌트](/reference/react/Component) 인스턴스에 대한 브라우저 DOM 노드를 찾습니다.

```js
const domNode = findDOMNode(componentInstance)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `findDOMNode(componentInstance)` {/*finddomnode*/}

주어진 React [클래스 컴포넌트](/reference/react/Component) 인스턴스에 대한 브라우저 DOM 노드를 찾기 위해 `findDOMNode`를 호출합니다.

```js
import { findDOMNode } from 'react-dom';

const domNode = findDOMNode(componentInstance);
```

[아래에서 더 많은 예제를 참조하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `componentInstance`: [`Component`](/reference/react/Component) 하위 클래스의 인스턴스입니다. 예를 들어, 클래스 컴포넌트 내부의 `this`입니다.


#### 반환값 {/*returns*/}

`findDOMNode`는 주어진 `componentInstance` 내에서 가장 가까운 첫 번째 브라우저 DOM 노드를 반환합니다. 컴포넌트가 `null`을 렌더링하거나 `false`를 렌더링할 때, `findDOMNode`는 `null`을 반환합니다. 컴포넌트가 문자열을 렌더링할 때, `findDOMNode`는 해당 값을 포함하는 텍스트 DOM 노드를 반환합니다.

#### 주의사항 {/*caveats*/}

* 컴포넌트는 여러 자식을 가진 배열이나 [Fragment](/reference/react/Fragment)를 반환할 수 있습니다. 이 경우 `findDOMNode`는 첫 번째 비어 있지 않은 자식에 해당하는 DOM 노드를 반환합니다.

* `findDOMNode`는 DOM에 배치된 컴포넌트(즉, 마운트된 컴포넌트)에서만 작동합니다. 아직 마운트되지 않은 컴포넌트에서 이를 호출하려고 하면(예: 아직 생성되지 않은 컴포넌트에서 `render()`에서 `findDOMNode()`를 호출하는 경우) 예외가 발생합니다.

* `findDOMNode`는 호출 시점의 결과만 반환합니다. 자식 컴포넌트가 나중에 다른 노드를 렌더링하면, 이 변경 사항에 대해 알림을 받을 방법이 없습니다.

* `findDOMNode`는 클래스 컴포넌트 인스턴스를 허용하므로 함수형 컴포넌트에서는 사용할 수 없습니다.

---

## 사용법 {/*usage*/}

### 클래스 컴포넌트의 루트 DOM 노드 찾기 {/*finding-the-root-dom-node-of-a-class-component*/}

DOM 노드를 찾기 위해 [클래스 컴포넌트](/reference/react/Component) 인스턴스(보통 `this`)로 `findDOMNode`를 호출합니다.

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

여기서 `input` 변수는 `<input>` DOM 요소로 설정됩니다. 이를 통해 무언가를 할 수 있습니다. 예를 들어, 아래의 "Show example"을 클릭하여 입력을 마운트하면, [`input.select()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select)이 입력의 모든 텍스트를 선택합니다:

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

## 대안 {/*alternatives*/}

### ref에서 컴포넌트의 자체 DOM 노드 읽기 {/*reading-components-own-dom-node-from-a-ref*/}

`findDOMNode`를 사용하는 코드는 JSX 노드와 해당 DOM 노드를 조작하는 코드 간의 연결이 명시적이지 않기 때문에 취약합니다. 예를 들어, 이 `<input />`을 `<div>`로 감싸보세요:

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

이제 `findDOMNode(this)`는 `<div>` DOM 노드를 찾지만, 코드는 `<input>` DOM 노드를 기대하기 때문에 코드가 깨집니다. 이러한 문제를 피하려면 특정 DOM 노드를 관리하기 위해 [`createRef`](/reference/react/createRef)를 사용하세요.

이 예제에서는 더 이상 `findDOMNode`를 사용하지 않습니다. 대신, `inputRef = createRef(null)`를 클래스의 인스턴스 필드로 정의합니다. DOM 노드를 읽기 위해 `this.inputRef.current`를 사용할 수 있습니다. 이를 JSX에 연결하려면 `<input ref={this.inputRef} />`를 렌더링합니다. 이렇게 하면 DOM 노드를 사용하는 코드가 JSX와 연결됩니다:

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

클래스 컴포넌트가 없는 최신 React에서는, 동일한 코드는 [`useRef`](/reference/react/useRef)를 호출합니다:

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

[refs를 사용하여 DOM 조작에 대해 더 읽어보세요.](/learn/manipulating-the-dom-with-refs)

---

### 전달된 ref에서 자식 컴포넌트의 DOM 노드 읽기 {/*reading-a-child-components-dom-node-from-a-forwarded-ref*/}

이 예제에서, `findDOMNode(this)`는 다른 컴포넌트에 속하는 DOM 노드를 찾습니다. `AutoselectingInput`은 브라우저 `<input>`을 렌더링하는 `MyInput`을 렌더링합니다.

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

`AutoselectingInput` 내부에서 `findDOMNode(this)`를 호출하면 여전히 DOM `<input>`을 얻을 수 있습니다. 비록 이 `<input>`의 JSX가 `MyInput` 컴포넌트 내부에 숨겨져 있어도 말입니다. 이는 위의 예제에서는 편리해 보이지만, 취약한 코드로 이어집니다. 나중에 `MyInput`을 편집하여 그 주위에 래퍼 `<div>`를 추가하려고 한다고 상상해보세요. 이는 `<input>`을 찾기를 기대하는 `AutoselectingInput`의 코드를 깨뜨릴 것입니다.

이 예제에서 `findDOMNode`를 대체하려면 두 컴포넌트가 협력해야 합니다:

1. `AutoSelectingInput`은 ref를 선언하고, [이전 예제](#reading-components-own-dom-node-from-a-ref)처럼 이를 `<MyInput>`에 전달해야 합니다.
2. `MyInput`은 [`forwardRef`](/reference/react/forwardRef)로 선언되어야 하며, 이를 통해 해당 ref를 `<input>` 노드로 전달해야 합니다.

이 버전은 이를 수행하므로 더 이상 `findDOMNode`가 필요하지 않습니다:

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

여기서는 클래스 대신 함수형 컴포넌트를 사용한 코드입니다:

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

### 래퍼 `<div>` 요소 추가하기 {/*adding-a-wrapper-div-element*/}

때때로 컴포넌트는 자식의 위치와 크기를 알아야 합니다. 이는 `findDOMNode(this)`로 자식을 찾고, [`getBoundingClientRect`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)와 같은 DOM 메서드를 사용하여 측정을 수행하는 유혹을 불러일으킵니다.

이 사용 사례에 대한 직접적인 대안은 현재 없기 때문에 `findDOMNode`는 사용 중단되었지만 아직 완전히 제거되지는 않았습니다. 그동안, 콘텐츠 주위에 래퍼 `<div>` 노드를 렌더링하고 해당 노드에 ref를 얻는 방법을 시도할 수 있습니다. 그러나 추가 래퍼는 스타일을 깨뜨릴 수 있습니다.

```js
<div ref={someRef}>
  {children}
</div>
```

이는 임의의 자식에게 포커스를 맞추거나 스크롤하는 경우에도 적용됩니다.