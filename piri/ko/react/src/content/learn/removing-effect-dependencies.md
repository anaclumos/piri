---
title: Effect 종속성 제거
---

<Intro>

Effect를 작성할 때, 린터는 Effect가 읽는 모든 반응형 값(예: props와 state)을 Effect의 종속성 목록에 포함했는지 확인합니다. 이는 Effect가 컴포넌트의 최신 props와 state와 동기화된 상태를 유지하도록 보장합니다. 불필요한 종속성은 Effect가 너무 자주 실행되거나 무한 루프를 생성할 수 있습니다. 이 가이드를 따라 Effect에서 불필요한 종속성을 검토하고 제거하세요.

</Intro>

<YouWillLearn>

- 무한 Effect 종속성 루프를 수정하는 방법
- 종속성을 제거하고 싶을 때 해야 할 일
- "반응"하지 않고 Effect에서 값을 읽는 방법
- 객체 및 함수 종속성을 피해야 하는 이유와 방법
- 종속성 린터를 억제하는 것이 위험한 이유와 대신 해야 할 일

</YouWillLearn>

## 종속성은 코드와 일치해야 합니다 {/*dependencies-should-match-the-code*/}

Effect를 작성할 때, 먼저 Effect가 수행하려는 작업을 [시작하고 중지하는 방법](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)을 지정합니다:

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  	// ...
}
```

그런 다음, Effect 종속성을 비워두면 (`[]`), 린터는 올바른 종속성을 제안할 것입니다:

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
  }, []); // <-- 여기에서 실수를 수정하세요!
  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 실제 구현은 서버에 연결할 것입니다
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

린터가 말하는 대로 채워 넣으세요:

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 모든 종속성 선언됨
  // ...
}
```

[Effects는 반응형 값에 "반응"합니다.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) `roomId`는 반응형 값이므로(리렌더링으로 인해 변경될 수 있음), 린터는 이를 종속성으로 지정했는지 확인합니다. `roomId`가 다른 값을 받으면 React는 Effect를 다시 동기화합니다. 이는 채팅이 선택된 방에 연결된 상태를 유지하고 드롭다운에 "반응"하도록 보장합니다:

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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 실제 구현은 서버에 연결할 것입니다
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

### 종속성을 제거하려면, 종속성이 아님을 증명하세요 {/*to-remove-a-dependency-prove-that-its-not-a-dependency*/}

Effect의 종속성을 "선택"할 수 없다는 점에 유의하세요. Effect 코드에서 사용하는 모든 <CodeStep step={2}>반응형 값</CodeStep>은 종속성 목록에 선언되어야 합니다. 종속성 목록은 주변 코드에 의해 결정됩니다:

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // 이것은 반응형 값입니다
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // 이 Effect는 그 반응형 값을 읽습니다
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 따라서 그 반응형 값을 Effect의 종속성으로 지정해야 합니다
  // ...
}
```

[반응형 값](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive)에는 props와 컴포넌트 내부에 직접 선언된 모든 변수와 함수가 포함됩니다. `roomId`는 반응형 값이므로 종속성 목록에서 제거할 수 없습니다. 린터가 이를 허용하지 않을 것입니다:

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect에 누락된 종속성: 'roomId'
  // ...
}
```

그리고 린터가 맞습니다! `roomId`는 시간이 지남에 따라 변경될 수 있으므로, 이는 코드에 버그를 도입할 수 있습니다.

**종속성을 제거하려면, 린터에게 그것이 *종속성이 아님*을 "증명"해야 합니다.** 예를 들어, `roomId`를 컴포넌트 외부로 이동하여 그것이 반응형이 아니며 리렌더링 시 변경되지 않음을 증명할 수 있습니다:

```js {2,9}
const serverUrl = 'https://localhost:1234';
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

이제 `roomId`가 반응형 값이 아니며(리렌더링 시 변경될 수 없음), 더 이상 종속성이 필요하지 않습니다:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 실제 구현은 서버에 연결할 것입니다
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

이제 [빈 (`[]`) 종속성 목록을 지정할 수 있습니다.](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) Effect는 더 이상 반응형 값에 의존하지 않으므로, 컴포넌트의 props나 state가 변경될 때 다시 실행될 필요가 없습니다.

### 종속성을 변경하려면, 코드를 변경하세요 {/*to-change-the-dependencies-change-the-code*/}

워크플로에서 패턴을 발견했을 수 있습니다:

1. 먼저, Effect의 코드나 반응형 값이 선언된 방식을 **변경**합니다.
2. 그런 다음, 린터를 따라 종속성을 **변경된 코드에 맞게 조정**합니다.
3. 종속성 목록이 마음에 들지 않으면, **첫 번째 단계로 돌아가서** (다시 코드를 변경합니다).

마지막 부분이 중요합니다. **종속성을 변경하려면, 먼저 주변 코드를 변경하세요.** 종속성 목록을 [Effect 코드에서 사용된 모든 반응형 값의 목록](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency)으로 생각할 수 있습니다. 목록에 무엇을 넣을지 *선택하지 않습니다.* 목록은 *코드를 설명합니다.* 종속성 목록을 변경하려면, 코드를 변경하세요.

이것은 방정식을 푸는 것과 비슷할 수 있습니다. 목표(예: 종속성을 제거하는 것)로 시작하고, 그 목표에 맞는 코드를 "찾아야" 합니다. 방정식을 푸는 것을 재미있어하지 않는 사람도 있고, Effect를 작성하는 것도 마찬가지일 수 있습니다! 다행히도 아래에서 시도할 수 있는 일반적인 레시피 목록이 있습니다.

<Pitfall>

기존 코드베이스가 있는 경우, 다음과 같이 린터를 억제하는 Effect가 있을 수 있습니다:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 이렇게 린터를 억제하지 마세요:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**종속성이 코드와 일치하지 않으면, 버그가 발생할 위험이 매우 높습니다.** 린터를 억제함으로써, Effect가 의존하는 값에 대해 React에게 "거짓말"을 하게 됩니다.

대신, 아래의 기술을 사용하세요.

</Pitfall>

<DeepDive>

#### 종속성 린터를 억제하는 것이 왜 위험한가요? {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}

린터를 억제하면 찾고 수정하기 어려운 매우 직관적이지 않은 버그가 발생합니다. 다음은 한 가지 예입니다:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
	setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
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
        매초마다 증가:
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

Effect를 "마운트 시에만" 실행하고 싶다고 가정해 봅시다. [빈 (`[]`) 종속성](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means)이 그렇게 한다는 것을 읽었기 때문에, 린터를 무시하고 강제로 `[]`를 종속성으로 지정하기로 결정했습니다.

이 카운터는 매초마다 두 버튼으로 구성 가능한 양만큼 증가해야 했습니다. 그러나 이 Effect가 아무것도 의존하지 않는다고 React에게 "거짓말"했기 때문에, React는 초기 렌더링의 `onTick` 함수를 영원히 사용합니다. [그 렌더링 동안,](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `count`는 `0`이고 `increment`는 `1`이었습니다. 이것이 `onTick`이 항상 `setCount(0 + 1)`을 매초마다 호출하는 이유이며, 항상 `1`을 보게 되는 이유입니다. 이러한 버그는 여러 컴포넌트에 퍼져 있을 때 수정하기가 더 어렵습니다.

린터를 무시하는 것보다 항상 더 나은 해결책이 있습니다! 이 코드를 수정하려면 `onTick`을 종속성 목록에 추가해야 합니다. (간격이 한 번만 설정되도록 하려면, [onTick을 Effect 이벤트로 만드세요.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events))

**종속성 린트 오류를 컴파일 오류로 취급하는 것을 권장합니다. 이를 억제하지 않으면, 이러한 버그를 절대 보지 않을 것입니다.** 이 페이지의 나머지 부분은 이와 다른 경우에 대한 대안을 문서화합니다.

</DeepDive>

## 불필요한 종속성 제거 {/*removing-unnecessary-dependencies*/}

Effect의 종속성을 코드에 맞게 조정할 때마다 종속성 목록을 살펴보세요. 이 종속성 중 하나가 변경될 때 Effect가 다시 실행되는 것이 합리적입니까? 때로는 "아니오"라는 답이 나올 수 있습니다:

* 다른 조건에서 Effect의 *다른 부분*을 다시 실행하고 싶을 수 있습니다.
* 일부 종속성의 변경에 "반응"하는 대신 *최신 값*만 읽고 싶을 수 있습니다.
* 종속성이 객체나 함수이기 때문에 *의도치 않게* 너무 자주 변경될 수 있습니다.

Effect에 대한 몇 가지 질문에 답해야 올바른 해결책을 찾을 수 있습니다. 함께 살펴보겠습니다.

### 이 코드는 이벤트 핸들러로 이동해야 하나요? {/*should-this-code-move-to-an-event-handler*/}

가장 먼저 생각해야 할 것은 이 코드가 Effect여야 하는지 여부입니다.

폼을 상상해 보세요. 제출 시, `submitted` 상태 변수를 `true`로 설정합니다. POST 요청을 보내고 알림을 표시해야 합니다. 이 논리를 `submitted`가 `true`로 "반응"하는 Effect 내부에 넣었습니다:

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 피해야 함: 이벤트별 논리가 Effect 내부에 있음
      post('/api/register');
      showNotification('성공적으로 등록되었습니다!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

나중에 현재 테마에 따라 알림 메시지를 스타일링하고 싶어서 현재 테마를 읽습니다. `theme`이 컴포넌트 본문에 선언되어 있으므로, 이는 반응형 값이며 종속성으로 추가합니다:

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 피해야 함: 이벤트별 논리가 Effect 내부에 있음
      post('/api/register');
      showNotification('성공적으로 등록되었습니다!', theme);
    }
  }, [submitted, theme]); // ✅ 모든 종속성 선언됨

  function handleSubmit() {
    setSubmitted(true);
  }  

  // ...
}
```

이렇게 하면 버그가 발생합니다. 폼을 먼저 제출한 다음 다크 및 라이트 테마를 전환한다고 상상해 보세요. `theme`이 변경되면 Effect가 다시 실행되어 동일한 알림을 다시 표시합니다!

