---
title: 반응형 효과의 생명 주기
---

<Intro>

Effects는 컴포넌트와 다른 생명주기를 가지고 있습니다. 컴포넌트는 마운트, 업데이트, 언마운트될 수 있습니다. Effect는 두 가지 일만 할 수 있습니다: 무언가를 동기화하기 시작하고, 나중에 그것을 동기화하는 것을 멈추는 것입니다. 이 사이클은 Effect가 시간이 지남에 따라 변경되는 props와 state에 의존하는 경우 여러 번 발생할 수 있습니다. React는 Effect의 종속성을 올바르게 지정했는지 확인하는 린터 규칙을 제공합니다. 이를 통해 Effect가 최신 props와 state에 동기화되도록 유지할 수 있습니다.

</Intro>

<YouWillLearn>

- Effect의 생명주기가 컴포넌트의 생명주기와 어떻게 다른지
- 각 개별 Effect를 고립된 상태로 생각하는 방법
- Effect가 다시 동기화되어야 하는 시기와 이유
- Effect의 종속성이 어떻게 결정되는지
- 값이 반응적이라는 것이 무엇을 의미하는지
- 빈 종속성 배열이 의미하는 것
- React가 린터를 사용하여 종속성이 올바른지 확인하는 방법
- 린터와 의견이 다를 때 해야 할 일

</YouWillLearn>

## Effect의 생명주기 {/*the-lifecycle-of-an-effect*/}

모든 React 컴포넌트는 동일한 생명주기를 거칩니다:

- 컴포넌트가 화면에 추가될 때 _마운트_ 됩니다.
- 컴포넌트가 새로운 props나 state를 받을 때 _업데이트_ 됩니다. 이는 보통 상호작용에 대한 응답으로 발생합니다.
- 컴포넌트가 화면에서 제거될 때 _언마운트_ 됩니다.

**이것은 컴포넌트를 생각하는 좋은 방법이지만, Effect에 대해서는 _아닙니다._** 대신, 각 Effect를 컴포넌트의 생명주기와 독립적으로 생각해보세요. Effect는 현재의 props와 state에 외부 시스템을 [동기화하는 방법](/learn/synchronizing-with-effects)을 설명합니다. 코드가 변경됨에 따라 동기화가 더 자주 또는 덜 자주 필요할 수 있습니다.

이 점을 설명하기 위해, 컴포넌트를 채팅 서버에 연결하는 이 Effect를 고려해보세요:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Effect의 본문은 **동기화를 시작하는 방법**을 지정합니다:

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

Effect가 반환하는 정리 함수는 **동기화를 중지하는 방법**을 지정합니다:

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

직관적으로, React가 컴포넌트가 마운트될 때 **동기화를 시작하고** 컴포넌트가 언마운트될 때 **동기화를 중지할** 것이라고 생각할 수 있습니다. 그러나 이것이 이야기의 끝은 아닙니다! 때로는 컴포넌트가 마운트된 상태에서 **여러 번 동기화를 시작하고 중지해야** 할 수도 있습니다.

이것이 왜 필요한지, 언제 발생하는지, 그리고 이 동작을 어떻게 제어할 수 있는지 살펴보겠습니다.

<Note>

어떤 Effect는 정리 함수를 전혀 반환하지 않습니다. [대부분의 경우,](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) 정리 함수를 반환하고 싶을 것입니다. 그러나 반환하지 않으면 React는 빈 정리 함수를 반환한 것처럼 동작합니다.

</Note>

### 동기화가 여러 번 필요할 수 있는 이유 {/*why-synchronization-may-need-to-happen-more-than-once*/}

이 `ChatRoom` 컴포넌트가 사용자가 드롭다운에서 선택한 `roomId` prop을 받는다고 상상해보세요. 처음에 사용자가 `"general"` 방을 `roomId`로 선택했다고 가정해봅시다. 앱은 `"general"` 채팅 방을 표시합니다:

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

UI가 표시된 후, React는 Effect를 실행하여 **동기화를 시작합니다.** `"general"` 방에 연결합니다:

```js {3,4}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // "general" 방에 연결합니다
    connection.connect();
    return () => {
      connection.disconnect(); // "general" 방에서 연결을 끊습니다
    };
  }, [roomId]);
  // ...
```

지금까지는 잘 진행되고 있습니다.

나중에 사용자가 드롭다운에서 다른 방(예: `"travel"`)을 선택합니다. 먼저, React는 UI를 업데이트합니다:

```js {1}
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

다음에 무슨 일이 일어날지 생각해보세요. 사용자는 UI에서 `"travel"`이 선택된 채팅 방임을 봅니다. 그러나 마지막으로 실행된 Effect는 여전히 `"general"` 방에 연결되어 있습니다. **`roomId` prop이 변경되었기 때문에, 이전에 Effect가 했던 일(즉, `"general"` 방에 연결하는 것)은 더 이상 UI와 일치하지 않습니다.**

이 시점에서 React가 두 가지를 수행하기를 원합니다:

1. 이전 `roomId`와의 동기화를 중지합니다(`"general"` 방에서 연결을 끊습니다)
2. 새로운 `roomId`와의 동기화를 시작합니다(`"travel"` 방에 연결합니다)

**다행히도, 이미 React에게 이 두 가지를 수행하는 방법을 가르쳤습니다!** Effect의 본문은 동기화를 시작하는 방법을 지정하고, 정리 함수는 동기화를 중지하는 방법을 지정합니다. 이제 React가 해야 할 일은 올바른 순서와 올바른 props와 state로 이들을 호출하는 것입니다. 정확히 어떻게 이루어지는지 살펴보겠습니다.

### React가 Effect를 다시 동기화하는 방법 {/*how-react-re-synchronizes-your-effect*/}

`ChatRoom` 컴포넌트가 `roomId` prop의 새로운 값을 받았다는 것을 기억하세요. 이전에는 `"general"`이었고, 이제는 `"travel"`입니다. React는 다른 방에 다시 연결하기 위해 Effect를 다시 동기화해야 합니다.

동기화를 **중지하기 위해,** React는 `"general"` 방에 연결한 후 Effect가 반환한 정리 함수를 호출합니다. `roomId`가 `"general"`이었기 때문에, 정리 함수는 `"general"` 방에서 연결을 끊습니다:

```js {6}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // "general" 방에 연결합니다
    connection.connect();
    return () => {
      connection.disconnect(); // "general" 방에서 연결을 끊습니다
    };
    // ...
