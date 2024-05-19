---
title: 사용자 정의 훅으로 로직 재사용하기
---

<Intro>

React에는 `useState`, `useContext`, `useEffect`와 같은 여러 내장된 Hook이 있습니다. 때로는 더 구체적인 목적을 위한 Hook이 있었으면 좋겠다고 생각할 수 있습니다. 예를 들어, 데이터를 가져오거나, 사용자가 온라인 상태인지 추적하거나, 채팅방에 연결하는 등의 경우입니다. 이러한 Hook을 React에서 찾을 수 없을 수도 있지만, 애플리케이션의 필요에 맞게 직접 Hook을 만들 수 있습니다.

</Intro>

<YouWillLearn>

- 커스텀 Hook이 무엇인지, 그리고 직접 작성하는 방법
- 컴포넌트 간에 로직을 재사용하는 방법
- 커스텀 Hook의 이름을 짓고 구조화하는 방법
- 커스텀 Hook을 추출해야 하는 시기와 이유

</YouWillLearn>

## 커스텀 Hook: 컴포넌트 간 로직 공유하기 {/*custom-hooks-sharing-logic-between-components*/}

네트워크에 크게 의존하는 앱을 개발하고 있다고 상상해 보세요(대부분의 앱이 그렇습니다). 사용자가 앱을 사용하는 동안 네트워크 연결이 우연히 끊어졌을 때 경고를 주고 싶습니다. 어떻게 해야 할까요? 컴포넌트에 두 가지가 필요할 것 같습니다:

1. 네트워크가 온라인 상태인지 추적하는 상태.
2. 전역 [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) 및 [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) 이벤트를 구독하고 해당 상태를 업데이트하는 Effect.

이렇게 하면 컴포넌트가 네트워크 상태와 [동기화](/learn/synchronizing-with-effects)됩니다. 다음과 같은 코드로 시작할 수 있습니다:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```

</Sandpack>

네트워크를 켜고 끄면서 `StatusBar`가 어떻게 반응하는지 확인해 보세요.

이제 동일한 로직을 다른 컴포넌트에서도 사용하고 싶다고 상상해 보세요. 네트워크가 꺼져 있을 때 "저장" 대신 "재연결 중..."을 표시하고 비활성화되는 저장 버튼을 구현하고 싶습니다.

먼저, `isOnline` 상태와 Effect를 `SaveButton`에 복사하여 붙여넣을 수 있습니다:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

</Sandpack>

네트워크를 끄면 버튼의 모양이 변경되는지 확인해 보세요.

이 두 컴포넌트는 잘 작동하지만, 로직의 중복이 아쉽습니다. 비록 시각적 모양은 다르지만, 로직을 재사용하고 싶습니다.

### 컴포넌트에서 커스텀 Hook 추출하기 {/*extracting-your-own-custom-hook-from-a-component*/}

[`useState`](/reference/react/useState)와 [`useEffect`](/reference/react/useEffect)와 유사하게 내장된 `useOnlineStatus` Hook이 있다고 상상해 보세요. 그러면 이 두 컴포넌트를 단순화하고 중복을 제거할 수 있습니다:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

비록 내장된 Hook은 없지만, 직접 작성할 수 있습니다. `useOnlineStatus`라는 함수를 선언하고 이전에 작성한 컴포넌트에서 모든 중복된 코드를 이동합니다:

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

함수 끝에서 `isOnline`을 반환합니다. 이렇게 하면 컴포넌트가 해당 값을 읽을 수 있습니다:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

네트워크를 켜고 끄면 두 컴포넌트가 업데이트되는지 확인해 보세요.

이제 컴포넌트에 반복적인 로직이 줄어들었습니다. **더 중요한 것은, 컴포넌트 내부의 코드가 *어떻게 해야 하는지* (브라우저 이벤트를 구독하여)보다는 *무엇을 하고 싶은지* (온라인 상태를 사용하고 싶다!)를 설명합니다.**

커스텀 Hook으로 로직을 추출하면 외부 시스템이나 브라우저 API를 다루는 복잡한 세부 사항을 숨길 수 있습니다. 컴포넌트의 코드는 의도를 표현하고, 구현을 표현하지 않습니다.

### Hook 이름은 항상 `use`로 시작합니다 {/*hook-names-always-start-with-use*/}

React 애플리케이션은 컴포넌트로 구성됩니다. 컴포넌트는 내장된 Hook이든 커스텀 Hook이든 Hook으로 구성됩니다. 종종 다른 사람이 만든 커스텀 Hook을 사용하게 되겠지만, 가끔은 직접 작성할 수도 있습니다!

다음과 같은 명명 규칙을 따라야 합니다:

1. **React 컴포넌트 이름은 대문자로 시작해야 합니다,** 예를 들어 `StatusBar`와 `SaveButton`처럼. React 컴포넌트는 React가 표시할 수 있는 무언가를 반환해야 합니다, 예를 들어 JSX 조각.
2. **Hook 이름은 `use`로 시작하고 대문자로 시작해야 합니다,** 예를 들어 [`useState`](/reference/react/useState) (내장) 또는 `useOnlineStatus` (커스텀, 이 페이지의 예시처럼). Hook은 임의의 값을 반환할 수 있습니다.

이 규칙을 따르면 컴포넌트를 볼 때 항상 상태, Effect, 및 다른 React 기능이 어디에 "숨겨져" 있는지 알 수 있습니다. 예를 들어, 컴포넌트 내부에서 `getColor()` 함수 호출을 보면, 그 이름이 `use`로 시작하지 않기 때문에 React 상태를 포함할 수 없다는 것을 확신할 수 있습니다. 그러나 `useOnlineStatus()`와 같은 함수 호출은 내부에 다른 Hook 호출을 포함할 가능성이 큽니다!

<Note>

만약 린터가 [React에 맞게 구성되어 있다면,](/learn/editor-setup#linting) 이 명명 규칙을 강제할 것입니다. 위의 샌드박스로 스크롤하여 `useOnlineStatus`를 `getOnlineStatus`로 이름을 변경해 보세요. 린터가 더 이상 `useState`나 `useEffect`를 호출할 수 없도록 허용하지 않는 것을 확인하세요. 오직 Hook과 컴포넌트만이 다른 Hook을 호출할 수 있습니다!

</Note>

<DeepDive>

#### 렌더링 중에 호출되는 모든 함수가 `use` 접두사로 시작해야 하나요? {/*should-all-functions-called-during-rendering-start-with-the-use-prefix*/}

아니요. Hook을 호출하지 않는 함수는 Hook이 될 필요가 없습니다.

함수가 Hook을 호출하지 않는다면, `use` 접두사를 피하고 대신 일반 함수로 작성하세요. 예를 들어, 아래의 `useSorted`는 Hook을 호출하지 않으므로 `getSorted`로 호출하세요:

```js
// 🔴 피해야 함: Hook을 사용하지 않는 Hook
function useSorted(items) {
  return items.slice().sort();
}

