---
title: forwardRef
---

<Intro>

`forwardRef`는 컴포넌트가 부모 컴포넌트에 DOM 노드를 [ref](/learn/manipulating-the-dom-with-refs)로 노출할 수 있게 합니다.

```js
const SomeComponent = forwardRef(render)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `forwardRef(render)` {/*forwardref*/}

`forwardRef()`를 호출하여 컴포넌트가 ref를 받아 자식 컴포넌트로 전달할 수 있게 합니다:

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### Parameters {/*parameters*/}

* `render`: 컴포넌트의 렌더 함수입니다. React는 이 함수를 부모로부터 받은 props와 `ref`로 호출합니다. 반환된 JSX는 컴포넌트의 출력이 됩니다.

#### Returns {/*returns*/}

`forwardRef`는 JSX에서 렌더링할 수 있는 React 컴포넌트를 반환합니다. 일반 함수로 정의된 React 컴포넌트와 달리, `forwardRef`로 반환된 컴포넌트는 `ref` prop도 받을 수 있습니다.

#### Caveats {/*caveats*/}

* Strict Mode에서 React는 [우연한 불순물을 찾기 위해](/reference/react/useState#my-initializer-or-updater-function-runs-twice) **렌더 함수를 두 번 호출**합니다. 이는 개발 전용 동작이며 프로덕션에는 영향을 미치지 않습니다. 렌더 함수가 순수하다면 (그렇게 되어야 합니다), 이는 컴포넌트의 로직에 영향을 미치지 않습니다. 호출 중 하나의 결과는 무시됩니다.


---

### `render` function {/*render-function*/}

`forwardRef`는 렌더 함수를 인수로 받습니다. React는 이 함수를 `props`와 `ref`로 호출합니다:

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

#### Parameters {/*render-parameters*/}

* `props`: 부모 컴포넌트에서 전달된 props.

* `ref`: 부모 컴포넌트에서 전달된 `ref` 속성. `ref`는 객체나 함수일 수 있습니다. 부모 컴포넌트가 ref를 전달하지 않았다면 `null`이 됩니다. 받은 `ref`를 다른 컴포넌트에 전달하거나 [`useImperativeHandle`](/reference/react/useImperativeHandle)에 전달해야 합니다.

#### Returns {/*render-returns*/}

`forwardRef`는 JSX에서 렌더링할 수 있는 React 컴포넌트를 반환합니다. 일반 함수로 정의된 React 컴포넌트와 달리, `forwardRef`로 반환된 컴포넌트는 `ref` prop도 받을 수 있습니다.

---

## Usage {/*usage*/}

### 부모 컴포넌트에 DOM 노드 노출하기 {/*exposing-a-dom-node-to-the-parent-component*/}

기본적으로 각 컴포넌트의 DOM 노드는 비공개입니다. 그러나 때로는 DOM 노드를 부모에게 노출하는 것이 유용할 수 있습니다. 예를 들어, 포커스를 맞추기 위해서입니다. 이를 위해 컴포넌트 정의를 `forwardRef()`로 감쌉니다:

```js {3,11}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} />
    </label>
  );
});
```

props 다음 두 번째 인수로 <CodeStep step={1}>ref</CodeStep>를 받습니다. 노출하려는 DOM 노드에 이를 전달합니다:

```js {8} [[1, 3, "ref"], [1, 8, "ref", 30]]
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

이렇게 하면 부모 `Form` 컴포넌트가 `MyInput`이 노출한 <CodeStep step={2}>`<input>` DOM 노드</CodeStep>에 접근할 수 있습니다:

```js [[1, 2, "ref"], [1, 10, "ref", 41], [2, 5, "ref.current"]]
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

이 `Form` 컴포넌트는 `MyInput`에 [ref를 전달](/reference/react/useRef#manipulating-the-dom-with-a-ref)합니다. `MyInput` 컴포넌트는 그 ref를 `<input>` 브라우저 태그에 *전달*합니다. 결과적으로 `Form` 컴포넌트는 그 `<input>` DOM 노드에 접근하여 [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)를 호출할 수 있습니다.

컴포넌트 내부의 DOM 노드에 ref를 노출하면 나중에 컴포넌트의 내부를 변경하기 어려워진다는 점을 기억하세요. 일반적으로 버튼이나 텍스트 입력과 같은 재사용 가능한 저수준 컴포넌트에서 DOM 노드를 노출하지만, 아바타나 댓글과 같은 애플리케이션 수준의 컴포넌트에서는 그렇게 하지 않습니다.

<Recipes titleText="ref 전달 예제">

#### 텍스트 입력에 포커스 맞추기 {/*focusing-a-text-input*/}

버튼을 클릭하면 입력란에 포커스가 맞춰집니다. `Form` 컴포넌트는 ref를 정의하고 이를 `MyInput` 컴포넌트에 전달합니다. `MyInput` 컴포넌트는 그 ref를 브라우저 `<input>`에 전달합니다. 이를 통해 `Form` 컴포넌트는 `<input>`에 포커스를 맞출 수 있습니다.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

<Solution />

#### 비디오 재생 및 일시 정지 {/*playing-and-pausing-a-video*/}

버튼을 클릭하면 [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) 및 [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause)가 `<video>` DOM 노드에서 호출됩니다. `App` 컴포넌트는 ref를 정의하고 이를 `MyVideoPlayer` 컴포넌트에 전달합니다. `MyVideoPlayer` 컴포넌트는 그 ref를 브라우저 `<video>` 노드에 전달합니다. 이를 통해 `App` 컴포넌트는 `<video>`를 재생하고 일시 정지할 수 있습니다.

<Sandpack>

```js
import { useRef } from 'react';
import MyVideoPlayer from './MyVideoPlayer.js';