```

그런 다음 React는 이번 렌더링 동안 제공한 Effect를 실행합니다. 이번에는 `roomId`가 `"travel"`이므로 `"travel"` 채팅 방에 **동기화를 시작**합니다(정리 함수가 결국 호출될 때까지):

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // "travel" 방에 연결합니다
    connection.connect();
    // ...
```

덕분에 이제 사용자가 UI에서 선택한 방과 동일한 방에 연결되었습니다. 재앙을 피했습니다!

컴포넌트가 다른 `roomId`로 다시 렌더링될 때마다 Effect는 다시 동기화됩니다. 예를 들어, 사용자가 `roomId`를 `"travel"`에서 `"music"`으로 변경한다고 가정해봅시다. React는 다시 Effect의 정리 함수를 호출하여 동기화를 **중지**합니다(즉, `"travel"` 방에서 연결을 끊습니다). 그런 다음 새로운 `roomId` prop으로 Effect의 본문을 실행하여 다시 **동기화**합니다(즉, `"music"` 방에 연결합니다).

마지막으로, 사용자가 다른 화면으로 이동하면 `ChatRoom`이 언마운트됩니다. 이제 더 이상 연결할 필요가 없습니다. React는 Effect를 마지막으로 **동기화 중지**하고 `"music"` 채팅 방에서 연결을 끊습니다.

### Effect의 관점에서 생각하기 {/*thinking-from-the-effects-perspective*/}

`ChatRoom` 컴포넌트의 관점에서 일어난 모든 일을 요약해 봅시다:

1. `ChatRoom`이 `"general"`로 설정된 `roomId`로 마운트되었습니다.
1. `ChatRoom`이 `"travel"`로 설정된 `roomId`로 업데이트되었습니다.
1. `ChatRoom`이 `"music"`으로 설정된 `roomId`로 업데이트되었습니다.
1. `ChatRoom`이 언마운트되었습니다.

컴포넌트의 생명주기의 각 지점에서 Effect는 다른 일을 했습니다:

1. Effect가 `"general"` 방에 연결되었습니다.
1. Effect가 `"general"` 방에서 연결을 끊고 `"travel"` 방에 연결되었습니다.
1. Effect가 `"travel"` 방에서 연결을 끊고 `"music"` 방에 연결되었습니다.
1. Effect가 `"music"` 방에서 연결을 끊었습니다.

이제 Effect 자체의 관점에서 일어난 일을 생각해 봅시다:

```js
  useEffect(() => {
    // Effect가 roomId로 지정된 방에 연결되었습니다...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...연결이 끊어질 때까지
      connection.disconnect();
    };
  }, [roomId]);
```

이 코드의 구조는 일어난 일을 겹치지 않는 시간의 연속으로 볼 수 있도록 영감을 줄 수 있습니다:

1. Effect가 `"general"` 방에 연결되었습니다(연결이 끊어질 때까지)
1. Effect가 `"travel"` 방에 연결되었습니다(연결이 끊어질 때까지)
1. Effect가 `"music"` 방에 연결되었습니다(연결이 끊어질 때까지)

이전에는 컴포넌트의 관점에서 생각하고 있었습니다. 컴포넌트의 관점에서 보면, Effect를 특정 시간에 실행되는 "콜백" 또는 "생명주기 이벤트"로 생각하기 쉽습니다. 예를 들어 "렌더링 후" 또는 "언마운트 전"과 같은 시간에 실행되는 것처럼 생각할 수 있습니다. 이러한 사고 방식은 매우 빠르게 복잡해지므로 피하는 것이 좋습니다.

**대신, 항상 한 번에 하나의 시작/중지 사이클에 집중하세요. 컴포넌트가 마운트, 업데이트 또는 언마운트되는지 여부는 중요하지 않습니다. 동기화를 시작하는 방법과 중지하는 방법을 설명하기만 하면 됩니다. 잘 설명하면, Effect는 필요한 만큼 여러 번 시작되고 중지되는 것에 강력하게 대응할 수 있습니다.**

이것은 컴포넌트가 마운트되거나 업데이트되는지 여부를 생각하지 않고 JSX를 생성하는 렌더링 로직을 작성하는 것과 비슷합니다. 화면에 무엇이 있어야 하는지 설명하고, React가 [나머지를 처리합니다.](/learn/reacting-to-input-with-state)

### React가 Effect가 다시 동기화될 수 있는지 확인하는 방법 {/*how-react-verifies-that-your-effect-can-re-synchronize*/}