// ✅ 좋음: Hook을 사용하지 않는 일반 함수
function getSorted(items) {
  return items.slice().sort();
}
```

이렇게 하면 조건문을 포함한 어디서든 이 일반 함수를 호출할 수 있습니다:

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ Hook이 아니기 때문에 조건부로 getSorted()를 호출해도 괜찮습니다
    displayedItems = getSorted(items);
  }
  // ...
}
```

함수 내부에 적어도 하나의 Hook을 사용하는 경우에만 `use` 접두사를 붙여서 Hook으로 만드세요:

```js
// ✅ 좋음: 다른 Hook을 사용하는 Hook
function useAuth() {
  return useContext(Auth);
}
```

기술적으로, 이는 React에 의해 강제되지 않습니다. 원칙적으로, 다른 Hook을 호출하지 않는 Hook을 만들 수 있습니다. 이는 종종 혼란스럽고 제한적이므로 그 패턴을 피하는 것이 좋습니다. 그러나 드물게 유용할 수 있는 경우가 있습니다. 예를 들어, 현재는 Hook을 사용하지 않지만, 나중에 Hook 호출을 추가할 계획이 있을 수 있습니다. 그런 경우 `use` 접두사로 이름을 붙이는 것이 합리적입니다:

```js {3-4}
// ✅ 좋음: 나중에 다른 Hook을 사용할 가능성이 있는 Hook
function useAuth() {
  // TODO: 인증이 구현되면 이 줄로 대체:
  // return useContext(Auth);
  return TEST_USER;
}
```

그러면 컴포넌트는 조건부로 이를 호출할 수 없습니다. 이는 실제로 Hook 호출을 추가할 때 중요해질 것입니다. 내부에 Hook을 사용할 계획이 없다면 (지금이나 나중에), Hook으로 만들지 마세요.

</DeepDive>

### 커스텀 Hook은 상태 자체가 아닌 상태 로직을 공유합니다 {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

앞의 예제에서 네트워크를 켜고 끌 때 두 컴포넌트가 함께 업데이트되었습니다. 그러나 단일 `isOnline` 상태 변수가 그들 사이에 공유된다고 생각하는 것은 잘못입니다. 이 코드를 보세요:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

