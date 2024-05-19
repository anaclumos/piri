---
title: 탈출구
---

<Intro>

일부 컴포넌트는 React 외부의 시스템을 제어하고 동기화해야 할 수도 있습니다. 예를 들어, 브라우저 API를 사용하여 입력에 포커스를 맞추거나, React 없이 구현된 비디오 플레이어를 재생 및 일시 정지하거나, 원격 서버에서 메시지를 수신하고 연결해야 할 수 있습니다. 이 장에서는 React를 "벗어나" 외부 시스템과 연결할 수 있는 탈출구를 배우게 됩니다. 대부분의 애플리케이션 로직과 데이터 흐름은 이러한 기능에 의존하지 않아야 합니다.

</Intro>

<YouWillLearn isChapter={true}>

* [새로 렌더링하지 않고 정보를 "기억"하는 방법](/learn/referencing-values-with-refs)
* [React가 관리하는 DOM 요소에 접근하는 방법](/learn/manipulating-the-dom-with-refs)
* [외부 시스템과 컴포넌트를 동기화하는 방법](/learn/synchronizing-with-effects)
* [컴포넌트에서 불필요한 Effects를 제거하는 방법](/learn/you-might-not-need-an-effect)
* [Effect의 생명주기가 컴포넌트의 생명주기와 다른 점](/learn/lifecycle-of-reactive-effects)
* [일부 값이 Effects를 다시 트리거하지 않도록 하는 방법](/learn/separating-events-from-effects)
* [Effect를 덜 자주 실행되게 하는 방법](/learn/removing-effect-dependencies)
* [컴포넌트 간 로직을 공유하는 방법](/learn/reusing-logic-with-custom-hooks)

</YouWillLearn>

## 참조를 사용하여 값 기억하기 {/*referencing-values-with-refs*/}

컴포넌트가 일부 정보를 "기억"하도록 하고 싶지만 그 정보가 [새로운 렌더링을 트리거](/learn/render-and-commit)하지 않기를 원할 때, *ref*를 사용할 수 있습니다:

```js
const ref = useRef(0);
```

상태와 마찬가지로, ref는 재렌더링 사이에 React에 의해 유지됩니다. 그러나 상태를 설정하면 컴포넌트가 다시 렌더링됩니다. ref를 변경해도 그렇지 않습니다! `ref.current` 속성을 통해 해당 ref의 현재 값을 액세스할 수 있습니다.

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