여기에서 실시간 예제를 확인할 수 있습니다. "Open chat"을 눌러 `ChatRoom` 컴포넌트를 마운트하세요:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  return <h1>Welcome to the {roomId} room!</h1>;
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
  // 실제 구현은 서버에 실제로 연결할 것입니다
  return {
    connect() {
      console.log('✅ "' + roomId + '" 방에 ' + serverUrl + '에 연결 중...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 ' + serverUrl + ' 연결 해제');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

컴포넌트가 처음 마운트될 때, 세 개의 로그가 표시되는 것을 확인하세요:

1. `✅ "general" 방에 https://localhost:1234에 연결 중...` *(개발 전용)*
1. `❌ "general" 방에서 https://localhost:1234 연결 해제.` *(개발 전용)*
1. `✅ "general" 방에 https://localhost:1234에 연결 중...`

첫 번째 두 로그는 개발 전용입니다. 개발 중에는 React가 각 컴포넌트를 한 번씩 다시 마운트합니다.

**React는 개발 중에 Effect를 강제로 즉시 다시 동기화하여 Effect가 다시 동기화될 수 있는지 확인합니다.** 이것은 문을 열고 닫아 잠금 장치가 작동하는지 확인하는 것과 비슷합니다. React는 개발 중에 Effect를 한 번 더 시작하고 중지하여 [정리 작업이 잘 구현되었는지 확인합니다.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

실제로 Effect가 다시 동기화되는 주요 이유는 사용된 데이터가 변경되었기 때문입니다. 위의 샌드박스에서 선택된 채팅 방을 변경해보세요. `roomId`가 변경될 때 Effect가 다시 동기화되는 것을 확인하세요.

그러나 다시 동기화가 필요한 더 특이한 경우도 있습니다. 예를 들어, 채팅이 열려 있는 동안 위의 샌드박스에서 `serverUrl`을 편집해보세요. 코드 편집에 반응하여 Effect가 다시 동기화되는 것을 확인하세요. 미래에는 React가 다시 동기화에 의존하는 더 많은 기능을 추가할 수 있습니다.

### React가 Effect를 다시 동기화해야 한다는 것을 어떻게 아는지 {/*how-react-knows-that-it-needs-to-re-synchronize-the-effect*/}

React가 `roomId`가 변경된 후 Effect를 다시 동기화해야 한다는 것을 어떻게 알았는지 궁금할 수 있습니다. 이는 *당신이 React에게* `roomId`에 의존한다고 말했기 때문입니다. [종속성 목록에 포함시켰기 때문입니다:](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies)

```js {1,3,8}
function ChatRoom({ roomId }) { // roomId prop은 시간이 지남에 따라 변경될 수 있습니다
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // 이 Effect는 roomId를 읽습니다
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // 따라서 이 Effect가 roomId에 "의존"한다고 React에게 말합니다
  // ...
```

이것이 작동하는 방식은 다음과 같습니다:

1. `roomId`가 prop이라는 것을 알고 있습니다. 이는 시간이 지남에 따라 변경될 수 있음을 의미합니다.
2. Effect가 `roomId`를 읽는다는 것을 알고 있습니다(따라서 그 논리는 나중에 변경될 수 있는 값에 의존합니다).
3. 이것이 Effect의 종속성으로 지정한 이유입니다(`roomId`가 변경될 때 다시 동기화되도록).

컴포넌트가 다시 렌더링된 후마다 React는 전달한 종속성 배열을 확인합니다. 배열의 값 중 하나라도 이전 렌더링 시 전달한 값과 다른 경우, React는 Effect를 다시 동기화합니다.

예를 들어, 초기 렌더링 시 `["general"]`을 전달하고, 다음 렌더링 시 `["travel"]`을 전달한 경우, React는 `"general"`과 `"travel"`을 비교합니다. 이 값들은 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)로 비교했을 때 다른 값입니다. 따라서 React는 Effect를 다시 동기화합니다. 반면, 컴포넌트가 다시 렌더링되었지만 `roomId`가 변경되지 않은 경우, Effect는 동일한 방에 연결된 상태로 유지됩니다.

### 각 Effect는 별도의 동기화 프로세스를 나타냅니다 {/*each-effect-represents-a-separate-s
-동기화 프로세스*/}

Effect에 관련 없는 로직을 추가하지 마세요. 예를 들어, 사용자가 방을 방문할 때 분석 이벤트를 보내고 싶다고 가정해봅시다. 이미 `roomId`에 의존하는 Effect가 있으므로, 그곳에 분석 호출을 추가하고 싶을 수 있습니다:

```js {3}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

하지만 나중에 이 Effect에 다른 종속성을 추가하여 연결을 다시 설정해야 한다고 가정해봅시다. 이 Effect가 다시 동기화되면, 동일한 방에 대해 `logVisit(roomId)`를 호출하게 되는데, 이는 의도한 바가 아닙니다. 방문 기록은 **연결과 별개의 프로세스**입니다. 이를 별도의 Effect로 작성하세요:

```js {2-4}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

**코드의 각 Effect는 별도이고 독립적인 동기화 프로세스를 나타내야 합니다.**

위의 예에서, 하나의 Effect를 삭제해도 다른 Effect의 로직이 깨지지 않습니다. 이는 서로 다른 것을 동기화하고 있으므로 분리하는 것이 합리적입니다. 반면, 하나의 논리적 단위를 여러 Effect로 분리하면 코드가 "깔끔해" 보일 수 있지만 [유지보수가 더 어려워집니다.](/learn/you-might-not-need-an-effect#chains-of-computations) 따라서 프로세스가 동일한지 별개인지 생각하는 것이 중요합니다. 코드가 깔끔해 보이는지 여부는 중요하지 않습니다.

## Effect는 반응적 값에 "반응"합니다 {/*effects-react-to-reactive-values*/}

Effect는 두 개의 변수를 읽습니다(`serverUrl`과 `roomId`), 하지만 `roomId`만 종속성으로 지정했습니다:

```js {5,10}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

왜 `serverUrl`은 종속성으로 필요하지 않을까요?

이는 `serverUrl`이 다시 렌더링으로 인해 변경되지 않기 때문입니다. 컴포넌트가 몇 번 다시 렌더링되든 항상 동일합니다. `serverUrl`이 변경되지 않기 때문에 종속성으로 지정하는 것은 의미가 없습니다. 결국, 종속성은 시간이 지남에 따라 변경될 때만 의미가 있습니다!

반면, `roomId`는 다시 렌더링 시 다를 수 있습니다. **props, state 및 컴포넌트 내부에서 선언된 다른 값들은 _반응적_입니다.** 이는 렌더링 중 계산되며 React 데이터 흐름에 참여하기 때문입니다.

만약 `serverUrl`이 상태 변수였다면, 이는 반응적일 것입니다. 반응적 값은 종속성에 포함되어야 합니다:

```js {2,5,10}
function ChatRoom({ roomId }) { // props는 시간이 지남에 따라 변경됩니다
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // state는 시간이 지남에 따라 변경될 수 있습니다

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Effect는 props와 state를 읽습니다
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // 따라서 이 Effect가 props와 state에 "의존"한다고 React에게 말합니다
  // ...
}
```

`serverUrl`을 종속성으로 포함시킴으로써, 변경 후 Effect가 다시 동기화되도록 보장합니다.

이 샌드박스에서 선택된 채팅 방을 변경하거나 서버 URL을 편집해보세요:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
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
export function createConnection(serverUrl, roomId) {
  // 실제 구현은 서버에 실제로 연결할 것입니다
  return {
    connect() {
      console.log('✅ "' + roomId + '" 방에 ' + serverUrl + '에 연결 중...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 ' + serverUrl + ' 연결 해제');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

반응적 값인 `roomId`나 `serverUrl`을 변경할 때마다 Effect는 채팅 서버에 다시 연결됩니다.

### 빈 종속성을 가진 Effect가 의미하는 것 {/*what-an-effect-with-empty-dependencies-means*/}

`serverUrl`과 `roomId`를 컴포넌트 외부로 이동하면 어떻게 될까요?

```js {1,2}
const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ 모든 종속성이 선언되었습니다
  // ...
}
```

이제 Effect의 코드가 *어떤* 반응적 값도 사용하지 않으므로, 종속성은 빈 배열(`[]`)일 수 있습니다.

컴포넌트의 관점에서 빈 `[]` 종속성 배열은 이 Effect가 컴포넌트가 마운트될 때 채팅 방에 연결되고, 컴포넌트가 언마운트될 때 연결이 끊어진다는 것을 의미합니다. (React는 여전히 [개발 중에 한 번 더 동기화합니다](#how-react-verifies-that-your-effect-can-re-synchronize) 논리를 스트레스 테스트하기 위해.)

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
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
  // 실제 구현은 서버에 실제로 연결할 것입니다
  return {
    connect() {
      console.log('✅ "' + roomId + '" 방에 ' + serverUrl + '에 연결 중...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 ' + serverUrl + ' 연결 해제');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

그러나 [Effect의 관점에서 생각하면,](#thinking-from-the-effects-perspective) 마운트와 언마운트에 대해 생각할 필요가 없습니다. 중요한 것은 동기화를 시작하고 중지하는 방법을 지정했다는 것입니다. 오늘날에는 반응적 종속성이 없습니다. 그러나 사용자가 시간이 지남에 따라 `roomId`나 `serverUrl`을 변경할 수 있도록 하려면(그리고 그것들이 반응적이 될 것입니다), Effect의 코드는 변경되지 않습니다. 종속성에 추가하기만 하면 됩니다.

### 컴포넌트 본문에 선언된 모든 변수는 반응적입니다 {/*all-variables-declared-in-the-component-body-are-reactive*/}

props와 state만 반응적 값이 아닙니다. props나 state에서 계산된 값도 반응적입니다. props나 state가 변경되면 컴포넌트가 다시 렌더링되고, 그로부터 계산된 값도 변경됩니다. 이 때문에 Effect 종속성 목록에 사용된 컴포넌트 본문의 모든 변수를 포함해야 합니다.

사용자가 드롭다운에서 채팅 서버를 선택할 수 있지만, 설정에서 기본 서버를 구성할 수도 있다고 가정해봅시다. 이미 설정 상태를 [컨텍스트](/learn/scaling-up-with-reducer-and-context)에 넣었으므로 `settings`를 해당 컨텍스트에서 읽습니다. 이제 선택한 서버와 기본 서버를 기반으로 `serverUrl`을 계산합니다:

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId는 반응적입니다
  const settings = useContext(SettingsContext); // settings는 반응적입니다
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl은 반응적입니다
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Effect는 roomId와 serverUrl을 읽습니다
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // 따라서 둘 중 하나가 변경될 때 다시 동기화해야 합니다!
  // ...
}
```

이 예에서 `serverUrl`은 prop이나 상태 변수가 아닙니다. 렌더링 중에 계산된 일반 변수입니다. 그러나 렌더링 중에 계산되므로 다시 렌더링으로 인해 변경될 수 있습니다. 이 때문에 반응적입니다.

**컴포넌트 내부의 모든 값(컴포넌트 본문의 props, state 및 변수 포함)은 반응적입니다.** 다시 렌더링 시 모든 반응적 값이 변경될 수 있으므로, 반응적 값을 Effect의 종속성으로 포함해야 합니다.

다시 말해, Effect는 컴포넌트 본문의 모든 값에 "반응"합니다.

<DeepDive>

#### 전역 또는 가변 값이 종속성이 될 수 있나요? {/*can-global-or-mutable-values-be-dependencies*/}

가변 값(전역 변수 포함)은 반응적이지 않습니다.

**[`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname)과 같은 가변 값은 종속성이 될 수 없습니다.** 이는 가변적이므로 React 렌더링 데이터 흐름 외부에서 언제든지 변경될 수 있습니다. 이를 변경해도 컴포넌트의 다시 렌더링을 트리거하지 않습니다. 따라서 종속성으로 지정하더라도 React는 변경 시 Effect를 다시 동기화해야 한다는 것을 알지 못합니다. 이는 렌더링 중에 가변 데이터를 읽는 것이 [렌더링의 순수성을 깨뜨리기](/learn/keeping-components-pure) 때문에 React의 규칙을 위반합니다. 대신, [`useSyncExternalStore`](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store)를 사용하여 외부 가변 값을 읽고 구독해야 합니다.

**[`ref.current`](/reference/react/useRef#reference)와 같은 가변 값이나 그로부터 읽은 값도 종속성이 될 수 없습니다.** `useRef`에서 반환된 ref 객체 자체는 종속성이 될 수 있지만, `current` 속성은 의도적으로 가변적입니다. 이는 [렌더링을 트리거하지 않고 무언가를 추적할 수 있게 합니다.](/learn/referencing-values-with-refs) 그러나 이를 변경해도 다시 렌더링을 트리거하지 않으므로 반응적 값이 아니며, React는 변경 시 Effect를 다시 실행해야 한다는 것을 알지 못합니다.

아래에서 배우게 될 것처럼, 린터는 이러한 문제를 자동으로 확인합니다.

</DeepDive>

### React는 모든 반응적 값을 종속성으로 지정했는지 확인합니다 {/*react-verifies-that-you-specified-every-reactive-value-as-a-dependency*/}

린터가 [React에 대해 구성된 경우,](/learn/editor-setup#linting) Effect 코드에서 사용된 모든 반응적 값이 종속성으로 선언되었는지 확인합니다. 예를 들어, `roomId`와 `serverUrl`이 모두 반응적이기 때문에 이는 린트 오류입니다:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomId는 반응적입니다
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl은 반응적입니다

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- 여기에 문제가 있습니다!

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
export function createConnection(serverUrl, roomId) {
  // 실제 구현은 서버에 실제로 연결할 것입니다
  return {
    connect() {
      console.log('✅ "' + roomId + '" 방에 ' + serverUrl + '에 연결 중...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 ' + serverUrl + ' 연결 해제');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

이는 React 오류처럼 보일 수 있지만, 실제로는 코드에 버그가 있음을 나타냅니다. `roomId`와 `serverUrl`은 시간이 지남에 따라 변경될 수 있지만, 변경 시 Effect를 다시 동기화하는 것을 잊고 있습니다. 사용자가 UI에서 다른 값을 선택해도 초기 `roomId`와 `serverUrl`에 연결된 상태로 유지됩니다.

버그를 수정하려면, 린터의 제안을 따라 `roomId`와 `serverUrl`을 Effect의 종속성으로 지정하세요:

```js {9}
function ChatRoom({ roomId }) { // roomId는 반응적입니다
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl은 반응적입니다
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // ✅ 모든 종속성이 선언되었습니다
  // ...
}
```

위의 샌드박스에서 이 수정을 시도해보세요. 린터 오류가 사라지고, 채팅이 필요할 때 다시 연결되는지 확인하세요.

<Note>

일부 경우, React는 컴포넌트 내부에 선언되었음에도 불구하고 값이 변경되지 않는다는 것을 *알고 있습니다.* 예를 들어, [`useState`에서 반환된 `set` 함수](/reference/react/useState#setstate)와 [`useRef`에서 반환된 ref 객체](/reference/react/useRef)는 *안정적*입니다. 다시 렌더링 시 변경되지 않음을 보장합니다. 안정적인 값은 반응적이지 않으므로 목록에서 생략할 수 있습니다. 포함하는 것은 허용됩니다. 변경되지 않으므로 상관없습니다.

</Note>

### 다시 동기화하고 싶지 않을 때 해야 할 일 {/*what-to-do-when-you-dont-want-to-re-synchronize*/}

이전 예제에서, `roomId`와 `serverUrl`을 종속성으로 지정하여 린트 오류를 수정했습니다.

**그러나, 이러한 값들이 반응적 값이 아니며,** 즉 다시 렌더링의 결과로 변경될 수 없다는 것을 린터에게 "증명"할 수도 있습니다. 예를 들어, `serverUrl`과 `roomId`가 렌더링에 의존하지 않고 항상 동일한 값을 가지는 경우, 컴포넌트 외
부로 이동할 수 있습니다. 이제 종속성으로 필요하지 않습니다:

```js {1,2,11}
const serverUrl = 'https://localhost:1234'; // serverUrl은 반응적이지 않습니다
const roomId = 'general'; // roomId는 반응적이지 않습니다

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ 모든 종속성이 선언되었습니다
  // ...
}
```

또는 *Effect 내부로* 이동할 수도 있습니다. 렌더링 중에 계산되지 않으므로 반응적이지 않습니다:

```js {3,4,10}
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl은 반응적이지 않습니다
    const roomId = 'general'; // roomId는 반응적이지 않습니다
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ 모든 종속성이 선언되었습니다
  // ...
}
```

**Effect는 반응적 코드 블록입니다.** Effect는 내부에서 읽은 값이 변경될 때 다시 동기화됩니다. 이벤트 핸들러와 달리, 이벤트 핸들러는 상호작용당 한 번만 실행되지만, Effect는 동기화가 필요할 때마다 실행됩니다.

**종속성을 "선택"할 수 없습니다.** 종속성에는 Effect에서 읽은 모든 [반응적 값](#all-variables-declared-in-the-component-body-are-reactive)이 포함되어야 합니다. 린터는 이를 강제합니다. 때로는 무한 루프와 같은 문제를 일으키거나 Effect가 너무 자주 다시 동기화될 수 있습니다. 이러한 문제를 린터를 억제하여 해결하지 마세요! 대신 다음을 시도해보세요:

* **Effect가 독립적인 동기화 프로세스를 나타내는지 확인하세요.** Effect가 아무것도 동기화하지 않는다면, [불필요할 수 있습니다.](/learn/you-might-not-need-an-effect) 여러 독립적인 것을 동기화한다면, [분리하세요.](#each-effect-represents-a-separate-synchronization-process)

* **props나 state의 최신 값을 읽고 싶지만 "반응"하지 않고 Effect를 다시 동기화하고 싶지 않다면,** Effect를 반응적 부분(Effect에 유지할 부분)과 비반응적 부분(Effect 이벤트라고 하는 것으로 추출할 부분)으로 분리할 수 있습니다. [이벤트와 Effect를 분리하는 방법을 읽어보세요.](/learn/separating-events-from-effects)

* **객체와 함수에 의존하는 것을 피하세요.** 렌더링 중에 객체와 함수를 생성하고 Effect에서 이를 읽으면, 매번 렌더링 시 다르게 됩니다. 이는 Effect가 매번 다시 동기화되게 합니다. [Effect에서 불필요한 종속성을 제거하는 방법을 읽어보세요.](/learn/removing-effect-dependencies)

<Pitfall>

린터는 친구이지만, 그 능력은 제한적입니다. 린터는 종속성이 *잘못되었을 때*만 알 수 있습니다. 각 경우를 해결하는 *최선의 방법*은 알지 못합니다. 린터가 종속성을 제안하지만, 추가하면 루프가 발생하는 경우, 린터를 무시해서는 안 됩니다. Effect 내부(또는 외부)의 코드를 변경하여 해당 값이 반응적이지 않도록 하고 종속성이 *필요하지 않도록* 해야 합니다.

기존 코드베이스가 있는 경우, 다음과 같이 린터를 억제하는 Effect가 있을 수 있습니다:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 이렇게 린터를 억제하지 마세요:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

[다음](/learn/separating-events-from-effects) [페이지들](/learn/removing-effect-dependencies)에서 규칙을 깨지 않고 이 코드를 수정하는 방법을 배우게 됩니다. 항상 수정할 가치가 있습니다!

</Pitfall>

<Recap>

- 컴포넌트는 마운트, 업데이트, 언마운트될 수 있습니다.
- 각 Effect는 주변 컴포넌트와 별도의 생명주기를 가집니다.
- 각 Effect는 시작하고 중지할 수 있는 별도의 동기화 프로세스를 설명합니다.
- Effect를 작성하고 읽을 때, 컴포넌트의 관점(마운트, 업데이트, 언마운트)보다는 각 개별 Effect의 관점(동기화 시작 및 중지 방법)에서 생각하세요.
- 컴포넌트 본문에 선언된 값은 "반응적"입니다.
- 반응적 값은 시간이 지남에 따라 변경될 수 있으므로 Effect를 다시 동기화해야 합니다.
- 린터는 Effect 내부에서 사용된 모든 반응적 값이 종속성으로 지정되었는지 확인합니다.
- 린터가 표시하는 모든 오류는 정당합니다. 규칙을 깨지 않고 코드를 수정할 방법이 항상 있습니다.

</Recap>

<Challenges>

#### 모든 키 입력 시 다시 연결되는 문제 수정 {/*fix-reconnecting-on-every-keystroke*/}

이 예제에서, `ChatRoom` 컴포넌트는 컴포넌트가 마운트될 때 채팅 방에 연결되고, 언마운트될 때 연결이 끊어지며, 다른 채팅 방을 선택할 때 다시 연결됩니다. 이 동작은 올바르므로 계속 유지해야 합니다.

그러나 문제가 있습니다. 메시지 상자 입력란에 입력할 때마다 `ChatRoom`이 *다시* 채팅에 연결됩니다. (콘솔을 지우고 입력하면 이를 확인할 수 있습니다.) 이 문제가 발생하지 않도록 수정하세요.

<Hint>

이 Effect에 대한 종속성 배열을 추가해야 할 수도 있습니다. 어떤 종속성이 있어야 할까요?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  });

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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
export function createConnection(serverUrl, roomId) {
  // 실제 구현은 서버에 실제로 연결할 것입니다
  return {
    connect() {
      console.log('✅ "' + roomId + '" 방에 ' + serverUrl + '에 연결 중...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 ' + serverUrl + ' 연결 해제');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution>

이 Effect에는 종속성 배열이 전혀 없었기 때문에, 매번 다시 렌더링될 때마다 다시 동기화되었습니다. 먼저 종속성 배열을 추가하세요. 그런 다음, Effect가 사용하는 모든 반응적 값이 배열에 지정되었는지 확인하세요. 예를 들어, `roomId`는 반응적입니다(왜냐하면 prop이기 때문입니다). 따라서 배열에 포함되어야 합니다. 이를 통해 사용자가 다른 방을 선택할 때 채팅이 다시 연결됩니다. 반면, `serverUrl`은 컴포넌트 외부에 정의되어 있습니다. 따라서 배열에 포함될 필요가 없습니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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
export function createConnection(serverUrl, roomId) {
  // 실제 구현은 서버에 실제로 연결할 것입니다
  return {
    connect() {
      console.log('✅ "' + roomId + '" 방에 ' + serverUrl + '에 연결 중...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 ' + serverUrl + ' 연결 해제');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

</Solution>

#### 동기화 켜고 끄기 {/*switch-synchronization-on-and-off*/}

이 예제에서, Effect는 창 [`pointermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) 이벤트를 구독하여 화면에 분홍색 점을 이동시킵니다. 미리보기 영역 위로 마우스를 이동하거나(모바일 장치의 경우 화면을 터치) 분홍색 점이 움직이는 것을 확인하세요.