이는 중복을 추출하기 전과 동일한 방식으로 작동합니다:

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

이들은 완전히 독립적인 상태 변수와 Effect입니다! 동일한 외부 값(네트워크가 켜져 있는지 여부)으로 동기화했기 때문에 동일한 값을 가졌습니다.

이를 더 잘 설명하기 위해 다른 예제가 필요합니다. 이 `Form` 컴포넌트를 고려해 보세요:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Good morning, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

각 폼 필드에 대해 반복적인 로직이 있습니다:

1. 상태 조각이 있습니다 (`firstName`과 `lastName`).
2. 변경 핸들러가 있습니다 (`handleFirstNameChange`와 `handleLastNameChange`).
3. 해당 입력의 `value`와 `onChange` 속성을 지정하는 JSX 조각이 있습니다.

이 반복적인 로직을 `useFormInput` 커스텀 Hook으로 추출할 수 있습니다:

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        First name:
        <input {...firstNameProps} />
      </label>
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js src/useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

이것은 단 하나의 상태 변수 `value`만 선언합니다.

그러나 `Form` 컴포넌트는 `useFormInput`을 두 번 호출합니다:

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

이것이 두 개의 별도 상태 변수를 선언하는 것처럼 작동하는 이유입니다!

**커스텀 Hook은 상태 자체가 아닌 상태 로직을 공유합니다. Hook에 대한 각 호출은 동일한 Hook에 대한 다른 모든 호출과 완전히 독립적입니다.** 이것이 위의 두 샌드박스가 완전히 동일한 이유입니다. 원한다면 위로 스크롤하여 비교해 보세요. 커스텀 Hook을 추출하기 전과 후의 동작은 동일합니다.

여러 컴포넌트 간에 상태 자체를 공유해야 할 때는 [상태를 올리고 내려서 전달하세요](/learn/sharing-state-between-components).

## Hook 간에 반응형 값 전달하기 {/*passing-reactive-values-between-hooks*/}

커스텀 Hook 내부의 코드는 컴포넌트가 다시 렌더링될 때마다 다시 실행됩니다. 이것이 커스텀 Hook의 코드가 컴포넌트의 본문 일부로 생각되어야 하는 이유입니다!

커스텀 Hook은 컴포넌트와 함께 다시 렌더링되므로 항상 최신 props와 상태를 받습니다. 이것이 무엇을 의미하는지 보려면 이 채팅방 예제를 고려해 보세요. 서버 URL이나 채팅방을 변경해 보세요:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
          <option value="general">general</
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 실제 구현은 서버에 연결할 것입니다
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

`serverUrl`이나 `roomId`를 변경하면 Effect가 [변경 사항에 반응](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)하고 다시 동기화됩니다. 콘솔 메시지를 통해 Effect의 종속성이 변경될 때마다 채팅이 다시 연결되는 것을 알 수 있습니다.

이제 Effect의 코드를 커스텀 Hook으로 이동해 보세요:

```js {2-13}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

이렇게 하면 `ChatRoom` 컴포넌트가 내부 작동 방식을 걱정하지 않고 커스텀 Hook을 호출할 수 있습니다:

```js {4-7}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

이것은 훨씬 더 간단해 보입니다! (하지만 동일한 작업을 수행합니다.)

로직이 여전히 prop과 상태 변경에 반응하는 것을 확인하세요. 서버 URL이나 선택된 방을 편집해 보세요:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 실제 구현은 서버에 연결할 것입니다
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

다음과 같이 한 Hook의 반환 값을 받아서:

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

다른 Hook의 입력으로 전달하는 것을 확인하세요:

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

`ChatRoom` 컴포넌트가 다시 렌더링될 때마다 최신 `roomId`와 `serverUrl`을 Hook에 전달합니다. 이것이 Effect가 다시 렌더링 후 값이 다를 때마다 채팅에 다시 연결되는 이유입니다. (오디오 또는 비디오 처리 소프트웨어를 사용해 본 적이 있다면, Hook을 체인으로 연결하는 것이 시각적 또는 오디오 효과를 체인으로 연결하는 것과 비슷할 수 있습니다. `useState`의 출력이 `useChatRoom`의 입력으로 "공급되는" 것처럼 보입니다.)

### 커스텀 Hook에 이벤트 핸들러 전달하기 {/*passing-event-handlers-to-custom-hooks*/}

<Wip>

이 섹션은 **아직 안정적인 버전의 React에서 릴리스되지 않은** 실험적 API를 설명합니다.

