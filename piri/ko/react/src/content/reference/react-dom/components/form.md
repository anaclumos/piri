---
title: <form>
canary: true
---

<Canary>

React의 `<form>`에 대한 확장은 현재 React의 canary 및 실험 채널에서만 사용할 수 있습니다. 안정적인 React 릴리스에서는 `<form>`이 [내장 브라우저 HTML 컴포넌트](https://react.dev/reference/react-dom/components#all-html-components)로만 작동합니다. [React의 릴리스 채널에 대해 자세히 알아보세요](/community/versioning-policy#all-release-channels).

</Canary>


<Intro>

[내장 브라우저 `<form>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)를 사용하면 정보를 제출하기 위한 인터랙티브 컨트롤을 만들 수 있습니다.

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `<form>` {/*form*/}

정보를 제출하기 위한 인터랙티브 컨트롤을 만들려면 [내장 브라우저 `<form>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)를 렌더링하세요.

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### Props {/*props*/}

`<form>`은 모든 [공통 요소 props](/reference/react-dom/components/common#props)를 지원합니다.

[`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action): URL 또는 함수. `action`에 URL이 전달되면 폼은 HTML 폼 컴포넌트처럼 동작합니다. `action`에 함수가 전달되면 함수가 폼 제출을 처리합니다. `action`에 전달된 함수는 비동기일 수 있으며 제출된 폼의 [폼 데이터](https://developer.mozilla.org/en-US/docs/Web/API/FormData)를 포함하는 단일 인수로 호출됩니다. `action` prop은 `<button>`, `<input type="submit">`, 또는 `<input type="image">` 컴포넌트의 `formAction` 속성으로 재정의할 수 있습니다.

#### 주의사항 {/*caveats*/}

* `action` 또는 `formAction`에 함수가 전달되면 `method` prop의 값과 상관없이 HTTP 메서드는 POST가 됩니다.

---

## 사용법 {/*usage*/}

### 클라이언트에서 폼 제출 처리 {/*handle-form-submission-on-the-client*/}

폼이 제출될 때 함수를 실행하려면 폼의 `action` prop에 함수를 전달하세요. [`formData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)는 폼이 제출될 때 함수의 인수로 전달되어 폼에 의해 제출된 데이터를 액세스할 수 있습니다. 이는 URL만을 허용하는 기존의 [HTML action](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action)과 다릅니다.

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
    const query = formData.get("query");
    alert(`You searched for '${query}'`);
  }
  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
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

### Server Action으로 폼 제출 처리 {/*handle-form-submission-with-a-server-action*/}

입력 및 제출 버튼이 있는 `<form>`을 렌더링하세요. 폼이 제출될 때 함수를 실행하려면 폼의 `action` prop에 Server Action (['use server'](/reference/rsc/use-server)로 표시된 함수)을 전달하세요.

Server Action을 `<form action>`에 전달하면 사용자는 JavaScript가 활성화되지 않았거나 코드가 로드되기 전에 폼을 제출할 수 있습니다. 이는 느린 연결, 장치 또는 JavaScript가 비활성화된 사용자를 위해 유익하며, URL이 `action` prop에 전달될 때 폼이 작동하는 방식과 유사합니다.

숨겨진 폼 필드를 사용하여 `<form>`의 action에 데이터를 제공할 수 있습니다. Server Action은 제출된 폼의 숨겨진 필드 데이터를 [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) 인스턴스로 호출합니다.

```jsx
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(formData) {
    'use server'
    const productId = formData.get('productId')
    await updateCart(productId)
  }
  return (
    <form action={addToCart}>
        <input type="hidden" name="productId" value={productId} />
        <button type="submit">Add to Cart</button>
    </form>

  );
}
```

숨겨진 폼 필드를 사용하여 `<form>`의 action에 데이터를 제공하는 대신, <CodeStep step={1}>`bind`</CodeStep> 메서드를 호출하여 추가 인수로 제공할 수 있습니다. 이는 함수에 전달된 <CodeStep step={3}>`formData`</CodeStep> 외에 새로운 인수(<CodeStep step={2}>`productId`</CodeStep>)를 함수에 바인딩합니다.

```jsx [[1, 8, "bind"], [2,8, "productId"], [2,4, "productId"], [3,4, "formData"]]
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(productId, formData) {
    "use server";
    await updateCart(productId)
  }
  const addProductToCart = addToCart.bind(null, productId);
  return (
    <form action={addProductToCart}>
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

`<form>`이 [Server Component](/reference/rsc/use-client)에 의해 렌더링되고, [Server Action](/reference/rsc/use-server)이 `<form>`의 `action` prop에 전달되면, 폼은 [점진적 향상](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)됩니다.

### 폼 제출 중 대기 상태 표시 {/*display-a-pending-state-during-form-submission*/}
폼이 제출되는 동안 대기 상태를 표시하려면 `<form>`에 렌더링된 컴포넌트에서 `useFormStatus` Hook을 호출하고 반환된 `pending` 속성을 읽을 수 있습니다.

여기서는 폼이 제출 중임을 나타내기 위해 `pending` 속성을 사용합니다.

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

function Form({ action }) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>

`useFormStatus` Hook에 대해 자세히 알아보려면 [참고 문서](/reference/react-dom/hooks/useFormStatus)를 참조하세요.

### 폼 데이터 낙관적 업데이트 {/*optimistically-updating-form-data*/}
`useOptimistic` Hook은 네트워크 요청과 같은 백그라운드 작업이 완료되기 전에 사용자 인터페이스를 낙관적으로 업데이트하는 방법을 제공합니다. 폼의 맥락에서 이 기술은 앱이 더 반응성이 있는 것처럼 느껴지도록 도와줍니다. 사용자가 폼을 제출할 때 서버의 응답을 기다리지 않고 예상 결과로 인터페이스가 즉시 업데이트됩니다.

예를 들어, 사용자가 폼에 메시지를 입력하고 "Send" 버튼을 누르면 `useOptimistic` Hook을 사용하여 메시지가 실제로 서버에 전송되기 전에 "Sending..." 레이블과 함께 목록에 즉시 나타나게 할 수 있습니다. 이 "낙관적" 접근 방식은 속도와 반응성을 주는 인상을 줍니다. 그런 다음 폼은 백그라운드에서 실제로 메시지를 보내려고 시도합니다. 서버가 메시지를 수신했음을 확인하면 "Sending..." 레이블이 제거됩니다.

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
    setMessages([...messages, { text: sentMessage }]);
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

[//]: # 'useOptimistic 참조 문서 페이지가 게시된 후 다음 줄의 주석을 해제하고 이 줄을 삭제하세요'
[//]: # 'useOptimistic Hook에 대해 자세히 알아보려면 [참고 문서](/reference/react/hooks/useOptimistic)를 참조하세요.'

### 폼 제출 오류 처리 {/*handling-form-submission-errors*/}

일부 경우 `<form>`의 `action` prop에 의해 호출된 함수가 오류를 발생시킬 수 있습니다. 이러한 오류를 처리하려면 `<form>`을 Error Boundary로 감싸세요. `<form>`의 `action` prop에 의해 호출된 함수가 오류를 발생시키면 오류 경계의 폴백이 표시됩니다.

<Sandpack>

```js src/App.js
import { ErrorBoundary } from "react-error-boundary";

export default function Search() {
  function search() {
    throw new Error("search error");
  }
  return (
    <ErrorBoundary
      fallback={<p>There was an error while submitting the form</p>}
    >
      <form action={search}>
        <input name="query" />
        <button type="submit">Search</button>
      </form>
    </ErrorBoundary>
  );
}

```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### JavaScript 없이 폼 제출 오류 표시 {/*display-a-form-submission-error-without-javascript*/}

점진적 향상을 위해 JavaScript 번들이 로드되기 전에 폼 제출 오류 메시지를 표시하려면 다음이 필요합니다:

1. `<form>`이 [Server Component](/reference/rsc/use-client)에 의해 렌더링됩니다.
1. `<form>`의 `action` prop에 전달된 함수가 [Server Action](/reference/rsc/use-server)입니다.
1. 오류 메시지를 표시하기 위해 `useActionState` Hook이 사용됩니다.

`useActionState`는 두 개의 매개변수를 받습니다: [Server Action](/reference/rsc/use-server)과 초기 상태. `useActionState`는 상태 변수와 액션 두 가지 값을 반환합니다. `useActionState`에서 반환된 액션은 폼의 `action` prop에 전달되어야 합니다. `useActionState`에서 반환된 상태 변수는 오류 메시지를 표시하는 데 사용할 수 있습니다. `useActionState`에 전달된 [Server Action](/reference/rsc/use-server)에서 반환된 값은 상태 변수를 업데이트하는 데 사용됩니다.

<Sandpack>

```js src/App.js
import { useActionState } from "react";
import { signUpNewUser } from "./api";

export default function Page() {
  async function signup(prevState, formData) {
    "use server";
    const email = formData.get("email");
    try {
      await signUpNewUser(email);
      alert(`Added "${email}"`);
    } catch (err) {
      return err.toString();
    }
  }
  const [message, signupAction] = useActionState(signup, null);
  return (
    <>
      <h1>Signup for my newsletter</h1>
      <p>Signup with the same email twice to see an error</p>
      <form action={signupAction} id="signup-form">
        <label htmlFor="email">Email: </label>
        <input name="email" id="email" placeholder="react@example.com" />
        <button>Sign up</button>
        {!!message && <p>{message}</p>}
      </form>
    </>
  );
}
```

```js src/api.js hidden
let emails = [];

export async function signUpNewUser(newEmail) {
  if (emails.includes(newEmail)) {
    throw new Error("This email address has already been added");
  }
  emails.push(newEmail);
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

폼 액션에서 상태를 업데이트하는 방법에 대해 자세히 알아보려면 [`useActionState`](/reference/react/useActionState) 문서를 참조하세요.

### 여러 제출 유형 처리 {/*handling-multiple-submission-types*/}

폼은 사용자가 누른 버튼에 따라 여러 제출 작업을 처리하도록 설계될 수 있습니다. 폼 내부의 각 버튼은 `formAction` prop을 설정하여 고유한 작업 또는 동작과 연결될 수 있습니다.

사용자가 특정 버튼을 누르면 폼이 제출되고 해당 버튼의 속성과 작업에 정의된 동작이 실행됩니다. 예를 들어, 폼은 기본적으로 기사를 검토를 위해 제출할 수 있지만, `formAction`이 설정된 별도의 버튼을 사용하여 기사를 초안으로 저장할 수 있습니다.

<Sandpack>

```js src/App.js
export default function Search() {
  function publish(formData) {
    const content = formData.get("content");
    const button = formData.get("button");
    alert(`'${content}' was published with the '${button}' button`);
  }

  function save(formData) {
    const content = formData.get("content");
    alert(`Your draft of '${content}' has been saved!`);
  }

  return (
    <form action={publish}>
      <textarea name="content" rows={4} cols={40} />
      <br />
      <button type="submit" name="button" value="submit">Publish</button>
      <button formAction={save}>Save draft</button>
    </form>
  );
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