또한 체크박스가 있습니다. 체크박스를 선택하면 `canMove` 상태 변수가 토글되지만, 이 상태 변수는 코드 어디에서도 사용되지 않습니다. `canMove`가 `false`(체크박스가 꺼짐)일 때 점이 움직이지 않도록 코드를 변경하세요. 체크박스를 다시 켜서 `canMove`를 `true`로 설정하면, 점이 다시 움직여야 합니다. 즉, 점이 움직일 수 있는지 여부는 체크박스가 선택되었는지 여부와 동기화되어야 합니다.

<Hint>

Effect를 조건부로 선언할 수는 없습니다. 그러나 Effect 내부의 코드는 조건을 사용할 수 있습니다!

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        The dot is allowed to move
      </label>
      <hr />
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
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

<Solution>

하나의 해결책은 `setPosition` 호출을 `if (canMove) { ... }` 조건으로 감싸는 것입니다:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        The dot is allowed to move
      </label>
      <hr />
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
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

또는 *이벤트 구독* 로직을 `if (canMove) { ... }` 조건으로 감쌀 수도 있습니다:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    if (canMove) {
      window.addEventListener('pointermove', handleMove);
      return () => window.removeEventListener('pointermove', handleMove);
    }
  }, [canMove]);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        The dot is allowed to move
      </label>
      <hr />
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
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

