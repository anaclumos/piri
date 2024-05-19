---
title: Refs로 값 참조하기
---

<Intro>

컴포넌트가 일부 정보를 "기억"하도록 하고 싶지만, 그 정보가 [새로운 렌더링을 트리거](/learn/render-and-commit)하지 않기를 원할 때는 *ref*를 사용할 수 있습니다.

</Intro>

<YouWillLearn>

- 컴포넌트에 ref를 추가하는 방법
- ref의 값을 업데이트하는 방법
- ref와 state의 차이점
- ref를 안전하게 사용하는 방법

</YouWillLearn>

## 컴포넌트에 ref 추가하기 {/*adding-a-ref-to-your-component*/}

React에서 `useRef` Hook을 가져와서 컴포넌트에 ref를 추가할 수 있습니다:

```js
import { useRef } from 'react';
```

컴포넌트 내부에서 `useRef` Hook을 호출하고 참조하려는 초기 값을 유일한 인수로 전달합니다. 예를 들어, 여기 `0` 값을 참조하는 ref가 있습니다:

```js
const ref = useRef(0);
```

`useRef`는 다음과 같은 객체를 반환합니다:

```js
{ 
  current: 0 // useRef에 전달한 값
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="주머니에 'ref'라고 적힌 화살표에 'current'라고 적힌 화살표가 들어있는 그림." />

해당 ref의 현재 값은 `ref.current` 속성을 통해 접근할 수 있습니다. 이 값은 의도적으로 변경 가능하며, 읽고 쓸 수 있습니다. 이는 React가 추적하지 않는 컴포넌트의 비밀 주머니와 같습니다. (이것이 React의 단방향 데이터 흐름에서 "탈출구"가 되는 이유입니다. 아래에서 더 자세히 설명합니다!)

여기, 버튼을 클릭할 때마다 `ref.current`가 증가하는 예제가 있습니다:

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

ref는 숫자를 가리키지만, [state](/learn/state-a-components-memory)처럼 문자열, 객체 또는 함수 등 무엇이든 가리킬 수 있습니다. state와 달리 ref는 `current` 속성을 가진 단순한 JavaScript 객체로, 읽고 수정할 수 있습니다.

**컴포넌트는 매번 증가할 때마다 다시 렌더링되지 않습니다.** state와 마찬가지로, ref는 React에 의해 재렌더링 사이에 유지됩니다. 그러나 state를 설정하면 컴포넌트가 다시 렌더링됩니다. ref를 변경해도 그렇지 않습니다!

## 예제: 스톱워치 만들기 {/*example-building-a-stopwatch*/}

하나의 컴포넌트에서 ref와 state를 결합할 수 있습니다. 예를 들어, 사용자가 버튼을 눌러 스톱워치를 시작하거나 중지할 수 있게 만들어 보겠습니다. 사용자가 "시작" 버튼을 누른 시점과 현재 시간을 추적하여 경과 시간을 표시해야 합니다. **이 정보는 렌더링에 사용되므로 state에 저장합니다:**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

사용자가 "시작"을 누르면 [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval)을 사용하여 10밀리초마다 시간을 업데이트합니다:

<Sandpack>

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // 카운트 시작.
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // 10ms마다 현재 시간 업데이트.
      setNow(Date.now());
    }, 10);
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
    </>
  );
}
```

</Sandpack>

"정지" 버튼을 누르면 기존의 interval을 취소하여 `now` state 변수를 업데이트하는 것을 중지해야 합니다. 이를 위해 [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)을 호출할 수 있지만, 사용자가 시작을 눌렀을 때 `setInterval` 호출로 반환된 interval ID를 제공해야 합니다. interval ID를 어딘가에 저장해야 합니다. **interval ID는 렌더링에 사용되지 않으므로 ref에 저장할 수 있습니다:**

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

렌더링에 사용되는 정보는 state에 저장합니다. 이벤트 핸들러에만 필요하고 변경해도 재렌더링이 필요하지 않은 정보는 ref를 사용하는 것이 더 효율적일 수 있습니다.

## ref와 state의 차이점 {/*differences-between-refs-and-state*/}

아마도 ref가 state보다 덜 "엄격"하다고 생각할 수 있습니다. 예를 들어, 항상 state 설정 함수를 사용해야 하는 대신 ref는 변경할 수 있습니다. 하지만 대부분의 경우 state를 사용하고 싶을 것입니다. ref는 자주 필요하지 않은 "탈출구"입니다. state와 ref의 비교는 다음과 같습니다:

| refs                                                                                  | state                                                                                                                     |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)`는 `{ current: initialValue }`를 반환합니다.                            | `useState(initialValue)`는 state 변수의 현재 값과 state 설정 함수 (`[value, setValue]`)를 반환합니다. |
| 변경해도 재렌더링을 트리거하지 않습니다.                                         | 변경하면 재렌더링을 트리거합니다.                                                                                    |
| 변경 가능—렌더링 과정 외부에서 `current`의 값을 수정하고 업데이트할 수 있습니다. | "불변"—state 변수를 수정하려면 state 설정 함수를 사용하여 재렌더링을 큐에 넣어야 합니다.                       |
| 렌더링 중에 `current` 값을 읽거나 쓰지 않아야 합니다. | 언제든지 state를 읽을 수 있습니다. 그러나 각 렌더링에는 변경되지 않는 state의 [스냅샷](/learn/state-as-a-snapshot)이 있습니다.

여기 state로 구현된 카운터 버튼이 있습니다:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You clicked {count} times
    </button>
  );
}
```

</Sandpack>

`count` 값이 표시되므로 state 값을 사용하는 것이 합리적입니다. 카운터의 값이 `setCount()`로 설정되면 React는 컴포넌트를 다시 렌더링하고 화면이 새로운 카운트를 반영하도록 업데이트됩니다.

이를 ref로 구현하려고 하면 React는 컴포넌트를 다시 렌더링하지 않으므로 카운트가 변경되는 것을 볼 수 없습니다! 이 버튼을 클릭해도 **텍스트가 업데이트되지 않는** 것을 확인하세요:

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // 이 코드는 컴포넌트를 다시 렌더링하지 않습니다!
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      You clicked {countRef.current} times
    </button>
  );
}
```

</Sandpack>

이것이 렌더링 중에 `ref.current`를 읽는 것이 신뢰할 수 없는 코드를 초래하는 이유입니다. 그런 경우에는 state를 사용해야 합니다.

<DeepDive>

#### useRef는 내부에서 어떻게 작동하나요? {/*how-does-use-ref-work-inside*/}

`useState`와 `useRef`는 모두 React에서 제공되지만, 원칙적으로 `useRef`는 `useState` 위에 구현될 수 있습니다. React 내부에서 `useRef`가 다음과 같이 구현된다고 상상할 수 있습니다:

```js
// React 내부
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

첫 번째 렌더링 동안 `useRef`는 `{ current: initialValue }`를 반환합니다. 이 객체는 React에 의해 저장되므로 다음 렌더링에서는 동일한 객체가 반환됩니다. 이 예제에서 state 설정 함수는 사용되지 않습니다. `useRef`는 항상 동일한 객체를 반환해야 하기 때문에 불필요합니다!

React는 실무에서 충분히 일반적이기 때문에 `useRef`의 내장 버전을 제공합니다. 그러나 이를 setter가 없는 일반 state 변수로 생각할 수 있습니다. 객체 지향 프로그래밍에 익숙하다면, ref는 인스턴스 필드를 떠올리게 할 수 있습니다. 그러나 `this.something` 대신 `somethingRef.current`를 작성합니다.

</DeepDive>

## ref를 언제 사용해야 하나요? {/*when-to-use-refs*/}

일반적으로 컴포넌트가 React 외부와 통신하고 외부 API와 상호작용해야 할 때 ref를 사용합니다. 이는 종종 컴포넌트의 외관에 영향을 미치지 않는 브라우저 API와 관련이 있습니다. 다음은 이러한 드문 상황 중 일부입니다:

- [timeout ID](https://developer.mozilla.org/docs/Web/API/setTimeout) 저장
- [DOM 요소](https://developer.mozilla.org/docs/Web/API/Element) 저장 및 조작, 이는 [다음 페이지](/learn/manipulating-the-dom-with-refs)에서 다룹니다.
- JSX를 계산하는 데 필요하지 않은 다른 객체 저장.

컴포넌트가 어떤 값을 저장해야 하지만 렌더링 로직에 영향을 미치지 않는 경우 ref를 선택하세요.

## ref의 모범 사례 {/*best-practices-for-refs*/}

다음 원칙을 따르면 컴포넌트가 더 예측 가능해집니다:

- **ref를 탈출구로 취급하세요.** ref는 외부 시스템이나 브라우저 API와 작업할 때 유용합니다. 애플리케이션 로직과 데이터 흐름의 많은 부분이 ref에 의존한다면 접근 방식을 재고해야 할 수 있습니다.
- **렌더링 중에 `ref.current`를 읽거나 쓰지 마세요.** 렌더링 중에 필요한 정보는 [state](/learn/state-a-components-memory)를 사용하세요. React는 `ref.current`가 변경될 때를 알지 못하므로, 렌더링 중에 이를 읽는 것은 컴포넌트의 동작을 예측하기 어렵게 만듭니다. (유일한 예외는 `if (!ref.current) ref.current = new Thing()`와 같은 코드로, 이는 첫 번째 렌더링 동안 ref를 한 번만 설정합니다.)

React state의 제한 사항은 ref에 적용되지 않습니다. 예를 들어, state는 [각 렌더링에 대한 스냅샷처럼 작동](/learn/state-as-a-snapshot)하며 [동기적으로 업데이트되지 않습니다.](/learn/queueing-a-series-of-state-updates) 그러나 ref의 현재 값을 변경하면 즉시 변경됩니다:

```js
ref.current = 5;
console.log(ref.current); // 5
```

이는 **ref 자체가 일반 JavaScript 객체**이기 때문에 그렇게 동작합니다.

ref를 사용할 때는 [변경을 피할 필요](/learn/updating-objects-in-state)가 없습니다. 렌더링에 사용되지 않는 객체를 변경하는 한, React는 ref나 그 내용에 대해 신경 쓰지 않습니다.

## ref와 DOM {/*refs-and-the-dom*/}

ref는 어떤 값이든 가리킬 수 있습니다. 그러나 ref의 가장 일반적인 사용 사례는 DOM 요소에 접근하는 것입니다. 예를 들어, 프로그래밍 방식으로 입력에 포커스를 맞추고 싶을 때 유용합니다. JSX에서 `<div ref={myRef}>`와 같이 ref를 `ref` 속성에 전달하면, React는 해당 DOM 요소를 `myRef.current`에 넣습니다. 요소가 DOM에서 제거되면 React는 `myRef.current`를 `null`로 업데이트합니다. 이에 대한 자세한 내용은 [Manipulating the DOM with Refs](/learn/manipulating-the-dom-with-refs)에서 읽을 수 있습니다.

<Recap>

- ref는 렌더링에 사용되지 않는 값을 유지하기 위한 탈출구입니다. 자주 필요하지 않습니다.
- ref는 읽거나 설정할 수 있는 단일 속성 `current`를 가진 단순한 JavaScript 객체입니다.
- `useRef` Hook을 호출하여 React에 ref를 요청할 수 있습니다.
- state와 마찬가지로, ref는 컴포넌트의 재렌더링 사이에 정보를 유지할 수 있습니다.
- state와 달리, ref의 `current` 값을 설정해도 재렌더링을 트리거하지 않습니다.
- 렌더링 중에 `ref.current`를 읽거나 쓰지 마세요. 이는 컴포넌트를 예측하기 어렵게 만듭니다.

</Recap>

<Challenges>

#### 고장난 채팅 입력 수정하기 {/*fix-a-broken-chat-input*/}

메시지를 입력하고 "Send"를 클릭하세요. "Sent!" 알림이 나타나기 전에 3초의 지연이 있습니다. 이 지연 동안 "Undo" 버튼이 보입니다. 클릭하세요. 이 "Undo" 버튼은 `handleSend` 동안 저장된 timeout ID에 대해 [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout)을 호출하여 "Sent!" 메시지가 나타나지 않도록 합니다. 그러나 "Undo"를 클릭해도 "Sent!" 메시지가 여전히 나타납니다. 왜 작동하지 않는지 찾아서 수정하세요.

<Hint>

`let timeoutID`와 같은 일반 변수는 매번 렌더링 사이에 "생존"하지 않습니다. 각 렌더링은 컴포넌트와 변수를 처음부터 초기화합니다. timeout ID를 다른 곳에 저장해야 할까요?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

<Solution>

컴포넌트가 다시 렌더링될 때마다 (예: state를 설정할 때) 모든 로컬 변수가 처음부터 초기화됩니다. 이것이 `timeoutID`와 같은 로컬 변수에 timeout ID를 저장하고 나중에 다른 이벤트 핸들러가 이를 "볼" 수 있다고 기대할 수 없는 이유입니다. 대신, ref에 저장하여 React가 렌더링 사이에 이를 유지하도록 합니다.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

</Solution>

#### 재렌더링되지 않는 컴포넌트 수정하기 {/*fix-a-component-failing-to-re-render*/}

이 버튼은 "On"과 "Off" 사이를 토글해야 합니다. 그러나 항상 "Off"로 표시됩니다. 이 코드에 무엇이 잘못되었나요? 수정하세요.

<Sandpack>

```js
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

<Solution>

이 예제에서 ref의 현재 값은 렌더링 출력을 계산하는 데 사용됩니다: `{isOnRef.current ? 'On' : 'Off'}`. 이는 이 정보가 ref에 있어서는 안 되며, 대신 state에 있어야 한다는 신호입니다. 이를 수정하려면 ref를 제거하고 대신 state를 사용하세요:

<Sandpack>

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

</Solution>

#### 디바운싱 수정하기 {/*fix-debouncing*/}

이 예제에서 모든 버튼 클릭 핸들러는 ["디바운싱"](https://redd.one/blog/debounce-vs-throttle)됩니다. 이게 무슨 뜻인지 보려면 버튼을 하나 눌러보세요. 메시지가 1초 후에 나타나는 것을 확인할 수 있습니다. 메시지를 기다리는 동안 버튼을 누르면 타이머가 재설정됩니다. 따라서 동일한 버튼을 빠르게 여러 번 클릭하면 메시지가 나타나지 않습니다. 디바운싱은 사용자가 "작업을 멈출 때까지" 일부 작업을 지연시킬 수 있게 합니다.

이 예제는 작동하지만 의도한 대로는 아닙니다. 버튼이 독립적이지 않습니다. 문제를 확인하려면 버튼 하나를 클릭한 다음 즉시 다른 버튼을 클릭하세요. 지연 후 두 버튼의 메시지가 나타날 것으로 예상되지만, 마지막 버튼의 메시지만 나타납니다. 첫 번째 버튼의 메시지는 사라집니다.

버튼이 서로 간섭하는 이유는 무엇일까요? 문제를 찾아 수정하세요.

<Hint>

마지막 timeout ID 변수는 모든 `DebouncedButton` 컴포넌트 간에 공유됩니다. 이것이 두 번째 버튼을 클릭하면 첫 번째 버튼의 타임아웃이 재설정되는 이유입니다. 각 버튼에 대해 별도의 timeout ID를 저장할 수 있나요?

</Hint>

<Sandpack>

```js
let timeoutID;

function DebouncedButton({ onClick, children }) {
  return (
    <button onClick={() => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

<Solution>

`timeoutID`와 같은 변수는 모든 컴포넌트 간에 공유됩니다. 이것이 두 번째 버튼을 클릭하면 첫 번째 버튼의 대기 중인 타임아웃이 재설정되는 이유입니다. 이를 수정하려면 timeout을 ref에 저장할 수 있습니다. 각 버튼은 자체 ref를 가지므로 서로 충돌하지 않습니다. 두 버튼을 빠르게 클릭하면 두 메시지가 모두 나타나는 것을 확인하세요.

<Sandpack>

```js
import { useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

</Solution>

#### 최신 state 읽기 {/*read-the-latest-state*/}

이 예제에서 "Send"를 누르면 메시지가 표시되기 전에 약간의 지연이 있습니다. "hello"를 입력하고 Send를 누른 다음 입력을 다시 빠르게 편집하세요. 편집에도 불구하고 경고는 여전히 "hello"를 표시합니다 (버튼이 클릭된 [시점의](/learn/state-as-a-snapshot#state-over-time) state 값입니다).

일반적으로 이 동작은 앱에서 원하는 것입니다. 그러나 비동기 코드가 일부 state의 *최신* 버전을 읽어야 하는 경우가 있을 수 있습니다. 클릭 시점의 입력 텍스트가 아닌 현재 입력 텍스트를 표시하도록 경고를 만들 수 있는 방법을 생각해 보세요.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + text);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

<Solution>

state는 [스냅샷처럼 작동](/learn/state-as-a-snapshot)하므로 비동기 작업(예: 타임아웃)에서 최신 state를 읽을 수 없습니다. 그러나 최신 입력 텍스트를 ref에 저장할 수 있습니다. ref는 변경 가능하므로 언제든지 `current` 속성을 읽을 수 있습니다. 현재 텍스트도 렌더링에 사용되므로, 이 예제에서는 *렌더링을 위해* state 변수가 필요하고, *타임아웃에서 읽기 위해* ref가 필요합니다. 현재 ref 값을 수동으로 업데이트해야 합니다.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

</Solution>

</Challenges>