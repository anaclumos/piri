---
title: <StrictMode>
---

<Intro>

`<StrictMode>`는 개발 중에 컴포넌트에서 일반적인 버그를 조기에 발견할 수 있게 해줍니다.


```js
<StrictMode>
  <App />
</StrictMode>
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `<StrictMode>` {/*strictmode*/}

`StrictMode`를 사용하여 컴포넌트 트리 내부에 추가 개발 동작 및 경고를 활성화합니다:

```js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

Strict Mode는 다음과 같은 개발 전용 동작을 활성화합니다:

- 불순한 렌더링으로 인한 버그를 찾기 위해 컴포넌트가 [추가로 한 번 더 렌더링됩니다](#fixing-bugs-found-by-double-rendering-in-development).
- Effect 정리가 누락되어 발생하는 버그를 찾기 위해 컴포넌트가 [Effect를 추가로 한 번 더 실행합니다](#fixing-bugs-found-by-re-running-effects-in-development).
- 컴포넌트가 [사용 중인 폐기 예정 API를 검사합니다.](#fixing-deprecation-warnings-enabled-by-strict-mode)

#### Props {/*props*/}

`StrictMode`는 props를 받지 않습니다.

#### 주의사항 {/*caveats*/}

* `<StrictMode>`로 감싸진 트리 내부에서 Strict Mode를 선택 해제할 수 있는 방법은 없습니다. 이는 `<StrictMode>` 내부의 모든 컴포넌트가 검사된다는 확신을 줍니다. 제품을 개발하는 두 팀이 이러한 검사가 유용한지 여부에 대해 동의하지 않는 경우, 합의를 이루거나 `<StrictMode>`를 트리 아래로 이동해야 합니다.

---

## 사용법 {/*usage*/}

### 전체 앱에 Strict Mode 활성화하기 {/*enabling-strict-mode-for-entire-app*/}

Strict Mode는 `<StrictMode>` 컴포넌트 내부의 전체 컴포넌트 트리에 대해 추가 개발 전용 검사를 활성화합니다. 이러한 검사는 개발 과정 초기에 컴포넌트에서 일반적인 버그를 찾는 데 도움이 됩니다.

전체 앱에 Strict Mode를 활성화하려면, 루트 컴포넌트를 렌더링할 때 `<StrictMode>`로 감싸세요:

```js {6,8}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

특히 새로 생성된 앱의 경우 전체 앱을 Strict Mode로 감싸는 것을 권장합니다. `createRoot`를 호출하는 프레임워크를 사용하는 경우, 해당 프레임워크의 문서를 참조하여 Strict Mode를 활성화하는 방법을 확인하세요.

Strict Mode 검사는 **개발 중에만 실행되지만,** 코드에 이미 존재하지만 프로덕션에서 재현하기 어려운 버그를 찾는 데 도움이 됩니다. Strict Mode를 사용하면 사용자 보고 전에 버그를 수정할 수 있습니다.

<Note>

Strict Mode는 개발 중에 다음 검사를 활성화합니다:

- 불순한 렌더링으로 인한 버그를 찾기 위해 컴포넌트가 [추가로 한 번 더 렌더링됩니다](#fixing-bugs-found-by-double-rendering-in-development).
- Effect 정리가 누락되어 발생하는 버그를 찾기 위해 컴포넌트가 [Effect를 추가로 한 번 더 실행합니다](#fixing-bugs-found-by-re-running-effects-in-development).
- 컴포넌트가 [사용 중인 폐기 예정 API를 검사합니다.](#fixing-deprecation-warnings-enabled-by-strict-mode)

**이 모든 검사는 개발 전용이며 프로덕션 빌드에는 영향을 미치지 않습니다.**

</Note>

---

### 앱의 일부에 Strict Mode 활성화하기 {/*enabling-strict-mode-for-a-part-of-the-app*/}

애플리케이션의 일부에 대해서도 Strict Mode를 활성화할 수 있습니다:

```js {7,12}
import { StrictMode } from 'react';

function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </>
  );
}
```

이 예제에서 Strict Mode 검사는 `Header`와 `Footer` 컴포넌트에 대해 실행되지 않습니다. 그러나 `Sidebar`와 `Content` 및 그 내부의 모든 컴포넌트에 대해서는 실행됩니다.

---

### 개발 중에 이중 렌더링으로 발견된 버그 수정하기 {/*fixing-bugs-found-by-double-rendering-in-development*/}

[React는 작성한 모든 컴포넌트가 순수 함수라고 가정합니다.](/learn/keeping-components-pure) 이는 React 컴포넌트가 동일한 입력(Props, State, Context)을 받으면 항상 동일한 JSX를 반환해야 함을 의미합니다.

이 규칙을 어기는 컴포넌트는 예측할 수 없는 동작을 하며 버그를 유발합니다. 실수로 불순한 코드를 찾는 데 도움이 되도록 Strict Mode는 **개발 중에** 일부 함수(순수해야 하는 함수만)를 두 번 호출합니다. 여기에는 다음이 포함됩니다:

- 컴포넌트 함수 본문(이벤트 핸들러 내부의 코드는 포함되지 않음)
- [`useState`](/reference/react/useState), [`set` 함수](/reference/react/useState#setstate), [`useMemo`](/reference/react/useMemo), 또는 [`useReducer`](/reference/react/useReducer)에 전달하는 함수
- [`constructor`](/reference/react/Component#constructor), [`render`](/reference/react/Component#render), [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate)와 같은 일부 클래스 컴포넌트 메서드 ([전체 목록 보기](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects))

함수가 순수하다면, 두 번 실행해도 동일한 결과를 생성하므로 동작이 변경되지 않습니다. 그러나 함수가 불순한 경우(예: 받은 데이터를 변경하는 경우), 두 번 실행하면 눈에 띄게 됩니다(이것이 불순한 이유입니다!). 이는 버그를 조기에 발견하고 수정하는 데 도움이 됩니다.

**다음은 Strict Mode에서 이중 렌더링이 버그를 조기에 발견하는 데 어떻게 도움이 되는지 설명하는 예제입니다.**

이 `StoryTray` 컴포넌트는 `stories` 배열을 받아 마지막에 "Create Story" 항목을 추가합니다:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

위 코드에는 실수가 있습니다. 그러나 초기 출력이 올바르게 보이기 때문에 쉽게 놓칠 수 있습니다.

`StoryTray` 컴포넌트가 여러 번 다시 렌더링되면 이 실수가 더 눈에 띄게 됩니다. 예를 들어, `StoryTray`가 마우스를 올릴 때마다 다른 배경색으로 다시 렌더링되도록 해보겠습니다:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

`StoryTray` 컴포넌트에 마우스를 올릴 때마다 "Create Story"가 목록에 다시 추가되는 것을 볼 수 있습니다. 코드의 의도는 한 번만 추가하는 것이었지만, `StoryTray`는 props에서 받은 `stories` 배열을 직접 수정합니다. `StoryTray`가 렌더링될 때마다 동일한 배열 끝에 "Create Story"를 다시 추가합니다. 즉, `StoryTray`는 순수 함수가 아니며, 여러 번 실행하면 다른 결과를 생성합니다.

이 문제를 해결하려면 배열을 복사하고 원본 대신 복사본을 수정할 수 있습니다:

```js {2}
export default function StoryTray({ stories }) {
  const items = stories.slice(); // 배열을 복제합니다
  // ✅ 좋음: 새로운 배열에 추가합니다
  items.push({ id: 'create', label: 'Create Story' });
```

이렇게 하면 [`StoryTray` 함수가 순수해집니다.](/learn/keeping-components-pure) 호출될 때마다 배열의 새 복사본만 수정하고 외부 객체나 변수를 변경하지 않습니다. 이렇게 하면 버그가 해결되지만, 컴포넌트를 더 자주 다시 렌더링해야 잘못된 동작이 명확해집니다.

**원래 예제에서는 버그가 명확하지 않았습니다. 이제 원래의 (버그가 있는) 코드를 `<StrictMode>`로 감싸보겠습니다:**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

**Strict Mode는 항상 렌더링 함수를 두 번 호출하므로 실수를 바로 확인할 수 있습니다** ("Create Story"가 두 번 나타남). 이렇게 하면 이러한 실수를 조기에 발견할 수 있습니다. Strict Mode에서 컴포넌트를 렌더링하도록 수정하면, 이전의 hover 기능과 같은 많은 잠재적인 프로덕션 버그도 수정됩니다:

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories.slice(); // 배열을 복제합니다
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Strict Mode 없이도 버그를 놓치기 쉬웠지만, Strict Mode는 동일한 버그를 즉시 나타나게 했습니다. Strict Mode는 팀과 사용자에게 버그를 전달하기 전에 버그를 찾는 데 도움이 됩니다.

[컴포넌트를 순수하게 유지하는 방법에 대해 더 읽어보세요.](/learn/keeping-components-pure)

<Note>

[React DevTools](/learn/react-developer-tools)을 설치한 경우, 두 번째 렌더링 호출 중 `console.log` 호출은 약간 흐리게 나타납니다. React DevTools는 이를 완전히 억제하는 설정(기본적으로 꺼짐)도 제공합니다.

</Note>

---

### 개발 중에 Effect를 다시 실행하여 발견된 버그 수정하기 {/*fixing-bugs-found-by-re-running-effects-in-development*/}

Strict Mode는 [Effects](/learn/synchronizing-with-effects)에서도 버그를 찾는 데 도움이 됩니다.

모든 Effect에는 일부 설정 코드가 있으며, 일부 정리 코드가 있을 수 있습니다. 일반적으로 React는 컴포넌트가 *마운트*될 때(화면에 추가될 때) 설정을 호출하고, 컴포넌트가 *언마운트*될 때(화면에서 제거될 때) 정리를 호출합니다. 그런 다음 React는 마지막 렌더링 이후 종속성이 변경된 경우 정리 및 설정을 다시 호출합니다.

Strict Mode가 켜져 있으면, React는 **모든 Effect에 대해 개발 중에 추가로 한 번의 설정+정리 사이클을 실행합니다.** 이는 놀라울 수 있지만, 수동으로 잡기 어려운 미묘한 버그를 드러내는 데 도움이 됩니다.

**다음은 Strict Mode에서 Effect를 다시 실행하여 버그를 조기에 발견하는 데 도움이 되는 예제입니다.**

채팅에 컴포넌트를 연결하는 예제를 고려해보세요:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './<App />);

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // 실제 구현은 서버에 연결합니다
  return {
    connect() {
      console.log('✅ "' + roomId + '" 방에 ' + serverUrl + '에 연결 중...');
      connections++;
      console.log('활성 연결: ' + connections);
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 ' + serverUrl + ' 연결 해제');
      connections--;
      console.log('활성 연결: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

이 코드에는 문제가 있지만, 즉시 명확하지 않을 수 있습니다.

문제를 더 명확하게 하기 위해 기능을 구현해 보겠습니다. 아래 예제에서는 `roomId`가 하드코딩되지 않습니다. 대신 사용자가 드롭다운에서 연결할 `roomId`를 선택할 수 있습니다. "Open chat"을 클릭한 다음, 하나씩 다른 채팅방을 선택하세요. 콘솔에서 활성 연결 수를 확인하세요:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        채팅방 선택:{' '}
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
        {show ? '채팅 닫기' : '채팅 열기'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // 실제 구현은 서버에 연결합니다
  return {
    connect() {
      console.log('✅ "' + roomId + '" 방에 ' + serverUrl + '에 연결 중...');
      connections++;
      console.log('활성 연결: ' + connections);
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 ' + serverUrl + ' 연결 해제');
      connections--;
      console.log('활성 연결: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

활성 연결 수가 계속 증가하는 것을 알 수 있습니다. 실제 앱에서는 성능 및 네트워크 문제가 발생할 수 있습니다. 문제는 [Effect에 정리 함수가 누락되었기 때문입니다:](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)

```js {4}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
```

이제 Effect가 "자신을 정리"하고 오래된 연결을 파괴하므로 누수가 해결되었습니다. 그러나 문제는 더 많은 기능(선택 상자)을 추가할 때까지 명확하지 않았습니다.

**원래 예제에서는 버그가 명확하지 않았습니다. 이제 원래의 (버그가 있는) 코드를 `<StrictMode>`로 감싸보겠습니다:**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // 실제 구현은 서버에 연결합니다
  return {
    connect() {
      console.log('✅ "' + roomId + '" 방에 ' + serverUrl + '에 연결 중...');
      connections++;
      console.log('활성 연결: ' + connections);
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 ' + serverUrl + ' 연결 해제');
      connections--;
      console.log('활성 연결: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

**Strict Mode를 사용하면 문제가 있다는 것을 즉시 알 수 있습니다** (활성 연결 수가 2로 증가). Strict Mode는 모든 Effect에 대해 추가 설정+정리 사이클을 실행합니다. 이 Effect에는 정리 로직이 없으므로 추가 연결을 생성하지만 이를 파괴하지 않습니다. 이는 정리 함수가 누락되었음을 나타냅니다.

Strict Mode는 이러한 실수를 조기에 발견할 수 있게 해줍니다. Strict Mode에서 Effect를 정리 함수로 수정하면, 이전의 선택 상자와 같은 많은 잠재적인 프로덕션 버그도 수정됩니다:

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

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
        채팅방 선택:{' '}
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
        {show ? '채팅 닫기' : '채팅 열기'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // 실제 구현은 서버에 연결합니다
  return {
    connect() {
      console.log('✅ "' + roomId + '" 방에 ' + serverUrl + '에 연결 중...');
      connections++;
      console.log('활성 연결: ' + connections);
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 ' + serverUrl + ' 연결 해제');
      connections--;
      console.log('활성 연결: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

활성 연결 수가 더 이상 증가하지 않는 것을 확인할 수 있습니다.

Strict Mode 없이도 Effect에 정리가 필요하다는 것을 놓치기 쉬웠습니다. Strict Mode는 개발 중에 Effect에 대해 *설정 → 정리 → 설정*을 실행하여 누락된 정리 로직을 더 눈에 띄게 만들었습니다.

[Effect 정리 구현에 대해 더 읽어보세요.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---

### Strict Mode로 활성화된 폐기 예정 경고 수정하기 {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}

React는 `<StrictMode>` 트리 내부의 일부 컴포넌트가 다음과 같은 폐기 예정 API를 사용하는 경우 경고합니다:

* [`findDOMNode`](/reference/react-dom/findDOMNode). [대안 보기](https://reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)
* `UNSAFE_` 클래스 생명주기 메서드, 예를 들어 [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount). [대안 보기](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles)
* 레거시 컨텍스트 ([`childContextTypes`](/reference/react/Component#static-childcontexttypes), [`contextTypes`](/reference/react/Component#static-contexttypes), 및 [`getChildContext`](/reference/react/Component#getchildcontext)). [대안 보기](/reference/react/createContext)
* 레거시 문자열 refs ([`this.refs`](/reference/react/Component#refs)). [대안 보기](https://reactjs.org/docs/strict-mode.html#warning-about-legacy-string-ref-api-usage)

이 API는 주로 오래된 [클래스 컴포넌트](/reference/react/Component)에서 사용되므로 현대 앱에서는 거의 나타나지 않습니다.