---
title: useEffect
---

<Intro>

`useEffect`는 컴포넌트를 외부 시스템과 동기화할 수 있게 해주는 React Hook입니다. [컴포넌트를 외부 시스템과 동기화하는 방법에 대해 알아보세요.](/learn/synchronizing-with-effects)

```js
useEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## 참고자료 {/*reference*/}

### `useEffect(setup, dependencies?)` {/*useeffect*/}

Effect를 선언하기 위해 컴포넌트의 최상위 레벨에서 `useEffect`를 호출하세요:

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `setup`: Effect의 로직을 담고 있는 함수입니다. setup 함수는 선택적으로 *cleanup* 함수를 반환할 수 있습니다. 컴포넌트가 DOM에 추가되면 React는 setup 함수를 실행합니다. 종속성이 변경된 상태로 다시 렌더링될 때마다 React는 먼저 cleanup 함수를 (제공된 경우) 이전 값으로 실행한 다음 새로운 값으로 setup 함수를 실행합니다. 컴포넌트가 DOM에서 제거되면 React는 cleanup 함수를 실행합니다.
 
* **선택적** `dependencies`: `setup` 코드 내에서 참조된 모든 반응형 값의 목록입니다. 반응형 값에는 props, state, 그리고 컴포넌트 본문 내에서 직접 선언된 모든 변수와 함수가 포함됩니다. linter가 [React에 맞게 구성된 경우](/learn/editor-setup#linting), 모든 반응형 값이 종속성으로 올바르게 지정되었는지 확인합니다. 종속성 목록은 일정한 항목 수를 가져야 하며 `[dep1, dep2, dep3]`와 같이 인라인으로 작성되어야 합니다. React는 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교를 사용하여 각 종속성을 이전 값과 비교합니다. 이 인수를 생략하면 컴포넌트가 다시 렌더링될 때마다 Effect가 다시 실행됩니다. [종속성 배열을 전달하는 것, 빈 배열을 전달하는 것, 종속성을 전혀 전달하지 않는 것의 차이를 확인하세요.](#examples-dependencies)

#### 반환값 {/*returns*/}

`useEffect`는 `undefined`를 반환합니다.

#### 주의사항 {/*caveats*/}

* `useEffect`는 Hook이므로 **컴포넌트의 최상위 레벨** 또는 자체 Hook에서만 호출할 수 있습니다. 루프나 조건문 내에서 호출할 수 없습니다. 그런 경우, 새로운 컴포넌트를 추출하고 상태를 그 안으로 이동하세요.

* **외부 시스템과 동기화하려는 것이 아니라면,** [Effect가 필요하지 않을 가능성이 큽니다.](/learn/you-might-not-need-an-effect)

* Strict Mode가 켜져 있으면 React는 **첫 번째 실제 setup 전에 개발 전용 setup+cleanup 사이클을 한 번 더 실행합니다.** 이는 cleanup 로직이 setup 로직을 "반영"하고 setup이 수행하는 작업을 중지하거나 취소하는지 확인하는 스트레스 테스트입니다. 이로 인해 문제가 발생하면 [cleanup 함수를 구현하세요.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* 종속성 중 일부가 컴포넌트 내에서 정의된 객체나 함수인 경우, **Effect가 필요 이상으로 자주 다시 실행될 위험이 있습니다.** 이를 해결하려면 불필요한 [객체](#removing-unnecessary-object-dependencies) 및 [함수](#removing-unnecessary-function-dependencies) 종속성을 제거하세요. 또한 [상태 업데이트를 추출](#updating-state-based-on-previous-state-from-an-effect)하고 [비반응형 로직을 Effect 외부로 이동](#reading-the-latest-props-and-state-from-an-effect)할 수 있습니다.

* Effect가 상호작용(예: 클릭)으로 인해 발생하지 않은 경우, React는 일반적으로 **Effect를 실행하기 전에 업데이트된 화면을 먼저 브라우저에 그리도록 합니다.** Effect가 시각적인 작업을 수행하고(예: 툴팁 위치 지정) 지연이 눈에 띄는 경우(예: 깜박임), `useEffect`를 [`useLayoutEffect`](/reference/react/useLayoutEffect)로 교체하세요.

* Effect가 상호작용(예: 클릭)으로 인해 발생한 경우에도 **브라우저는 Effect 내의 상태 업데이트를 처리하기 전에 화면을 다시 그릴 수 있습니다.** 일반적으로 이는 원하는 동작입니다. 그러나 브라우저가 화면을 다시 그리는 것을 차단해야 하는 경우, `useEffect`를 [`useLayoutEffect`](/reference/react/useLayoutEffect)로 교체해야 합니다.

* Effect는 **클라이언트에서만 실행됩니다.** 서버 렌더링 중에는 실행되지 않습니다.

---

## 사용법 {/*usage*/}

### 외부 시스템에 연결하기 {/*connecting-to-an-external-system*/}

일부 컴포넌트는 페이지에 표시되는 동안 네트워크, 브라우저 API 또는 타사 라이브러리에 연결된 상태를 유지해야 합니다. 이러한 시스템은 React에 의해 제어되지 않으므로 *외부*라고 합니다.

[컴포넌트를 외부 시스템에 연결하려면,](/learn/synchronizing-with-effects) 컴포넌트의 최상위 레벨에서 `useEffect`를 호출하세요:

```js [[1, 8, "const connection = createConnection(serverUrl, roomId);"], [1, 9, "connection.connect();"], [2, 11, "connection.disconnect();"], [3, 13, "[serverUrl, roomId]"]]
import { useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
  	const connection = createConnection(serverUrl, roomId);
    connection.connect();
  	return () => {
      connection.disconnect();
  	};
  }, [serverUrl, roomId]);
  // ...
}
```

`useEffect`에 두 가지 인수를 전달해야 합니다:

1. 해당 시스템에 연결하는 <CodeStep step={1}>setup 코드</CodeStep>가 포함된 *setup 함수*.
   - 해당 시스템에서 연결을 해제하는 <CodeStep step={2}>cleanup 코드</CodeStep>가 포함된 *cleanup 함수*를 반환해야 합니다.
2. 해당 함수들 내에서 사용된 컴포넌트의 모든 값을 포함하는 <CodeStep step={3}>종속성 목록</CodeStep>.

**React는 필요할 때마다 setup 및 cleanup 함수를 호출합니다. 이는 여러 번 발생할 수 있습니다:**

1. 컴포넌트가 페이지에 추가될 때 *(mount)* <CodeStep step={1}>setup 코드</CodeStep>가 실행됩니다.
2. <CodeStep step={3}>종속성</CodeStep>이 변경된 상태로 컴포넌트가 다시 렌더링될 때마다:
   - 먼저, 이전 props와 state로 <CodeStep step={2}>cleanup 코드</CodeStep>가 실행됩니다.
   - 그런 다음, 새로운 props와 state로 <CodeStep step={1}>setup 코드</CodeStep>가 실행됩니다.
3. 컴포넌트가 페이지에서 제거될 때 *(unmount)* <CodeStep step={2}>cleanup 코드</CodeStep>가 마지막으로 실행됩니다.

**위 예제를 통해 이 순서를 설명해 보겠습니다.**  

위의 `ChatRoom` 컴포넌트가 페이지에 추가되면 초기 `serverUrl`과 `roomId`로 채팅방에 연결됩니다. 드롭다운에서 사용자가 다른 채팅방을 선택하는 경우와 같이 다시 렌더링된 결과로 `serverUrl` 또는 `roomId`가 변경되면, Effect는 *이전 방에서 연결을 해제하고 다음 방에 연결합니다.* `ChatRoom` 컴포넌트가 페이지에서 제거되면, Effect는 마지막으로 연결을 해제합니다.

**개발 중 버그를 찾기 위해, React는 <CodeStep step={1}>setup</CodeStep>과 <CodeStep step={2}>cleanup</CodeStep>을 첫 번째 <CodeStep step={1}>setup</CodeStep> 전에 한 번 더 실행합니다.** 이는 Effect의 로직이 올바르게 구현되었는지 확인하는 스트레스 테스트입니다. 이로 인해 문제가 발생하면, cleanup 함수에 일부 로직이 누락된 것입니다. cleanup 함수는 setup 함수가 수행하는 작업을 중지하거나 취소해야 합니다. 사용자가 setup이 한 번 호출된 것(프로덕션에서처럼)과 *setup* → *cleanup* → *setup* 시퀀스(개발에서처럼) 사이의 차이를 구별할 수 없어야 합니다. [일반적인 해결책을 확인하세요.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

**모든 Effect를 독립적인 프로세스로 작성하고, 한 번에 하나의 setup/cleanup 사이클을 생각해 보세요.** 컴포넌트가 마운트, 업데이트 또는 언마운트되는지 여부는 중요하지 않습니다. cleanup 로직이 setup 로직을 올바르게 "반영"할 때, Effect는 필요한 만큼 setup 및 cleanup을 실행하는 데 강력합니다.

<Note>

Effect는 컴포넌트를 외부 시스템(예: 채팅 서비스)과 동기화할 수 있게 해줍니다. 여기서 *외부 시스템*이란 React에 의해 제어되지 않는 모든 코드를 의미합니다. 예를 들어:

* <CodeStep step={1}>[`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)</CodeStep> 및 <CodeStep step={2}>[`clearInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)</CodeStep>로 관리되는 타이머.
* <CodeStep step={1}>[`window.addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)</CodeStep> 및 <CodeStep step={2}>[`window.removeEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)</CodeStep>를 사용한 이벤트 구독.
* <CodeStep step={1}>`animation.start()`</CodeStep> 및 <CodeStep step={2}>`animation.reset()`</CodeStep>과 같은 API를 가진 타사 애니메이션 라이브러리.

**외부 시스템에 연결하지 않는 경우, [Effect가 필요하지 않을 가능성이 큽니다.](/learn/you-might-not-need-an-effect)**

</Note>

<Recipes titleText="외부 시스템에 연결하는 예제" titleId="examples-connecting">

#### 채팅 서버에 연결하기 {/*connecting-to-a-chat-server*/}

이 예제에서 `ChatRoom` 컴포넌트는 `chat.js`에 정의된 외부 시스템에 연결된 상태를 유지하기 위해 Effect를 사용합니다. "Open chat"을 눌러 `ChatRoom` 컴포넌트를 나타나게 하세요. 이 샌드박스는 개발 모드에서 실행되므로, [여기서 설명한 대로](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) 추가 연결 및 연결 해제 사이클이 있습니다. 드롭다운과 입력을 사용하여 `roomId`와 `serverUrl`을 변경하고 Effect가 채팅에 다시 연결되는 것을 확인하세요. "Close chat"을 눌러 Effect가 마지막으로 연결을 해제하는 것을 확인하세요.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 실제 구현은 서버에 실제로 연결될 것입니다
  return {
    connect() {
      console.log('✅ "' + roomId + '" 방에 ' + serverUrl + '에 연결 중...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 ' + serverUrl + ' 연결 해제됨');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### 전역 브라우저 이벤트 수신하기 {/*listening-to-a-global-browser-event*/}

이 예제에서 외부 시스템은 브라우저 DOM 자체입니다. 일반적으로 JSX로 이벤트 리스너를 지정하지만, 전역 [`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window) 객체에는 이렇게 할 수 없습니다. Effect를 사용하면 `window` 객체에 연결하고 그 이벤트를 수신할 수 있습니다. `pointermove` 이벤트를 수신하면 커서(또는 손가락) 위치를 추적하고 빨간 점이 함께 이동하도록 업데이트할 수 있습니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity: 0.6,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### 애니메이션 트리거하기 {/*triggering-an-animation*/}