이 두 경우 모두 `canMove`는 Effect 내부에서 읽는 반응적 변수입니다. 따라서 Effect 종속성 목록에 지정되어야 합니다. 이를 통해 값이 변경될 때마다 Effect가 다시 동기화됩니다.

</Solution>

#### 오래된 값 버그 조사 {/*investigate-a-stale-value-bug*/}

이 예제에서, 체크박스가 켜져 있을 때 분홍색 점이 움직여야 하고, 체크박스가 꺼져 있을 때 점이 움직이지 않아야 합니다. 이를 위한 로직은 이미 구현되어 있습니다: `handleMove` 이벤트 핸들러는 `canMove` 상태 변수를 확인합니다.

그러나 어떤 이유로 `handleMove` 내부의 `canMove` 상태 변수가 "오래된" 것처럼 보입니다: 체크박스를 꺼도 항상 `true`입니다. 어떻게 이런 일이 가능할까요? 코드에서 실수를 찾아 수정하세요.

<Hint>

린터 규칙이 억제되는 것을 보면, 이를 제거하세요! 보통 그곳에 실수가 있습니다.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        The dot is allowed to move
      </label>
      <hr />
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
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

<Solution>

원래 코드의 문제는 종속성 린터를 억제한 것입니다. 억제를 제거하면, 이 Effect가 `handleMove` 함수에 의존한다는 린트 오류가 표시됩니다. 이는 `handleMove`가 컴포넌트 본문
내에서 선언되었기 때문에 반응적 값이기 때문입니다. 모든 반응적 값은 종속성으로 지정되어야 하며, 그렇지 않으면 시간이 지남에 따라 오래될 수 있습니다!

