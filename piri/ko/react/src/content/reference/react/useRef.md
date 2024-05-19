---
title: useRef
---

<Intro>

`useRef`는 렌더링에 필요하지 않은 값을 참조할 수 있게 해주는 React Hook입니다.

```js
const ref = useRef(initialValue)
```

</Intro>

<InlineToc />

---

## 참조 {/*reference*/}

### `useRef(initialValue)` {/*useref*/}

컴포넌트의 최상위 레벨에서 `useRef`를 호출하여 [ref를 선언](/learn/referencing-values-with-refs)합니다.

```js
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `initialValue`: ref 객체의 `current` 속성에 초기 설정할 값입니다. 이 값은 어떤 타입이든 될 수 있습니다. 이 인수는 초기 렌더링 이후에는 무시됩니다.

#### 반환값 {/*returns*/}

`useRef`는 단일 속성을 가진 객체를 반환합니다:

* `current`: 처음에는 전달한 `initialValue`로 설정됩니다. 나중에 다른 값으로 설정할 수 있습니다. ref 객체를 JSX 노드의 `ref` 속성으로 React에 전달하면, React는 `current` 속성을 설정합니다.

다음 렌더링 시, `useRef`는 동일한 객체를 반환합니다.

#### 주의사항 {/*caveats*/}

* `ref.current` 속성은 변경할 수 있습니다. 상태와 달리, 이는 변경 가능합니다. 그러나 렌더링에 사용되는 객체를 포함하고 있다면(예: 상태의 일부), 해당 객체를 변경해서는 안 됩니다.
* `ref.current` 속성을 변경해도 React는 컴포넌트를 다시 렌더링하지 않습니다. ref는 단순한 JavaScript 객체이기 때문에 React는 이를 변경할 때 인식하지 못합니다.
* 렌더링 중에는 `ref.current`를 읽거나 쓰지 마세요, [초기화](#avoiding-recreating-the-ref-contents)를 제외하고. 이는 컴포넌트의 동작을 예측할 수 없게 만듭니다.
* Strict Mode에서는, React가 **컴포넌트 함수를 두 번 호출**하여 [우연한 불순물을 찾도록 돕습니다.](/reference/react/useState#my-initializer-or-updater-function-runs-twice) 이는 개발 전용 동작이며, 프로덕션에는 영향을 미치지 않습니다. 각 ref 객체는 두 번 생성되지만, 하나의 버전은 폐기됩니다. 컴포넌트 함수가 순수하다면(그렇게 되어야 합니다), 이는 동작에 영향을 미치지 않습니다.

---

## 사용법 {/*usage*/}

### ref로 값 참조하기 {/*referencing-a-value-with-a-ref*/}

컴포넌트의 최상위 레벨에서 `useRef`를 호출하여 하나 이상의 [ref를 선언](/learn/referencing-values-with-refs)합니다.

```js [[1, 4, "intervalRef"], [3, 4, "0"]]
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

`useRef`는 <CodeStep step={1}>ref 객체</CodeStep>를 반환하며, 이 객체는 단일 <CodeStep step={2}>`current` 속성</CodeStep>을 가지고 있으며, 초기에는 제공한 <CodeStep step={3}>초기 값</CodeStep>으로 설정됩니다.

다음 렌더링 시, `useRef`는 동일한 객체를 반환합니다. `current` 속성을 변경하여 정보를 저장하고 나중에 읽을 수 있습니다. 이는 [상태](/reference/react/useState)를 연상시킬 수 있지만, 중요한 차이점이 있습니다.

**ref를 변경해도 다시 렌더링되지 않습니다.** 이는 ref가 컴포넌트의 시각적 출력에 영향을 미치지 않는 정보를 저장하는 데 적합하다는 것을 의미합니다. 예를 들어, [interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)를 저장하고 나중에 검색해야 하는 경우, 이를 ref에 넣을 수 있습니다. ref 내부의 값을 업데이트하려면, 수동으로 <CodeStep step={2}>`current` 속성</CodeStep>을 변경해야 합니다:

```js [[2, 5, "intervalRef.current"]]
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}
```

나중에, ref에서 해당 interval ID를 읽어 [해당 interval을 지울](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) 수 있습니다:

```js [[2, 2, "intervalRef.current"]]
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

ref를 사용하면 다음을 보장할 수 있습니다:

- **정보를 다시 렌더링 사이에 저장**할 수 있습니다 (매 렌더링 시 초기화되는 일반 변수와 달리).
- 변경해도 **다시 렌더링되지 않습니다** (다시 렌더링을 트리거하는 상태 변수와 달리).
- **정보가 각 컴포넌트 복사본에 로컬**입니다 (외부 변수와 달리, 외부 변수는 공유됩니다).

ref를 변경해도 다시 렌더링되지 않으므로, 화면에 표시하려는 정보를 저장하는 데는 적합하지 않습니다. 대신 상태를 사용하세요. [`useRef`와 `useState` 사이의 선택에 대해 더 읽어보세요.](/learn/referencing-values-with-refs#differences-between-refs-and-state)

<Recipes titleText="useRef로 값 참조 예제" titleId="examples-value">

#### 클릭 카운터 {/*click-counter*/}

이 컴포넌트는 버튼이 클릭된 횟수를 추적하기 위해 ref를 사용합니다. 클릭 수는 이벤트 핸들러에서만 읽고 쓰기 때문에, 여기서는 상태 대신 ref를 사용하는 것이 괜찮습니다.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

JSX에서 `{ref.current}`를 표시하면, 클릭 시 숫자가 업데이트되지 않습니다. 이는 `ref.current`를 설정해도 다시 렌더링되지 않기 때문입니다. 렌더링에 사용되는 정보는 상태여야 합니다.

<Solution />

#### 스톱워치 {/*a-stopwatch*/}

이 예제는 상태와 ref의 조합을 사용합니다. `startTime`과 `now`는 렌더링에 사용되기 때문에 상태 변수입니다. 그러나 버튼을 눌러 interval을 중지할 수 있도록 [interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)를 보유해야 합니다. interval ID는 렌더링에 사용되지 않으므로, ref에 보관하고 수동으로 업데이트하는 것이 적절합니다.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

**렌더링 중에 `ref.current`를 읽거나 쓰지 마세요.**

React는 컴포넌트의 본문이 [순수 함수처럼 동작하기를 기대합니다](/learn/keeping-components-pure):

- 입력값([props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory), [context](/learn/passing-data-deeply-with-context))이 동일하면, 정확히 동일한 JSX를 반환해야 합니다.
- 다른 순서로 호출하거나 다른 인수로 호출해도 다른 호출의 결과에 영향을 미치지 않아야 합니다.

렌더링 중에 ref를 읽거나 쓰는 것은 이러한 기대를 깨뜨립니다.

```js {3-4,6-7}
function MyComponent() {
  // ...
  // 🚩 렌더링 중에 ref를 쓰지 마세요
  myRef.current = 123;
  // ...
  // 🚩 렌더링 중에 ref를 읽지 마세요
  return <h1>{myOtherRef.current}</h1>;
}
```

대신 **이벤트 핸들러나 효과에서** ref를 읽거나 쓸 수 있습니다.

```js {4-5,9-10}
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ 효과에서 ref를 읽거나 쓸 수 있습니다
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ 이벤트 핸들러에서 ref를 읽거나 쓸 수 있습니다
    doSomething(myOtherRef.current);
  }
  // ...
}
```

렌더링 중에 [무언가를 읽거나](/reference/react/useState#storing-information-from-previous-renders) 써야 한다면, 대신 [상태를 사용](/reference/react/useState)하세요.

이 규칙을 어기면 컴포넌트가 여전히 작동할 수 있지만, React에 추가하는 대부분의 새로운 기능은 이러한 기대에 의존하게 됩니다. [컴포넌트를 순수하게 유지하는 방법](https://react.dev/learn/keeping-components-pure#where-you-_can_-cause-side-effects)에 대해 더 읽어보세요.

</Pitfall>

---

### ref로 DOM 조작하기 {/*manipulating-the-dom-with-a-ref*/}

ref를 사용하여 [DOM을 조작](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API)하는 것은 특히 일반적입니다. React는 이를 위한 내장 지원을 제공합니다.

먼저, <CodeStep step={1}>ref 객체</CodeStep>를 `null`의 <CodeStep step={3}>초기 값</CodeStep>으로 선언합니다:

```js [[1, 4, "inputRef"], [3, 4, "null"]]
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

그런 다음, ref 객체를 조작하려는 DOM 노드의 JSX에 `ref` 속성으로 전달합니다:

```js [[1, 2, "inputRef"]]
  // ...
  return <input ref={inputRef} />;
```

React가 DOM 노드를 생성하고 화면에 표시한 후, React는 ref 객체의 <CodeStep step={2}>`current` 속성</CodeStep>을 해당 DOM 노드로 설정합니다. 이제 `<input>`의 DOM 노드에 접근하여 [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)와 같은 메서드를 호출할 수 있습니다:

```js [[2, 2, "inputRef.current"]]
  function handleClick() {
    inputRef.current.focus();
  }
```

React는 노드가 화면에서 제거될 때 `current` 속성을 `null`로 다시 설정합니다.