**문제는 이것이 처음부터 Effect가 되어서는 안 된다는 것입니다.** 이 POST 요청을 보내고 알림을 표시하려는 것은 *폼 제출*에 대한 특정 상호작용에 대한 응답입니다. 특정 상호작용에 응답하여 코드를 실행하려면 해당 논리를 해당 이벤트 핸들러에 직접 넣으세요:

```js {6-7}
function Form() {
 
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ 좋음: 이벤트별 논리가 이벤트 핸들러에서 호출됨
    post('/api/register');
    showNotification('성공적으로 등록되었습니다!', theme);
  }  

  // ...
}
```

이제 코드가 이벤트 핸들러에 있으므로 반응형이 아니며 사용자가 폼을 제출할 때만 실행됩니다. [이벤트 핸들러와 Effect 사이에서 선택하는 방법](/learn/separating-events-from-effects#reactive-values-and-reactive-logic)과 [불필요한 Effect를 삭제하는 방법](/learn/you-might-not-need-an-effect)에 대해 자세히 알아보세요.

### Effect가 여러 가지 관련 없는 작업을 수행하고 있나요? {/*is-your-effect-doing-several-unrelated-things*/}

다음으로 스스로에게 물어봐야 할 질문은 Effect가 여러 가지 관련 없는 작업을 수행하고 있는지 여부입니다.

사용자가 도시와 지역을 선택해야 하는 배송 폼을 만들고 있다고 상상해 보세요. 선택한 `country`에 따라 서버에서 `cities` 목록을 가져와 드롭다운에 표시합니다:

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

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
  }, [country]); // ✅ 모든 종속성 선언됨

  // ...
```

이것은 [Effect에서 데이터를 가져오는](/learn/you-might-not-need-an-effect#fetching-data) 좋은 예입니다. `cities` 상태를 `country` prop에 따라 네트워크와 동기화하고 있습니다. `ShippingForm`이 표시될 때와 `country`가 변경될 때마다 데이터를 가져와야 하므로 이벤트 핸들러에서 이를 수행할 수 없습니다.

이제 현재 선택된 `city`에 대해 `areas`를 가져와야 하는 두 번째 선택 상자를 추가한다고 가정해 보겠습니다. 동일한 Effect 내에서 `areas` 목록에 대한 두 번째 `fetch` 호출을 추가할 수 있습니다:

```js {15-24,28}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 피해야 함: 단일 Effect가 두 개의 독립적인 프로세스를 동기화함
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ 모든 종속성 선언됨

  // ...
```

그러나 이제 Effect가 `city` 상태 변수를 사용하므로 `city`를 종속성 목록에 추가해야 했습니다. 그 결과, 사용자가 다른 도시를 선택할 때 Effect가 다시 실행되어 `fetchCities(country)`를 호출합니다. 결과적으로 도시 목록을 불필요하게 여러 번 다시 가져오게 됩니다.

**이 코드의 문제는 두 가지 다른 관련 없는 작업을 동기화하고 있다는 것입니다:**

1. `country` prop에 따라 `cities` 상태를 네트워크와 동기화하려고 합니다.
2. `city` 상태에 따라 `areas` 상태를 네트워크와 동기화하려고 합니다.

논리를 두 개의 Effect로 분리하여 각각이 동기화해야 하는 prop에 반응하도록 하세요:

```js {19-33}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
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
  }, [country]); // ✅ 모든 종속성 선언됨

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
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
  }, [city]); // ✅ 모든 종속성 선언됨

  // ...
```

이제 첫 번째 Effect는 `country`가 변경될 때만 다시 실행되고, 두 번째 Effect는 `city`가 변경될 때 다시 실행됩니다. 목적에 따라 분리되었습니다: 두 가지 다른 작업이 두 개의 별도 Effect에 의해 동기화됩니다. 두 개의 별도 Effect는 두 개의 별도 종속성 목록을 가지므로 의도치 않게 서로를 트리거하지 않습니다.

최종 코드는 원래 코드보다 길지만, 이러한 Effect를 분리하는 것이 여전히 올바릅니다. [각 Effect는 독립적인 동기화 프로세스를 나타내야 합니다.](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) 이 예에서 하나의 Effect를 삭제해도 다른 Effect의 논리가 깨지지 않습니다. 이는 그들이 *다른 작업을 동기화*하고 있음을 의미하며, 분리하는 것이 좋습니다. 중복이 걱정된다면, [반복적인 논리를 사용자 정의 Hook으로 추출하여](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks) 이 코드를 개선할 수 있습니다.

### 다음 상태를 계산하기 위해 일부 상태를 읽고 있습니까? {/*are-you-reading-some-state-to-calculate-the-next-state*/}

이 Effect는 새 메시지가 도착할 때마다 `messages` 상태 변수를 새로 생성된 배열로 업데이트합니다:

```js {2,6-8}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

기존 메시지와 새 메시지를 끝에 추가하여 [새 배열을 생성](/learn/updating-arrays-in-state)합니다. 그러나 `messages`는 Effect가 읽는 반응형 값이므로 종속성이어야 합니다:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ 모든 종속성 선언됨
  // ...