</Wip>

`useChatRoom`을 더 많은 컴포넌트에서 사용하기 시작하면, 컴포넌트가 그 동작을 사용자 정의할 수 있도록 하고 싶을 수 있습니다. 예를 들어, 현재 메시지가 도착했을 때의 로직은 Hook 내부에 하드코딩되어 있습니다:

```js {9-11}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

이 로직을 다시 컴포넌트로 이동하고 싶다고 가정해 보세요:

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });
  // ...
```

이 작업을 수행하려면 커스텀 Hook이 `onReceiveMessage`를 명명된 옵션 중 하나로 받도록 변경하세요:

```js {1,10,13}
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ 모든 종속성 선언됨
}
```

이렇게 하면 작동하지만, 커스텀 Hook이 이벤트 핸들러를 받을 때 더 나은 개선을 할 수 있습니다.

`onReceiveMessage`에 대한 종속성을 추가하는 것은 이상적이지 않습니다. 이는 컴포넌트가 다시 렌더링될 때마다 채팅이 다시 연결되기 때문입니다. [이 이벤트 핸들러를 Effect 이벤트로 래핑하여 종속성에서 제거하세요:](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)

```js {1,4,5,15,18}
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ 모든 종속성 선언됨
}
```

이제 컴포넌트가 다시 렌더링될 때마다 채팅이 다시 연결되지 않습니다. 커스텀 Hook에 이벤트 핸들러를 전달하는 완전한 작동 예제를 아래에서 확인할 수 있습니다:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 실제 구현은 서버에 연결할 것입니다
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
  Toastify({
    text: message,
    duration: 
2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

`useChatRoom`이 어떻게 작동하는지 알 필요가 없다는 점에 주목하세요. 다른 컴포넌트에 추가하고 다른 옵션을 전달해도 동일하게 작동합니다. 이것이 커스텀 Hook의 힘입니다.

## 커스텀 Hook을 사용할 시기 {/*when-to-use-custom-hooks*/}

모든 작은 중복된 코드에 대해 커스텀 Hook을 추출할 필요는 없습니다. 일부 중복은 괜찮습니다. 예를 들어, 단일 `useState` 호출을 감싸는 `useFormInput` Hook을 추출하는 것은 아마도 불필요합니다.

그러나 Effect를 작성할 때마다 커스텀 Hook으로 감싸는 것이 더 명확할지 고려해 보세요. [Effect가 자주 필요하지 않아야 합니다,](/learn/you-might-not-need-an-effect) 따라서 하나를 작성하고 있다면, React 외부로 "나가야" 하거나 React에 내장된 API가 없는 작업을 수행해야 한다는 의미입니다. 커스텀 Hook으로 감싸면 의도와 데이터 흐름을 정확하게 전달할 수 있습니다.

예를 들어, 선택한 도시의 목록을 표시하는 두 개의 드롭다운을 표시하는 `ShippingForm` 컴포넌트를 고려해 보세요. 다음과 같은 코드로 시작할 수 있습니다:

```js {3-16,20-35}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // 이 Effect는 국가에 대한 도시를 가져옵니다
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // 이 Effect는 선택된 도시에 대한 지역을 가져옵니다
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]);

  // ...
```

이 코드는 꽤 반복적이지만, [이 Effect들을 서로 분리하는 것이 올바릅니다.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) 이들은 두 가지 다른 작업을 동기화하므로 하나의 Effect로 병합해서는 안 됩니다. 대신, `ShippingForm` 컴포넌트의 공통 로직을 `useData` Hook으로 추출하여 단순화할 수 있습니다:

```js {2-18}
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

이제 `ShippingForm` 컴포넌트의 두 Effect를 `useData` 호출로 대체할 수 있습니다:

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

커스텀 Hook을 추출하면 데이터 흐름이 명확해집니다. `url`을 입력으로 받고 `data`를 출력으로 받습니다. `useData` 내부에 Effect를 "숨기면" `ShippingForm` 컴포넌트에서 [불필요한 종속성](/learn/removing-effect-dependencies)을 추가하는 것을 방지할 수 있습니다. 시간이 지나면 대부분의 앱의 Effect는 커스텀 Hook에 있을 것입니다.

<DeepDive>

#### 커스텀 Hook을 구체적인 고수준 사용 사례에 집중시키세요 {/*keep-your-custom-hooks-focused-on-concrete-high-level-use-cases*/}

커스텀 Hook의 이름을 선택하는 것부터 시작하세요. 명확한 이름을 선택하는 데 어려움을 겪는다면, Effect가 컴포넌트의 다른 로직과 너무 결합되어 있고 아직 추출할 준비가 되지 않았다는 의미일 수 있습니다.

이상적으로는, 커스텀 Hook의 이름이 코드 작성 경험이 없는 사람도 커스텀 Hook이 무엇을 하는지, 무엇을 받는지, 무엇을 반환하는지에 대해 좋은 추측을 할 수 있을 만큼 명확해야 합니다:

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `useChatRoom(options)`

외부 시스템과 동기화할 때, 커스텀 Hook 이름은 더 기술적일 수 있으며 해당 시스템에 특정한 용어를 사용할 수 있습니다. 해당 시스템에 익숙한 사람에게 명확하다면 좋습니다:

* ✅ `useMediaQuery(query)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**커스텀 Hook을 구체적인 고수준 사용 사례에 집중시키세요.** `useEffect` API 자체의 대안 및 편의 래퍼로 작동하는 커스텀 "라이프사이클" Hook을 만들고 사용하는 것을 피하세요:

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

예를 들어, 이 `useMount` Hook은 일부 코드가 "마운트 시"에만 실행되도록 하려고 합니다:

```js {4-5,14-15}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 🔴 피해야 함: 커스텀 "라이프사이클" Hook 사용
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 피해야 함: 커스텀 "라이프사이클" Hook 만들기
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 React Hook useEffect에 누락된 종속성: 'fn'
}
```

**`useMount`와 같은 커스텀 "라이프사이클" Hook은 React 패러다임에 잘 맞지 않습니다.** 예를 들어, 이 코드 예제에는 실수가 있습니다 (이는 `roomId`나 `serverUrl` 변경에 "반응"하지 않습니다), 그러나 린터는 이에 대해 경고하지 않습니다. 린터는 직접적인 `useEffect` 호출만 확인합니다. 커스텀 Hook에 대해서는 알지 못합니다.

Effect를 작성할 때는 React API를 직접 사용하는 것부터 시작하세요:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ 좋음: 목적에 따라 분리된 두 개의 원시 Effect

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

그런 다음, (반드시 해야 하는 것은 아니지만) 다양한 고수준 사용 사례에 대한 커스텀 Hook을 추출할 수 있습니다:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ 훌륭함: 목적에 따라 이름이 지정된 커스텀 Hook
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**좋은 커스텀 Hook은 호출 코드를 더 선언적으로 만들어 그 기능을 제한합니다.** 예를 들어, `useChatRoom(options)`은 채팅방에만 연결할 수 있고, `useImpressionLog(eventName, extraData)`는 인상 로그를 분석에만 보낼 수 있습니다. 커스텀 Hook API가 사용 사례를 제한하지 않고 매우 추상적이라면, 장기적으로는 해결하는 것보다 더 많은 문제를 일으킬 가능성이 큽니다.

</DeepDive>

### 커스텀 Hook은 더 나은 패턴으로 마이그레이션하는 데 도움이 됩니다 {/*custom-hooks-help-you-migrate-to-better-patterns*/}

Effect는 ["탈출구"](/learn/escape-hatches)입니다: React 외부로 "나가야" 할 때와 해당 사용 사례에 대한 더 나은 내장 솔루션이 없을 때 사용합니다. 시간이 지나면서 React 팀의 목표는 더 구체적인 문제에 대한 더 구체적인 솔루션을 제공하여 앱의 Effect 수를 최소화하는 것입니다. Effect를 커스텀 Hook으로 감싸면 이러한 솔루션이 제공될 때 코드를 업그레이드하기가 더 쉬워집니다.

이 예제로 돌아가 보겠습니다:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js active
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

위의 예제에서 `useOnlineStatus`는 [`useState`](/reference/react/useState)와 [`useEffect`](/reference/react/useEffect)의 쌍으로 구현되었습니다. 그러나 이것이 최선의 해결책은 아닙니다. 고려하지 않은 여러 엣지 케이스가 있습니다. 예를 들어, 컴포넌트가 마운트될 때 `isOnline`이 이미 `true`라고 가정하지만, 네트워크가 이미 오프라인으로 전환된 경우 이는 잘못될 수 있습니다. 브라우저 [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) API를 사용하여 이를 확인할 수 있지만, 이를 직접 사용하는 것은 초기 HTML을 생성하는 서버에서는 작동하지 않습니다. 요컨대, 이 코드는 개선될 수 있습니다.

다행히도, React 18에는 이러한 모든 문제를 해결하는 전용 API인 [`useSyncExternalStore`](/reference/react/useSyncExternalStore)가 포함되어 있습니다. 다음은 이 새로운 API를 활용하도록 `useOnlineStatus` Hook을 다시 작성한 예입니다:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js active
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // 클라이언트에서 값을 가져오는 방법
    () => true // 서버에서 값을 가져오는 방법
  );
}

