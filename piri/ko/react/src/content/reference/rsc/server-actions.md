---
title: 서버 액션
canary: true
---

<Intro>

서버 액션은 클라이언트 컴포넌트가 서버에서 실행되는 비동기 함수를 호출할 수 있게 합니다.

</Intro>

<InlineToc />

<Note>

#### 서버 액션을 지원하려면 어떻게 해야 하나요? {/*how-do-i-build-support-for-server-actions*/}

React 19의 서버 액션은 안정적이며 주요 버전 간에 깨지지 않지만, React Server Components 번들러나 프레임워크에서 서버 액션을 구현하는 데 사용되는 기본 API는 semver를 따르지 않으며 React 19.x의 마이너 버전 간에 깨질 수 있습니다.

번들러나 프레임워크로서 서버 액션을 지원하려면 특정 React 버전에 고정하거나 Canary 릴리스를 사용하는 것을 권장합니다. 우리는 앞으로 서버 액션을 구현하는 데 사용되는 API를 안정화하기 위해 번들러 및 프레임워크와 계속 협력할 것입니다.

</Note>

서버 액션이 `"use server"` 지시어로 정의되면, 프레임워크는 자동으로 서버 함수에 대한 참조를 생성하고 해당 참조를 클라이언트 컴포넌트에 전달합니다. 클라이언트에서 해당 함수가 호출되면, React는 서버에 요청을 보내 함수를 실행하고 결과를 반환합니다.

서버 액션은 서버 컴포넌트에서 생성되어 클라이언트 컴포넌트에 props로 전달될 수 있으며, 클라이언트 컴포넌트에서 가져와 사용할 수도 있습니다.

### 서버 컴포넌트에서 서버 액션 생성하기 {/*creating-a-server-action-from-a-server-component*/}

서버 컴포넌트는 `"use server"` 지시어로 서버 액션을 정의할 수 있습니다:

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Server Component
import Button from './Button';

function EmptyNote () {
  async function createNoteAction() {
    // Server Action
    'use server';
    
    await db.notes.create();
  }

  return <Button onClick={createNoteAction}/>;
}
```

React가 `EmptyNote` 서버 컴포넌트를 렌더링할 때, `createNoteAction` 함수에 대한 참조를 생성하고 해당 참조를 `Button` 클라이언트 컴포넌트에 전달합니다. 버튼이 클릭되면, React는 제공된 참조를 사용하여 `createNoteAction` 함수를 실행하기 위해 서버에 요청을 보냅니다:

```js {5}
"use client";

export default function Button({onClick}) { 
  console.log(onClick); 
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={onClick}>Create Empty Note</button>
}
```

자세한 내용은 [`"use server"`](/reference/rsc/use-server) 문서를 참조하세요.


### 클라이언트 컴포넌트에서 서버 액션 가져오기 {/*importing-server-actions-from-client-components*/}

클라이언트 컴포넌트는 `"use server"` 지시어를 사용하는 파일에서 서버 액션을 가져올 수 있습니다:

```js [[1, 3, "createNoteAction"]]
"use server";

export async function createNoteAction() {
  await db.notes.create();
}

```

번들러가 `EmptyNote` 클라이언트 컴포넌트를 빌드할 때, 번들 내에서 `createNoteAction` 함수에 대한 참조를 생성합니다. `button`이 클릭되면, React는 제공된 참조를 사용하여 `createNoteAction` 함수를 실행하기 위해 서버에 요청을 보냅니다:

```js [[1, 2, "createNoteAction"], [1, 5, "createNoteAction"], [1, 7, "createNoteAction"]]
"use client";
import {createNoteAction} from './actions';

function EmptyNote() {
  console.log(createNoteAction);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  <button onClick={createNoteAction} />
}
```

자세한 내용은 [`"use server"`](/reference/rsc/use-server) 문서를 참조하세요.

### 액션과 함께 서버 액션 구성하기 {/*composing-server-actions-with-actions*/}

서버 액션은 클라이언트에서 액션과 함께 구성될 수 있습니다:

```js [[1, 3, "updateName"]]
"use server";

export async function updateName(name) {
  if (!name) {
    return {error: 'Name is required'};
  }
  await db.users.updateName(name);
}
```

```js [[1, 3, "updateName"], [1, 13, "updateName"], [2, 11, "submitAction"],  [2, 23, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const [isPending, startTransition] = useTransition();

  const submitAction = async () => {
    startTransition(async () => {
      const {error} = await updateName(name);
      if (!error) {
        setError(error);
      } else {
        setName('');
      }
    })
  }
  
  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  )
}
```

이렇게 하면 클라이언트에서 액션으로 감싸서 서버 액션의 `isPending` 상태에 접근할 수 있습니다.

자세한 내용은 [서버 액션을 `<form>` 외부에서 호출하기](/reference/rsc/use-server#calling-a-server-action-outside-of-form) 문서를 참조하세요.

### 폼 액션과 서버 액션 {/*form-actions-with-server-actions*/}

서버 액션은 React 19의 새로운 폼 기능과 함께 작동합니다.

서버 액션을 폼에 전달하여 폼을 서버에 자동으로 제출할 수 있습니다:


```js [[1, 3, "updateName"], [1, 7, "updateName"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
    </form>
  )
}
```

폼 제출이 성공하면, React는 자동으로 폼을 재설정합니다. `useActionState`를 추가하여 대기 상태, 마지막 응답에 접근하거나 점진적 향상을 지원할 수 있습니다.

자세한 내용은 [폼에서 서버 액션](/reference/rsc/use-server#server-actions-in-forms) 문서를 참조하세요.

### `useActionState`와 서버 액션 {/*server-actions-with-use-action-state*/}

서버 액션을 `useActionState`와 함께 구성하여 액션 대기 상태와 마지막 반환된 응답에 접근할 수 있습니다:

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "submitAction"], [2, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(updateName, {error: null});

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  );
}
```

서버 액션과 함께 `useActionState`를 사용할 때, React는 하이드레이션이 완료되기 전에 입력된 폼 제출을 자동으로 재생합니다. 이는 사용자가 앱이 하이드레이션되기 전에도 앱과 상호작용할 수 있음을 의미합니다.

자세한 내용은 [`useActionState`](/reference/react-dom/hooks/useFormState) 문서를 참조하세요.

### `useActionState`를 사용한 점진적 향상 {/*progressive-enhancement-with-useactionstate*/}

서버 액션은 `useActionState`의 세 번째 인수를 사용하여 점진적 향상을 지원합니다.

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "/name/update"], [3, 6, "submitAction"], [3, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [, submitAction] = useActionState(updateName, null, `/name/update`);

  return (
    <form action={submitAction}>
      ...
    </form>
  );
}
```

<CodeStep step={2}>permalink</CodeStep>가 `useActionState`에 제공되면, React는 JavaScript 번들이 로드되기 전에 폼이 제출되면 제공된 URL로 리디렉션합니다.

자세한 내용은 [`useActionState`](/reference/react-dom/hooks/useFormState) 문서를 참조하세요.