ref는 React가 추적하지 않는 컴포넌트의 비밀 주머니와 같습니다. 예를 들어, ref를 사용하여 [타임아웃 ID](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value), [DOM 요소](https://developer.mozilla.org/en-US/docs/Web/API/Element) 및 컴포넌트의 렌더링 출력에 영향을 미치지 않는 다른 객체를 저장할 수 있습니다.

<LearnMore path="/learn/referencing-values-with-refs">

**[참조를 사용하여 값 기억하기](/learn/referencing-values-with-refs)**를 읽고 ref를 사용하여 정보를 기억하는 방법을 배우세요.

</LearnMore>

## 참조를 사용하여 DOM 조작하기 {/*manipulating-the-dom-with-refs*/}

React는 렌더링 출력을 반영하도록 DOM을 자동으로 업데이트하므로, 컴포넌트가 DOM을 조작할 필요는 거의 없습니다. 그러나 때로는 React가 관리하는 DOM 요소에 접근해야 할 때가 있습니다. 예를 들어, 노드에 포커스를 맞추거나, 스크롤하거나, 크기와 위치를 측정해야 할 수 있습니다. React에는 이러한 작업을 수행하는 내장 방법이 없으므로 DOM 노드에 대한 ref가 필요합니다. 예를 들어, 버튼을 클릭하면 ref를 사용하여 입력에 포커스를 맞춥니다:

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

<LearnMore path="/learn/manipulating-the-dom-with-refs">

**[참조를 사용하여 DOM 조작하기](/learn/manipulating-the-dom-with-refs)**를 읽고 React가 관리하는 DOM 요소에 접근하는 방법을 배우세요.

</LearnMore>

## Effects로 동기화하기 {/*synchronizing-with-effects*/}

일부 컴포넌트는 외부 시스템과 동기화해야 합니다. 예를 들어, React 상태에 따라 비React 컴포넌트를 제어하거나, 서버 연결을 설정하거나, 컴포넌트가 화면에 나타날 때 분석 로그를 보내고 싶을 수 있습니다. 이벤트 핸들러와 달리, *Effects*는 렌더링 후에 코드를 실행할 수 있게 해줍니다. 이를 사용하여 컴포넌트를 React 외부의 시스템과 동기화하세요.

재생/일시 정지를 몇 번 누르고 비디오 플레이어가 `isPlaying` prop 값에 맞게 동기화되는지 확인하세요:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

많은 Effects는 또한 "정리" 작업을 수행합니다. 예를 들어, 채팅 서버에 연결을 설정하는 Effect는 React에 컴포넌트를 해당 서버에서 어떻게 연결 해제할지 알려주는 *정리 함수*를 반환해야 합니다:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // 실제 구현은 실제로 서버에 연결할 것입니다
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

개발 중에는 React가 Effect를 한 번 더 실행하고 정리합니다. 이로 인해 `"✅ Connecting..."`이 두 번 출력됩니다. 이는 정리 함수를 구현하는 것을 잊지 않도록 보장합니다.

<LearnMore path="/learn/synchronizing-with-effects">

**[Effects로 동기화하기](/learn/synchronizing-with-effects)**를 읽고 컴포넌트를 외부 시스템과 동기화하는 방법을 배우세요.

</LearnMore>

## Effect가 필요하지 않을 수도 있습니다 {/*you-might-not-need-an-effect*/}

Effects는 React 패러다임에서 벗어나는 탈출구입니다. 이를 통해 React 외부의 시스템과 컴포넌트를 동기화할 수 있습니다. 외부 시스템이 관련되지 않은 경우(예: 일부 props 또는 상태가 변경될 때 컴포넌트의 상태를 업데이트하려는 경우) Effect가 필요하지 않습니다. 불필요한 Effects를 제거하면 코드가 더 쉽게 이해되고, 실행 속도가 빨라지며, 오류가 줄어듭니다.

Effect가 필요하지 않은 두 가지 일반적인 경우가 있습니다:
- **렌더링을 위해 데이터를 변환하는 데 Effects가 필요하지 않습니다.**
- **사용자 이벤트를 처리하는 데 Effects가 필요하지 않습니다.**

예를 들어, 다른 상태를 기반으로 일부 상태를 조정하려면 Effect가 필요하지 않습니다:

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 피해야 함: 중복 상태 및 불필요한 Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

대신 렌더링 중에 최대한 계산하세요:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ 좋음: 렌더링 중에 계산됨
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

그러나 외부 시스템과 동기화하려면 Effects가 필요합니다.

<LearnMore path="/learn/you-might-not-need-an-effect">

**[Effect가 필요하지 않을 수도 있습니다](/learn/you-might-not-need-an-effect)**를 읽고 불필요한 Effects를 제거하는 방법을 배우세요.

</LearnMore>

## 반응형 Effect의 생명주기 {/*lifecycle-of-reactive-effects*/}

Effects는 컴포넌트와 다른 생명주기를 가집니다. 컴포넌트는 마운트, 업데이트 또는 언마운트될 수 있습니다. Effect는 두 가지 작업만 수행할 수 있습니다: 무언가를 동기화 시작하고, 나중에 동기화를 중지합니다. 이 주기는 Effect가 시간에 따라 변경되는 props와 상태에 의존하는 경우 여러 번 발생할 수 있습니다.

이 Effect는 `roomId` prop의 값에 의존합니다. Props는 *반응형 값*으로, 다시 렌더링할 때 변경될 수 있습니다. `roomId`가 변경되면 Effect가 *다시 동기화*되고 서버에 다시 연결되는 것을 확인하세요:

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
  // 실제 구현은 실제로 서버에 연결할 것입니다
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

React는 Effect의 종속성을 올바르게 지정했는지 확인하는 린터 규칙을 제공합니다. 위 예제에서 `roomId`를 종속성 목록에 지정하는 것을 잊으면 린터가 자동으로 해당 버그를 찾아냅니다.

<LearnMore path="/learn/lifecycle-of-reactive-effects">

**[반응형 이벤트의 생명주기](/learn/lifecycle-of-reactive-effects)**를 읽고 Effect의 생명주기가 컴포넌트의 생명주기와 다른 점을 배우세요.

</LearnMore>

## 이벤트와 Effects 분리하기 {/*separating-events-from-effects*/}

<Wip>

이 섹션은 **아직 안정적인 버전의 React에서 릴리스되지 않은 실험적 API**를 설명합니다.

</Wip>

이벤트 핸들러는 동일한 상호작용을 다시 수행할 때만 다시 실행됩니다. 이벤트 핸들러와 달리, Effects는 읽은 값(예: props 또는 상태)이 마지막 렌더링 시와 다르면 다시 동기화됩니다. 때로는 두 가지 동작을 혼합한 것이 필요합니다: 일부 값에 반응하지만 다른 값에는 반응하지 않는 Effect.

Effects 내부의 모든 코드는 *반응형*입니다. 렌더링으로 인해 읽은 반응형 값이 변경되면 다시 실행됩니다. 예를 들어, 이 Effect는 `roomId` 또는 `theme`이 변경되면 다시 채팅에 연결됩니다:

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
  // 실제 구현은 실제로 서버에 연결할 것입니다
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

이것은 이상적이지 않습니다. `roomId`가 변경된 경우에만 채팅에 다시 연결하고 싶습니다. `theme`을 전환하는 것은 채팅에 다시 연결하지 않아야 합니다! `theme`을 읽는 코드를 Effect에서 *Effect Event*로 이동하세요:

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
  // 실제 구현은 실제로 서버에 연결할 것입니다
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

Effect Events 내부의 코드는 반응형이 아니므로 `theme`을 변경해도 Effect가 다시 연결되지 않습니다.

<LearnMore path="/learn/separating-events-from-effects">

**[이벤트와 Effects 분리하기](/learn/separating-events-from-effects)**를 읽고 일부 값이 Effects를 다시 트리거하지 않도록 하는 방법을 배우세요.

</LearnMore>

## Effect 종속성 제거하기 {/*removing-effect-dependencies*/}

Effect를 작성할 때, 린터는 Effect가 읽는 모든 반응형 값(예: props와 상태)을 Effect의 종속성 목록에 포함했는지 확인합니다. 이는 Effect가 컴포넌트의 최신 props와 상태와 동기화된 상태를 유지하도록 보장합니다. 불필요한 종속성은 Effect가 너무 자주 실행되거나 무한 루프를 생성할 수 있습니다. 이를 제거하는 방법은 경우에 따라 다릅니다.

예를 들어, 이 Effect는 입력을 편집할 때마다 다시 생성되는 `options` 객체에 의존합니다:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

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
  // 실제 구현은 실제로 서버에 연결할 것입니다
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

채팅 중 메시지를 입력할 때마다 다시 연결하고 싶지 않습니다. 이 문제를 해결하려면 `options` 객체 생성을 Effect 내부로 이동하여 Effect가 `roomId` 문자열에만 의존하도록 하세요:

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
  // 실제 구현은 실제로 서버에 연결할 것입니다
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

종속성 목록을 편집하여 `options` 종속성을 제거하는 것으로 시작하지 않았다는 점에 주목하세요. 그것은 잘못된 접근 방식입니다. 대신, 종속성이 *불필요*해지도록 주변 코드를 변경했습니다. 종속성 목록을 Effect 코드에서 사용하는 모든 반응형 값의 목록으로 생각하세요. 목록에 무엇을 넣을지 의도적으로 선택하지 않습니다. 목록은 코드를 설명합니다. 종속성 목록을 변경하려면 코드를 변경하세요.

<LearnMore path="/learn/removing-effect-dependencies">

**[Effect 종속성 제거하기](/learn/removing-effect-dependencies)**를 읽고 Effect를 덜 자주 실행되게 하는 방법을 배우세요.

</LearnMore>

## 사용자 정의 Hooks로 로직 재사용하기 {/*reusing-logic-with-custom-hooks*/}

React는 `useState`, `useContext`, `useEffect`와 같은 내장 Hooks를 제공합니다. 때로는 데이터 가져오기, 사용자가 온라인 상태인지 추적하기, 채팅방에 연결하기 등 특정 목적을 위한 Hook이 필요할 수 있습니다. 이를 위해 애플리케이션의 필요에 맞는 사용자 정의 Hooks를 만들 수 있습니다.

이 예제에서 `usePointerPosition` 사용자 정의 Hook은 커서 위치를 추적하고, `useDelayedValue` 사용자 정의 Hook은 전달된 값보다 일정 시간 지연된 값을 반환합니다. 샌드박스 미리보기 영역 위로 커서를 이동하여 커서를 따라가는 점들의 움직이는 궤적을 확인하세요:

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos4, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
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

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```js src/useDelayedValue.js
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

사용자 정의 Hooks를 만들고, 이를 함께 구성하고, 데이터를 전달하고, 컴포넌트 간에 재사용할 수 있습니다. 애플리케이션이 성장함에 따라, 이미 작성한 사용자 정의 Hooks를 재사용할 수 있기 때문에 수작업으로 Effects를 작성하는 일이 줄어들 것입니다. React 커뮤니티에서 유지 관리하는 훌륭한 사용자 정의 Hooks도 많이 있습니다.

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

**[사용자 정의 Hooks로 로직 재사용하기](/learn/reusing-logic-with-custom-hooks)**를 읽고 컴포넌트 간 로직을 공유하는 방법을 배우세요.

</LearnMore>

## 다음은 무엇인가요? {/*whats-next*/}

[참조를 사용하여 값 기억하기](/learn/referencing-values-with-refs)로 이동하여 이 장을 페이지별로 읽기 시작하세요!