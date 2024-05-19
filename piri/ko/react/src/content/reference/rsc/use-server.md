---
title: 'use server'
titleForTitleTag: 'use server' directive
canary: true
---

<Canary>

`'use server'`는 [React Server Components를 사용하는 경우](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) 또는 그와 호환되는 라이브러리를 빌드하는 경우에만 필요합니다.

</Canary>


<Intro>

`'use server'`는 클라이언트 측 코드에서 호출할 수 있는 서버 측 함수를 표시합니다.

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `'use server'` {/*use-server*/}

비동기 함수 본문의 맨 위에 `'use server'`를 추가하여 클라이언트에서 호출할 수 있는 함수로 표시합니다. 이러한 함수를 _서버 액션_이라고 합니다.

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

클라이언트에서 서버 액션을 호출할 때, 전달된 인수의 직렬화된 사본을 포함하는 네트워크 요청이 서버로 전송됩니다. 서버 액션이 값을 반환하면 해당 값이 직렬화되어 클라이언트로 반환됩니다.

개별 함수에 `'use server'`를 표시하는 대신, 파일 상단에 지시문을 추가하여 해당 파일 내의 모든 내보내기를 클라이언트 코드에서 가져올 수 있는 서버 액션으로 표시할 수 있습니다.

#### 주의사항 {/*caveats*/}
* `'use server'`는 함수나 모듈의 맨 처음에 있어야 하며, 다른 코드(주석 제외)보다 위에 있어야 합니다. 단일 또는 이중 따옴표로 작성해야 하며, 백틱은 사용할 수 없습니다.
* `'use server'`는 서버 측 파일에서만 사용할 수 있습니다. 결과 서버 액션은 props를 통해 클라이언트 컴포넌트에 전달될 수 있습니다. 지원되는 [직렬화 유형](#serializable-parameters-and-return-values)을 참조하세요.
* [클라이언트 코드](/reference/rsc/use-client)에서 서버 액션을 가져오려면 모듈 수준에서 지시문을 사용해야 합니다.
* 기본 네트워크 호출이 항상 비동기이므로 `'use server'`는 비동기 함수에서만 사용할 수 있습니다.
* 서버 액션의 인수를 신뢰할 수 없는 입력으로 취급하고 모든 변형을 승인해야 합니다. [보안 고려 사항](#security)을 참조하세요.
* 서버 액션은 서버 측 상태를 업데이트하는 변형을 위해 설계되었으며, 데이터 페칭에는 권장되지 않습니다. 따라서 서버 액션을 구현하는 프레임워크는 일반적으로 한 번에 하나의 액션을 처리하며 반환 값을 캐시하는 방법이 없습니다.

### 보안 고려 사항 {/*security*/}

서버 액션의 인수는 완전히 클라이언트에서 제어됩니다. 보안을 위해 항상 이를 신뢰할 수 없는 입력으로 취급하고, 적절하게 인수를 검증하고 이스케이프 처리해야 합니다.

어떤 서버 액션에서도 로그인한 사용자가 해당 액션을 수행할 수 있는지 확인해야 합니다.

<Wip>

서버 액션에서 민감한 데이터를 전송하지 않도록 하기 위해, 고유 값과 객체가 클라이언트 코드로 전달되지 않도록 하는 실험적 오염 API가 있습니다.

[experimental_taintUniqueValue](/reference/react/experimental_taintUniqueValue) 및 [experimental_taintObjectReference](/reference/react/experimental_taintObjectReference)를 참조하세요.

</Wip>

### 직렬화 가능한 인수 및 반환 값 {/*serializable-parameters-and-return-values*/}

클라이언트 코드가 네트워크를 통해 서버 액션을 호출할 때, 전달된 인수는 직렬화 가능해야 합니다.

서버 액션 인수로 지원되는 유형은 다음과 같습니다:

* 원시값
	* [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)를 통해 전역 심볼 레지스트리에 등록된 심볼만 해당
* 직렬화 가능한 값을 포함하는 반복 가능한 객체
	* [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 및 [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) 인스턴스
* 직렬화 가능한 속성을 가진 [객체 초기화자](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)로 생성된 평범한 [객체](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
* 서버 액션인 함수
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

특히, 다음은 지원되지 않습니다:
* React 요소 또는 [JSX](/learn/writing-markup-with-jsx)
* 컴포넌트 함수나 서버 액션이 아닌 모든 함수
* [클래스](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* (언급된 내장 객체 외에) 어떤 클래스의 인스턴스인 객체 또는 [null 프로토타입](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)을 가진 객체
* 전역적으로 등록되지 않은 심볼, 예: `Symbol('my new symbol')`

지원되는 직렬화 가능한 반환 값은 경계 클라이언트 컴포넌트에 대한 [직렬화 가능한 props](/reference/rsc/use-client#passing-props-from-server-to-client-components)와 동일합니다.


## 사용법 {/*usage*/}

### 폼에서 서버 액션 사용 {/*server-actions-in-forms*/}

서버 액션의 가장 일반적인 사용 사례는 데이터를 변형하는 서버 함수를 호출하는 것입니다. 브라우저에서 [HTML form 요소](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)는 사용자가 변형을 제출하는 전통적인 방법입니다. React Server Components를 사용하면 React는 [forms](/reference/react-dom/components/form)에서 서버 액션에 대한 일급 지원을 도입합니다.

다음은 사용자가 사용자 이름을 요청할 수 있는 폼입니다.

```js [[1, 3, "formData"]]
// App.js

async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">Request</button>
    </form>
  );
}
```

이 예제에서 `requestUsername`은 `<form>`에 전달된 서버 액션입니다. 사용자가 이 폼을 제출하면 서버 함수 `requestUsername`에 네트워크 요청이 전송됩니다. 폼에서 서버 액션을 호출할 때, React는 폼의 <CodeStep step={1}>[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep>를 서버 액션의 첫 번째 인수로 제공합니다.

폼 `action`에 서버 액션을 전달함으로써 React는 폼을 [점진적으로 향상](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)시킬 수 있습니다. 이는 JavaScript 번들이 로드되기 전에 폼을 제출할 수 있음을 의미합니다.

#### 폼에서 반환 값 처리 {/*handling-return-values*/}

사용자 이름 요청 폼에서는 사용자 이름이 사용 가능하지 않을 가능성이 있습니다. `requestUsername`은 실패 여부를 알려야 합니다.

점진적 향상을 지원하면서 서버 액션의 결과를 기반으로 UI를 업데이트하려면 [`useActionState`](/reference/react/useActionState)를 사용하세요.

```js
// requestUsername.js
'use server';

export default async function requestUsername(formData) {
  const username = formData.get('username');
  if (canRequest(username)) {
    // ...
    return 'successful';
  }
  return 'failed';
}
```

```js {4,8}, [[2, 2, "'use client'"]]
// UsernameForm.js
'use client';

import { useActionState } from 'react';
import requestUsername from './requestUsername';

function UsernameForm() {
  const [state, action] = useActionState(requestUsername, null, 'n/a');

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">Request</button>
      </form>
      <p>Last submission request returned: {state}</p>
    </>
  );
}
```

대부분의 Hooks와 마찬가지로, `useActionState`는 <CodeStep step={1}>[클라이언트 코드](/reference/rsc/use-client)</CodeStep>에서만 호출할 수 있습니다.

### `<form>` 외부에서 서버 액션 호출 {/*calling-a-server-action-outside-of-form*/}

서버 액션은 노출된 서버 엔드포인트이며 클라이언트 코드 어디에서나 호출할 수 있습니다.

[폼](/reference/react-dom/components/form) 외부에서 서버 액션을 사용할 때, 서버 액션을 [Transition](/reference/react/useTransition)에서 호출하여 로딩 표시기를 표시하고, [낙관적 상태 업데이트](/reference/react/useOptimistic)를 보여주며, 예기치 않은 오류를 처리할 수 있습니다. 폼은 자동으로 서버 액션을 트랜지션으로 래핑합니다.

```js {9-12}
import incrementLike from './actions';
import { useState, useTransition } from 'react';

function LikeButton() {
  const [isPending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(0);

  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike();
      setLikeCount(currentCount);
    });
  };

  return (
    <>
      <p>Total Likes: {likeCount}</p>
      <button onClick={onClick} disabled={isPending}>Like</button>;
    </>
  );
}
```

```js
// actions.js
'use server';

let likeCount = 0;
export default async function incrementLike() {
  likeCount++;
  return likeCount;
}
```

서버 액션 반환 값을 읽으려면 반환된 promise를 `await`해야 합니다.