```

</Sandpack>

**컴포넌트를 변경할 필요가 없었다는 점에 주목하세요**:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

이것이 Effect를 커스텀 Hook으로 감싸는 것이 종종 유익한 또 다른 이유입니다:

1. 데이터 흐름을 매우 명확하게 만듭니다.
2. 컴포넌트가 의도에 집중할 수 있도록 하고, Effect의 정확한 구현에 집중하지 않도록 합니다.
3. React가 새로운 기능을 추가할 때, 컴포넌트의 변경 없이 Effect를 제거할 수 있습니다.

[디자인 시스템](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969)과 유사하게, 앱의 컴포넌트에서 공통적인 관용구를 커스텀 Hook으로 추출하는 것이 도움이 될 수 있습니다. 이렇게 하면 컴포넌트의 코드가 의도에 집중할 수 있고, 원시 Effect를 자주 작성하지 않아도 됩니다. 많은 훌륭한 커스텀 Hook은 React 커뮤니티에 의해 유지 관리됩니다.

<DeepDive>

#### React가 데이터 가져오기에 대한 내장 솔루션을 제공할까요? {/*will-react-provide-any-built-in-solution-for-data-fetching*/}

우리는 아직 세부 사항을 정리 중이지만, 미래에는 다음과 같이 데이터 가져오기를 작성할 수 있을 것으로 기대합니다:

```js {1,4,6}
import { use } from 'react'; // 아직 사용 불가!

