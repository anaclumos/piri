---
title: useOptimistic
canary: true
---

<Canary>

`useOptimistic` 훅은 현재 React의 Canary 및 실험 채널에서만 사용할 수 있습니다. [React의 릴리스 채널에 대해 자세히 알아보세요](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`useOptimistic`는 UI를 낙관적으로 업데이트할 수 있게 해주는 React 훅입니다.

```js
  const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `useOptimistic(state, updateFn)` {/*use*/}

`useOptimistic`는 비동기 작업이 진행 중일 때 다른 상태를 표시할 수 있게 해주는 React 훅입니다. 이 훅은 상태를 인수로 받아 비동기 작업(예: 네트워크 요청)이 진행되는 동안 다른 상태를 반환합니다. 현재 상태와 작업의 입력을 받아 비동기 작업이 진행되는 동안 사용할 낙관적인 상태를 반환하는 함수를 제공합니다.

이 상태는 "낙관적인" 상태라고 불리며, 이는 일반적으로 작업을 수행한 결과를 사용자에게 즉시 보여주기 위해 사용됩니다. 비록 실제로는 작업이 완료되는 데 시간이 걸리더라도 말입니다.

```js
import { useOptimistic } from 'react';

function AppContainer() {
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // updateFn
    (currentState, optimisticValue) => {
      // 낙관적인 값을 포함한 새로운 상태를 병합하여 반환
    }
  );
}
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `state`: 초기 및 작업이 진행 중이지 않을 때 반환될 값.
* `updateFn(currentState, optimisticValue)`: 현재 상태와 `addOptimistic`에 전달된 낙관적인 값을 받아 결과적인 낙관적인 상태를 반환하는 함수. 순수 함수여야 합니다. `updateFn`은 두 개의 매개변수를 받습니다. `currentState`와 `optimisticValue`. 반환 값은 `currentState`와 `optimisticValue`의 병합된 값이 됩니다.

#### 반환값 {/*returns*/}

* `optimisticState`: 결과적인 낙관적인 상태. 작업이 진행 중이지 않을 때는 `state`와 같고, 작업이 진행 중일 때는 `updateFn`이 반환한 값과 같습니다.
* `addOptimistic`: 낙관적인 업데이트가 있을 때 호출할 디스패치 함수입니다. 하나의 인수 `optimisticValue`를 받으며, 이는 `state`와 `optimisticValue`를 사용하여 `updateFn`을 호출합니다.

---

## 사용법 {/*usage*/}

### 폼을 낙관적으로 업데이트하기 {/*optimistically-updating-with-forms*/}

`useOptimistic` 훅은 네트워크 요청과 같은 백그라운드 작업이 완료되기 전에 사용자 인터페이스를 낙관적으로 업데이트할 수 있는 방법을 제공합니다. 폼의 경우, 이 기술은 앱이 더 반응성이 있는 것처럼 느껴지게 합니다. 사용자가 폼을 제출할 때 서버의 응답을 기다리지 않고 인터페이스가 예상 결과로 즉시 업데이트됩니다.

예를 들어, 사용자가 폼에 메시지를 입력하고 "보내기" 버튼을 누르면, `useOptimistic` 훅은 메시지가 실제로 서버에 전송되기 전에 메시지가 "전송 중..." 레이블과 함께 목록에 즉시 나타나게 합니다. 이 "낙관적인" 접근 방식은 속도와 반응성을 주는 인상을 줍니다. 폼은 백그라운드에서 실제로 메시지를 보내려고 시도합니다. 서버가 메시지를 수신했음을 확인하면 "전송 중..." 레이블이 제거됩니다.

<Sandpack>


```js src/App.js
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages((messages) => [...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>