export default function App() {
  const ref = useRef(null);
  return (
    <>
      <button onClick={() => ref.current.play()}>
        Play
      </button>
      <button onClick={() => ref.current.pause()}>
        Pause
      </button>
      <br />
      <MyVideoPlayer
        ref={ref}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        type="video/mp4"
        width="250"
      />
    </>
  );
}
```

```js src/MyVideoPlayer.js
import { forwardRef } from 'react';

const VideoPlayer = forwardRef(function VideoPlayer({ src, type, width }, ref) {
  return (
    <video width={width} ref={ref}>
      <source
        src={src}
        type={type}
      />
    </video>
  );
});

export default VideoPlayer;
```

```css
button { margin-bottom: 10px; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### 여러 컴포넌트를 통해 ref 전달하기 {/*forwarding-a-ref-through-multiple-components*/}

DOM 노드에 ref를 전달하는 대신, `MyInput`과 같은 자신의 컴포넌트에 전달할 수 있습니다:

```js {1,5}
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

그 `MyInput` 컴포넌트가 ref를 `<input>`에 전달하면, `FormField`에 대한 ref는 그 `<input>`을 제공합니다:

```js {2,5,10}
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

`Form` 컴포넌트는 ref를 정의하고 이를 `FormField`에 전달합니다. `FormField` 컴포넌트는 그 ref를 `MyInput`에 전달하고, `MyInput`은 이를 브라우저 `<input>` DOM 노드에 전달합니다. 이렇게 해서 `Form`은 그 DOM 노드에 접근할 수 있습니다.


<Sandpack>

```js
import { useRef } from 'react';
import FormField from './FormField.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/FormField.js
import { forwardRef, useState } from 'react';
import MyInput from './MyInput.js';

const FormField = forwardRef(function FormField({ label, isRequired }, ref) {
  const [value, setValue] = useState('');
  return (
    <>
      <MyInput
        ref={ref}
        label={label}
        value={value}
        onChange={e => setValue(e.target.value)} 
      />
      {(isRequired && value === '') &&
        <i>Required</i>
      }
    </>
  );
});

export default FormField;
```


```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input, button {
  margin: 5px;
}
```

</Sandpack>

---

### DOM 노드 대신 명령형 핸들 노출하기 {/*exposing-an-imperative-handle-instead-of-a-dom-node*/}

전체 DOM 노드를 노출하는 대신, 더 제한된 메서드 집합을 가진 사용자 정의 객체인 *명령형 핸들*을 노출할 수 있습니다. 이를 위해 DOM 노드를 보유할 별도의 ref를 정의해야 합니다:

```js {2,6}
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

받은 `ref`를 [`useImperativeHandle`](/reference/react/useImperativeHandle)에 전달하고 노출하려는 값을 지정합니다:

```js {6-15}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

어떤 컴포넌트가 `MyInput`에 대한 ref를 받으면, DOM 노드 대신 `{ focus, scrollIntoView }` 객체만 받게 됩니다. 이를 통해 DOM 노드에 대한 정보를 최소한으로 노출할 수 있습니다.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // DOM 노드가 노출되지 않기 때문에 작동하지 않습니다:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

[명령형 핸들 사용에 대해 더 읽어보세요.](/reference/react/useImperativeHandle)

<Pitfall>

**ref를 과도하게 사용하지 마세요.** ref는 스크롤, 포커스, 애니메이션 트리거, 텍스트 선택 등 props로 표현할 수 없는 *명령형* 동작에만 사용해야 합니다.

**props로 표현할 수 있는 것은 ref를 사용하지 마세요.** 예를 들어, `Modal` 컴포넌트에서 `{ open, close }`와 같은 명령형 핸들을 노출하는 대신, `<Modal isOpen={isOpen} />`와 같이 `isOpen`을 prop으로 받는 것이 더 좋습니다. [Effects](/learn/synchronizing-with-effects)는 props를 통해 명령형 동작을 노출하는 데 도움이 될 수 있습니다.

</Pitfall>

---

## Troubleshooting {/*troubleshooting*/}

### 내 컴포넌트가 `forwardRef`로 감싸져 있지만, 이에 대한 `ref`가 항상 `null`입니다 {/*my-component-is-wrapped-in-forwardref-but-the-ref-to-it-is-always-null*/}

이는 보통 받은 `ref`를 실제로 사용하지 않았기 때문입니다.

예를 들어, 이 컴포넌트는 `ref`로 아무것도 하지 않습니다:

```js {1}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input />
    </label>
  );
});
```

이를 수정하려면, `ref`를 DOM 노드나 ref를 받을 수 있는 다른 컴포넌트에 전달하세요:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

`MyInput`에 대한 ref는 논리가 조건부일 때도 `null`일 수 있습니다:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      {showInput && <input ref={ref} />}
    </label>
  );
});
```

`showInput`이 `false`이면, ref는 어떤 노드에도 전달되지 않으며, `MyInput`에 대한 ref는 비어 있게 됩니다. 이는 특히 조건이 다른 컴포넌트 내부에 숨겨져 있을 때 쉽게 놓칠 수 있습니다. 예를 들어, 이 예제의 `Panel`처럼:

```js {5,7}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      <Panel isExpanded={showInput}>
        <input ref={ref} />
      </Panel>
    </label>
  );
});
```