원래 코드의 작성자는 Effect가 어떤 반응적 값에도 의존하지 않는다고 React에게 "거짓말"을 했습니다(`[]`). 이 때문에 React는 `canMove`가 변경된 후(그리고 `handleMove`와 함께) Effect를 다시 동기화하지 않았습니다. React가 Effect를 다시 동기화하지 않았기 때문에, 첨부된 `handleMove`는 초기 렌더링 동안 생성된 `handleMove` 함수입니다. 초기 렌더링 동안 `canMove`는 `true`였기 때문에, 초기 렌더링의 `handleMove`는 영원히 그 값을 볼 것입니다.

**린터를 억제하지 않으면 오래된 값 문제를 절대 보지 않을 것입니다.** 이 버그를 해결하는 몇 가지 방법이 있지만, 항상 린터 억제를 제거하는 것부터 시작해야 합니다. 그런 다음 린트 오류를 수정하기 위해 코드를 변경하세요.

Effect 종속성을 `[handleMove]`로 변경할 수 있지만, 매번 렌더링 시 새로 정의된 함수이므로 종속성 배열을 제거하는 것이 좋습니다. 그러면 Effect는 매번 다시 렌더링될 때마다 다시 동기화됩니다:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  });

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        The dot is allowed to move
      </label>
      <hr />
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
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

