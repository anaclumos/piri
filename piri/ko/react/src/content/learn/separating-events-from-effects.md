---
title: 이벤트와 효과 분리하기
---

<Intro>

이벤트 핸들러는 동일한 상호작용을 다시 수행할 때만 다시 실행됩니다. 이벤트 핸들러와 달리, Effect는 읽은 값(예: prop 또는 상태 변수)이 마지막 렌더링 시와 다를 경우 다시 동기화됩니다. 때로는 두 가지 동작을 혼합한 것이 필요할 때도 있습니다: 일부 값에 반응하지만 다른 값에는 반응하지 않는 Effect. 이 페이지에서는 이를 수행하는 방법을 배울 수 있습니다.

</Intro>

<YouWillLearn>

- 이벤트 핸들러와 Effect 중에서 선택하는 방법
- 왜 Effect는 반응적이고, 이벤트 핸들러는 그렇지 않은지
- Effect 코드의 일부가 반응적이지 않게 하려면 어떻게 해야 하는지
- Effect 이벤트가 무엇인지, 그리고 이를 Effect에서 추출하는 방법
- Effect 이벤트를 사용하여 최신 props와 상태를 읽는 방법

</YouWillLearn>

## 이벤트 핸들러와 Effect 선택하기 {/*choosing-between-event-handlers-and-effects*/}

먼저, 이벤트 핸들러와 Effect의 차이점을 요약해 보겠습니다.

채팅방 컴포넌트를 구현한다고 가정해 봅시다. 요구 사항은 다음과 같습니다:

1. 컴포넌트는 선택된 채팅방에 자동으로 연결되어야 합니다.
1. "전송" 버튼을 클릭하면 메시지를 채팅에 전송해야 합니다.

이미 코드를 구현했지만, 어디에 넣어야 할지 확신이 서지 않는다고 가정해 봅시다. 이벤트 핸들러를 사용해야 할까요, 아니면 Effect를 사용해야 할까요? 이 질문에 답할 때마다 [코드가 실행되어야 하는 이유](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)를 고려하세요.

### 이벤트 핸들러는 특정 상호작용에 반응하여 실행됩니다 {/*event-handlers-run-in-response-to-specific-interactions*/}

사용자의 관점에서 메시지를 보내는 것은 특정 "전송" 버튼이 클릭되었기 때문에 발생해야 합니다. 사용자가 다른 시간이나 다른 이유로 메시지를 보내면 매우 화가 날 것입니다. 이것이 메시지를 보내는 것이 이벤트 핸들러여야 하는 이유입니다. 이벤트 핸들러는 특정 상호작용을 처리할 수 있게 해줍니다:

```js {4-6}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}
```

이벤트 핸들러를 사용하면 `sendMessage(message)`가 사용자가 버튼을 누를 때만 실행된다는 것을 확신할 수 있습니다.

### Effect는 동기화가 필요할 때마다 실행됩니다 {/*effects-run-whenever-synchronization-is-needed*/}

컴포넌트를 채팅방에 연결된 상태로 유지해야 한다는 점을 기억하세요. 그 코드는 어디에 넣어야 할까요?

이 코드를 실행해야 하는 *이유*는 특정 상호작용이 아닙니다. 사용자가 채팅방 화면으로 어떻게 이동했는지는 중요하지 않습니다. 이제 사용자가 그것을 보고 상호작용할 수 있으므로, 컴포넌트는 선택된 채팅 서버에 연결된 상태를 유지해야 합니다. 심지어 채팅방 컴포넌트가 앱의 초기 화면이었고, 사용자가 아무런 상호작용도 하지 않았더라도, 여전히 연결해야 합니다. 이것이 Effect인 이유입니다:

```js {3-9}
function ChatRoom({ roomId }) {
  // ...
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

이 코드를 사용하면 사용자가 수행한 특정 상호작용에 *관계없이* 현재 선택된 채팅 서버에 항상 활성 연결이 있다는 것을 확신할 수 있습니다. 사용자가 앱을 열기만 했든, 다른 방을 선택했든, 다른 화면으로 이동했다가 다시 돌아왔든, Effect는 컴포넌트가 현재 선택된 방과 *동기화된 상태를 유지*하고, [필요할 때마다 다시 연결되도록](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once) 보장합니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
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
export function sendMessage(message) {
  console.log('🔵 You sent: ' + message);
}

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input, select { margin-right: 20px; }
```