```

그리고 `messages`를 종속성으로 만드는 것은 문제를 도입합니다.

메시지를 받을 때마다 `setMessages()`는 받은 메시지를 포함한 새 `messages` 배열로 컴포넌트를 다시 렌더링합니다. 그러나 이제 이 Effect는 `messages`에 의존하므로, 이는 Effect를 다시 동기화합니다. 따라서 새 메시지가 올 때마다 채팅이 다시 연결됩니다. 사용자는 이를 좋아하지 않을 것입니다!

문제를 해결하려면, Effect 내부에서 `messages`를 읽지 마세요. 대신, [업데이터 함수](/reference/react/useState#updating-state-based-on-the-previous-state)를 `setMessages`에 전달하세요:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ 모든 종속성 선언됨
  // ...
```

**이제 Effect가 `messages` 변수를 전혀 읽지 않는다는 점에 주목하세요.** `msgs => [...msgs, receivedMessage]`와 같은 업데이터 함수를 전달하기만 하면 됩니다. React는 [업데이터 함수를 큐에 넣고](/learn/queueing-a-series-of-state-updates) 다음 렌더링 동안 `msgs` 인수를 제공합니다. 이것이 Effect 자체가 더 이상 `messages`에 의존할 필요가 없는 이유입니다. 이 수정 덕분에 채팅 메시지를 받는 것이 더 이상 채팅을 다시 연결하지 않습니다.

### 값을 "반응"하지 않고 읽고 싶습니까? {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

<Wip>

이 섹션은 **아직 안정적인 버전의 React에서 릴리스되지 않은** 실험적 API를 설명합니다.

</Wip>

사용자가 새 메시지를 받을 때 `isMuted`가 `true`가 아닌 경우 소리를 재생하고 싶다고 가정해 보겠습니다:

```js {3,10-12}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

이제 Effect가 `isMuted`를 사용하므로, 이를 종속성으로 추가해야 합니다:

```js {10,15}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ 모든 종속성 선언됨
  // ...
```

문제는 `isMuted`가 변경될 때마다(예: 사용자가 "음소거" 토글을 누를 때) Effect가 다시 동기화되어 채팅이 다시 연결된다는 것입니다. 이는 원하는 사용자 경험이 아닙니다! (이 예에서는 린터를 비활성화해도 작동하지 않습니다. 그렇게 하면 `isMuted`가 이전 값에 "고정"됩니다.)

이 문제를 해결하려면 반응형이 아닌 논리를 Effect에서 추출해야 합니다. 이 Effect가 `isMuted`의 변경에 "반응"하지 않기를 원합니다. [이 비반응형 논리를 Effect 이벤트로 이동하세요:](/learn/separating-events-from-effects#declaring-an-effect-event)

```js {1,7-12,18,21}
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ 모든 종속성 선언됨
  // ...
```

Effect 이벤트를 사용하면 Effect를 반응형 부분(예: `roomId`와 같은 반응형 값과 그 변경에 "반응"해야 하는 부분)과 비반응형 부분(예: `onMessage`가 `isMuted`를 읽는 것처럼 최신 값을 읽기만 하는 부분)으로 분할할 수 있습니다. **이제 `isMuted`를 Effect 이벤트 내에서 읽으므로, 더 이상 Effect의 종속성이 될 필요가 없습니다.** 그 결과, "음소거" 설정을 켜고 끌 때 채팅이 다시 연결되지 않아 원래 문제를 해결할 수 있습니다!

#### props에서 이벤트 핸들러 래핑하기 {/*wrapping-an-event-handler-from-the-props*/}

컴포넌트가 이벤트 핸들러를 props로 받을 때 유사한 문제에 직면할 수 있습니다:

```js {1,8,11}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ 모든 종속성 선언됨
  // ...
```

부모 컴포넌트가 매 렌더링마다 *다른* `onReceiveMessage` 함수를 전달한다고 가정해 보겠습니다:

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

`onReceiveMessage`가 종속성이므로, 이는 부모가 다시 렌더링될 때마다 Effect를 다시 동기화하게 만듭니다. 이는 채팅을 다시 연결하게 만듭니다. 이를 해결하려면 호출을 Effect 이벤트로 래핑하세요:

```js {4-6,12,15}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ 모든 종속성 선언됨
  // ...
```

Effect 이벤트는 반응형이 아니므로 종속성으로 지정할 필요가 없습니다. 그 결과, 부모 컴포넌트가 매 렌더링마다 다른 함수를 전달하더라도 채팅이 다시 연결되지 않습니다.

#### 반응형 코드와 비반응형 코드 분리하기 {/*separating-reactive-and-non-reactive-code*/}

이 예제에서는 `roomId`가 변경될 때마다 방문을 기록하고 싶습니다. 현재 `notificationCount`를 포함하여 모든 로그를 기록하고 싶지만, `notificationCount`의 변경이 로그 이벤트를 트리거하지 않기를 원합니다.

해결책은 비반응형 코드를 Effect 이벤트로 분리하는 것입니다:

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ 모든 종속성 선언됨
  // ...
}
```

`roomId`와 관련하여 논리가 반응형이 되기를 원하므로, Effect 내에서 `roomId`를 읽습니다. 그러나 `notificationCount`의 변경이 추가 방문을 기록하지 않기를 원하므로, Effect 이벤트 내에서 `notificationCount`를 읽습니다. [Effect 이벤트를 사용하여 Effect에서 최신 props와 state를 읽는 방법에 대해 자세히 알아보세요.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)