이 해결책은 작동하지만, 이상적이지는 않습니다. Effect 본문에 `console.log('Resubscribing')`을 추가하면, 매번 다시 렌더링될 때마다 다시 구독하는 것을 확인할 수 있습니다. 다시 구독하는 것은 빠르지만, 너무 자주 하는 것을 피하는 것이 좋습니다.

더 나은 해결책은 `handleMove` 함수를 *Effect 내부로* 이동하는 것입니다. 그러면 `handleMove`는 반응적 값이 아니므로 Effect는 함수에 의존하지 않습니다. 대신, 이제 코드에서 읽는 `canMove`에 의존해야 합니다. 이는 원하는 동작과 일치합니다. 이제 Effect는 `canMove` 값과 동기화된 상태로 유지됩니다:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        The dot is allowed to move
      </label>
      <hr />
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
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

Effect 본문에 `console.log('Resubscribing')`을 추가해보세요. 이제 체크박스를 토글할 때(`canMove`가 변경될 때)나 코드를 편집할 때만 다시 구독하는 것을 확인할 수 있습니다. 이는 이전 접근 방식보다 더 나은 접근 방식입니다.

이 유형의 문제에 대한 더 일반적인 접근 방식을 [이벤트와 Effect를 분리하기](/learn/separating-events-from-effects)에서 배우게 됩니다.

</Solution>

#### 연결 전환 수정 {/*fix-a-connection-switch*/}

이 예제에서, `chat.js`의 채팅 서비스는 `createEncryptedConnection`과 `createUnencryptedConnection` 두 가지 API를 제공합니다. 루트 `App` 컴포넌트는 사용자가 암호화를 사용할지 선택할 수 있게 하며, 선택한 API 메서드를 `createConnection` prop으로 자식 `ChatRoom` 컴포넌트에 전달합니다.

처음에는 콘솔 로그에 연결이 암호화되지 않았다고 표시됩니다. 체크박스를 켜보세요: 아무 일도 일어나지 않습니다. 그러나 그 후에 방을 변경하면, 채팅이 다시 연결되고 암호화가 활성화됩니다(콘솔 메시지에서 확인할 수 있습니다). 이는 버그입니다. 체크박스를 토글할 때도 채팅이 다시 연결되도록 버그를 수정하세요.

<Hint>

