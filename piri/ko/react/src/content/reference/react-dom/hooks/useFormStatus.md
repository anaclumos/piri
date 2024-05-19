---
title: useFormStatus
canary: true
---

<Canary>

`useFormStatus` 훅은 현재 React의 Canary 및 실험 채널에서만 사용할 수 있습니다. [React의 릴리스 채널에 대해 자세히 알아보세요](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`useFormStatus`는 마지막 폼 제출의 상태 정보를 제공하는 훅입니다.

```js
const { pending, data, method, action } = useFormStatus();
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `useFormStatus()` {/*use-form-status*/}

`useFormStatus` 훅은 마지막 폼 제출의 상태 정보를 제공합니다.

```js {5},[[1, 6, "status.pending"]]
import { useFormStatus } from "react-dom";
import action from './actions';

function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>Submit</button>
}

export default function App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
```

상태 정보를 얻으려면, `Submit` 컴포넌트는 `<form>` 내에서 렌더링되어야 합니다. 훅은 폼이 적극적으로 제출되고 있는지 여부를 알려주는 <CodeStep step={1}>`pending`</CodeStep> 속성과 같은 정보를 반환합니다.

위 예제에서 `Submit`은 이 정보를 사용하여 폼이 제출되는 동안 `<button>` 클릭을 비활성화합니다.

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

`useFormStatus`는 매개변수를 받지 않습니다.

#### 반환값 {/*returns*/}

다음 속성을 가진 `status` 객체를 반환합니다:

* `pending`: 불리언 값입니다. `true`이면 부모 `<form>`이 제출 대기 중임을 의미합니다. 그렇지 않으면 `false`입니다.

* `data`: 부모 `<form>`이 제출하는 데이터를 포함하는 [`FormData 인터페이스`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)를 구현하는 객체입니다. 활성 제출이 없거나 부모 `<form>`이 없으면 `null`입니다.

* `method`: `'get'` 또는 `'post'` 중 하나의 문자열 값입니다. 이는 부모 `<form>`이 `GET` 또는 `POST` [HTTP 메서드](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)로 제출되는지 나타냅니다. 기본적으로 `<form>`은 `GET` 메서드를 사용하며 [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method) 속성으로 지정할 수 있습니다.

[//]: # (Link to `<form>` documentation. "Read more on the `action` prop on `<form>`.")
* `action`: 부모 `<form>`의 `action` 속성에 전달된 함수에 대한 참조입니다. 부모 `<form>`이 없으면 속성은 `null`입니다. `action` 속성에 URI 값이 제공되었거나 `action` 속성이 지정되지 않은 경우, `status.action`은 `null`입니다.

#### 주의사항 {/*caveats*/}

* `useFormStatus` 훅은 `<form>` 내에서 렌더링된 컴포넌트에서 호출되어야 합니다.
* `useFormStatus`는 부모 `<form>`에 대한 상태 정보만 반환합니다. 동일한 컴포넌트나 자식 컴포넌트에 렌더링된 다른 `<form>`에 대한 상태 정보는 반환하지 않습니다.

---

## 사용법 {/*usage*/}

### 폼 제출 중 대기 상태 표시 {/*display-a-pending-state-during-form-submission*/}
폼이 제출되는 동안 대기 상태를 표시하려면, `<form>` 내에서 렌더링된 컴포넌트에서 `useFormStatus` 훅을 호출하고 반환된 `pending` 속성을 읽을 수 있습니다.

여기서는 `pending` 속성을 사용하여 폼이 제출 중임을 나타냅니다.

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

<Pitfall>

##### `useFormStatus`는 동일한 컴포넌트에 렌더링된 `<form>`에 대한 상태 정보를 반환하지 않습니다. {/*useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component*/}

`useFormStatus` 훅은 부모 `<form>`에 대한 상태 정보만 반환하며, 훅을 호출하는 동일한 컴포넌트에 렌더링된 `<form>`이나 자식 컴포넌트에 대한 상태 정보는 반환하지 않습니다.

```js
function Form() {
  // 🚩 `pending`은 절대 true가 되지 않습니다.
  // useFormStatus는 이 컴포넌트에 렌더링된 폼을 추적하지 않습니다.
  const { pending } = useFormStatus();
  return <form action={submit}></form>;
}
```

대신 `<form>` 내에 위치한 컴포넌트에서 `useFormStatus`를 호출하세요.

```js
function Submit() {
  // ✅ `pending`은 Submit 컴포넌트를 감싸는 폼에서 파생됩니다.
  const { pending } = useFormStatus(); 
  return <button disabled={pending}>...</button>;
}

function Form() {
  // 이것이 `useFormStatus`가 추적하는 <form>입니다.
  return (
    <form action={submit}>
      <Submit />
    </form>
  );
}
```

</Pitfall>

### 제출 중인 폼 데이터 읽기 {/*read-form-data-being-submitted*/}

`useFormStatus`에서 반환된 상태 정보의 `data` 속성을 사용하여 사용자가 제출 중인 데이터를 표시할 수 있습니다.

여기서는 사용자가 사용자 이름을 요청할 수 있는 폼이 있습니다. `useFormStatus`를 사용하여 사용자가 요청한 사용자 이름을 확인하는 임시 상태 메시지를 표시할 수 있습니다.

<Sandpack>

```js src/UsernameForm.js active
import {useState, useMemo, useRef} from 'react';
import {useFormStatus} from 'react-dom';

export default function UsernameForm() {
  const {pending, data} = useFormStatus();

  return (
    <div>
      <h3>Request a Username: </h3>
      <input type="text" name="username" disabled={pending}/>
      <button type="submit" disabled={pending}>
        Submit
      </button>
      <br />
      <p>{data ? `Requesting ${data?.get("username")}...`: ''}</p>
    </div>
  );
}
```

```js src/App.js
import UsernameForm from './UsernameForm';
import { submitForm } from "./actions.js";
import {useRef} from 'react';

export default function App() {
  const ref = useRef(null);
  return (
    <form ref={ref} action={async (formData) => {
      await submitForm(formData);
      ref.current.reset();
    }}>
      <UsernameForm />
    </form>
  );
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 2000));
}
```

```css
p {
    height: 14px;
    padding: 0;
    margin: 2px 0 0 0 ;
    font-size: 14px
}

button {
    margin-left: 2px;
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

---

## 문제 해결 {/*troubleshooting*/}

### `status.pending`이 절대 `true`가 되지 않습니다. {/*pending-is-never-true*/}

`useFormStatus`는 부모 `<form>`에 대한 상태 정보만 반환합니다.

`useFormStatus`를 호출하는 컴포넌트가 `<form>` 내에 중첩되지 않은 경우, `status.pending`은 항상 `false`를 반환합니다. `useFormStatus`가 `<form>` 요소의 자식인 컴포넌트에서 호출되는지 확인하세요.

`useFormStatus`는 동일한 컴포넌트에 렌더링된 `<form>`의 상태를 추적하지 않습니다. 자세한 내용은 [Pitfall](#useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component)을 참조하세요.