### 일부 반응형 값이 의도치 않게 변경되나요? {/*does-some-reactive-value-change-unintentionally*/}

때로는 Effect가 특정 값에 "반응"하기를 원하지만, 그 값이 사용자의 관점에서 실제 변경을 반영하지 않고 너무 자주 변경될 수 있습니다. 예를 들어, 컴포넌트 본문에서 `options` 객체를 생성한 다음 Effect 내부에서 해당 객체를 읽는다고 가정해 보겠습니다:

```js {3-6,9}
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

이 객체는 컴포넌트 본문에 선언되어 있으므로 [반응형 값](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)입니다. Effect 내부에서 반응형 값을 읽을 때, 이를 종속성으로 선언합니다. 이는 Effect가 해당 값의 변경에 "반응"하도록 보장합니다:

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ 모든 종속성 선언됨
  // ...
```

이를 종속성으로 선언하는 것이 중요합니다! 예를 들어, `roomId`가 변경되면 Effect가 새로운 `options`로 채팅을 다시 연결하도록 보장합니다. 그러나 이 코드에는 문제도 있습니다. 이를 확인하려면 아래 샌드박스에서 입력란에 입력해 보고 콘솔에서 무슨 일이 일어나는지 확인하세요:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // 문제를 시연하기 위해 린터를 일시적으로 비활성화합니다
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 실제 구현은 서버에 연결할 것입니다
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

위 샌드박스에서 입력란은 `message` 상태 변수를 업데이트합니다. 사용자의 관점에서 이는 채팅 연결에 영향을 미치지 않아야 합니다. 그러나 `message`를 업데이트할 때마다 컴포넌트가 다시 렌더링됩니다. 컴포넌트가 다시 렌더링될 때마다 내부의 코드가 처음부터 다시 실행됩니다.

새 `options` 객체가 `ChatRoom` 컴포넌트의 매 렌더링마다 처음부터 다시 생성됩니다. React는 `options` 객체가 이전 렌더링 동안 생성된 `options` 객체와 *다른 객체*임을 인식합니다. 이것이 종속성인 `options`가 변경되었기 때문에 Effect를 다시 동기화하는 이유이며, 입력할 때마다 채팅이 다시 연결되는 이유입니다.

**이 문제는 객체와 함수에만 영향을 미칩니다. JavaScript에서는 새로 생성된 객체와 함수가 모두 다른 것으로 간주됩니다. 그 안의 내용이 동일할 수 있다는 것은 중요하지 않습니다!**

```js {7-8}
// 첫 번째 렌더링 동안
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// 다음 렌더링 동안
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// 이들은 두 개의 다른 객체입니다!
console.log(Object.is(options1, options2)); // false
```

**객체와 함수 종속성은 Effect가 필요 이상으로 자주 다시 동기화되게 할 수 있습니다.**

이것이 가능한 한 Effect의 종속성으로 객체와 함수를 피해야 하는 이유입니다. 대신, 이를 컴포넌트 외부로 이동하거나, Effect 내부로 이동하거나, 원시 값을 추출해 보세요.

#### 정적 객체와 함수를 컴포넌트 외부로 이동하기 {/*move-static-objects-and-functions-outside-your-component*/}

객체가 props와 state에 의존하지 않는 경우, 해당 객체를 컴포넌트 외부로 이동할 수 있습니다:

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ 모든 종속성 선언됨
  // ...
```

이렇게 하면 린터에게 그것이 반응형이 아님을 *증명*할 수 있습니다. 리렌더링의 결과로 변경될 수 없으므로 종속성이 될 필요가 없습니다. 이제 `ChatRoom`을 다시 렌더링해도 Effect가 다시 동기화되지 않습니다.

이것은 함수에도 적용됩니다:

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ 모든 종속성 선언됨
  // ...
```

`createOptions`가 컴포넌트 외부에 선언되어 있으므로, 이는 반응형 값이 아닙니다. 이것이 Effect의 종속성으로 지정할 필요가 없는 이유이며, Effect가 다시 동기화되지 않는 이유입니다.

#### 동적 객체와 함수를 Effect 내부로 이동하기 {/*move-dynamic-objects-and-functions-inside-your-effect*/}

객체가 `roomId` prop과 같은 리렌더링의 결과로 변경될 수 있는 반응형 값에 의존하는 경우, 이를 컴포넌트 *외부*로 이동할 수 없습니다. 그러나 이를 Effect 코드 *내부*로 이동할 수 있습니다:

```js {7-10,11,14}
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
  }, [roomId]); // ✅ 모든 종속성 선언됨
  // ...
```

이제 `options`가 Effect 내부에 선언되었으므로, 더 이상 Effect의 종속성이 아닙니다. 대신, Effect가 사용하는 유일한 반응형 값은 `roomId`입니다. `roomId`는 객체나 함수가 아니므로, 의도치 않게 다를 수 없습니다. JavaScript에서는 숫자와 문자열이 내용으로 비교됩니다:

```js {7-8}
// 첫 번째 렌더링 동안
const roomId1 = 'music';

// 다음 렌더링 동안
const roomId2 = 'music';

// 이 두 문자열은 동일합니다!
console.log(Object.is(roomId1, roomId2)); // true
```

이 수정 덕분에 입력란을 편집해도 채팅이 다시 연결되지 않습니다:

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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 실제 구현은 서버에 연결할 것입니다
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

그러나 `roomId` 드롭다운을 변경할 때는 예상대로 다시 연결됩니다.

이것은 함수에도 적용됩니다:

```js {7-12,14}
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
  }, [roomId]); // ✅ 모든 종속성 선언됨
  // ...
```

Effect 내부에 선언된 한, 논리를 그룹화하기 위해 자체 함수를 작성할 수 있습니다. Effect 내부에 선언된 한, 이는 반응형 값이 아니므로 Effect의 종속성이 될 필요가 없습니다.

#### 객체에서 원시 값 읽기 {/*read-primitive-values-from-objects*/}

때로는 props에서 객체를 받을 수 있습니다:

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ 모든 종속성 선언됨
  // ...
```

여기서 위험은 부모 컴포넌트가 렌더링 중에 객체를 생성하는 것입니다:

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

이로 인해 부모 컴포넌트가 다시 렌더링될 때마다 Effect가 다시 연결됩니다. 이를 해결하려면 Effect *외부*에서 객체에서 정보를 읽고, 객체와 함수 종속성을 피하세요:

```js {4,7-8,12}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ 모든 종속성 선언됨
  // ...
```

논리가 약간 반복적입니다(객체에서 값을 읽고, 동일한 값으로 객체를 생성). 그러나 Effect가 *실제로* 의존하는 정보를 매우 명확하게 만듭니다. 객체가 부모 컴포넌트에 의해 의도치 않게 다시 생성되더라도, 채팅은 다시 연결되지 않습니다. 그러나 `options.roomId`나 `options.serverUrl`이 실제로 다르면, 채팅은 다시 연결됩니다.

#### 함수에서 원시 값 계산하기 {/*calculate-primitive-values-from-functions*/}

동일한 접근 방식이 함수에도 적용될 수 있습니다. 예를 들어, 부모 컴포넌트가 함수를 전달한다고 가정해 보겠습니다:

```js {3-8}
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

이를 종속성으로 만들지 않고(및 다시 렌더링 시 다시 연결되지 않도록) Effect 외부에서 호출하세요. 이를 통해 객체가 아닌 `roomId`와 `serverUrl` 값을 얻을 수 있으며, 이를 Effect 내부에서 읽을 수 있습니다:

```js {1,4}
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ 모든 종속성 선언됨
  // ...
```