린터를 억제하는 것은 항상 의심스럽습니다. 이것이 버그일까요?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // 실제 구현은 서버에 실제로 연결할 것입니다
  return {
    connect() {
      console.log('✅ 🔐 "' + roomId + '... (암호화됨)" 방에 연결 중');
    },
    disconnect() {
      console.log('❌ 🔐 "' + roomId + '" 방에서 연결 해제 (암호화됨)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // 실제 구현은 서버에 실제로 연결할 것입니다
  return {
    connect() {
      console.log('✅ "' + roomId + '... (암호화되지 않음)" 방에 연결 중');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 연결 해제 (암호화되지 않음)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

린터 억제를 제거하면 린트 오류가 표시됩니다. 문제는 `createConnection`이 prop이므로 반응적 값이라는 것입니다. 이는 시간이 지남에 따라 변경될 수 있습니다! (실제로, 사용자가 체크박스를 선택할 때 부모 컴포넌트는 `createConnection` prop의 다른 값을 전달합니다.) 이 때문에 종속성으로 지정해야 합니다. 이를 포함하여 버그를 수정하세요:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, createConnection]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // 실제 구현은 서버에 실제로 연결할 것입니다
  return {
    connect() {
      console.log('✅ 🔐 "' + roomId + '... (암호화됨)" 방에 연결 중');
    },
    disconnect() {
      console.log('❌ 🔐 "' + roomId + '" 방에서 연결 해제 (암호화됨)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // 실제 구현은 서버에 실제로 연결할 것입니다
  return {
    connect() {
      console.log('✅ "' + roomId + '... (암호화되지 않음)" 방에 연결 중');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 연결 해제 (암호화되지 않음)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

`createConnection`이 종속성이라는 것은 맞습니다. 그러나 이 코드는 약간 취약합니다. 누군가 `App` 컴포넌트를 편집하여 이 prop의 값으로 인라인 함수를 전달할 수 있습니다. 이 경우, `App` 컴포넌트가 다시 렌더링될 때마다 값이 다를 수 있으므로 Effect가 너무 자주 다시 동기화될 수 있습니다. 이를 피하기 위해 `isEncrypted`를 전달할 수 있습니다:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted }) {
  useEffect(() => {
    const createConnection = isEncrypted ?
      createEncryptedConnection :
      createUnencryptedConnection;
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // 실제 구현은 서버에 실제로 연결할 것입니다
  return {
    connect() {
      console.log('✅ 🔐 "' + roomId + '... (암호화됨)" 방에 연결 중');
    },
    disconnect() {
      console.log('❌ 🔐 "' + roomId + '" 방에서 연결 해제 (암호화됨)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // 실제 구현은 서버에 실제로 연결할 것입니다
  return {
    connect() {
      console.log('✅ "' + roomId + '... (암호화되지 않음)" 방에 연결 중');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 연결 해제 (암호화되지 않음)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

이 버전에서는 `App` 컴포넌트가 함수 대신 부울 prop을 전달합니다. Effect 내부에서 사용할 함수를 결정합니다. `createEncryptedConnection`과 `createUnencryptedConnection`은 컴포넌트 외부에 선언되었으므로 반응적이지 않으며 종속성으로 필요하지 않습니다. [Effect 종속성 제거](/learn/removing-effect-dependencies)에서 이에 대해 더 배울 것입니다.

</Solution>

#### 선택 상자 체인 채우기 {/*populate-a-chain-of-select-boxes*/}

이 예제에서는 두 개의 선택 상자가 있습니다. 하나의 선택 상자는 사용자가 행성을 선택할 수 있게 합니다. 다른 선택 상자는 *그 행성의* 장소를 선택할 수 있게 합니다. 두 번째 상자는 아직 작동하지 않습니다. 선택한 행성의 장소를 표시하도록 수정하세요.

첫 번째 선택 상자가 어떻게 작동하는지 확인하세요. 이는 `"/planets"` API 호출의 결과로 `planetList` 상태를 채웁니다. 현재 선택된 행성의 ID는 `planetId` 상태 변수에 저장됩니다. `placeList` 상태 변수를 `"/planets/" + planetId + "/places"` API 호출의 결과로 채우는 추가 코드를 어디에 추가해야 하는지 찾아보세요.

올바르게 구현하면, 행성을 선택하면 장소 목록이 채워져야 합니다. 행성을 변경하면 장소 목록이 변경되어야 합니다.

<Hint>

두 개의 독립적인 동기화 프로세스가 있다면, 두 개의 별도 Effect를 작성해야 합니다.

</Hint>

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // 첫 번째 행성을 선택합니다
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" 또는 "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

두 개의 독립적인 동기화 프로세스가 있습니다:

- 첫 번째 선택 상자는 원격 행성 목록과 동기화됩니다.
- 두 번째 선택 상자는 현재 `planetId`에 대한 원격 장소 목록과 동기화됩니다.

이 때문에 두 개의 별도 Effect로 설명하는 것이 합리적입니다. 다음은 이를 수행하는 예입니다:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // 첫 번째 행성을 선택합니다
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  useEffect(() => {
    if (planetId === '') {
      // 첫 번째 상자에서 아무것도 선택되지 않았습니다
      return;
    }

    let ignore = false;
    fetchData('/planets/' + planetId + '/places').then(result => {
      if (!ignore) {
        console.log('Fetched a list of places on "' + planetId + '".');
        setPlaceList(result);
        setPlaceId(result[0].id); // 첫 번째 장소를 선택합니다
      }
    });
    return () => {
      ignore = true;
    }
  }, [planetId]);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" 또는 "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

이 코드는 약간 반복적입니다. 그러나 이를 단일 Effect로 결합하는 것은 좋은 이유가 아닙니다! 그렇게 하면 두 Effect의 종속성을 하나의 목록으로 결합해야 하며, 행성을 변경하면 모든 행성 목록을 다시 가져오게 됩니다. Effect는 코드 재사용을 위한 도구가 아닙니다.

대신, 반복을 줄이기 위해 `useSelectOptions`와 같은 커스텀 훅으로 일부 로직을 추출할 수 있습니다:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useSelectOptions } from './useSelectOptions.js';

export default function Page() {
  const [
    planetList,
    planetId,
    setPlanetId
  ] = useSelectOptions('/planets');

  const [
    placeList,
    placeId,
    setPlaceId
  ] = useSelectOptions(planetId ? `/planets/${planetId}/places` : null);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '...'} on {planetId || '...'} </p>
    </>
  );
}
```

```js src/useSelectOptions.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export function useSelectOptions(url) {
  const [list, setList] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => {
    if (url === null) {
      return;
    }

    let ignore = false;
    fetchData(url).then(result => {
      if (!ignore) {
        setList(result);
        setSelectedId(result[0].id);
      }
    });
    return () => {
      ignore = true;
    }
  }, [url]);
  return [list, selectedId, setSelectedId];
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" 또는 "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

샌드박스의 `useSelectOptions.js` 탭을 확인하여 작동 방식을 확인하세요. 이상적으로, 애플리케이션의 대부분의 Effect는 결국 커스텀 훅으로 대체되어야 합니다. 이는 직접 작성한 것이든 커뮤니티에서 작성한 것이든 상관없습니다. 커스텀 훅은 동기화 로직을 숨기므로 호출하는 컴포넌트는 Effect에 대해 알지 못합니다. 앱 작업을 계속하면서 선택할 수 있는 훅의 팔레트를 개발하게 될 것이며, 결국 컴포넌트에서 Effect를 자주 작성할 필요가 없게 될 것입니다.

</Solution>

</Challenges>