이 예제에서 외부 시스템은 `animation.js`에 있는 애니메이션 라이브러리입니다. 이 라이브러리는 DOM 노드를 인수로 받아들이고 해당 노드를 제어하기 위해 `start()` 및 `stop()` 메서드를 노출하는 `FadeInAnimation`이라는 JavaScript 클래스를 제공합니다. 이 컴포넌트는 [ref를 사용하여](/learn/manipulating-the-dom-with-refs) 기본 DOM 노드에 접근합니다. Effect는 ref에서 DOM 노드를 읽고 컴포넌트가 나타날 때 해당 노드에 대한 애니메이션을 자동으로 시작합니다.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(1000);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // 즉시 끝으로 이동
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // 애니메이션 시작
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // 아직 그릴 프레임이 더 있음
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop
() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

<Solution />

#### 모달 다이얼로그 제어하기 {/*controlling-a-modal-dialog*/}

이 예제에서 외부 시스템은 브라우저 DOM입니다. `ModalDialog` 컴포넌트는 [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) 요소를 렌더링합니다. Effect를 사용하여 `isOpen` prop을 [`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) 및 [`close()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close) 메서드 호출과 동기화합니다.

<Sandpack>

```js
import { useState } from 'react';
import ModalDialog from './ModalDialog.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Open dialog
      </button>
      <ModalDialog isOpen={show}>
        Hello there!
        <br />
        <button onClick={() => {
          setShow(false);
        }}>Close</button>
      </ModalDialog>
    </>
  );
}
```

