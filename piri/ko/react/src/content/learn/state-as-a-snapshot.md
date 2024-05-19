---
title: 스냅샷으로서의 상태
---

<Intro>

상태 변수는 읽고 쓸 수 있는 일반적인 JavaScript 변수처럼 보일 수 있습니다. 그러나 상태는 스냅샷처럼 동작합니다. 상태를 설정하는 것은 이미 가지고 있는 상태 변수를 변경하는 것이 아니라, 대신 다시 렌더링을 트리거합니다.

</Intro>

<YouWillLearn>

* 상태 설정이 다시 렌더링을 트리거하는 방법
* 상태가 언제, 어떻게 업데이트되는지
* 상태가 설정된 직후에 즉시 업데이트되지 않는 이유
* 이벤트 핸들러가 상태의 "스냅샷"에 접근하는 방법

</YouWillLearn>

## 상태 설정이 렌더링을 트리거합니다 {/*setting-state-triggers-renders*/}

사용자 인터페이스가 클릭과 같은 사용자 이벤트에 직접 반응하여 변경된다고 생각할 수 있습니다. React에서는 이 정신 모델과는 조금 다르게 작동합니다. 이전 페이지에서 [상태 설정이 React로부터 다시 렌더링을 요청한다](/learn/render-and-commit#step-1-trigger-a-render)는 것을 보았습니다. 이는 인터페이스가 이벤트에 반응하려면 *상태를 업데이트*해야 한다는 것을 의미합니다.

이 예제에서 "send"를 누르면 `setIsSent(true)`가 React에게 UI를 다시 렌더링하라고 지시합니다:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

버튼을 클릭하면 다음과 같은 일이 발생합니다:

1. `onSubmit` 이벤트 핸들러가 실행됩니다.
2. `setIsSent(true)`가 `isSent`를 `true`로 설정하고 새로운 렌더링을 큐에 넣습니다.
3. React는 새로운 `isSent` 값에 따라 컴포넌트를 다시 렌더링합니다.

상태와 렌더링의 관계를 좀 더 자세히 살펴보겠습니다.

## 렌더링은 시간의 스냅샷을 찍습니다 {/*rendering-takes-a-snapshot-in-time*/}

["렌더링"](/learn/render-and-commit#step-2-react-renders-your-components)은 React가 컴포넌트를 호출하는 것을 의미합니다. 컴포넌트는 함수입니다. 그 함수에서 반환하는 JSX는 시간의 UI 스냅샷과 같습니다. 그 렌더링의 상태를 사용하여 모든 props, 이벤트 핸들러, 로컬 변수가 계산되었습니다.

사진이나 영화 프레임과 달리, 반환하는 UI "스냅샷"은 인터랙티브합니다. 입력에 대한 반응을 지정하는 이벤트 핸들러와 같은 로직을 포함합니다. React는 이 스냅샷에 맞게 화면을 업데이트하고 이벤트 핸들러를 연결합니다. 그 결과, 버튼을 누르면 JSX의 클릭 핸들러가 트리거됩니다.

React가 컴포넌트를 다시 렌더링할 때:

1. React가 다시 함수를 호출합니다.
2. 함수가 새로운 JSX 스냅샷을 반환합니다.
3. React는 함수가 반환한 스냅샷에 맞게 화면을 업데이트합니다.

<IllustrationBlock sequential>
    <Illustration caption="React가 함수를 실행하는 모습" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="스냅샷을 계산하는 모습" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="DOM 트리를 업데이트하는 모습" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

컴포넌트의 메모리로서 상태는 함수가 반환된 후 사라지는 일반적인 변수와는 다릅니다. 상태는 실제로 React 자체에 "살아있습니다" -- 마치 선반 위에 있는 것처럼! -- 함수 외부에 있습니다. React가 컴포넌트를 호출할 때, 특정 렌더링에 대한 상태의 스냅샷을 제공합니다. 컴포넌트는 상태 값을 사용하여 계산된 새로운 props와 이벤트 핸들러 세트가 포함된 UI의 스냅샷을 반환합니다.

<IllustrationBlock sequential>
  <Illustration caption="React에게 상태를 업데이트하라고 지시하는 모습" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React가 상태 값을 업데이트하는 모습" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React가 컴포넌트에 상태 값의 스냅샷을 전달하는 모습" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

이것이 어떻게 작동하는지 보여주는 작은 실험이 있습니다. 이 예제에서 "+3" 버튼을 클릭하면 `setNumber(number + 1)`을 세 번 호출하기 때문에 카운터가 세 번 증가할 것이라고 예상할 수 있습니다.

"+3" 버튼을 클릭하면 어떤 일이 일어나는지 보세요:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

`number`가 클릭당 한 번만 증가하는 것을 확인하세요!

**상태 설정은 *다음* 렌더링을 위해서만 변경됩니다.** 첫 번째 렌더링 동안 `number`는 `0`이었습니다. 이것이 *그 렌더링의* `onClick` 핸들러에서 `number`의 값이 `setNumber(number + 1)`이 호출된 후에도 여전히 `0`인 이유입니다:

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

이 버튼의 클릭 핸들러가 React에게 지시하는 내용은 다음과 같습니다:

1. `setNumber(number + 1)`: `number`는 `0`이므로 `setNumber(0 + 1)`.
    - React는 다음 렌더링에서 `number`를 `1`로 변경할 준비를 합니다.
2. `setNumber(number + 1)`: `number`는 `0`이므로 `setNumber(0 + 1)`.
    - React는 다음 렌더링에서 `number`를 `1`로 변경할 준비를 합니다.
3. `setNumber(number + 1)`: `number`는 `0`이므로 `setNumber(0 + 1)`.
    - React는 다음 렌더링에서 `number`를 `1`로 변경할 준비를 합니다.

`setNumber(number + 1)`을 세 번 호출했지만, *이 렌더링의* 이벤트 핸들러에서 `number`는 항상 `0`이므로 상태를 세 번 `1`로 설정합니다. 이것이 이벤트 핸들러가 끝난 후 React가 `number`를 `3`이 아닌 `1`로 설정하여 컴포넌트를 다시 렌더링하는 이유입니다.

코드에서 상태 변수를 값으로 대체하여 이를 시각화할 수도 있습니다. *이 렌더링* 동안 `number` 상태 변수는 `0`이므로 이벤트 핸들러는 다음과 같습니다:

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

다음 렌더링에서는 `number`가 `1`이므로 *그 렌더링의* 클릭 핸들러는 다음과 같습니다:

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

이것이 버튼을 다시 클릭하면 카운터가 `2`로 설정되고, 다음 클릭에서 `3`으로 설정되는 이유입니다.

## 시간에 따른 상태 {/*state-over-time*/}

재미있었죠. 이 버튼을 클릭하면 어떤 경고가 표시될지 추측해보세요:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

이전의 대체 방법을 사용하면 경고가 "0"을 표시할 것이라고 추측할 수 있습니다:

```js
setNumber(0 + 5);
alert(0);
```

하지만 경고에 타이머를 설정하여 컴포넌트가 다시 렌더링된 후에만 실행되도록 하면 어떻게 될까요? "0" 또는 "5" 중 무엇이 표시될까요? 추측해보세요!

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

놀라셨나요? 대체 방법을 사용하면 경고에 전달된 상태의 "스냅샷"을 볼 수 있습니다.

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

경고가 실행될 때 React에 저장된 상태는 변경되었을 수 있지만, 사용자가 상호작용한 시점의 상태 스냅샷을 사용하여 예약되었습니다!

**상태 변수의 값은 렌더링 내에서 절대 변경되지 않습니다,** 이벤트 핸들러의 코드가 비동기적이라도 마찬가지입니다. *그 렌더링의* `onClick` 내에서 `number`의 값은 `setNumber(number + 5)`가 호출된 후에도 계속 `0`입니다. React가 컴포넌트를 호출하여 UI의 "스냅샷"을 찍을 때 값이 "고정"되었습니다.

이것이 이벤트 핸들러가 타이밍 실수에 덜 취약하게 만드는 예입니다. 아래는 메시지를 5초 지연 후에 보내는 폼입니다. 다음 시나리오를 상상해보세요:

1. "Send" 버튼을 눌러 "Hello"를 Alice에게 보냅니다.
2. 5초 지연이 끝나기 전에 "To" 필드의 값을 "Bob"으로 변경합니다.

경고가 무엇을 표시할 것 같습니까? "You said Hello to Alice"를 표시할까요? 아니면 "You said Hello to Bob"을 표시할까요? 알고 있는 내용을 바탕으로 추측해보고, 직접 시도해보세요:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

**React는 하나의 렌더링 이벤트 핸들러 내에서 상태 값을 "고정"합니다.** 코드가 실행되는 동안 상태가 변경되었는지 걱정할 필요가 없습니다.

하지만 다시 렌더링하기 전에 최신 상태를 읽고 싶다면 어떻게 해야 할까요? 다음 페이지에서 다룰 [상태 업데이트 함수](/learn/queueing-a-series-of-state-updates)를 사용하고 싶을 것입니다!

<Recap>

* 상태 설정은 새로운 렌더링을 요청합니다.
* React는 컴포넌트 외부에 상태를 저장합니다, 마치 선반 위에 있는 것처럼.
* `useState`를 호출하면 React는 *그 렌더링*에 대한 상태의 스냅샷을 제공합니다.
* 변수와 이벤트 핸들러는 다시 렌더링을 "생존"하지 않습니다. 각 렌더링에는 자체 이벤트 핸들러가 있습니다.
* 각 렌더링(및 그 안의 함수)은 항상 React가 *그* 렌더링에 제공한 상태의 스냅샷을 "봅니다".
* 렌더링된 JSX를 생각하는 것과 유사하게 이벤트 핸들러에서 상태를 대체할 수 있습니다.
* 과거에 생성된 이벤트 핸들러는 생성된 렌더링의 상태 값을 가지고 있습니다.

</Recap>

<Challenges>

#### 신호등 구현하기 {/*implement-a-traffic-light*/}

여기 버튼을 누르면 토글되는 횡단보도 신호등 컴포넌트가 있습니다:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

클릭 핸들러에 `alert`를 추가하세요. 신호등이 녹색이고 "Walk"라고 표시될 때 버튼을 클릭하면 "Stop is next"라고 표시되어야 합니다. 신호등이 빨간색이고 "Stop"이라고 표시될 때 버튼을 클릭하면 "Walk is next"라고 표시되어야 합니다.

`setWalk` 호출 전후에 `alert`를 넣는 것이 차이가 있습니까?

<Solution>

`alert`는 다음과 같아야 합니다:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Stop is next' : 'Walk is next');
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

`setWalk` 호출 전후에 `alert`를 넣는 것은 차이가 없습니다. 그 렌더링의 `walk` 값은 고정되어 있습니다. `setWalk`를 호출하면 *다음* 렌더링에 대해서만 변경되며, 이전 렌더링의 이벤트 핸들러에는 영향을 미치지 않습니다.

이 줄은 처음에는 직관적이지 않을 수 있습니다:

```js
alert(walk ? 'Stop is next' : 'Walk is next');
```

하지만 "신호등이 'Walk now'를 표시하면 메시지는 'Stop is next'라고 해야 한다"고 읽으면 이해가 됩니다. 이벤트 핸들러 내부의 `walk` 변수는 그 렌더링의 `walk` 값을 일치시키며 변경되지 않습니다.

대체 방법을 적용하여 이것이 올바른지 확인할 수 있습니다. `walk`가 `true`일 때 다음과 같습니다:

```js
<button onClick={() => {
  setWalk(false);
  alert('Stop is next');
}}>
  Change to Stop
</button>
<h1 style={{color: 'darkgreen'}}>
  Walk
</h1>
```

따라서 "Change to Stop"을 클릭하면 `walk`가 `false`로 설정된 렌더링을 큐에 넣고 "Stop is next"를 경고합니다.

</Solution>

</Challenges