</Sandpack>

## 반응형 값과 반응형 로직 {/*reactive-values-and-reactive-logic*/}

직관적으로, 이벤트 핸들러는 항상 "수동으로" 트리거된다고 말할 수 있습니다. 예를 들어 버튼을 클릭하는 것처럼. 반면에, Effect는 "자동"입니다: 동기화를 유지하기 위해 필요할 때마다 실행되고 다시 실행됩니다.

이것을 생각하는 더 정확한 방법이 있습니다.

컴포넌트 본문 내부에 선언된 props, 상태 및 변수는 <CodeStep step={2}>반응형 값</CodeStep>이라고 합니다. 이 예제에서 `serverUrl`은 반응형 값이 아니지만, `roomId`와 `message`는 반응형 값입니다. 이들은 렌더링 데이터 흐름에 참여합니다:

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

이와 같은 반응형 값은 다시 렌더링으로 인해 변경될 수 있습니다. 예를 들어, 사용자가 `message`를 편집하거나 드롭다운에서 다른 `roomId`를 선택할 수 있습니다. 이벤트 핸들러와 Effect는 변경에 다르게 반응합니다:

- **이벤트 핸들러 내부의 로직은 *반응형이 아닙니다.*** 사용자가 동일한 상호작용(예: 클릭)을 다시 수행하지 않는 한 다시 실행되지 않습니다. 이벤트 핸들러는 반응형 값의 변경에 "반응"하지 않고 읽을 수 있습니다.
- **Effect 내부의 로직은 *반응형입니다.*** Effect가 반응형 값을 읽으면, [이를 종속성으로 지정해야 합니다.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) 그런 다음, 다시 렌더링으로 인해 해당 값이 변경되면, React는 새로운 값으로 Effect의 로직을 다시 실행합니다.

이 차이를 설명하기 위해 이전 예제를 다시 살펴보겠습니다.

### 이벤트 핸들러 내부의 로직은 반응형이 아닙니다 {/*logic-inside-event-handlers-is-not-reactive*/}

이 코드 줄을 살펴보세요. 이 로직이 반응형이어야 할까요?

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

사용자의 관점에서, **`message`의 변경은 사용자가 메시지를 보내고 싶다는 것을 의미하지 않습니다.** 이는 단지 사용자가 타이핑하고 있다는 것을 의미합니다. 즉, 메시지를 보내는 로직은 반응형이어서는 안 됩니다. <CodeStep step={2}>반응형 값</CodeStep>이 변경되었다고 해서 다시 실행되어서는 안 됩니다. 그래서 이벤트 핸들러에 속합니다:

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

이벤트 핸들러는 반응형이 아니므로 `sendMessage(message)`는 사용자가 전송 버튼을 클릭할 때만 실행됩니다.

### Effect 내부의 로직은 반응형입니다 {/*logic-inside-effects-is-reactive*/}

이제 이 코드 줄로 돌아가 보겠습니다:

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

사용자의 관점에서, **`roomId`의 변경은 다른 방에 연결하고 싶다는 것을 의미합니다.** 즉, 방에 연결하는 로직은 반응형이어야 합니다. 이 코드 줄이 <CodeStep step={2}>반응형 값</CodeStep>을 "따라잡고", 그 값이 다르면 다시 실행되기를 원합니다. 그래서 Effect에 속합니다:

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

Effect는 반응형이므로, `createConnection(serverUrl, roomId)`와 `connection.connect()`는 `roomId`의 각 고유 값에 대해 실행됩니다. Effect는 현재 선택된 방과 채팅 연결을 동기화 상태로 유지합니다.

## Effect에서 비반응형 로직 추출하기 {/*extracting-non-reactive-logic-out-of-effects*/}

반응형 로직과 비반응형 로직을 혼합하고 싶을 때는 더 복잡해집니다.

예를 들어, 사용자가 채팅에 연결될 때 알림을 표시하고 싶다고 가정해 봅시다. 현재 테마(어두운 테마 또는 밝은 테마)를 props에서 읽어 알림을 올바른 색상으로 표시합니다:

```js {1,4-6}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    // ...
```

그러나 `theme`은 반응형 값입니다(다시 렌더링 결과로 변경될 수 있음), 그리고 [Effect가 읽는 모든 반응형 값은 종속성으로 선언되어야 합니다.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) 이제 `theme`을 Effect의 종속성으로 지정해야 합니다:

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ 모든 종속성 선언됨
  // ...
```

이 예제를 가지고 놀면서 사용자 경험에 문제가 있는지 확인해 보세요:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

`roomId`가 변경되면 채팅이 예상대로 다시 연결됩니다. 그러나 `theme`도 종속성이기 때문에, 어두운 테마와 밝은 테마를 전환할 때마다 채팅이 *다시* 연결됩니다. 이는 좋지 않습니다!

다시 말해, 이 줄은 반응형이 아니어야 합니다, 비록 그것이 반응형인 Effect 내부에 있더라도:

```js
      // ...
      showNotification('Connected!', theme);
      // ...
```

이 비반응형 로직을 주변의 반응형 Effect에서 분리할 방법이 필요합니다.

### Effect 이벤트 선언하기 {/*declaring-an-effect-event*/}

<Wip>

이 섹션은 **아직 안정 버전의 React에 릴리스되지 않은** 실험적 API를 설명합니다.

</Wip>

[`useEffectEvent`](/reference/react/experimental_useEffectEvent)라는 특별한 Hook을 사용하여 이 비반응형 로직을 Effect에서 추출하세요:

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  // ...
```

여기서 `onConnected`는 *Effect 이벤트*라고 합니다. 이는 Effect 로직의 일부이지만, 이벤트 핸들러와 매우 유사하게 동작합니다. 그 내부의 로직은 반응형이 아니며, 항상 최신 props와 상태 값을 "봅니다".

이제 Effect 내부에서 `onConnected` Effect 이벤트를 호출할 수 있습니다:

```js {2-4,9,13}
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 모든 종속성 선언됨
  // ...
```

이로써 문제가 해결됩니다. `onConnected`를 Effect의 종속성 목록에서 *제거*해야 한다는 점에 유의하세요. **Effect 이벤트는 반응형이 아니며 종속성에서 생략해야 합니다.**

새로운 동작이 예상대로 작동하는지 확인하세요:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",

    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Effect 이벤트는 이벤트 핸들러와 매우 유사하다고 생각할 수 있습니다. 주요 차이점은 이벤트 핸들러는 사용자 상호작용에 반응하여 실행되는 반면, Effect 이벤트는 Effect에서 트리거됩니다. Effect 이벤트는 Effect의 반응성과 반응적이지 않아야 하는 코드 사이의 "연결 고리"를 끊을 수 있게 해줍니다.

### Effect 이벤트로 최신 props와 상태 읽기 {/*reading-latest-props-and-state-with-effect-events*/}

<Wip>

이 섹션은 **아직 안정 버전의 React에 릴리스되지 않은** 실험적 API를 설명합니다.

</Wip>

Effect 이벤트는 종속성 린터를 억제하고 싶은 많은 패턴을 수정할 수 있게 해줍니다.

예를 들어, 페이지 방문을 기록하는 Effect가 있다고 가정해 봅시다:

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

나중에 사이트에 여러 경로를 추가합니다. 이제 `Page` 컴포넌트는 현재 경로와 함께 `url` prop을 받습니다. `logVisit` 호출의 일부로 `url`을 전달하고 싶지만, 종속성 린터가 불평합니다:

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'url'
  // ...
}
```

코드가 무엇을 해야 하는지 생각해 보세요. 각 URL이 다른 페이지를 나타내므로 다른 URL에 대해 별도의 방문을 기록하고 싶습니다. 즉, 이 `logVisit` 호출은 `url`에 대해 반응형이어야 합니다. 이 경우, 종속성 린터를 따르고 `url`을 종속성으로 추가하는 것이 합리적입니다:

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ 모든 종속성 선언됨
  // ...
}
```

이제 쇼핑 카트에 있는 항목 수를 각 페이지 방문과 함께 포함하고 싶다고 가정해 봅시다:

```js {2-3,6}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 React Hook useEffect has a missing dependency: 'numberOfItems'
  // ...
}
```

Effect 내부에서 `numberOfItems`를 사용했으므로, 린터는 이를 종속성으로 추가하라고 요청합니다. 그러나 `logVisit` 호출이 `numberOfItems`에 대해 반응형이 되기를 원하지 않습니다. 사용자가 쇼핑 카트에 무언가를 넣고 `numberOfItems`가 변경되면, 이는 사용자가 페이지를 다시 방문했다는 것을 의미하지 않습니다. 즉, *페이지 방문*은 어떤 의미에서는 "이벤트"입니다. 이는 특정 시점에 발생합니다.

코드를 두 부분으로 나누세요:

```js {5-7,10}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ 모든 종속성 선언됨
  // ...
}
```

여기서 `onVisit`은 Effect 이벤트입니다. 그 내부의 코드는 반응형이 아닙니다. 따라서 `numberOfItems`(또는 다른 반응형 값!)를 사용해도 걱정할 필요가 없습니다.

반면에, Effect 자체는 반응형으로 유지됩니다. Effect 내부의 코드는 `url` prop을 사용하므로, 다른 `url`로 다시 렌더링될 때마다 Effect가 다시 실행됩니다. 이는 `onVisit` Effect 이벤트를 호출합니다.

결과적으로, `url`의 모든 변경에 대해 `logVisit`을 호출하고 항상 최신 `numberOfItems`를 읽습니다. 그러나 `numberOfItems`가 자체적으로 변경되면, 이 코드 중 어느 것도 다시 실행되지 않습니다.

<Note>

`onVisit()`을 인수 없이 호출하고, 내부에서 `url`을 읽을 수 있는지 궁금할 수 있습니다:

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

이것은 작동하지만, 이 `url`을 Effect 이벤트에 명시적으로 전달하는 것이 더 좋습니다. **Effect 이벤트에 `url`을 인수로 전달함으로써, 다른 `url`로 페이지를 방문하는 것이 사용자의 관점에서 별도의 "이벤트"를 구성한다고 말하는 것입니다.** `visitedUrl`은 발생한 "이벤트"의 *일부*입니다:

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

Effect 이벤트가 `visitedUrl`을 명시적으로 "요청"하므로, 이제 `url`을 Effect의 종속성에서 실수로 제거할 수 없습니다. `url` 종속성을 제거하면(다른 페이지 방문을 하나로 간주하게 됨), 린터가 이에 대해 경고할 것입니다. `onVisit`이 `url`에 대해 반응형이 되기를 원하므로, 내부에서 `url`을 읽는 대신 Effect에서 *전달*합니다.

이것은 Effect 내부에 비동기 로직이 있는 경우 특히 중요합니다:

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // 방문 기록 지연
  }, [url]);
