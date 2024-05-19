---
title: 일련의 상태 업데이트 대기열에 추가하기
---

<Intro>

상태 변수를 설정하면 또 다른 렌더링이 큐에 추가됩니다. 하지만 때로는 다음 렌더링을 큐에 추가하기 전에 값에 대해 여러 작업을 수행하고 싶을 수 있습니다. 이를 위해 React가 상태 업데이트를 어떻게 배치하는지 이해하는 것이 도움이 됩니다.

</Intro>

<YouWillLearn>

* "배칭"이 무엇이며 React가 여러 상태 업데이트를 처리하는 방법
* 동일한 상태 변수에 여러 업데이트를 연속으로 적용하는 방법

</YouWillLearn>

## React는 상태 업데이트를 배치합니다 {/*react-batches-state-updates*/}

`+3` 버튼을 클릭하면 `setNumber(number + 1)`을 세 번 호출하기 때문에 카운터가 세 번 증가할 것이라고 예상할 수 있습니다:

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

그러나 이전 섹션에서 기억할 수 있듯이, [각 렌더링의 상태 값은 고정되어 있습니다](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time). 따라서 첫 번째 렌더링의 이벤트 핸들러 내부의 `number` 값은 `0`으로 고정되어 있으며, `setNumber(1)`을 몇 번 호출하든 상관없습니다:

```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

하지만 여기에는 또 다른 요소가 작용합니다. **React는 이벤트 핸들러의 모든 코드가 실행될 때까지 상태 업데이트를 처리하지 않습니다.** 이것이 `setNumber()` 호출 후에만 다시 렌더링이 발생하는 이유입니다.

이것은 레스토랑에서 주문을 받는 웨이터를 떠올리게 할 수 있습니다. 웨이터는 첫 번째 요리를 언급할 때 주방으로 달려가지 않습니다! 대신, 당신이 주문을 마칠 때까지 기다리고, 변경 사항을 허용하며, 테이블의 다른 사람들의 주문도 받습니다.

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="레스토랑에서 우아한 커서가 여러 번 주문을 하고 React가 웨이터 역할을 합니다. setState()를 여러 번 호출한 후, 웨이터는 그녀가 마지막으로 요청한 것을 최종 주문으로 기록합니다." />

이렇게 하면 여러 상태 변수를 업데이트할 수 있으며, 심지어 여러 컴포넌트에서 업데이트할 수 있습니다. 너무 많은 [재렌더링](/learn/render-and-commit#re-renders-when-state-updates)을 트리거하지 않고도 가능합니다. 하지만 이것은 또한 이벤트 핸들러와 그 안의 모든 코드가 완료된 후에만 UI가 업데이트된다는 것을 의미합니다. **배칭**이라고도 하는 이 동작은 React 앱을 훨씬 더 빠르게 실행되게 합니다. 또한 일부 변수만 업데이트된 혼란스러운 "반쯤 완료된" 렌더링을 처리하지 않아도 됩니다.

**React는 여러 의도적인 이벤트(예: 클릭) 간에 배칭하지 않습니다**. 각 클릭은 별도로 처리됩니다. React는 일반적으로 안전할 때만 배칭을 수행하므로 안심할 수 있습니다. 예를 들어, 첫 번째 버튼 클릭이 폼을 비활성화하면 두 번째 클릭은 다시 제출되지 않습니다.

## 다음 렌더링 전에 동일한 상태를 여러 번 업데이트하기 {/*updating-the-same-state-multiple-times-before-the-next-render*/}

드문 경우이지만, 다음 렌더링 전에 동일한 상태 변수를 여러 번 업데이트하려면 `setNumber(number + 1)`과 같은 *다음 상태 값*을 전달하는 대신, `setNumber(n => n + 1)`과 같이 큐의 이전 상태를 기반으로 다음 상태를 계산하는 *함수*를 전달할 수 있습니다. 이는 React에게 "상태 값으로 무언가를 하라"고 지시하는 방법입니다.

이제 카운터를 증가시켜 보세요:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
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

여기서 `n => n + 1`은 **업데이터 함수**라고 합니다. 상태 설정자에 이를 전달할 때:

1. React는 이벤트 핸들러의 다른 모든 코드가 실행된 후 이 함수를 처리하기 위해 큐에 추가합니다.
2. 다음 렌더링 동안 React는 큐를 통해 최종 업데이트된 상태를 제공합니다.

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

React가 이벤트 핸들러를 실행하는 동안 이 코드 줄을 처리하는 방법은 다음과 같습니다:

1. `setNumber(n => n + 1)`: `n => n + 1`은 함수입니다. React는 이를 큐에 추가합니다.
1. `setNumber(n => n + 1)`: `n => n + 1`은 함수입니다. React는 이를 큐에 추가합니다.
1. `setNumber(n => n + 1)`: `n => n + 1`은 함수입니다. React는 이를 큐에 추가합니다.

다음 렌더링 동안 `useState`를 호출할 때, React는 큐를 통해 진행합니다. 이전 `number` 상태는 `0`이었으므로, React는 이를 첫 번째 업데이터 함수의 `n` 인수로 전달합니다. 그런 다음 React는 이전 업데이터 함수의 반환 값을 가져와 다음 업데이터에 `n`으로 전달합니다. 이렇게 계속됩니다:

|  큐에 추가된 업데이트 | `n` | 반환 값 |
|--------------|---------|-----|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

React는 최종 결과로 `3`을 저장하고 이를 `useState`에서 반환합니다.

이것이 위의 예에서 `+3`을 클릭하면 값이 3만큼 올바르게 증가하는 이유입니다.
### 상태를 교체한 후 상태를 업데이트하면 어떻게 될까요? {/*what-happens-if-you-update-state-after-replacing-it*/}

이 이벤트 핸들러는 어떻게 될까요? 다음 렌더링에서 `number`는 무엇일까요?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

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
        setNumber(n => n + 1);
      }}>숫자 증가</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

이 이벤트 핸들러는 React에게 다음과 같이 지시합니다:

1. `setNumber(number + 5)`: `number`는 `0`이므로 `setNumber(0 + 5)`. React는 *"5로 교체"*를 큐에 추가합니다.
2. `setNumber(n => n + 1)`: `n => n + 1`은 업데이터 함수입니다. React는 *그 함수를* 큐에 추가합니다.

다음 렌더링 동안 React는 상태 큐를 통해 진행합니다:

|   큐에 추가된 업데이트       | `n` | 반환 값 |
|--------------|---------|-----|
| "5로 교체" | `0` (사용되지 않음) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

React는 최종 결과로 `6`을 저장하고 이를 `useState`에서 반환합니다. 

<Note>

`setState(5)`가 실제로 `setState(n => 5)`처럼 작동하지만, `n`은 사용되지 않는다는 것을 눈치챘을 것입니다!

</Note>

### 상태를 업데이트한 후 상태를 교체하면 어떻게 될까요? {/*what-happens-if-you-replace-state-after-updating-it*/}

한 가지 예를 더 시도해 봅시다. 다음 렌더링에서 `number`는 무엇일까요?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

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
        setNumber(n => n + 1);
        setNumber(42);
      }}>숫자 증가</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

React가 이 이벤트 핸들러를 실행하는 동안 이 코드 줄을 처리하는 방법은 다음과 같습니다:

1. `setNumber(number + 5)`: `number`는 `0`이므로 `setNumber(0 + 5)`. React는 *"5로 교체"*를 큐에 추가합니다.
2. `setNumber(n => n + 1)`: `n => n + 1`은 업데이터 함수입니다. React는 *그 함수를* 큐에 추가합니다.
3. `setNumber(42)`: React는 *"42로 교체"*를 큐에 추가합니다.

다음 렌더링 동안 React는 상태 큐를 통해 진행합니다:

|   큐에 추가된 업데이트       | `n` | 반환 값 |
|--------------|---------|-----|
| "5로 교체" | `0` (사용되지 않음) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| "42로 교체" | `6` (사용되지 않음) | `42` |

그런 다음 React는 최종 결과로 `42`를 저장하고 이를 `useState`에서 반환합니다.

요약하자면, `setNumber` 상태 설정자에 전달하는 내용을 다음과 같이 생각할 수 있습니다:

* **업데이터 함수** (예: `n => n + 1`)는 큐에 추가됩니다.
* **다른 값** (예: 숫자 `5`)은 큐에 "5로 교체"를 추가하며, 이미 큐에 있는 것을 무시합니다.

이벤트 핸들러가 완료된 후, React는 다시 렌더링을 트리거합니다. 다시 렌더링하는 동안 React는 큐를 처리합니다. 업데이터 함수는 렌더링 중에 실행되므로 **업데이터 함수는 [순수](/learn/keeping-components-pure)**해야 하며, 결과만 반환해야 합니다. 그 안에서 상태를 설정하거나 다른 부작용을 실행하려고 하지 마세요. Strict Mode에서는 React가 각 업데이터 함수를 두 번 실행하지만(두 번째 결과는 버립니다) 실수를 찾는 데 도움이 됩니다.

### 명명 규칙 {/*naming-conventions*/}

업데이터 함수 인수를 해당 상태 변수의 첫 글자로 이름 짓는 것이 일반적입니다:

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

더 자세한 코드를 선호한다면, `setEnabled(enabled => !enabled)`와 같이 상태 변수 이름을 반복하거나 `setEnabled(prevEnabled => !prevEnabled)`와 같은 접두사를 사용하는 것이 또 다른 일반적인 규칙입니다.

<Recap>

* 상태를 설정해도 기존 렌더링의 변수는 변경되지 않지만, 새로운 렌더링을 요청합니다.
* React는 이벤트 핸들러가 실행을 마친 후 상태 업데이트를 처리합니다. 이를 배칭이라고 합니다.
* 하나의 이벤트에서 여러 번 상태를 업데이트하려면 `setNumber(n => n + 1)` 업데이터 함수를 사용할 수 있습니다.

</Recap>



<Challenges>

#### 요청 카운터 수정하기 {/*fix-a-request-counter*/}

사용자가 동일한 아트 아이템에 대해 여러 주문을 제출할 수 있는 아트 마켓플레이스 앱을 작업 중입니다. 사용자가 "구매" 버튼을 누를 때마다 "대기 중" 카운터가 하나 증가해야 합니다. 3초 후에 "대기 중" 카운터는 감소하고 "완료됨" 카운터는 증가해야 합니다.

그러나 "대기 중" 카운터가 의도한 대로 작동하지 않습니다. "구매"를 누르면 `-1`로 감소합니다(이는 불가능해야 합니다!). 그리고 빠르게 두 번 클릭하면 두 카운터가 예측할 수 없게 작동하는 것 같습니다.

이것이 왜 발생할까요? 두 카운터를 모두 수정하세요.

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending + 1);
    await delay(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

<Solution>

`handleClick` 이벤트 핸들러 내부에서 `pending`과 `completed`의 값은 클릭 이벤트 시점의 값에 해당합니다. 첫 번째 렌더링에서는 `pending`이 `0`이었으므로 `setPending(pending - 1)`이 `setPending(-1)`이 되어 잘못된 결과가 됩니다. 카운터를 *증가* 또는 *감소*하려는 것이므로, 클릭 시점에 결정된 구체적인 값으로 설정하는 대신 업데이터 함수를 전달할 수 있습니다:

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

이렇게 하면 카운터를 증가 또는 감소시킬 때, 클릭 시점의 상태가 아닌 *최신* 상태와 관련하여 수행됩니다.

</Solution>

#### 상태 큐를 직접 구현하기 {/*implement-the-state-queue-yourself*/}

이 도전 과제에서는 React의 작은 부분을 처음부터 다시 구현할 것입니다! 생각만큼 어렵지 않습니다.

샌드박스 미리보기를 스크롤해 보세요. **네 가지 테스트 케이스**가 표시됩니다. 이들은 이 페이지에서 본 예제에 해당합니다. `getFinalState` 함수를 구현하여 각 경우에 대해 올바른 결과를 반환하도록 하는 것이 과제입니다. 올바르게 구현하면 네 가지 테스트가 모두 통과해야 합니다.

두 개의 인수를 받게 됩니다: `baseState`는 초기 상태(예: `0`)이며, `queue`는 추가된 순서대로 숫자(예: `5`)와 업데이터 함수(예: `n => n + 1`)가 혼합된 배열입니다.

이 페이지의 표와 같이 최종 상태를 반환하는 것이 과제입니다!

<Hint>

막히면 이 코드 구조로 시작하세요:

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: 업데이터 함수 적용
    } else {
      // TODO: 상태 교체
    }
  }

  return finalState;
}
```

누락된 줄을 채우세요!

</Hint>

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: do something with the queue...

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

<Solution>

이 페이지에서 설명한 React가 최종 상태를 계산하는 정확한 알고리즘입니다:

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // 업데이터 함수 적용
      finalState = update(finalState);
    } else {
      // 다음 상태 교체
      finalState = update;
    }
  }

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

이제 React의 이 부분이 어떻게 작동하는지 알게 되었습니다!

</Solution>

</Challenges>