function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```

앱에서 위의 `useData`와 같은 커스텀 Hook을 사용하면, 결국 권장되는 접근 방식으로 마이그레이션하는 데 필요한 변경 사항이 줄어들 것입니다. 그러나 이전 접근 방식도 여전히 잘 작동할 것이므로, 원시 Effect를 작성하는 것이 더 편하다면 계속 그렇게 할 수 있습니다.

</DeepDive>

### 여러 가지 방법이 있습니다 {/*there-is-more-than-one-way-to-do-it*/}

*requestAnimationFrame* API를 사용하여 *스크래치*에서 페이드 인 애니메이션을 구현하고 싶다고 가정해 보겠습니다. 애니메이션 루프를 설정하는 Effect로 시작할 수 있습니다. 애니메이션의 각 프레임 동안, DOM 노드의 불투명도를 `1`에 도달할 때까지 변경할 수 있습니다. 다음과 같은 코드로 시작할 수 있습니다:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // 아직 더 많은 프레임을 그려야 합니다
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
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

```css
label, button { display: block; margin-bottom: 20px; }
html, body
{ min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

컴포넌트를 더 읽기 쉽게 만들기 위해 로직을 `useFadeIn` 커스텀 Hook으로 추출할 수 있습니다:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
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

```js src/useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // 아직 더 많은 프레임을 그려야 합니다
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

`useFadeIn` 코드를 그대로 유지할 수도 있지만, 더 리팩터링할 수도 있습니다. 예를 들어, 애니메이션 루프를 설정하는 로직을 `useFadeIn`에서 `useAnimationLoop` 커스텀 Hook으로 추출할 수 있습니다:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
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

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEffectEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();
    let frameId = null;

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

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

</Sandpack>

그러나 반드시 그렇게 해야 하는 것은 아닙니다. 일반 함수와 마찬가지로, 코드의 경계를 어디에 그릴지 궁극적으로 결정하는 것은 여러분입니다. 또한 매우 다른 접근 방식을 취할 수도 있습니다. Effect 내부에 로직을 유지하는 대신, 대부분의 명령형 로직을 JavaScript [클래스](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) 내부로 이동할 수 있습니다:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
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

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress === 1) {
      this.stop();
    } else {
      // 아직 더 많은 프레임을 그려야 합니다
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
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
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Effect는 React를 외부 시스템에 연결할 수 있게 해줍니다. 더 많은 조정이 필요한 경우 (예: 여러 애니메이션을 체인으로 연결하는 경우), Effect와 Hook에서 로직을 완전히 추출하는 것이 더 합리적입니다. 그런 다음, 추출한 코드가 "외부 시스템"이 됩니다. 이렇게 하면 Effect가 단순해지고, React 외부로 이동한 시스템에 메시지를 보내기만 하면 됩니다.

위의 예제는 페이드 인 로직이 JavaScript로 작성되어야 한다고 가정합니다. 그러나 이 특정 페이드 인 애니메이션은 단순히 [CSS 애니메이션](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)으로 구현하는 것이 훨씬 더 간단하고 효율적입니다:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import './welcome.css';

function Welcome() {
  return (
    <h1 className="welcome">
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

```css src/styles.css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

```css src/welcome.css active
.welcome {
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);

  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

```

</Sandpack>

때로는 Hook이 필요하지 않습니다!

<Recap>

- 커스텀 Hook은 컴포넌트 간에 로직을 공유할 수 있게 해줍니다.
- 커스텀 Hook은 항상 `use`로 시작하고 대문자로 시작해야 합니다.
- 커스텀 Hook은 상태 자체가 아닌 상태 로직을 공유합니다.
- 한 Hook에서 다른 Hook으로 반응형 값을 전달할 수 있으며, 최신 상태를 유지합니다.
- 모든 Hook은 컴포넌트가 다시 렌더링될 때마다 다시 실행됩니다.
- 커스텀 Hook의 코드는 컴포넌트의 코드처럼 순수해야 합니다.
- 커스텀 Hook이 받는 이벤트 핸들러를 Effect 이벤트로 래핑하세요.
- `useMount`와 같은 커스텀 Hook을 만들지 마세요. 그 목적을 구체적으로 유지하세요.
- 코드의 경계를 어디에 그릴지 선택하는 것은 여러분에게 달려 있습니다.

</Recap>

<Challenges>

#### `useCounter` Hook 추출하기 {/*extract-a-usecounter-hook*/}

이 컴포넌트는 상태 변수와 Effect를 사용하여 매초 증가하는 숫자를 표시합니다. 이 로직을 `useCounter`라는 커스텀 Hook으로 추출하세요. 목표는 `Counter` 컴포넌트 구현이 다음과 같아야 합니다:

```js
export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

커스텀 Hook을 `useCounter.js` 파일에 작성하고 `Counter.js` 파일에 가져오세요.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
// 이 파일에 커스텀 Hook을 작성하세요!
```

</Sandpack>

<Solution>

코드는 다음과 같아야 합니다:

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

`App.js`는 더 이상 `useState`나 `useEffect`를 가져올 필요가 없습니다.

</Solution>

#### 카운터 지연 시간을 구성 가능하게 만들기 {/*make-the-counter-delay-configurable*/}

이 예제에서는 슬라이더로 제어되는 `delay` 상태 변수가 있지만, 그 값은 사용되지 않습니다. `delay` 값을 커스텀 `useCounter` Hook에 전달하고, `useCounter` Hook이 하드코딩된 `1000` ms 대신 전달된 `delay`를 사용하도록 변경하세요.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter();
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

<Solution>

`useCounter(delay)`로 Hook에 `delay`를 전달하세요. 그런 다음, Hook 내부에서 하드코딩된 `1000` 값 대신 `delay`를 사용하세요. Effect의 종속성에 `delay`를 추가해야 합니다. 이렇게 하면 `delay`가 변경될 때마다 간격이 재설정됩니다.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

</Sandpack>

</Solution>

#### `useCounter`에서 `useInterval` 추출하기 {/*extract-useinterval-out-of-usecounter*/}

현재 `useCounter` Hook은 두 가지 작업을 수행합니다. 간격을 설정하고, 간격 틱마다 상태 변수를 증가시킵니다. 간격을 설정하는 로직을 `useInterval`이라는 별도의 Hook으로 분리하세요. 이 Hook은 두 개의 인수를 받아야 합니다: `onTick` 콜백과 `delay`. 이 변경 후, `useCounter` 구현은 다음과 같아야 합니다:

```js
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

`useInterval`을 `useInterval.js` 파일에 작성하고 `useCounter.js` 파일에 가져오세요.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

```js src/useInterval.js
// 여기에 Hook을 작성하세요!
```

</Sandpack>

<Solution>

`useInterval` 내부의 로직은 간격을 설정하고 지우는 것입니다. 다른 작업은 필요하지 않습니다.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [onTick, delay]);
}
```

</Sandpack>

이 솔루션에는 약간의 문제가 있습니다. 다음 챌린지에서 해결할 것입니다.

</Solution>

#### 간격 재설정 문제 해결하기 {/*fix-a-resetting-interval*/}

이 예제에서는 *두 개*의 별도 간격이 있습니다.

`App` 컴포넌트는 `useCounter`를 호출하여 매초 카운터를 업데이트하는 `useInterval`을 호출합니다. 그러나 `App` 컴포넌트는 *또한* 페이지 배경색을 2초마다 무작위로 업데이트하는 `useInterval`을 호출합니다.

어떤 이유로 페이지 배경을 업데이트하는 콜백이 실행되지 않습니다. `useInterval` 내부에 몇 가지 로그를 추가해 보세요:

```js {2,5}
  useEffect(() => {
    console.log('✅ Setting up an interval with delay ', delay)
    const id = setInterval(onTick, delay);
    return () => {
      console.log('❌ Clearing an interval with delay ', delay)
      clearInterval(id);
    };
  }, [onTick, delay]);
```

로그가 예상한 대로 일치하나요? 일부 Effect가 불필요하게 다시 동기화되는 것 같다면, 어떤 종속성이 이를 유발하는지 추측할 수 있나요? Effect의 종속성에서 이를 제거할 방법이 있나요?

문제를 해결한 후에는 페이지 배경이 2초마다 업데이트되는 것을 기대할 수 있습니다.

<Hint>

`useInterval` Hook이 이벤트 리스너를 인수로 받는 것 같습니다. 이 이벤트 리스너를 래핑하여 Effect의 종속성으로 포함할 필요가 없도록 할 방법이 있나요?

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

</Sandpack>

<Solution>

`useInterval` 내부에서 틱 콜백을 Effect 이벤트로 래핑하세요. 이렇게 하면 `onTick`을 Effect의 종속성에서 생략할 수 있습니다. Effect는 컴포넌트가 다시 렌더링될 때마다 다시 동기화되지 않으므로, 페이지 배경색 변경 간격이 매초 재설정되지 않습니다.

이 변경으로 두 간격이 예상대로 작동하고 서로 간섭하지 않습니다:

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

</Sandpack>

</Solution>

#### 스태거링 이동 구현하기 {/*implement-a-staggering-movement*/}

이 예제에서 `usePointerPosition()` Hook은 현재 포인터 위치를 추적합니다. 미리보기 영역 위로 커서나 손가락을 이동해 보세요. 빨간 점이 움직임을 따라가는 것을 볼 수 있습니다. 그 위치는 `pos1` 변수에 저장됩니다.

사실, 다섯 (!) 개의 다른 빨간 점이 렌더링되고 있습니다. 현재 모두 같은 위치에 나타나기 때문에 보이지 않습니다. 이를 수정해야 합니다. 구현하고자 하는 것은 "스태거링" 이동입니다: 각 점이 이전 점의 경로를 따라가야 합니다. 예를 들어, 커서를 빠르게 이동하면 첫 번째 점이 즉시 따라가고, 두 번째 점이 첫 번째 점을 약간의 지연 후 따라가고, 세 번째 점이 두 번째 점을 따라가고, 이런 식으로 계속됩니다.

`useDelayedValue` 커스텀 Hook을 구현해야 합니다. 현재 구현은 제공된 `value`를 반환합니다. 대신, `delay` 밀리초 전의 값을 반환하고자 합니다. 이를 위해 상태와 Effect가 필요할 수 있습니다.

`useDelayedValue`를 구현한 후, 점들이 서로를 따라 움직이는 것을 볼 수 있어야 합니다.

<Hint>

커스텀 Hook 내부에 `delayedValue`를 상태 변수로 저장해야 합니다. `value`가 업데이트되면 Effect를 실행하고, 이 Effect는 `delay` 후에 `delayedValue`를 업데이트해야 합니다. `setTimeout`을 호출하는 것이 도움이 될 수 있습니다.

이 Effect는 정리가 필요할까요? 왜 그렇거나 그렇지 않은가요?

</Hint>

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  // TODO: 이 Hook을 구현하세요
  return value;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```css
body { min-height: 300px; }
```

</Sandpack>

<Solution>

다음은 작동하는 버전입니다. `delayedValue`를 상태 변수로 유지합니다. `value`가 업데이트되면 Effect가 타임아웃을 예약하여 `delayedValue`를 업데이트합니다. 이렇게 하면 `delayedValue`가 항상 실제 `value`보다 "뒤처지게" 됩니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```css
body { min-height: 300px; }
```

</Sandpack>

이 Effect는 정리가 필요하지 않습니다. 정리 함수에서 `clearTimeout`을 호출하면, `value`가 변경될 때마다 이미 예약된 타임아웃이 재설정됩니다. 이동을 연속적으로 유지하려면 모든 타임아웃이 실행되도록 해야 합니다.

</Solution>

</Challenges>