이것은 [순수한](/learn/keeping-components-pure) 함수에만 작동합니다. 렌더링 중에 호출해도 안전하기 때문입니다. 함수가 이벤트 핸들러인 경우, 그러나 변경이 Effect를 다시 동기화하지 않기를 원한다면, [Effect 이벤트로 래핑하세요.](#do-you-want-to-read-a-value-without-reacting-to-its-changes)

<Recap>

- 종속성은 항상 코드와 일치해야 합니다.
- 종속성이 마음에 들지 않으면, 변경해야 하는 것은 코드입니다.
- 린터를 억제하면 매우 혼란스러운 버그가 발생하므로 항상 피해야 합니다.
- 종속성을 제거하려면, 린터에게 그것이 필요하지 않음을 "증명"해야 합니다.
- 특정 상호작용에 응답하여 일부 코드를 실행해야 하는 경우, 해당 코드를 이벤트 핸들러로 이동하세요.
- Effect의 다른 부분이 다른 이유로 다시 실행되어야 하는 경우, 이를 여러 Effect로 분리하세요.
- 이전 상태를 기반으로 일부 상태를 업데이트하려면, 업데이터 함수를 전달하세요.
- "반응"하지 않고 최신 값을 읽고 싶다면, Effect에서 Effect 이벤트를 추출하세요.
- JavaScript에서는 객체와 함수가 다른 시간에 생성된 경우 서로 다르다고 간주됩니다.
- 객체와 함수 종속성을 피하세요. 이를 컴포넌트 외부로 이동하거나 Effect 내부로 이동하세요.

</Recap>

<Challenges>

#### 재설정되는 간격 수정하기 {/*fix-a-resetting-interval*/}

이 Effect는 매초마다 틱하는 간격을 설정합니다. 매 틱마다 간격이 파괴되고 다시 생성되는 것처럼 보이는 이상한 현상을 발견했습니다. 간격이 계속해서 다시 생성되지 않도록 코드를 수정하세요.

<Hint>

이 Effect의 코드가 `count`에 의존하는 것 같습니다. 이 종속성이 필요하지 않도록 할 수 있는 방법이 있습니까? 이 값에 대한 종속성을 추가하지 않고 이전 값을 기반으로 `count` 상태를 업데이트할 방법이 있어야 합니다.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ 간격 생성 중');
    const id = setInterval(() => {
      console.log('⏰ 간격 틱');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ 간격 해제 중');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

<Solution>

Effect 내부에서 `count` 상태를 `count + 1`로 업데이트하려고 합니다. 그러나 이는 Effect가 `count`에 의존하게 하여, 매 틱마다 변경되므로 간격이 매 틱마다 다시 생성됩니다.

이를 해결하려면, [업데이터 함수](/reference/react/useState#updating-state-based-on-the-previous-state)를 사용하고 `setCount(c => c + 1)` 대신 `setCount(count + 1)`을 작성하세요:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ 간격 생성 중');
    const id = setInterval(() => {
      console.log('⏰ 간격 틱');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ 간격 해제 중');
      clearInterval(id);
    };
  }, []);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

Effect 내부에서 `count`를 읽는 대신, React에 `c => c + 1` 지시("이 숫자를 증가시키세요!")를 전달합니다. React는 다음 렌더링에서 이를 적용합니다. 그리고 더 이상 Effect 내부에서 `count` 값을 읽을 필요가 없으므로, Effect의 종속성을 빈 (`[]`)으로 유지할 수 있습니다. 이는 Effect가 매 틱마다 간격을 다시 생성하지 않도록 합니다.

</Solution>

#### 다시 트리거되는 애니메이션 수정하기 {/*fix-a-retriggering-animation*/}

이 예제에서 "Show"를 누르면 환영 메시지가 페이드 인됩니다. 애니메이션은 1초가 걸립니다. "Remove"를 누르면 환영 메시지가 즉시 사라집니다. 페이드 인 애니메이션의 논리는 `animation.js` 파일에 일반 JavaScript [애니메이션 루프](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)로 구현되어 있습니다. 해당 논리를 변경할 필요는 없습니다. 이를 타사 라이브러리로 취급할 수 있습니다. Effect는 DOM 노드에 대한 `FadeInAnimation` 인스턴스를 생성한 다음, 애니메이션을 제어하기 위해 `start(duration)` 또는 `stop()`을 호출합니다. `duration`은 슬라이더로 제어됩니다. 슬라이더를 조정하고 애니메이션이 어떻게 변경되는지 확인하세요.

이 코드는 이미 작동하지만, 변경하고 싶은 것이 있습니다. 현재 슬라이더를 이동하여 `duration` 상태 변수를 제어하면 애니메이션이 다시 트리거됩니다. Effect가 `duration` 변수에 "반응"하지 않도록 동작을 변경하세요. "Show"를 누르면 Effect가 슬라이더의 현재 `duration`을 사용해야 합니다. 그러나 슬라이더 자체를 이동하는 것은 애니메이션을 다시 트리거하지 않아야 합니다.

<Hint>

Effect 내부에 반응형이 아닌 코드가 있습니까? 비반응형 코드를 Effect 외부로 이동하는 방법은 무엇입니까?

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
    "build
": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect, useRef } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);

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
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        페이드 인 지속 시간: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
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
      // 아직 더 그릴 프레임이 남아 있음
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
```

</Sandpack>

<Solution>

Effect는 `duration`의 최신 값을 읽어야 하지만, `duration`의 변경에 "반응"하지 않기를 원합니다. `duration`을 사용하여 애니메이션을 시작하지만, 애니메이션 시작은 반응형이 아닙니다. 비반응형 코드를 Effect 이벤트로 추출하고, 해당 함수를 Effect에서 호출하세요.

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
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
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
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        페이드 인 지속 시간: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
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
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // 아직 더 그릴 프레임이 남아 있음
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
```

</Sandpack>

`onAppear`와 같은 Effect 이벤트는 반응형이 아니므로, `duration`을 읽어도 애니메이션이 다시 트리거되지 않습니다.

</Solution>

#### 다시 연결되는 채팅 수정하기 {/*fix-a-reconnecting-chat*/}

이 예제에서 "Toggle theme"을 누를 때마다 채팅이 다시 연결됩니다. 왜 이런 일이 발생합니까? 서버 URL을 편집하거나 다른 채팅방을 선택할 때만 채팅이 다시 연결되도록 실수를 수정하세요.

`chat.js`를 외부 타사 라이브러리로 취급하세요: API를 확인하기 위해 참조할 수 있지만, 코드를 수정하지 마세요.

<Hint>

이 문제를 해결하는 방법은 여러 가지가 있지만, 궁극적으로 객체를 종속성으로 피하고자 합니다.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        서버 URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <hr />
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

<Solution>

Effect가 `options` 객체에 의존하고 있기 때문에 다시 실행됩니다. 객체는 의도치 않게 다시 생성될 수 있으므로, 가능한 한 Effect의 종속성으로 피해야 합니다.

가장 덜 침습적인 수정은 Effect 외부에서 `roomId`와 `serverUrl`을 읽고, 원시 값(의도치 않게 변경될 수 없는 값)을 종속성으로 만드는 것입니다. Effect 내부에서 객체를 생성하고 `createConnection`에 전달하세요:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        서버 URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <hr />
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

객체 `options` prop을 더 구체적인 `roomId`와 `serverUrl` props로 대체하는 것이 더 좋습니다:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        서버 URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <hr />
      <ChatRoom
        roomId={roomId}
        serverUrl={serverUrl}
      />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

가능한 한 원시 props를 고수하면 나중에 컴포넌트를 최적화하기가 더 쉬워집니다.

</Solution>

#### 다시 연결되는 채팅, 다시 수정하기 {/*fix-a-reconnecting-chat-again*/}

이 예제는 암호화 여부에 따라 채팅에 연결됩니다. 체크박스를 토글하고 암호화가 켜져 있을 때와 꺼져 있을 때 콘솔에 표시되는 다른 메시지를 확인하세요. 방을 변경해 보세요. 그런 다음 테마를 토글해 보세요. 채팅방에 연결되어 있을 때 몇 초마다 새 메시지를 받게 됩니다. 메시지의 색상이 선택한 테마와 일치하는지 확인하세요.

이 예제에서는 테마를 변경할 때마다 채팅이 다시 연결됩니다. 이를 수정하세요. 수정 후, 테마를 변경해도 채팅이 다시 연결되지 않아야 하지만, 암호화 설정을 토글하거나 방을 변경하면 다시 연결되어야 합니다.

`chat.js`의 코드를 변경하지 마세요. 그 외에는 동일한 동작을 유지하는 한 코드를 변경할 수 있습니다. 예를 들어, 전달되는 props를 변경하는 것이 도움이 될 수 있습니다.

<Hint>

두 개의 함수를 전달하고 있습니다: `onMessage`와 `createConnection`. 이 두 함수는 `App`이 다시 렌더링될 때마다 새 값으로 간주됩니다. 이는 Effect를 다시 트리거하는 이유입니다.

이 함수 중 하나는 이벤트 핸들러입니다. 이벤트 핸들러의 새 값에 "반응"하지 않고 Effect에서 이벤트 핸들러를 호출하는 방법을 알고 있습니까? 그게 도움이 될 것입니다!

다른 함수는 일부 상태를 가져와서 가져온 API 메서드에 전달하기 위해 존재합니다. 이 함수가 정말 필요한가요? 전달되는 중요한 정보는 무엇입니까? `App.js`에서 `ChatRoom.js`로 일부 가져오기를 이동해야 할 수도 있습니다.

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
   createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        다크 테마 사용
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        암호화 사용
      </label>
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
      <hr />
      <ChatRoom
        roomId={roomId}
        onMessage={msg => {
          showNotification('새 메시지: ' + msg, isDark ? 'dark' : 'light');
        }}
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ 🔐 "' + roomId + '" 방에 연결 중... (암호화됨)');
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
      console.log('❌ 🔐 "' + roomId + '" 방에서 연결 해제됨 (암호화됨)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ "' + roomId + '" 방에 연결 중 (암호화되지 않음)...');
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
      console.log('❌ "' + roomId + '" 방에서 연결 해제됨 (암호화되지 않음)');
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

이 문제를 해결하는 방법은 여러 가지가 있지만, 다음은 가능한 해결책 중 하나입니다.

원래 예제에서는 테마를 토글할 때마다 다른 `onMessage`와 `createConnection` 함수가 생성되어 전달되었습니다. Effect가 이 함수들에 의존하고 있었기 때문에, 테마를 토글할 때마다 채팅이 다시 연결되었습니다.

`onMessage` 문제를 해결하려면, 이를 Effect 이벤트로 래핑해야 했습니다:

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

`onMessage` prop과 달리, `onReceiveMessage` Effect 이벤트는 반응형이 아닙니다. 따라서 Effect의 종속성으로 지정할 필요가 없습니다. 그 결과, `onMessage`의 변경이 채팅을 다시 연결하지 않습니다.

`createConnection`과 동일하게 할 수는 없습니다. 이는 *반응형*이어야 하기 때문입니다. 사용자가 암호화된 연결과 암호화되지 않은 연결을 전환하거나, 현재 방을 전환할 때 Effect가 다시 트리거되기를 원합니다. 그러나 `createConnection`이 함수이기 때문에, 전달된 정보가 *실제로* 변경되었는지 여부를 확인할 수 없습니다. 이를 해결하려면, `App` 컴포넌트에서 `createConnection`을 전달하는 대신, 원시 `roomId`와 `isEncrypted` 값을 전달하세요:

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('새 메시지: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

이제 `createConnection` 함수를 *Effect 내부*로 이동할 수 있습니다:

```js {1-4,6,10-20}
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }
    // ...
```

이 두 가지 변경 후, Effect는 더 이상 함수 값에 의존하지 않습니다:

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // 반응형 값
  const onReceiveMessage = useEffectEvent(onMessage); // 비반응형

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // 반응형 값 읽기
      };
      if (isEncrypted) { // 반응형 값 읽기
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ 모든 종속성 선언됨
```

그 결과, 채팅은 의미 있는 것이 변경될 때만 다시 연결됩니다(`roomId` 또는 `isEncrypted`):

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        다크 테마 사용
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        암호화 사용
      </label>
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
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('새 메시지: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ 🔐 "' + roomId + '" 방에 연결 중... (암호화됨)');
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
      console.log('❌ 🔐 "' + roomId + '" 방에서 연결 해제됨 (암호화됨)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ "' + roomId + '" 방에 연결 중 (암호화되지 않음)...');
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
      console.log('❌ "' + roomId + '" 방에서 연결 해제됨 (암호화되지 않음)');
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

</Solution>

</Challenges>