---
title: React 19 베타
author: The React Team
date: 2024/04/25
description: React 19 베타가 이제 npm에서 사용 가능합니다! 이 게시물에서는 React 19의 새로운 기능 개요와 이를 채택하는 방법에 대해 설명하겠습니다.
---

2024년 4월 25일 [React 팀](/community/team)

---

<Note>

이 베타 릴리스는 라이브러리가 React 19에 대비할 수 있도록 제공됩니다. 앱 개발자는 18.3.0으로 업그레이드하고, 우리가 라이브러리와 협력하여 피드백을 기반으로 변경 사항을 적용하는 동안 React 19 안정 버전을 기다려야 합니다.

</Note>

<Intro>

React 19 베타가 이제 npm에서 사용할 수 있습니다!

</Intro>

[React 19 베타 업그레이드 가이드](/blog/2024/04/25/react-19-upgrade-guide)에서 앱을 React 19 베타로 업그레이드하는 단계별 지침을 공유했습니다. 이 게시물에서는 React 19의 새로운 기능과 이를 채택하는 방법에 대해 개요를 제공합니다.

- [React 19의 새로운 기능](#whats-new-in-react-19)
- [React 19의 개선 사항](#improvements-in-react-19)
- [업그레이드 방법](#how-to-upgrade)

중대한 변경 사항 목록은 [업그레이드 가이드](/blog/2024/04/25/react-19-upgrade-guide)를 참조하세요.

---

## React 19의 새로운 기능 {/*whats-new-in-react-19*/}

### Actions {/*actions*/}

React 앱에서 일반적인 사용 사례는 데이터 변형을 수행한 후 상태를 업데이트하는 것입니다. 예를 들어, 사용자가 이름을 변경하기 위해 양식을 제출하면 API 요청을 수행하고 응답을 처리합니다. 과거에는 대기 상태, 오류, 낙관적 업데이트 및 순차적 요청을 수동으로 처리해야 했습니다.

예를 들어, `useState`에서 대기 및 오류 상태를 처리할 수 있습니다:

```js
// Actions 이전
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    setIsPending(true);
    const error = await updateName(name);
    setIsPending(false);
    if (error) {
      setError(error);
      return;
    } 
    redirect("/path");
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

React 19에서는 대기 상태, 오류, 양식 및 낙관적 업데이트를 자동으로 처리하기 위해 전환에서 비동기 함수를 사용하는 지원을 추가하고 있습니다.

예를 들어, `useTransition`을 사용하여 대기 상태를 처리할 수 있습니다:

```js
// Actions에서 대기 상태 사용
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const error = await updateName(name);
      if (error) {
        setError(error);
        return;
      } 
      redirect("/path");
    })
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

비동기 전환은 즉시 `isPending` 상태를 true로 설정하고 비동기 요청을 수행하며, 전환 후 `isPending`을 false로 전환합니다. 이를 통해 데이터가 변경되는 동안 현재 UI를 응답성 있게 유지할 수 있습니다.

<Note>

#### 관례에 따라 비동기 전환을 사용하는 함수는 "Actions"라고 합니다. {/*by-convention-functions-that-use-async-transitions-are-called-actions*/}

Actions는 데이터를 자동으로 제출하는 것을 관리합니다:

- **대기 상태**: Actions는 요청 시작 시 대기 상태를 제공하고 최종 상태 업데이트가 커밋될 때 자동으로 재설정합니다.
- **낙관적 업데이트**: Actions는 새로운 [`useOptimistic`](#new-hook-optimistic-updates) 훅을 지원하여 요청이 제출되는 동안 사용자에게 즉각적인 피드백을 제공할 수 있습니다.
- **오류 처리**: Actions는 오류 처리를 제공하여 요청이 실패할 때 오류 경계(Error Boundaries)를 표시하고 낙관적 업데이트를 원래 값으로 자동으로 되돌립니다.
- **양식**: `<form>` 요소는 이제 `action` 및 `formAction` 속성에 함수를 전달하는 것을 지원합니다. `action` 속성에 함수를 전달하면 기본적으로 Actions를 사용하고 제출 후 양식을 자동으로 재설정합니다.

</Note>

Actions를 기반으로 React 19는 낙관적 업데이트를 관리하기 위한 [`useOptimistic`](#new-hook-optimistic-updates)와 Actions의 일반적인 사례를 처리하기 위한 새로운 훅 [`React.useActionState`](#new-hook-useactionstate)를 도입합니다. `react-dom`에서는 양식을 자동으로 관리하기 위한 [`<form>` Actions](#form-actions)와 양식에서 Actions의 일반적인 사례를 지원하기 위한 [`useFormStatus`](#new-hook-useformstatus)를 추가하고 있습니다.

React 19에서는 위의 예제를 다음과 같이 단순화할 수 있습니다:

```js
// <form> Actions 및 useActionState 사용
function ChangeName({ name, setName }) {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await updateName(formData.get("name"));
      if (error) {
        return error;
      }
      redirect("/path");
      return null;
    },
    null,
  );

  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>Update</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

다음 섹션에서는 React 19의 새로운 Action 기능을 하나씩 설명하겠습니다.

### 새로운 훅: `useActionState` {/*new-hook-useactionstate*/}

Actions의 일반적인 사례를 더 쉽게 만들기 위해 `useActionState`라는 새로운 훅을 추가했습니다:

```js
const [error, submitAction, isPending] = useActionState(
  async (previousState, newName) => {
    const error = await updateName(newName);
    if (error) {
      // Action의 결과를 반환할 수 있습니다.
      // 여기서는 오류만 반환합니다.
      return error;
    }

    // 성공 처리
    return null;
  },
  null,
);
```

`useActionState`는 함수(“Action”)를 받아들이고 호출할 래핑된 Action을 반환합니다. 이는 Actions가 구성되기 때문에 작동합니다. 래핑된 Action이 호출되면 `useActionState`는 Action의 마지막 결과를 `data`로 반환하고, Action의 대기 상태를 `pending`으로 반환합니다.

<Note>

`React.useActionState`는 이전에 Canary 릴리스에서 `ReactDOM.useFormState`로 불렸지만, 이름이 변경되었고 `useFormState`는 사용 중단되었습니다.

자세한 내용은 [#28491](https://github.com/facebook/react/pull/28491)를 참조하세요.

</Note>

자세한 내용은 [`useActionState`](/reference/react/useActionState) 문서를 참조하세요.

### React DOM: `<form>` Actions {/*form-actions*/}

Actions는 `react-dom`의 새로운 `<form>` 기능과 통합되어 있습니다. `<form>`, `<input>`, `<button>` 요소의 `action` 및 `formAction` 속성에 함수를 전달하여 Actions로 양식을 자동으로 제출하는 것을 지원합니다:

```js [[1,1,"actionFunction"]]
<form action={actionFunction}>
```

`<form>` Action이 성공하면 React는 비제어 컴포넌트의 경우 양식을 자동으로 재설정합니다. `<form>`을 수동으로 재설정해야 하는 경우, 새로운 `requestFormReset` React DOM API를 호출할 수 있습니다.

자세한 내용은 [`<form>`](/reference/react-dom/components/form), [`<input>`](/reference/react-dom/components/input), `<button>`에 대한 `react-dom` 문서를 참조하세요.

### React DOM: 새로운 훅: `useFormStatus` {/*new-hook-useformstatus*/}

디자인 시스템에서는 디자인 컴포넌트가 `<form>` 내에서 정보에 접근해야 하는 경우가 많습니다. 이를 위해 props를 컴포넌트로 전달하지 않고도 Context를 통해 수행할 수 있습니다. 그러나 일반적인 사례를 더 쉽게 만들기 위해 새로운 훅 `useFormStatus`를 추가했습니다:

```js [[1, 4, "pending"], [1, 5, "pending"]]
import {useFormStatus} from 'react-dom';

function DesignButton() {
  const {pending} = useFormStatus();
  return <button type="submit" disabled={pending} />
}
```

`useFormStatus`는 마치 폼이 Context 제공자인 것처럼 부모 `<form>`의 상태를 읽습니다.

자세한 내용은 [`useFormStatus`](/reference/react-dom/hooks/useFormStatus)에 대한 `react-dom` 문서를 참조하세요.

### 새로운 훅: `useOptimistic` {/*new-hook-optimistic-updates*/}

데이터 변형을 수행할 때 일반적인 UI 패턴은 비동기 요청이 진행되는 동안 최종 상태를 낙관적으로 표시하는 것입니다. React 19에서는 이를 더 쉽게 만들기 위해 새로운 훅 `useOptimistic`을 추가하고 있습니다:

```js {2,6,13,19}
function ChangeName({currentName, onUpdateName}) {
  const [optimisticName, setOptimisticName] = useOptimistic(currentName);

  const submitAction = async formData => {
    const newName = formData.get("name");
    setOptimisticName(newName);
    const updatedName = await updateName(newName);
    onUpdateName(updatedName);
  };

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <p>
        <label>Change Name:</label>
        <input
          type="text"
          name="name"
          disabled={currentName !== optimisticName}
        />
      </p>
    </form>
  );
}
```

`useOptimistic` 훅은 `updateName` 요청이 진행되는 동안 즉시 `optimisticName`을 렌더링합니다. 업데이트가 완료되거나 오류가 발생하면 React는 자동으로 `currentName` 값으로 전환합니다.

자세한 내용은 [`useOptimistic`](/reference/react/useOptimistic) 문서를 참조하세요.

### 새로운 API: `use` {/*new-feature-use*/}

React 19에서는 렌더링에서 리소스를 읽기 위한 새로운 API `use`를 도입하고 있습니다.

예를 들어, `use`를 사용하여 프라미스를 읽을 수 있으며, React는 프라미스가 해결될 때까지 일시 중단합니다:

```js {1,5}
import {use} from 'react';

function Comments({commentsPromise}) {
  // `use`는 프라미스가 해결될 때까지 일시 중단합니다.
  const comments = use(commentsPromise);
  return comments.map(comment => <p key={comment.id}>{comment}</p>);
}

function Page({commentsPromise}) {
  // `use`가 Comments에서 일시 중단되면,
  // 이 Suspense 경계가 표시됩니다.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  )
}
```

<Note>

#### `use`는 렌더링에서 생성된 프라미스를 지원하지 않습니다. {/*use-does-not-support-promises-created-in-render*/}

렌더링에서 생성된 프라미스를 `use`에 전달하려고 하면 React는 경고를 표시합니다:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

컴포넌트가 캐시되지 않은 프라미스에 의해 일시 중단되었습니다. 클라이언트 컴포넌트 또는 훅 내에서 프라미스를 생성하는 것은 아직 지원되지 않으며, Suspense 호환 라이브러리 또는 프레임워크를 통해서만 가능합니다.

</ConsoleLogLine>

</ConsoleBlockMulti>

이를 수정하려면, 프라미스를 캐싱하는 것을 지원하는 Suspense 기반 라이브러리 또는 프레임워크에서 프라미스를 전달해야 합니다. 향후 렌더링에서 프라미스를 캐싱하기 쉽게 만드는 기능을 제공할 계획입니다.

</Note>

또한 `use`를 사용하여 컨텍스트를 읽을 수 있어 초기 반환 후 조건부로 컨텍스트를 읽을 수 있습니다:

```js {1,11}
import {use} from 'react';
import ThemeContext from './ThemeContext'

function Heading({children}) {
  if (children == null) {
    return null;
  }
  
  // 초기 반환으로 인해 useContext로는 작동하지 않습니다.
  const theme = use(ThemeContext);
  return (
    <h1 style={{color: theme.color}}>
      {children}
    </h1>
  );
}
```

`use` API는 훅과 유사하게 렌더링에서만 호출할 수 있습니다. 훅과 달리 `use`는 조건부로 호출할 수 있습니다. 향후 `use`를 사용하여 렌더링에서 리소스를 소비하는 더 많은 방법을 지원할 계획입니다.

자세한 내용은 [`use`](/reference/react/use) 문서를 참조하세요.

## React Server Components {/*react-server-components*/}

### Server Components {/*server-components*/}

Server Components는 클라이언트 애플리케이션 또는 SSR 서버와 별도의 환경에서 번들링 전에 컴포넌트를 미리 렌더링할 수 있는 새로운 옵션입니다. 이 별도의 환경은 React Server Components의 "서버"입니다. Server Components는 CI 서버에서 빌드 시 한 번 실행되거나 웹 서버를 사용하여 각 요청에 대해 실행될 수 있습니다.

React 19에는 Canary 채널에서 포함된 모든 React Server Components 기능이 포함되어 있습니다. 이는 Server Components를 포함한 라이브러리가 이제 React 19를 피어 의존성으로 타겟팅할 수 있으며, [Full-stack React Architecture](/learn/start-a-new-react-project#which-features-make-up-the-react-teams-full-stack-architecture-vision)를 지원하는 프레임워크에서 `react-server` [export condition](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md#react-server-conditional-exports)을 사용할 수 있음을 의미합니다.

<Note>

#### Server Components를 지원하려면 어떻게 해야 하나요? {/*how-do-i-build-support-for-server-components*/}

React 19의 React Server Components는 안정적이며 주요 버전 간에 깨지지 않지만, React Server Components 번들러 또는 프레임워크를 구현하는 데 사용되는 기본 API는 semver를 따르지 않으며 React 19.x의 마이너 버전 간에 깨질 수 있습니다.

React Server Components를 번들러 또는 프레임워크로 지원하려면 특정 React 버전에 고정하거나 Canary 릴리스를 사용하는 것이 좋습니다. 향후 React Server Components를 구현하는 데 사용되는 API를 안정화하기 위해 번들러 및 프레임워크와 계속 협력할 것입니다.

</Note>

자세한 내용은 [React Server Components](/reference/rsc/server-components) 문서를 참조하세요.

### Server Actions {/*server-actions*/}

Server Actions는 클라이언트 컴포넌트가 서버에서 실행되는 비동기 함수를 호출할 수 있게 합니다.

Server Action이 `"use server"` 지시어로 정의되면, 프레임워크는 자동으로 서버 함수에 대한 참조를 생성하고 클라이언트 컴포넌트에 해당 참조를 전달합니다. 클라이언트에서 해당 함수가 호출되면, React는 서버에 요청을 보내 함수를 실행하고 결과를 반환합니다.

<Note>

#### Server Components에는 지시어가 없습니다. {/*there-is-no-directive-for-server-components*/}

Server Components는 `"use server"`로 표시된다는 오해가 있지만, Server Components에는 지시어가 없습니다. `"use server"` 지시어는 Server Actions에 사용됩니다.

자세한 내용은 [Directives](/reference/rsc/directives) 문서를 참조하세요.

</Note>

Server Actions는 Server Components에서 생성되어 클라이언트 컴포넌트에 props로 전달될 수 있으며, 클라이언트 컴포넌트에서 가져와 사용할 수도 있습니다.

자세한 내용은 [React Server Actions](/reference/rsc/server-actions) 문서를 참조하세요.

## React 19의 개선 사항 {/*improvements-in-react-19*/}

### `ref`를 prop으로 사용 {/*ref-as-a-prop*/}

React 19부터 함수 컴포넌트에서 `ref`를 prop으로 접근할 수 있습니다:

```js [[1, 1, "ref"], [1, 2, "ref", 45], [1, 6, "ref", 14]]
function MyInput({placeholder, ref}) {
  return <input placeholder={placeholder} ref={ref} />
}

//...
<MyInput ref={ref} />
```

새로운 함수 컴포넌트는 더 이상 `forwardRef`가 필요하지 않으며, 컴포넌트를 자동으로 업데이트하기 위해 codemod를 게시할 예정입니다. 향후 버전에서는 `forwardRef`를 사용 중단하고 제거할 예정입니다.

<Note>

클래스에 전달된 `refs`는 컴포넌트 인스턴스를 참조하기 때문에 props로 전달되지 않습니다.

</Note>

### 하이드레이션 오류에 대한 차이점 {/*diffs-for-hydration-errors*/}

`react-dom`에서 하이드레이션 오류에 대한 오류 보고를 개선했습니다. 예를 들어, DEV에서 불일치에 대한 정보 없이 여러 오류를 기록하는 대신:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

경고: 텍스트 내용이 일치하지 않습니다. 서버: "Server" 클라이언트: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

경고: 하이드레이션 중 오류
가 발생했습니다. 서버 HTML이 클라이언트 콘텐츠로 대체되었습니다. \<div\>에서.

</ConsoleLogLine>

<ConsoleLogLine level="error">

경고: 텍스트 내용이 일치하지 않습니다. 서버: "Server" 클라이언트: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

경고: 하이드레이션 중 오류가 발생했습니다. 서버 HTML이 클라이언트 콘텐츠로 대체되었습니다. \<div\>에서.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Uncaught Error: 텍스트 내용이 서버 렌더링된 HTML과 일치하지 않습니다.
{'  '}at checkForUnmatchedText
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

이제 불일치의 차이점을 포함한 단일 메시지를 기록합니다:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Uncaught Error: 하이드레이션이 실패했습니다. 서버에서 렌더링된 HTML이 클라이언트와 일치하지 않았기 때문에 이 트리는 클라이언트에서 다시 생성됩니다. 이는 SSR된 클라이언트 컴포넌트가 다음을 사용한 경우 발생할 수 있습니다:{'\n'}
\- 서버/클라이언트 분기 `if (typeof window !== 'undefined')`.
\- 각 호출 시 변경되는 `Date.now()` 또는 `Math.random()`과 같은 변수 입력.
\- 서버와 일치하지 않는 사용자의 로케일에서의 날짜 형식.
\- HTML과 함께 스냅샷을 보내지 않은 외부 변경 데이터.
\- 잘못된 HTML 태그 중첩.{'\n'}
또한 클라이언트가 React를 로드하기 전에 HTML을 변경하는 브라우저 확장 프로그램이 설치된 경우에도 발생할 수 있습니다.{'\n'}
https://react.dev/link/hydration-mismatch {'\n'}
{'  '}\<App\>
{'    '}\<span\>
{'+    '}Client
{'-    '}Server{'\n'}
{'  '}at throwOnHydrationMismatch
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

### `<Context>`를 제공자로 사용 {/*context-as-a-provider*/}

React 19에서는 `<Context.Provider>` 대신 `<Context>`를 제공자로 렌더링할 수 있습니다:

```js {5,7}
const ThemeContext = createContext('');

function App({children}) {
  return (
    <ThemeContext value="dark">
      {children}
    </ThemeContext>
  );  
}
```

새로운 컨텍스트 제공자는 `<Context>`를 사용할 수 있으며, 기존 제공자를 변환하기 위한 codemod를 게시할 예정입니다. 향후 버전에서는 `<Context.Provider>`를 사용 중단할 예정입니다.

### refs에 대한 정리 함수 {/*cleanup-functions-for-refs*/}

이제 `ref` 콜백에서 정리 함수를 반환하는 것을 지원합니다:

```js {7-9}
<input
  ref={(ref) => {
    // ref 생성됨

    // NEW: 요소가 DOM에서 제거될 때
    // ref를 재설정하기 위한 정리 함수를 반환합니다.
    return () => {
      // ref 정리
    };
  }}
/>
```

컴포넌트가 언마운트될 때, React는 `ref` 콜백에서 반환된 정리 함수를 호출합니다. 이는 DOM refs, 클래스 컴포넌트에 대한 refs, `useImperativeHandle`에 대해 작동합니다.

<Note>

이전에는 컴포넌트를 언마운트할 때 React가 `null`로 `ref` 함수를 호출했습니다. `ref`가 정리 함수를 반환하는 경우, React는 이제 이 단계를 건너뜁니다.

향후 버전에서는 컴포넌트를 언마운트할 때 refs를 `null`로 호출하는 것을 사용 중단할 예정입니다.

</Note>

ref 정리 함수 도입으로 인해, 이제 `ref` 콜백에서 다른 것을 반환하는 것은 TypeScript에 의해 거부됩니다. 수정 방법은 일반적으로 암시적 반환을 중지하는 것입니다. 예를 들어:

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

원래 코드는 `HTMLDivElement`의 인스턴스를 반환했으며, TypeScript는 이것이 정리 함수인지 아니면 정리 함수를 반환하지 않으려는 것인지 알 수 없었습니다.

이 패턴은 [`no-implicit-ref-callback-return`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return)으로 codemod할 수 있습니다.

### `useDeferredValue` 초기 값 {/*use-deferred-value-initial-value*/}

`useDeferredValue`에 `initialValue` 옵션을 추가했습니다:

```js [[1, 1, "deferredValue"], [1, 4, "deferredValue"], [2, 4, "''"]]
function Search({deferredValue}) {
  // 초기 렌더링 시 값은 ''입니다.
  // 그런 다음 배경에서 deferredValue로 다시 렌더링이 예약됩니다.
  const value = useDeferredValue(deferredValue, '');
  
  return (
    <Results query={value} />
  );
}
```

<CodeStep step={2}>initialValue</CodeStep>가 제공되면, `useDeferredValue`는 컴포넌트의 초기 렌더링에 대해 이를 `value`로 반환하고, <CodeStep step={1}>deferredValue</CodeStep>로 다시 렌더링을 배경에서 예약합니다.

자세한 내용은 [`useDeferredValue`](/reference/react/useDeferredValue) 문서를 참조하세요.

### 문서 메타데이터 지원 {/*support-for-metadata-tags*/}

HTML에서 문서 메타데이터 태그인 `<title>`, `<link>`, `<meta>`는 문서의 `<head>` 섹션에 배치하기 위해 예약되어 있습니다. React에서는 앱에 적합한 메타데이터를 결정하는 컴포넌트가 `<head>`를 렌더링하는 위치에서 매우 멀리 떨어져 있거나 React가 `<head>`를 전혀 렌더링하지 않을 수 있습니다. 과거에는 이러한 요소를 효과적으로 수동으로 삽입하거나 [`react-helmet`](https://github.com/nfl/react-helmet)과 같은 라이브러리를 사용하여 삽입해야 했으며, React 애플리케이션을 서버 렌더링할 때 주의 깊게 처리해야 했습니다.

React 19에서는 컴포넌트에서 문서 메타데이터 태그를 네이티브로 렌더링하는 것을 지원하고 있습니다:

```js {5-8}
function BlogPost({post}) {
  return (
    <article>
      <h1>{post.title}</h1>
      <title>{post.title}</title>
      <meta name="author" content="Josh" />
      <link rel="author" href="https://twitter.com/joshcstory/" />
      <meta name="keywords" content={post.keywords} />
      <p>
        Eee equals em-see-squared...
      </p>
    </article>
  );
}
```

React가 이 컴포넌트를 렌더링할 때, `<title>`, `<link>`, `<meta>` 태그를 확인하고 이를 문서의 `<head>` 섹션으로 자동으로 올립니다. 이러한 메타데이터 태그를 네이티브로 지원함으로써 클라이언트 전용 앱, 스트리밍 SSR 및 Server Components와 함께 작동할 수 있도록 보장할 수 있습니다.

<Note>

#### 여전히 메타데이터 라이브러리가 필요할 수 있습니다 {/*you-may-still-want-a-metadata-library*/}

간단한 사용 사례의 경우, 태그로 문서 메타데이터를 렌더링하는 것이 적합할 수 있지만, 라이브러리는 현재 경로에 따라 일반 메타데이터를 특정 메타데이터로 재정의하는 것과 같은 더 강력한 기능을 제공할 수 있습니다. 이러한 기능은 프레임워크와 [`react-helmet`](https://github.com/nfl/react-helmet)과 같은 라이브러리가 메타데이터 태그를 지원하기 쉽게 만듭니다.

</Note>

자세한 내용은 [`<title>`](/reference/react-dom/components/title), [`<link>`](/reference/react-dom/components/link), [`<meta>`](/reference/react-dom/components/meta) 문서를 참조하세요.

### 스타일시트 지원 {/*support-for-stylesheets*/}

스타일시트는 외부 링크(``<link rel="stylesheet" href="...">``)와 인라인(``<style>...</style>``) 모두 스타일 우선순위 규칙 때문에 DOM에서 신중하게 배치해야 합니다. 컴포넌트 내에서 스타일시트 기능을 조합할 수 있도록 하는 것은 어렵기 때문에, 사용자는 종종 스타일을 로드하는 위치가 컴포넌트와 멀리 떨어져 있거나 스타일 라이브러리를 사용하여 이 복잡성을 캡슐화합니다.

React 19에서는 이 복잡성을 해결하고 클라이언트의 동시 렌더링 및 서버의 스트리밍 렌더링과의 통합을 더욱 깊이 있게 제공하여 스타일시트를 지원합니다. 스타일시트의 `precedence`를 React에 알려주면, React는 DOM에서 스타일시트의 삽입 순서를 관리하고 스타일시트(외부인 경우)가 해당 스타일 규칙에 의존하는 콘텐츠를 표시하기 전에 로드되도록 보장합니다.

```js {4,5,17}
function ComponentOne() {
  return (
    <Suspense fallback="loading...">
      <link rel="stylesheet" href="foo" precedence="default" />
      <link rel="stylesheet" href="bar" precedence="high" />
      <article class="foo-class bar-class">
        {...}
      </article>
    </Suspense>
  )
}

function ComponentTwo() {
  return (
    <div>
      <p>{...}</p>
      <link rel="stylesheet" href="baz" precedence="default" />  <-- foo와 bar 사이에 삽입됩니다.
    </div>
  )
}
```

서버 사이드 렌더링 중 React는 스타일시트를 `<head>`에 포함하여 브라우저가 로드될 때까지 페인트하지 않도록 보장합니다. 스트리밍을 시작한 후 스타일시트가 늦게 발견되면, React는 클라이언트에서 해당 스타일시트가 로드되기 전에 Suspense 경계의 콘텐츠를 표시하지 않도록 보장합니다.

클라이언트 사이드 렌더링 중 React는 새로 렌더링된 스타일시트가 로드될 때까지 렌더링을 커밋하지 않습니다. 애플리케이션의 여러 위치에서 이 컴포넌트를 렌더링하면 React는 문서에 스타일시트를 한 번만 포함합니다:

```js {5}
function App() {
  return <>
    <ComponentOne />
    ...
    <ComponentOne /> // DOM에 중복된 스타일시트 링크가 생성되지 않습니다.
  </>
}
```

스타일시트를 수동으로 로드하는 데 익숙한 사용자는 이러한 스타일시트를 해당 스타일 규칙에 의존하는 컴포넌트와 함께 배치하여 더 나은 로컬 추론을 할 수 있으며 실제로 의존하는 스타일시트만 로드하는 것을 더 쉽게 보장할 수 있습니다.

스타일 라이브러리 및 번들러와의 스타일 통합도 이 새로운 기능을 채택할 수 있으므로 직접 스타일시트를 렌더링하지 않더라도 도구가 이 기능을 사용하도록 업그레이드되면 여전히 혜택을 받을 수 있습니다.

자세한 내용은 [`<link>`](/reference/react-dom/components/link) 및 [`<style>`](/reference/react-dom/components/style) 문서를 참조하세요.

### 비동기 스크립트 지원 {/*support-for-async-scripts*/}

HTML에서 일반 스크립트(``<script src="...">``)와 지연된 스크립트(``<script defer="" src="...">``)는 문서 순서대로 로드되므로 컴포넌트 트리 깊숙이 이러한 종류의 스크립트를 렌더링하는 것이 어렵습니다. 그러나 비동기 스크립트(``<script async="" src="...">``)는 임의의 순서로 로드됩니다.

React 19에서는 비동기 스크립트를 더 잘 지원하여 컴포넌트 트리 어디에서나, 실제로 스크립트에 의존하는 컴포넌트 내에서 렌더링할 수 있으며, 스크립트 인스턴스를 재배치하고 중복을 관리할 필요가 없습니다.

```js {4,15}
function MyComponent() {
  return (
    <div>
      <script async={true} src="..." />
      Hello World
    </div>
  )
}

function App() {
  <html>
    <body>
      <MyComponent>
      ...
      <MyComponent> // DOM에 중복된 스크립트가 생성되지 않습니다.
    </body>
  </html>
}
```

모든 렌더링 환경에서 비동기 스크립트는 중복되지 않으므로 React는 여러 다른 컴포넌트에서 렌더링되더라도 스크립트를 한 번만 로드하고 실행합니다.

서버 사이드 렌더링에서는 비동기 스크립트가 `<head>`에 포함되며, 스타일시트, 폰트 및 이미지 프리로드와 같은 페인트를 차단하는 더 중요한 리소스 뒤에 우선 순위가 매겨집니다.

자세한 내용은 [`<script>`](/reference/react-dom/components/script) 문서를 참조하세요.

### 리소스 프리로딩 지원 {/*support-for-preloading-resources*/}

초기 문서 로드 및 클라이언트 사이드 업데이트 중 브라우저가 로드할 리소스를 가능한 빨리 알리는 것은 페이지 성능에 큰 영향을 미칠 수 있습니다.

React 19에는 브라우저 리소스를 로드하고 프리로딩하기 위한 새로운 API가 포함되어 있어 비효율적인 리소스 로딩에 방해받지 않는 훌륭한 경험을 구축하는 것을 최대한 쉽게 만듭니다.

```js
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom'
function MyComponent() {
  preinit('https://.../path/to/some/script.js', {as: 'script' }) // 이 스크립트를 적극적으로 로드하고 실행합니다.
  preload('https://.../path/to/font.woff', { as: 'font' }) // 이 폰트를 프리로딩합니다.
  preload('https://.../path/to/stylesheet.css', { as: 'style' }) // 이 스타일시트를 프리로딩합니다.
  prefetchDNS('https://...') // 이 호스트에서 실제로 요청할 수 없는 경우
  preconnect('https://...') // 요청할 것이지만 무엇인지 확실하지 않은 경우
}
```
```html
<!-- 위 코드는 다음과 같은 DOM/HTML을 생성합니다 -->
<html>
  <head>
    <!-- 링크/스크립트는 호출 순서가 아닌 초기 로딩에 대한 유틸리티에 따라 우선 순위가 매겨집니다 -->
    <link rel="prefetch-dns" href="https://...">
    <link rel="preconnect" href="https://...">
    <link rel="preload" as="font" href="https://.../path/to/font.woff">
    <link rel="preload" as="style" href="https://.../path/to/stylesheet.css">
    <script async="" src="https://.../path/to/some/script.js"></script>
  </head>
  <body>
    ...
  </body>
</html>
```

이 API는 스타일시트 로딩에서 추가 리소스의 발견을 이동하여 초기 페이지 로드를 최적화하는 데 사용할 수 있습니다. 또한 예상되는 탐색에서 사용되는 리소스를 프리페치하고 클릭 또는 심지어 호버 시 이러한 리소스를 적극적으로 프리로딩하여 클라이언트 업데이트를 더 빠르게 만들 수 있습니다.

자세한 내용은 [Resource Preloading APIs](/reference/react-dom#resource-preloading-apis)를 참조하세요.

### 서드파티 스크립트 및 확장 프로그램과의 호환성 {/*compatibility-with-third-party-scripts-and-extensions*/}

서드파티 스크립트 및 브라우저 확장 프로그램을 고려하여 하이드레이션을 개선했습니다.

하이드레이션 시, 클라이언트에서 렌더링된 요소가 서버에서 가져온 HTML의 요소와 일치하지 않으면, React는 클라이언트 재렌더링을 강제하여 콘텐츠를 수정합니다. 이전에는 서드파티 스크립트 또는 브라우저 확장 프로그램에 의해 삽입된 요소가 있으면 불일치 오류가 발생하고 클라이언트 렌더링이 트리거되었습니다.

React 19에서는 `<head>` 및 `<body>`에서 예상치 못한 태그를 건너뛰어 불일치 오류를 피합니다. React가 관련 없는 하이드레이션 불일치로 인해 전체 문서를 다시 렌더링해야 하는 경우, 서드파티 스크립트 및 브라우저 확장 프로그램에 의해 삽입된 스타일시트를 그대로 둡니다.

### 더 나은 오류 보고 {/*error-handling*/}

React 19에서는 오류 처리를 개선하여 중복을 제거하고 잡힌 오류와 잡히지 않은 오류를 처리할 수 있는 옵션을 제공합니다. 예를 들어, Error Boundary에서 렌더링 중 오류가 발생하면, 이전에는 React가 오류를 두 번(원래 오류 한 번, 자동 복구 실패 후 한 번) 던지고, 오류가 발생한 위치에 대한 정보를 `console.error`로 호출했습니다.

이로 인해 잡힌 오류마다 세 개의 오류가 발생했습니다:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Uncaught Error: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

Uncaught Error: hit<span className="ms-2 text-gray-30">{'    <--'} 중복</span>
{'  '}at Throws
{'   '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

위의 오류는 Throws 컴포넌트에서 발생했습니다:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
React는 제공된 오류 경계를 사용하여 이 컴포넌트 트리를 처음부터 다시 생성하려고 합니다, ErrorBoundary.

</ConsoleLogLine>

</ConsoleBlockMulti>

React 19에서는 모든 오류 정보를 포함한 단일 오류를 기록합니다:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Error: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...{'\n'}
위의 오류는 Throws 컴포넌트에서 발생했습니다:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
React는 제공된 오류 경계를 사용하여 이 컴포넌트 트리를 처음부터 다시 생성하려고 합니다, ErrorBoundary.
{'  '}at ErrorBoundary
{'  '}at App

</ConsoleLogLine>

</ConsoleBlockMulti>

또한, `onRecoverableError`를 보완하는 두 가지 새로운 루트 옵션을 추가했습니다:

- `onCaughtError`: Error Boundary에서 오류를 잡았을 때 호출됩니다.
- `onUncaughtError`: 오류가 발생하고 Error Boundary에서 잡히지 않았을 때 호출됩니다.
- `onRecoverableError`: 오류가 발생하고 자동으로 복구될 때 호출됩니다.

자세한 정보와 예제는 [`createRoot`](/reference/react-dom/client/createRoot) 및 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 문서를 참조하세요.

### Custom Elements 지원 {/*support-for-custom-elements*/}

React 19는 Custom Elements에 대한 완전한 지원을 추가하고 [Custom Elements Everywhere](https://custom-elements-everywhere.com/)의 모든 테스트를 통과합니다.

이전 버전에서는 React가 인식되지 않은 props를 속성으로 처리했기 때문에 React에서 Custom Elements를 사용하는 것이 어려웠습니다. React 19에서는 다음 전략을 사용하여 클라이언트 및 SSR 중에 작동하는 속성에 대한 지원을 추가했습니다:

- **서버 사이드 렌더링**: Custom Element에 전달된 props는 `string`, `number`와 같은 원시 값이거나 값이 `true`인 경우 속성으로 렌더링됩니다. `object`, `symbol`, `function`과 같은 비원시 타입의 props 또는 값이 `false`인 경우 생략됩니다.
- **클라이언트 사이드 렌더링**: Custom Element 인스턴스의 속성과 일치하는 props는 속성으로 할당되며, 그렇지 않으면 속성으로 할당됩니다.

Custom Element 지원의 설계 및 구현을 주도한 [Joey Arhar](https://github.com/josepharhar)에게 감사드립니다.

#### 업그레이드 방법 {/*how-to-upgrade*/}
단계별 지침과 중대한 변경 사항 및 주목할 만한 변경 사항의 전체 목록은 [React 19 업그레이드 가이드](/blog/2024/04/25/react-19-upgrade-guide)를 참조하세요.