[ref로 DOM 조작하기](https://react.dev/learn/manipulating-the-dom-with-refs)에 대해 더 읽어보세요.

<Recipes titleText="useRef로 DOM 조작 예제" titleId="examples-dom">

#### 텍스트 입력에 포커스 맞추기 {/*focusing-a-text-input*/}

이 예제에서는 버튼을 클릭하면 입력란에 포커스가 맞춰집니다:

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

<Solution />

#### 이미지를 뷰로 스크롤하기 {/*scrolling-an-image-into-view*/}

이 예제에서는 버튼을 클릭하면 이미지가 뷰로 스크롤됩니다. 이는 리스트 DOM 노드에 대한 ref를 사용하고, DOM [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) API를 호출하여 스크롤할 이미지를 찾습니다.

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const listRef = useRef(null);

  function scrollToIndex(index) {
    const listNode = listRef.current;
    // 이 줄은 특정 DOM 구조를 가정합니다:
    const imgNode = listNode.querySelectorAll('li > img')[index];
    imgNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToIndex(0)}>
          Tom
        </button>
        <button onClick={() => scrollToIndex(1)}>
          Maru
        </button>
        <button onClick={() => scrollToIndex(2)}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul ref={listRef}>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<Solution />

#### 비디오 재생 및 일시 정지 {/*playing-and-pausing-a-video*/}

이 예제는 ref를 사용하여 `<video>` DOM 노드에서 [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) 및 [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause)를 호출합니다.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution />

#### 자신의 컴포넌트에 ref 노출하기 {/*exposing-a-ref-to-your-own-component*/}

때로는 부모 컴포넌트가 컴포넌트 내부의 DOM을 조작할 수 있도록 하고 싶을 수 있습니다. 예를 들어, `MyInput` 컴포넌트를 작성하고 있지만, 부모가 입력란에 포커스를 맞출 수 있도록 하고 싶을 수 있습니다(부모는 입력란에 접근할 수 없습니다). `useRef`를 사용하여 입력란을 보유하고 [`forwardRef`](/reference/react/forwardRef)를 사용하여 부모 컴포넌트에 노출할 수 있습니다. [자세한 설명](https://react.dev/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)을 여기에서 읽어보세요.

<Sandpack>

```js
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### ref 내용 재생성 방지하기 {/*avoiding-recreating-the-ref-contents*/}

React는 초기 ref 값을 한 번 저장하고 다음 렌더링 시 무시합니다.

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

`new VideoPlayer()`의 결과는 초기 렌더링에만 사용되지만, 여전히 매 렌더링 시 이 함수를 호출하고 있습니다. 이는 비싼 객체를 생성하는 경우 낭비가 될 수 있습니다.

이를 해결하려면, 대신 ref를 다음과 같이 초기화할 수 있습니다:

```js
function Video() {
  const playerRef = useRef(null);
  if ((playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

일반적으로, 렌더링 중에 `ref.current`를 읽거나 쓰는 것은 허용되지 않습니다. 그러나 이 경우에는 결과가 항상 동일하고 조건이 초기화 중에만 실행되므로 완전히 예측 가능합니다.

<DeepDive>

#### useRef를 나중에 초기화할 때 null 검사를 피하는 방법 {/*how-to-avoid-null-checks-when-initializing-use-ref-later*/}

타입 체커를 사용하고 항상 `null`을 검사하고 싶지 않다면, 대신 다음과 같은 패턴을 시도할 수 있습니다:

```js
function Video() {
  const playerRef = useRef(null);

  function getPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
```

여기서, `playerRef` 자체는 nullable입니다. 그러나 `getPlayer()`가 `null`을 반환하지 않는 경우가 없음을 타입 체커에게 납득시킬 수 있어야 합니다. 그런 다음 이벤트 핸들러에서 `getPlayer()`를 사용하세요.

</DeepDive>

---

## 문제 해결 {/*troubleshooting*/}

### 커스텀 컴포넌트에 ref를 얻을 수 없습니다 {/*i-cant-get-a-ref-to-a-custom-component*/}

다음과 같이 `ref`를 자신의 컴포넌트에 전달하려고 하면:

```js
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

콘솔에 오류가 발생할 수 있습니다:

<ConsoleBlock level="error">

경고: 함수 컴포넌트에 ref를 줄 수 없습니다. 이 ref에 접근하려는 시도는 실패합니다. React.forwardRef()를 사용하려고 했습니까?

</ConsoleBlock>

기본적으로, 자신의 컴포넌트는 내부의 DOM 노드에 ref를 노출하지 않습니다.

이를 해결하려면, ref를 얻고자 하는 컴포넌트를 찾으세요:

```js
export default function MyInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
    />
  );
}
```

그런 다음 이를 [`forwardRef`](/reference/react/forwardRef)로 다음과 같이 감싸세요:

```js {3,8}
import { forwardRef } from 'react';

const MyInput = forwardRef(({ value, onChange }, ref) => {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
});

export default MyInput;
```

그런 다음 부모 컴포넌트는 이에 대한 ref를 얻을 수 있습니다.

[다른 컴포넌트의 DOM 노드에 접근하기](https://react.dev/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)에 대해 더 읽어보세요.