```js src/ModalDialog.js active
import { useEffect, useRef } from 'react';

export default function ModalDialog({ isOpen, children }) {
  const ref = useRef();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
    };
  }, [isOpen]);

  return <dialog ref={ref}>{children}</dialog>;
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### 요소 가시성 추적하기 {/*tracking-element-visibility*/}

이 예제에서 외부 시스템은 다시 브라우저 DOM입니다. `App` 컴포넌트는 긴 목록을 표시한 다음 `Box` 컴포넌트를 표시하고 다시 긴 목록을 표시합니다. 목록을 아래로 스크롤하세요. `Box` 컴포넌트가 뷰포트에 완전히 표시되면 배경색이 검은색으로 변경되는 것을 확인할 수 있습니다. 이를 구현하기 위해 `Box` 컴포넌트는 Effect를 사용하여 [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)를 관리합니다. 이 브라우저 API는 DOM 요소가 뷰포트에 표시될 때 알림을 제공합니다.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (keep scrolling)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';

export default function Box() {
  const ref = useRef(null);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
      } else {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
      }
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, []);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Effect를 커스텀 Hook으로 감싸기 {/*wrapping-effects-in-custom-hooks*/}

Effect는 ["탈출구"](https://react.dev/learn/escape-hatches)입니다. React 외부로 "탈출"해야 하거나 특정 사용 사례에 대한 더 나은 내장 솔루션이 없을 때 사용합니다. 수동으로 Effect를 자주 작성해야 한다면, 이는 일반적으로 컴포넌트가 의존하는 공통 동작에 대한 [커스텀 Hook](/learn/reusing-logic-with-custom-hooks)을 추출해야 한다는 신호입니다.

예를 들어, 이 `useChatRoom` 커스텀 Hook은 Effect의 로직을 더 선언적인 API 뒤에 "숨깁니다":

```js {1,11}
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

그런 다음, 어떤 컴포넌트에서든 다음과 같이 사용할 수 있습니다:

```js {4-7}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

React 생태계에는 다양한 목적을 위한 훌륭한 커스텀 Hook이 많이 있습니다.

[Effect를 커스텀 Hook으로 감싸는 방법에 대해 더 알아보세요.](/learn/reusing-logic-with-custom-hooks)

<Recipes titleText="Effect를 커스텀 Hook으로 감싸는 예제" titleId="examples-custom-hooks">

#### 커스텀 `useChatRoom` Hook {/*custom-usechatroom-hook*/}

이 예제는 [이전 예제](#examples-connecting) 중 하나와 동일하지만, 로직이 커스텀 Hook으로 추출되었습니다.

<Sandpack>

```js
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 실제 구현은 서버에 실제로 연결될 것입니다
  return {
    connect() {
      console.log('✅ "' + roomId + '" 방에 ' + serverUrl + '에 연결 중...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 ' + serverUrl + ' 연결 해제됨');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### 커스텀 `useWindowListener` Hook {/*custom-usewindowlistener-hook*/}

이 예제는 [이전 예제](#examples-connecting) 중 하나와 동일하지만, 로직이 커스텀 Hook으로 추출되었습니다.

<Sandpack>

```js
import { useState } from 'react';
import { useWindowListener } from './useWindowListener.js';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useWindowListener('pointermove', (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  });

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity: 0.6,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/useWindowListener.js
import { useState, useEffect } from 'react';

export function useWindowListener(eventType, listener) {
  useEffect(() => {
    window.addEventListener(eventType, listener);
    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, listener]);
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### 커스텀 `useIntersectionObserver` Hook {/*custom-useintersectionobserver-hook*/}

이 예제는 [이전 예제](#examples-connecting) 중 하나와 동일하지만, 로직이 부분적으로 커스텀 Hook으로 추출되었습니다.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (keep scrolling)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver.js';

export default function Box() {
  const ref = useRef(null);
  const isIntersecting = useIntersectionObserver(ref);

  useEffect(() => {
   if (isIntersecting) {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'white';
    } else {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    }
  }, [isIntersecting]);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

```js src/useIntersectionObserver.js
import { useState, useEffect } from 'react';

export function useIntersectionObserver(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      setIsIntersecting(entry.isIntersecting);
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, [ref]);

  return isIntersecting;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### 비React 위젯 제어하기 {/*controlling-a-non-react-widget*/}

때때로, 컴포넌트의 일부 prop 또는 state를 외부 시스템과 동기화하고 싶을 수 있습니다.

예를 들어, React 없이 작성된 타사 지도 위젯이나 비디오 플레이어 컴포넌트가 있는 경우, Effect를 사용하여 해당 클래스 인스턴스의 메서드를 호출하여 React 컴포넌트의 현재 상태와 일치시킬 수 있습니다. 이 Effect는 `map-widget.js`에 정의된 `MapWidget` 클래스의 인스턴스를 생성합니다. `Map` 컴포넌트의 `zoomLevel` prop을 변경하면, Effect는 클래스 인스턴스의 `setZoom()`을 호출하여 동기화 상태를 유지합니다:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState } from 'react';
import Map from './Map.js';

export default function App() {
  const [zoomLevel, setZoomLevel] = useState(0);
  return (
    <>
      Zoom level: {zoomLevel}x
      <button onClick={() => setZoomLevel(zoomLevel + 1)}>+</button>
      <button onClick={() => setZoomLevel(zoomLevel - 1)}>-</button>
      <hr />
      <Map zoomLevel={zoomLevel} />
    </>
  );
}
```

```js src/Map.js active
import { useRef, useEffect } from 'react';
import { MapWidget } from './map-widget.js';

export default function Map({ zoomLevel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return (
    <div
      style={{ width: 200, height: 200 }}
      ref={containerRef}
    />
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export class MapWidget {
  constructor(domNode) {
    this.map = L.map(domNode, {
      zoomControl: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      scrollWheelZoom: false,
      zoomAnimation: false,
      touchZoom: false,
      zoomSnap: 0.1
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    this.map.setView([0, 0], 0);
  }
  setZoom(level) {
    this.map.setZoom(level);
  }
}
```

```css
button { margin: 5px; }
```

</Sandpack>

이 예제에서는 `MapWidget` 클래스가 전달된 DOM 노드만 관리하기 때문에 cleanup 함수가 필요하지 않습니다. `Map` React 컴포넌트가 트리에서 제거된 후, DOM 노드와 `MapWidget` 클래스 인스턴스는 브라우저 JavaScript 엔진에 의해 자동으로 가비지 컬렉션됩니다.

---

### Effect로 데이터 가져오기 {/*fetching-data-with-effects*/}

Effect를 사용하여 컴포넌트의 데이터를 가져올 수 있습니다. [프레임워크를 사용하는 경우,](/learn/start-a-new-react-project#production-grade-react-frameworks) 프레임워크의 데이터 가져오기 메커니즘을 사용하는 것이 Effect를 수동으로 작성하는 것보다 훨씬 효율적입니다.

Effect를 사용하여 데이터를 수동으로 가져오려면 다음과 같은 코드를 작성할 수 있습니다:

```js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [person]);

  // ...
```

`ignore` 변수가 `false`로 초기화되고 cleanup 중에 `true`로 설정되는 것을 주목하세요. 이는 [코드가 "경쟁 조건"](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)으로 인해 문제가 발생하지 않도록 보장합니다. 네트워크 응답은 보낸 순서와 다른 순서로 도착할 수 있습니다.

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p
<i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

</Sandpack>

`async` / `await` 구문을 사용하여 다시 작성할 수도 있지만, 여전히 cleanup 함수를 제공해야 합니다:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    async function startFetching() {
      setBio(null);
      const result = await fetchBio(person);
      if (!ignore) {
        setBio(result);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

</Sandpack>

Effect에서 직접 데이터를 가져오는 것은 반복적이며 나중에 캐싱 및 서버 렌더링과 같은 최적화를 추가하기 어렵게 만듭니다. [자체 커스텀 Hook 또는 커뮤니티에서 유지 관리하는 Hook을 사용하는 것이 더 쉽습니다.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

<DeepDive>

#### Effect에서 데이터 가져오기에 대한 좋은 대안은 무엇인가요? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Effect 내부에서 `fetch` 호출을 작성하는 것은 [데이터를 가져오는 인기 있는 방법](https://www.robinwieruch.de/react-hooks-fetch-data/)입니다. 특히 완전히 클라이언트 측 앱에서 그렇습니다. 그러나 이는 매우 수동적인 접근 방식이며 상당한 단점이 있습니다:

- **Effect는 서버에서 실행되지 않습니다.** 이는 초기 서버 렌더링된 HTML이 데이터 없이 로딩 상태만 포함한다는 것을 의미합니다. 클라이언트 컴퓨터는 모든 JavaScript를 다운로드하고 앱을 렌더링한 후 데이터를 로드해야 한다는 것을 알게 됩니다. 이는 매우 비효율적입니다.
- **Effect에서 직접 데이터를 가져오면 "네트워크 워터폴"을 쉽게 만들 수 있습니다.** 부모 컴포넌트를 렌더링하고 데이터를 가져오고 자식 컴포넌트를 렌더링한 후 자식 컴포넌트가 데이터를 가져오기 시작합니다. 네트워크가 매우 빠르지 않으면 이는 모든 데이터를 병렬로 가져오는 것보다 훨씬 느립니다.
- **Effect에서 직접 데이터를 가져오면 데이터를 미리 로드하거나 캐시하지 않습니다.** 예를 들어, 컴포넌트가 언마운트된 후 다시 마운트되면 데이터를 다시 가져와야 합니다.
- **매우 비효율적입니다.** 경쟁 조건과 같은 버그가 없는 방식으로 `fetch` 호출을 작성할 때 많은 보일러플레이트 코드가 포함됩니다.

이러한 단점 목록은 React에만 국한되지 않습니다. 이는 모든 라이브러리에서 마운트 시 데이터를 가져오는 것에 적용됩니다. 라우팅과 마찬가지로 데이터 가져오기는 잘 수행하기가 쉽지 않으므로 다음 접근 방식을 권장합니다:

- **[프레임워크를 사용하는 경우,](/learn/start-a-new-react-project#production-grade-react-frameworks) 내장된 데이터 가져오기 메커니즘을 사용하세요.** 최신 React 프레임워크는 효율적이고 위의 단점이 없는 통합 데이터 가져오기 메커니즘을 가지고 있습니다.
- **그렇지 않으면 클라이언트 측 캐시를 사용하거나 구축하는 것을 고려하세요.** 인기 있는 오픈 소스 솔루션으로는 [React Query](https://tanstack.com/query/latest/), [useSWR](https://swr.vercel.app/), [React Router 6.4+](https://beta.reactrouter.com/en/main/start/overview)가 있습니다. 자체 솔루션을 구축할 수도 있으며, 이 경우 Effect를 내부적으로 사용하지만 요청 중복 제거, 응답 캐싱 및 네트워크 워터폴 방지(데이터 미리 로드 또는 라우트로 데이터 요구사항을 올리는 방식)와 같은 로직을 추가합니다.

이러한 접근 방식이 적합하지 않은 경우, Effect에서 직접 데이터를 계속 가져올 수 있습니다.

</DeepDive>

---

### 반응형 종속성 지정하기 {/*specifying-reactive-dependencies*/}

**Effect의 종속성을 "선택"할 수 없습니다.** Effect 코드에서 사용된 모든 <CodeStep step={2}>반응형 값</CodeStep>은 종속성으로 선언되어야 합니다. Effect의 종속성 목록은 주변 코드에 의해 결정됩니다:

```js [[2, 1, "roomId"], [2, 2, "serverUrl"], [2, 5, "serverUrl"], [2, 5, "roomId"], [2, 8, "serverUrl"], [2, 8, "roomId"]]
function ChatRoom({ roomId }) { // 이것은 반응형 값입니다
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // 이것도 반응형 값입니다

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // 이 Effect는 이러한 반응형 값을 읽습니다
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]); // ✅ 따라서 종속성으로 지정해야 합니다
  // ...
}
```

`serverUrl` 또는 `roomId`가 변경되면 Effect는 새로운 값으로 채팅에 다시 연결됩니다.

**[반응형 값](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)에는 props와 컴포넌트 내부에 직접 선언된 모든 변수와 함수가 포함됩니다.** `roomId`와 `serverUrl`은 반응형 값이므로 종속성에서 제거할 수 없습니다. 이를 생략하려고 하면 [React에 맞게 구성된 linter가](/learn/editor-setup#linting) 이를 실수로 간주하고 수정해야 한다고 경고할 것입니다:

```js {8}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect에 누락된 종속성: 'roomId' 및 'serverUrl'
  // ...
}
```

**종속성을 제거하려면, linter에게 해당 종속성이 필요하지 않다는 것을 "증명"해야 합니다.** 예를 들어, `serverUrl`을 컴포넌트 외부로 이동하여 반응형이 아니며 다시 렌더링 시 변경되지 않음을 증명할 수 있습니다:

```js {1,8}
const serverUrl = 'https://localhost:1234'; // 더 이상 반응형 값이 아닙니다

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 모든 종속성 선언됨
  // ...
}
```

이제 `serverUrl`이 반응형 값이 아니며(다시 렌더링 시 변경되지 않음) 종속성으로 지정할 필요가 없습니다. **Effect의 코드가 반응형 값을 사용하지 않는 경우, 종속성 목록은 비어 있어야 합니다(`[]`):**

```js {1,2,9}
const serverUrl = 'https://localhost:1234'; // 더 이상 반응형 값이 아닙니다
const roomId = 'music'; // 더 이상 반응형 값이 아닙니다

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ 모든 종속성 선언됨
  // ...
}
```

[종속성이 비어 있는 Effect](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means)는 컴포넌트의 props 또는 state가 변경될 때 다시 실행되지 않습니다.

<Pitfall>

기존 코드베이스가 있는 경우, 다음과 같이 linter를 억제하는 Effect가 있을 수 있습니다:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 linter를 이렇게 억제하지 마세요:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**종속성이 코드와 일치하지 않으면 버그가 발생할 위험이 큽니다.** linter를 억제함으로써 Effect가 의존하는 값에 대해 React에게 "거짓말"을 하게 됩니다. [대신, 불필요함을 증명하세요.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)

</Pitfall>

<Recipes titleText="반응형 종속성을 전달하는 예제" titleId="examples-dependencies">

#### 종속성 배열 전달하기 {/*passing-a-dependency-array*/}

종속성을 지정하면, Effect는 **초기 렌더링 후 _및_ 변경된 종속성으로 다시 렌더링된 후에 실행됩니다.**

```js {3}
useEffect(() => {
  // ...
}, [a, b]); // a 또는 b가 다르면 다시 실행됩니다
```

아래 예제에서 `serverUrl`과 `roomId`는 [반응형 값](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)이므로 둘 다 종속성으로 지정해야 합니다. 결과적으로 드롭다운에서 다른 방을 선택하거나 서버 URL 입력을 편집하면 채팅이 다시 연결됩니다. 그러나 `message`는 Effect에서 사용되지 않으므로(따라서 종속성이 아님) 메시지를 편집해도 채팅이 다시 연결되지 않습니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Close chat' : 'Open chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 실제 구현은 서버에 실제로 연결될 것입니다
  return {
    connect() {
      console.log('✅ "' + roomId + '" 방에 ' + serverUrl + '에 연결 중...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 ' + serverUrl + ' 연결 해제됨');
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### 빈 종속성 배열 전달하기 {/*passing-an-empty-dependency-array*/}

Effect가 반응형 값을 전혀 사용하지 않는 경우, **초기 렌더링 후에만 실행됩니다.**

```js {3}
useEffect(() => {
  // ...
}, []); // 다시 실행되지 않음(개발 중 한 번 제외)
```

**종속성이 비어 있어도, [개발 중 버그를 찾기 위해 setup과 cleanup이 한 번 더 실행됩니다.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)**

이 예제에서 `serverUrl`과 `roomId`는 하드코딩되어 있습니다. 컴포넌트 외부에 선언되었기 때문에 반응형 값이 아니며 종속성이 아닙니다. 종속성 목록이 비어 있으므로 Effect는 다시 렌더링 시 다시 실행되지 않습니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 실제 구현은 서버에 실제로 연결될 것입니다
  return {
    connect() {
      console.log('✅ "' + roomId + '" 방에 ' + serverUrl + '에 연결 중...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 ' + serverUrl + ' 연결 해제됨');
    }
  };
}
```

</Sandpack>

<Solution />


#### 종속성 배열을 전혀 전달하지 않기 {/*passing-no-dependency-array-at-all*/}

종속성 배열을 전혀 전달하지 않으면, Effect는 **컴포넌트의 모든 렌더링(및 다시 렌더링) 후에 실행됩니다.**

```js {3}
useEffect(() => {
  // ...
}); // 항상 다시 실행됨
```

이 예제에서, Effect는 `serverUrl`과 `roomId`를 변경할 때 다시 실행되므로 합리적입니다. 그러나 *또한* `message`를 변경할 때 다시 실행되므로 이는 아마도 바람직하지 않을 것입니다. 이 때문에 일반적으로 종속성 배열을 지정합니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }); // 종속성 배열 없음

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Close chat' : 'Open chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 실제 구현은 서버에 실제로 연결될 것입니다
  return {
    connect() {
      console.log('✅ "' + roomId + '" 방에 ' + serverUrl + '에 연결 중...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 ' + serverUrl + ' 연결 해제됨');
    }
  };
}
```

```css
input { margin-bottom: 10
px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Effect에서 이전 상태를 기반으로 상태 업데이트하기 {/*updating-state-based-on-previous-state-from-an-effect*/}

Effect에서 이전 상태를 기반으로 상태를 업데이트하려고 할 때 문제가 발생할 수 있습니다:

```js {6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1); // 매 초마다 카운터를 증가시키고 싶지만...
    }, 1000)
    return () => clearInterval(intervalId);
  }, [count]); // 🚩 ... `count`를 종속성으로 지정하면 항상 interval을 재설정합니다.
  // ...
}
```

`count`는 반응형 값이므로 종속성 목록에 지정해야 합니다. 그러나 이는 `count`가 변경될 때마다 Effect가 cleanup 및 setup을 다시 실행하게 만듭니다. 이는 이상적이지 않습니다.

이를 해결하려면, `setCount`에 [상태 업데이트 함수 `c => c + 1`](/reference/react/useState#updating-state-based-on-the-previous-state)을 전달하세요:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // ✅ 상태 업데이트 함수 전달
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅ 이제 count는 종속성이 아님

  return <h1>{count}</h1>;
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

이제 `count + 1` 대신 `c => c + 1`을 전달하므로, [Effect는 더 이상 `count`에 의존할 필요가 없습니다.](/learn/removing-effect-dependencies#are-you-reading-some-state-to-calculate-the-next-state) 이 수정의 결과로, `count`가 변경될 때마다 interval을 다시 설정할 필요가 없습니다.

---

### 불필요한 객체 종속성 제거하기 {/*removing-unnecessary-object-dependencies*/}

Effect가 렌더링 중에 생성된 객체나 함수에 의존하는 경우, 너무 자주 실행될 수 있습니다. 예를 들어, 이 Effect는 `options` 객체가 [매 렌더링마다 다르기 때문에](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally) 매 렌더링 후에 다시 연결됩니다:

```js {6-9,12,15}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { // 🚩 이 객체는 매 렌더링마다 새로 생성됩니다
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options); // Effect 내부에서 사용됩니다
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🚩 결과적으로, 이 종속성은 매 렌더링마다 다릅니다
  // ...
```

렌더링 중에 생성된 객체를 종속성으로 사용하지 마세요. 대신, Effect 내부에서 객체를 생성하세요:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 실제 구현은 서버에 실제로 연결될 것입니다
  return {
    connect() {
      console.log('✅ "' + roomId + '" 방에 ' + serverUrl + '에 연결 중...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 ' + serverUrl + ' 연결 해제됨');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

이제 `options` 객체를 Effect 내부에서 생성하므로, Effect 자체는 `roomId` 문자열에만 의존합니다.

이 수정으로, 입력에 타이핑해도 채팅이 다시 연결되지 않습니다. 객체와 달리 문자열인 `roomId`는 다른 값으로 설정되지 않는 한 변경되지 않습니다. [종속성 제거에 대해 더 알아보세요.](/learn/removing-effect-dependencies)

---

### 불필요한 함수 종속성 제거하기 {/*removing-unnecessary-function-dependencies*/}

Effect가 렌더링 중에 생성된 객체나 함수에 의존하는 경우, 너무 자주 실행될 수 있습니다. 예를 들어, 이 Effect는 `createOptions` 함수가 [매 렌더링마다 다르기 때문에](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally) 매 렌더링 후에 다시 연결됩니다:

```js {4-9,12,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() { // 🚩 이 함수는 매 렌더링마다 새로 생성됩니다
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions(); // Effect 내부에서 사용됩니다
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🚩 결과적으로, 이 종속성은 매 렌더링마다 다릅니다
  // ...
```

자체적으로, 매 렌더링마다 함수를 새로 생성하는 것은 문제가 아닙니다. 최적화할 필요는 없습니다. 그러나 이를 Effect의 종속성으로 사용하면, 매 렌더링 후에 Effect가 다시 실행됩니다.

렌더링 중에 생성된 함수를 종속성으로 사용하지 마세요. 대신, Effect 내부에서 함수를 선언하세요:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 실제 구현은 서버에 실제로 연결될 것입니다
  return {
    connect() {
      console.log('✅ "' + roomId + '" 방에 ' + serverUrl + '에 연결 중...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 ' + serverUrl + ' 연결 해제됨');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

이제 `createOptions` 함수를 Effect 내부에서 정의하므로, Effect 자체는 `roomId` 문자열에만 의존합니다. 이 수정으로, 입력에 타이핑해도 채팅이 다시 연결되지 않습니다. 함수와 달리 문자열인 `roomId`는 다른 값으로 설정되지 않는 한 변경되지 않습니다. [종속성 제거에 대해 더 알아보세요.](/learn/removing-effect-dependencies)

---

### Effect에서 최신 props와 state 읽기 {/*reading-the-latest-props-and-state-from-an-effect*/}

<Wip>

이 섹션은 **아직 안정적인 React 버전에서 릴리스되지 않은 실험적 API**를 설명합니다.

</Wip>

기본적으로, Effect에서 반응형 값을 읽을 때 해당 값을 종속성으로 추가해야 합니다. 이는 Effect가 해당 값의 모든 변경에 "반응"하도록 보장합니다. 대부분의 종속성에 대해 이는 원하는 동작입니다.

**그러나 때로는 Effect에서 최신 props와 state를 "반응"하지 않고 읽고 싶을 때가 있습니다.** 예를 들어, 페이지 방문마다 쇼핑 카트의 항목 수를 기록하고 싶다고 가정해 보겠습니다:

```js {3}
function Page({ url, shoppingCart }) {
  useEffect(() => {
    logVisit(url, shoppingCart.length);
  }, [url, shoppingCart]); // ✅ 모든 종속성 선언됨
  // ...
}
```

**`url` 변경 후에만 새로운 페이지 방문을 기록하고 싶지만, `shoppingCart`만 변경된 경우에는 기록하지 않으려면 어떻게 해야 할까요?** [반응성 규칙을 깨지 않고](/learn/specifying-reactive-dependencies) `shoppingCart`를 종속성에서 제외할 수 없습니다. 그러나 Effect 내부에서 호출된 코드가 "반응"하지 않기를 원한다고 표현할 수 있습니다. [`useEffectEvent`](/reference/react/experimental_useEffectEvent) Hook을 사용하여 [Effect 이벤트를 선언하고,](/learn/separating-events-from-effects#declaring-an-effect-event) `shoppingCart`를 읽는 코드를 그 안에 이동하세요:

```js {2-4,7,8}
function Page({ url, shoppingCart }) {
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, shoppingCart.length)
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ 모든 종속성 선언됨
  // ...
}
```

**Effect 이벤트는 반응형이 아니며, Effect의 종속성에서 항상 생략해야 합니다.** 이는 비반응형 코드(일부 props와 state의 최신 값을 읽을 수 있는 코드)를 그 안에 넣을 수 있게 합니다. `onVisit` 내부에서 `shoppingCart`를 읽음으로써, `shoppingCart`가 Effect를 다시 실행하지 않도록 보장합니다.

[Effect 이벤트가 반응형 코드와 비반응형 코드를 분리할 수 있게 하는 방법에 대해 더 알아보세요.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)

---

### 서버와 클라이언트에서 다른 콘텐츠 표시하기 {/*displaying-different-content-on-the-server-and-the-client*/}

앱이 서버 렌더링을 사용하는 경우([직접](/reference/react-dom/server) 또는 [프레임워크를 통해](/learn/start-a-new-react-project#production-grade-react-frameworks)), 컴포넌트는 두 가지 다른 환경에서 렌더링됩니다. 서버에서는 초기 HTML을 생성하기 위해 렌더링됩니다. 클라이언트에서는 React가 렌더링 코드를 다시 실행하여 이벤트 핸들러를 해당 HTML에 연결할 수 있도록 합니다. 이 때문에, [하이드레이션](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html)이 작동하려면 초기 렌더링 출력이 클라이언트와 서버에서 동일해야 합니다.

드물게, 클라이언트에서 다른 콘텐츠를 표시해야 할 수 있습니다. 예를 들어, 앱이 [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)에서 일부 데이터를 읽는 경우, 서버에서는 이를 수행할 수 없습니다. 이를 구현하는 방법은 다음과 같습니다:

```js
function MyComponent() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (didMount) {
    // ... 클라이언트 전용 JSX 반환 ...
  }  else {
    // ... 초기 JSX 반환 ...
  }
}
```

앱이 로드되는 동안 사용자는 초기 렌더링 출력을 보게 됩니다. 그런 다음, 로드되고 하이드레이션되면 Effect가 실행되어 `didMount`를 `true`로 설정하고 다시 렌더링을 트리거합니다. 이렇게 하면 클라이언트 전용 렌더링 출력으로 전환됩니다. Effect는 서버에서 실행되지 않으므로 초기 서버 렌더링 동안 `didMount`는 `false`였습니다.

이 패턴을 신중하게 사용하세요. 느린 연결을 가진 사용자는 초기 콘텐츠를 꽤 오랜 시간 동안 볼 수 있습니다. 잠재적으로 몇 초 동안, 따라서 컴포넌트의 외관을 급격히 변경하지 않도록 하세요. 많은 경우, CSS를 사용하여 다른 것을 조건부로 표시함으로써 이를 피할 수 있습니다.

---

## 문제 해결 {/*troubleshooting*/}

### 컴포넌트가 마운트될 때 Effect가 두 번 실행됩니다 {/*my-effect-runs-twice-when-the-component-mounts*/}

Strict Mode가 켜져 있으면, 개발 중에 React는 setup과 cleanup을 실제 setup 전에 한 번 더 실행합니다.

이는 Effect의 로직이 올바르게 구현되었는지 확인하는 스트레스 테스트입니다. 이로 인해 문제가 발생하면, cleanup 함수에 일부 로직이 누락된 것입니다. cleanup 함수는 setup 함수가 수행하는 작업을 중지하거나 취소해야 합니다. 사용자가 setup이 한 번 호출된 것(프로덕션에서처럼)과 setup → cleanup → setup 시퀀스(개발에서처럼) 사이의 차이를 구별할 수 없어야 합니다.

[이것이 버그를 찾는 데 어떻게 도움이 되는지](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)와 [로직을 수정하는 방법](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)에 대해 더 읽어보세요.

---

### Effect가 매번 다시 렌더링될 때마다 실행됩니다 {/*my-effect-runs-after-every-re-render*/}

먼저 종속성 배열을 지정하는 것을 잊지 않았는지 확인하세요:

```js {3}
useEffect(() => {
  // ...
}); // 🚩 종속성 배열 없음: 매 렌더링 후에 다시 실행됨!
```

종속성 배열을 지정했지만 Effect가 여전히 루프에서 다시 실행되는 경우, 이는 종속성 중 하나가 매 렌더링마다 다르기 때문입니다.

이 문제를 디버그하려면 종속성을 수동으로 콘솔에 기록하세요:

```js {5}
  useEffect(() => {
    // ..
  }, [serverUrl, roomId]);

  console.log([serverUrl, roomId]);
```

그런 다음, 콘솔에서 다른 렌더링의 배열을 마우스 오른쪽 버튼으로 클릭하고 "Store as a global variable"을 선택하여 두 배열을 저장할 수 있습니다. 첫 번째 배열이 `temp1`로 저장되고 두 번째 배열이 `temp2`로 저장되었다고 가정하면, 브라우저 콘솔을 사용하여 각 종속성이 두 배열 간에 동일한지 확인할 수 있습니다:

```js
Object.is(temp1[0], temp2[0]); // 배열 간 첫 번째 종속성이 동일한가요?
Object.is(temp1[1], temp2[1]); // 배열 간 두 번째 종속성이 동일한가요?
Object.is(temp1[2], temp2[2]); // ... 모든 종속성에 대해 계속 확인하세요 ...
```

매 렌더링마다 다른 종속성을 찾으면, 다음 방법 중 하나로 이를 수정할 수 있습니다:

- [Effect에서 이전 상태를 기반으로 상태 업데이트하기](#updating-state-based-on-previous-state-from-an-effect)
- [불필요한 객체 종속성 제거하기](#removing-unnecessary-object-dependencies)
- [불필요한 함수 종속성 제거하기](#removing-unnecessary-function-dependencies)
- [Effect에서 최신 props와 state 읽기](#reading-the-latest-props-and-state-from-an-effect)

마지막 수단으로(이 방법들이 도움이 되지 않는 경우), [`useMemo`](/reference/react/useMemo#memoizing-a-dependency-of-another-hook) 또는 [`useCallback`](/reference/react/useCallback#preventing-an-effect-from-firing-too-often)으로 생성 과정을 래핑하세요(함수의 경우).

---

### Effect가 무한 루프에서 계속 실행됩니다 {/*my-effect-keeps-re-running-in-an-infinite-cycle*/}

Effect가 무한 루프에서 실행되는 경우, 다음 두 가지가 사실이어야 합니다:

- Effect가 일부 상태를 업데이트하고 있습니다.
- 해당 상태가 다시 렌더링을 트리거하여 Effect의 종속성이 변경됩니다.

문제를시작하기 전에, Effect가 외부 시스템(예: DOM, 네트워크, 타사 위젯 등)과 동기화되는지 생각해 보세요. Effect가 상태를 설정해야 하는 이유는 무엇인가요? 외부 시스템과 동기화되나요? 아니면 애플리케이션의 데이터 흐름을 관리하려고 하나요?

외부 시스템이 없는 경우, [Effect를 제거하는 것이](/learn/you-might-not-need-an-effect) 로직을 단순화할 수 있는지 고려해 보세요.

외부 시스템과 실제로 동기화되는 경우, Effect가 상태를 업데이트해야 하는 이유와 조건을 생각해 보세요. 컴포넌트의 시각적 출력에 영향을 미치는 무언가가 변경되었나요? 렌더링에 사용되지 않는 일부 데이터를 추적해야 하는 경우, [ref](/reference/react/useRef#referencing-a-value-with-a-ref) (렌더링을 트리거하지 않음)가 더 적절할 수 있습니다. Effect가 필요 이상으로 상태를 업데이트하지 않도록 확인하세요.

마지막으로, Effect가 적절한 시점에 상태를 업데이트하지만 여전히 루프가 발생하는 경우, 이는 상태 업데이트가 Effect의 종속성 중 하나를 변경하기 때문입니다. [종속성 변경을 디버그하는 방법을 읽어보세요.](/reference/react/useEffect#my-effect-runs-after-every-re-render)

---

### 컴포넌트가 언마운트되지 않았는데도 cleanup 로직이 실행됩니다 {/*my-cleanup-logic-runs-even-though-my-component-didnt-unmount*/}

cleanup 함수는 언마운트 시뿐만 아니라, 변경된 종속성으로 다시 렌더링되기 전에도 실행됩니다. 또한, 개발 중에는 React가 [컴포넌트가 마운트된 직후 setup+cleanup을 한 번 더 실행합니다.](#my-effect-runs-twice-when-the-component-mounts)

setup 로직 없이 cleanup 로직만 있는 경우, 이는 일반적으로 코드 냄새입니다:

```js {2-5}
useEffect(() => {
  // 🔴 피하세요: setup 로직 없이 cleanup 로직만 있는 경우
  return () => {
    doSomething();
  };
}, []);
```

cleanup 로직은 setup 로직과 "대칭"이어야 하며, setup이 수행한 작업을 중지하거나 취소해야 합니다:

```js {2-3,5}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
```

[Effect의 생명 주기가 컴포넌트의 생명 주기와 어떻게 다른지 알아보세요.](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)

---

### Effect가 시각적인 작업을 수행하는데, 실행되기 전에 깜박임이 보입니다 {/*my-effect-does-something-visual-and-i-see-a-flicker-before-it-runs*/}

Effect가 브라우저가 [화면을 그리는 것을 차단해야 하는 경우,](/learn/render-and-commit#epilogue-browser-paint) `useEffect`를 [`useLayoutEffect`](/reference/react/useLayoutEffect)로 교체하세요. 이는 대부분의 Effect에 필요하지 않습니다. Effect가 브라우저 페인트 전에 실행되어야 하는 경우에만 필요합니다. 예를 들어, 툴팁을 측정하고 위치를 지정해야 하는 경우입니다.