```

여기서, `onVisit` 내부의 `url`은 *최신* `url`에 해당하지만(이미 변경되었을 수 있음), `visitedUrl`은 이 Effect(및 이 `onVisit` 호출)를 실행하게 한 원래 `url`에 해당합니다.

</Note>

<DeepDive>

#### 종속성 린터를 억제하는 것이 괜찮을까요? {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

기존 코드베이스에서는 다음과 같이 린트 규칙을 억제하는 경우를 종종 볼 수 있습니다:

```js {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 이렇게 린터를 억제하지 마세요:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

`useEffectEvent`가 React의 안정적인 부분이 된 후에는 **린터를 억제하지 않는 것**을 권장합니다.

린트 규칙을 억제하는 첫 번째 단점은, React가 코드에 도입한 새로운 반응형 종속성에 대해 Effect가 "반응"해야 할 때 더 이상 경고하지 않는다는 것입니다. 이전 예제에서, React가 상기시켜 주었기 때문에 `url`을 종속성으로 추가했습니다. 린터를 비활성화하면 해당 Effect에 대한 향후 편집에 대해 더 이상 이러한 상기 알림을 받지 못합니다. 이는 버그로 이어집니다.

린터를 억제하여 발생하는 혼란스러운 버그의 예를 들어 보겠습니다. 이 예제에서 `handleMove` 함수는 현재 `canMove` 상태 변수 값을 읽어 점이 커서를 따라야 할지 여부를 결정해야 합니다. 그러나 `canMove`는 항상 `true`입니다.

이유를 알 수 있나요?

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

이 코드의 문제는 종속성 린터를 억제하는 것입니다. 억제 주석을 제거하면, 이 Effect의 코드가 `handleMove` 함수에 의존한다는 것을 알 수 있습니다. 이는 `handleMove`가 컴포넌트 본문 내부에 선언되었기 때문에 반응형 값이기 때문입니다. 모든 반응형 값은 종속성으로 지정해야 하며, 그렇지 않으면 시간이 지남에 따라 오래될 수 있습니다!

원래 코드의 작성자는 이 Effect가 어떤 반응형 값에도 의존하지 않는다고 React에 "거짓말"을 했습니다(`[]`). 이 때문에 React는 `canMove`가 변경된 후(그리고 `handleMove`와 함께) Effect를 다시 동기화하지 않았습니다. React가 Effect를 다시 동기화하지 않았기 때문에, 리스너로 첨부된 `handleMove`는 초기 렌더링 동안 생성된 `handleMove` 함수입니다. 초기 렌더링 동안 `canMove`는 `true`였기 때문에, 초기 렌더링의 `handleMove`는 영원히 그 값을 볼 것입니다.

**린터를 억제하지 않으면 오래된 값 문제를 절대 보지 않을 것입니다.**

`useEffectEvent`를 사용하면 린터에 "거짓말"할 필요가 없으며, 코드는 예상대로 작동합니다:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
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

이것이 `useEffectEvent`가 *항상* 올바른 해결책이라는 의미는 아닙니다. 반응형이 되지 않아야 하는 코드 줄에만 적용해야 합니다. 위의 샌드박스에서는 Effect의 코드가 `canMove`에 대해 반응형이 되기를 원하지 않았습니다. 그래서 Effect 이벤트를 추출하는 것이 합리적이었습니다.

린터를 억제하는 다른 올바른 대안에 대해서는 [Effect 종속성 제거](/learn/removing-effect-dependencies)를 읽어보세요.

</DeepDive>

### Effect 이벤트의 제한 사항 {/*limitations-of-effect-events*/}

<Wip>

이 섹션은 **아직 안정 버전의 React에 릴리스되지 않은** 실험적 API를 설명합니다.

</Wip>

Effect 이벤트는 사용 방법에 매우 제한적입니다:

* **Effect 내부에서만 호출하세요.**
* **다른 컴포넌트나 Hook에 전달하지 마세요.**

예를 들어, 다음과 같이 Effect 이벤트를 선언하고 전달하지 마세요:

```js {4-6,8}
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 피하세요: Effect 이벤트 전달

  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // "callback"을 종속성으로 지정해야 함
}
```

대신, 항상 Effect 이벤트를 사용하는 Effect 옆에 직접 선언하세요:

```js {10-12,16,21}
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ 좋음: Effect 내부에서만 로컬로 호출됨
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // "onTick"(Effect 이벤트)을 종속성으로
지정할 필요 없음
}
```

Effect 이벤트는 반응형이 아닌 Effect 코드의 "조각"입니다. 이를 사용하는 Effect 옆에 있어야 합니다.

<Recap>

- 이벤트 핸들러는 특정 상호작용에 반응하여 실행됩니다.
- Effect는 동기화가 필요할 때마다 실행됩니다.
- 이벤트 핸들러 내부의 로직은 반응형이 아닙니다.
- Effect 내부의 로직은 반응형입니다.
- 비반응형 로직을 Effect에서 Effect 이벤트로 이동할 수 있습니다.
- Effect 내부에서만 Effect 이벤트를 호출하세요.
- Effect 이벤트를 다른 컴포넌트나 Hook에 전달하지 마세요.

</Recap>

<Challenges>

#### 업데이트되지 않는 변수를 수정하세요 {/*fix-a-variable-that-doesnt-update*/}

이 `Timer` 컴포넌트는 매초 증가하는 `count` 상태 변수를 유지합니다. 증가하는 값은 `increment` 상태 변수에 저장되며, 플러스 및 마이너스 버튼으로 제어할 수 있습니다.

그러나 플러스 버튼을 몇 번 클릭해도 카운터는 여전히 매초 1씩 증가합니다. 이 코드에 무엇이 잘못되었나요? 왜 `increment`는 Effect 코드 내부에서 항상 1인가요? 실수를 찾아 수정하세요.

<Hint>

이 코드를 수정하려면 규칙을 따르기만 하면 됩니다.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Effect에서 버그를 찾을 때는 항상 린터 억제 주석을 먼저 찾아보세요.

억제 주석을 제거하면, React는 이 Effect의 코드가 `increment`에 의존한다고 알려줍니다. 이는 `increment`가 컴포넌트 본문 내부에 선언되었기 때문에 반응형 값이기 때문입니다. 모든 반응형 값은 종속성으로 지정해야 하며, 그렇지 않으면 시간이 지남에 따라 오래될 수 있습니다!

`increment`를 종속성 배열에 추가하세요:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

이제 `increment`가 변경되면, React는 Effect를 다시 동기화하여 타이머를 재시작합니다.

</Solution>

#### 멈추는 카운터 수정하기 {/*fix-a-freezing-counter*/}

이 `Timer` 컴포넌트는 매초 증가하는 `count` 상태 변수를 유지합니다. 증가하는 값은 `increment` 상태 변수에 저장되며, 플러스 및 마이너스 버튼으로 제어할 수 있습니다. 예를 들어, 플러스 버튼을 아홉 번 누르면, `count`가 매초 10씩 증가하는 것을 볼 수 있습니다.

이 사용자 인터페이스에는 작은 문제가 있습니다. 플러스 또는 마이너스 버튼을 1초에 한 번 이상 빠르게 누르면, 타이머 자체가 멈추는 것처럼 보입니다. 버튼을 마지막으로 누른 후 1초가 지나야 타이머가 다시 시작됩니다. 이 문제가 발생하는 이유를 찾아 수정하여 타이머가 *매* 초마다 중단 없이 작동하도록 하세요.

<Hint>

Effect 내부의 코드가 `increment` 값을 사용합니다. `increment` 값이 변경될 때마다 Effect가 다시 실행되어야 하나요?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

이 예제의 문제는 Effect 내부의 코드가 `increment` 상태 변수를 사용한다는 것입니다. 이는 Effect의 종속성이므로, `increment`가 변경될 때마다 Effect가 다시 동기화되어 타이머가 지워집니다. 타이머가 실행되기 전에 계속 지우면, 타이머가 멈춘 것처럼 보입니다.

이 문제를 해결하려면, `onTick` Effect 이벤트를 추출하세요:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

`onTick`이 Effect 이벤트이므로, 그 내부의 코드는 반응형이 아닙니다. `increment`의 변경은 어떤 Effect도 트리거하지 않습니다.

</Solution>

#### 조정할 수 없는 지연 수정하기 {/*fix-a-non-adjustable-delay*/}

이 예제에서는 간격 지연을 사용자 정의할 수 있습니다. 이는 두 버튼으로 업데이트되는 `delay` 상태 변수에 저장됩니다. 그러나 "100ms 추가" 버튼을 눌러 `delay`가 1000밀리초(즉, 1초)가 될 때까지 눌러도, 타이머는 여전히 매우 빠르게(100ms마다) 증가합니다. `delay` 변경이 무시되는 것처럼 보입니다. 버그를 찾아 수정하세요.

<Hint>

Effect 이벤트 내부의 코드는 반응형이 아닙니다. `setInterval` 호출이 다시 실행되기를 원하는 경우가 있나요?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  const onMount = useEffectEvent(() => {
    return setInterval(() => {
      onTick();
    }, delay);
  });

  useEffect(() => {
    const id = onMount();
    return () => {
      clearInterval(id);
    }
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

위 예제의 문제는 `onMount`라는 Effect 이벤트를 추출하면서 코드가 실제로 무엇을 해야 하는지 고려하지 않았다는 것입니다. 특정 이유 없이 Effect 이벤트를 추출해서는 안 됩니다: 코드의 일부가 반응형이 되지 않아야 할 때만 추출해야 합니다. 그러나 `setInterval` 호출은 `delay` 상태 변수에 대해 반응형이어야 합니다. `delay`가 변경되면, 타이머를 처음부터 설정하고 싶습니다! 이 코드를 수정하려면 모든 반응형 코드를 Effect 내부로 다시 가져오세요:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => {
      clearInterval(id);
    }
  }, [delay]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

일반적으로, *타이밍*보다는 코드의 *목적*에 초점을 맞춘 함수(`onMount`와 같은)를 의심해야 합니다. 처음에는 "더 설명적"으로 느껴질 수 있지만, 의도를 흐리게 합니다. Effect 이벤트는 *사용자의* 관점에서 발생한 것과 일치해야 합니다. 예를 들어, `onMessage`, `onTick`, `onVisit`, 또는 `onConnected`는 좋은 Effect 이벤트 이름입니다. 그 내부의 코드는 반응형이 아닐 가능성이 큽니다. 반면에, `onMount`, `onUpdate`, `onUnmount`, 또는 `onAfterRender`는 너무 일반적이어서 반응형이어야 하는 코드를 실수로 넣기 쉽습니다. 따라서 Effect 이벤트는 *사용자가 생각하는* 사건에 따라 이름을 지어야 하며, 코드가 실행된 시점이 아니라 사용자가 생각하는 사건에 따라 이름을 지어야 합니다.

</Solution>

#### 지연된 알림 수정하기 {/*fix-a-delayed-notification*/}

채팅방에 참여할 때, 이 컴포넌트는 알림을 표시합니다. 그러나 즉시 알림을 표시하지 않습니다. 대신, 사용자가 UI를 둘러볼 수 있도록 알림이 인위적으로 2초 지연됩니다.

이것은 거의 작동하지만, 버그가 있습니다. 드롭다운을 "general"에서 "travel"로, 그리고 "music"으로 매우 빠르게 변경해 보세요. 충분히 빠르게 하면, 두 개의 알림이 표시되지만(예상대로!), 두 알림 모두 "Welcome to music"이라고 표시됩니다.

"general"에서 "travel"로, 그리고 "music"으로 매우 빠르게 전환할 때, 첫 번째 알림은 "Welcome to travel"이고 두 번째 알림은 "Welcome to music"이 되도록 수정하세요. (추가 도전 과제로, 이미 알림이 올바른 방을 표시하도록 만든 경우, 마지막 알림만 표시되도록 코드를 변경하세요.)

<Hint>

Effect는 어떤 방에 연결되었는지 알고 있습니다. Effect 이벤트에 전달할 정보가 있나요?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Welcome to ' + roomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected();
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Effect 이벤트 내부에서 `roomId`는 Effect 이벤트가 호출된 시점의 값입니다.

Effect 이벤트는 2초 지연 후 호출됩니다. `travel`에서 `music`으로 빠르게 전환하면, `travel` 방의 알림이 표시될 때 `roomId`는 이미 `"music"`입니다. 이것이 두 알림이 모두 "Welcome to music"이라고 표시되는 이유입니다.

이 문제를 해결하려면, Effect 이벤트 내부에서 *최신* `roomId`를 읽는 대신, `connectedRoomId`와 같이 Effect 이벤트의 매개변수로 만드세요. 그런 다음, Effect에서 `onConnected(roomId)`를 호출하여 `roomId`를 전달하세요:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

`roomId`가 `"travel"`로 설정된 Effect는 `"travel"` 방에 연결되었으므로 `"travel"`에 대한 알림을 표시합니다. `roomId`가 `"music"`으로 설정된 Effect는 `"music"` 방에 연결되었으므로 `"music"`에 대한 알림을 표시합니다. 즉, `connectedRoomId`는 반응형인 Effect에서 오며, `theme`은 항상 최신 값을 사용합니다.

추가 도전 과제를 해결하려면, 알림 타임아웃 ID를 저장하고 Effect의 정리 함수에서 이를 지우세요:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    let notificationTimeoutId;
    connection.on('connected', () => {
      notificationTimeoutId = setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => {
      connection.disconnect();
      if (notificationTimeoutId !== undefined) {
        clearTimeout(notificationTimeoutId);
      }
    };
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

이렇게 하면 방을 변경할 때 이미 예약된(아직 표시되지 않은) 알림이 취소됩니다.

</Solution>

</Challenges>