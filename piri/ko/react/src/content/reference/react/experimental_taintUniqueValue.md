---
title: experimental_taintUniqueValue
---

<Wip>

**이 API는 실험적이며 아직 안정적인 버전의 React에서는 사용할 수 없습니다.**

React 패키지를 최신 실험 버전으로 업그레이드하여 시도해볼 수 있습니다:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

React의 실험 버전에는 버그가 있을 수 있습니다. 프로덕션 환경에서는 사용하지 마세요.

이 API는 [React Server Components](/reference/rsc/use-client) 내에서만 사용할 수 있습니다.

</Wip>


<Intro>

`taintUniqueValue`는 비밀번호, 키, 또는 토큰과 같은 고유 값을 Client Components에 전달하는 것을 방지할 수 있게 해줍니다.

```js
taintUniqueValue(errMessage, lifetime, value)
```

민감한 데이터를 포함하는 객체의 전달을 방지하려면 [`taintObjectReference`](/reference/react/experimental_taintObjectReference)를 참조하세요.

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `taintUniqueValue(message, lifetime, value)` {/*taintuniquevalue*/}

비밀번호, 토큰, 키 또는 해시를 `taintUniqueValue`로 호출하여 React에 Client로 전달되지 않아야 하는 값으로 등록합니다:

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  '비밀 키를 클라이언트로 전달하지 마세요.',
  process,
  process.env.SECRET_KEY
);
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `message`: `value`가 Client Component에 전달될 경우 표시할 메시지입니다. 이 메시지는 `value`가 Client Component에 전달될 경우 발생하는 오류의 일부로 표시됩니다.

* `lifetime`: `value`가 얼마나 오랫동안 taint 상태로 유지될지를 나타내는 객체입니다. 이 객체가 존재하는 동안 `value`는 어떤 Client Component에도 전달되지 않습니다. 예를 들어, `globalThis`를 전달하면 앱의 수명 동안 값을 차단합니다. `lifetime`은 일반적으로 `value`를 포함하는 속성을 가진 객체입니다.

* `value`: 문자열, bigint 또는 TypedArray입니다. `value`는 암호화 토큰, 개인 키, 해시 또는 긴 비밀번호와 같은 높은 엔트로피를 가진 고유한 문자 또는 바이트 시퀀스여야 합니다. `value`는 어떤 Client Component에도 전달되지 않습니다.

#### 반환값 {/*returns*/}

`experimental_taintUniqueValue`는 `undefined`를 반환합니다.

#### 주의사항 {/*caveats*/}

* tainted 값에서 새로운 값을 도출하면 taint 보호가 손상될 수 있습니다. tainted 값을 대문자로 변환하거나, tainted 문자열 값을 더 큰 문자열로 연결하거나, tainted 값을 base64로 변환하거나, tainted 값을 부분 문자열로 반환하는 등의 유사한 변환으로 생성된 새로운 값은 명시적으로 `taintUniqueValue`를 호출하지 않는 한 tainted되지 않습니다.
* PIN 코드나 전화번호와 같은 낮은 엔트로피 값을 보호하기 위해 `taintUniqueValue`를 사용하지 마세요. 요청의 어떤 값이 공격자에 의해 제어될 경우, 비밀의 모든 가능한 값을 열거하여 어떤 값이 tainted인지 추론할 수 있습니다.

---

## 사용법 {/*usage*/}

### 토큰이 Client Components에 전달되지 않도록 방지하기 {/*prevent-a-token-from-being-passed-to-client-components*/}

비밀번호, 세션 토큰 또는 기타 고유한 값과 같은 민감한 정보가 실수로 Client Components에 전달되지 않도록 하기 위해 `taintUniqueValue` 함수는 보호 계층을 제공합니다. 값이 tainted되면 이를 Client Component에 전달하려는 모든 시도는 오류를 발생시킵니다.

`lifetime` 인수는 값이 tainted 상태로 유지되는 기간을 정의합니다. 무기한으로 tainted 상태로 유지되어야 하는 값의 경우, [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) 또는 `process`와 같은 객체가 `lifetime` 인수로 사용될 수 있습니다. 이러한 객체는 앱 실행 전체 기간 동안 수명을 가집니다.

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  '사용자 비밀번호를 클라이언트로 전달하지 마세요.',
  globalThis,
  process.env.SECRET_KEY
);
```

tainted 값의 수명이 객체에 연결된 경우, `lifetime`은 값을 캡슐화하는 객체여야 합니다. 이렇게 하면 캡슐화 객체의 수명 동안 tainted 값이 보호됩니다.

```js
import {experimental_taintUniqueValue} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintUniqueValue(
    '사용자 세션 토큰을 클라이언트로 전달하지 마세요.',
    user,
    user.session.token
  );
  return user;
}
```

이 예제에서 `user` 객체는 `lifetime` 인수로 사용됩니다. 이 객체가 전역 캐시에 저장되거나 다른 요청에 의해 접근 가능해지면 세션 토큰은 tainted 상태로 유지됩니다.

<Pitfall>

**보안을 위해 tainting에만 의존하지 마세요.** 값을 tainting하는 것은 모든 가능한 파생 값을 차단하지 않습니다. 예를 들어, tainted 문자열을 대문자로 변환하여 새 값을 생성하는 것은 새 값을 tainting하지 않습니다.

```js
import {experimental_taintUniqueValue} from 'react';

const password = 'correct horse battery staple';

experimental_taintUniqueValue(
  '비밀번호를 클라이언트로 전달하지 마세요.',
  globalThis,
  password
);

const uppercasePassword = password.toUpperCase() // `uppercasePassword`는 tainted되지 않음
```

이 예제에서 상수 `password`는 tainted됩니다. 그런 다음 `password`를 사용하여 `toUpperCase` 메서드를 호출하여 새 값 `uppercasePassword`를 생성합니다. 새로 생성된 `uppercasePassword`는 tainted되지 않습니다.

tainted 값에서 새로운 값을 도출하는 다른 유사한 방법들, 예를 들어 더 큰 문자열로 연결하거나, base64로 변환하거나, 부분 문자열을 반환하는 것은 tainted되지 않은 값을 생성합니다.

tainting은 비밀 값을 클라이언트에 명시적으로 전달하는 것과 같은 간단한 실수를 방지하는 데만 보호 기능을 제공합니다. React 외부의 전역 저장소를 사용하는 것과 같은 `taintUniqueValue` 호출 실수는 tainted 값을 tainted되지 않게 만들 수 있습니다. tainting은 보호 계층 중 하나일 뿐입니다. 안전한 앱은 여러 보호 계층, 잘 설계된 API 및 격리 패턴을 가집니다.

</Pitfall>

<DeepDive>

#### `server-only`와 `taintUniqueValue`를 사용하여 비밀 유출 방지하기 {/*using-server-only-and-taintuniquevalue-to-prevent-leaking-secrets*/}

데이터베이스 비밀번호와 같은 비밀 키나 비밀번호에 접근할 수 있는 Server Components 환경을 실행 중인 경우, 이를 Client Component에 전달하지 않도록 주의해야 합니다.

```js
export async function Dashboard(props) {
  // 이렇게 하지 마세요
  return <Overview password={process.env.API_PASSWORD} />;
}
```

```js
"use client";

import {useEffect} from '...'

export async function Overview({ password }) {
  useEffect(() => {
    const headers = { Authorization: password };
    fetch(url, { headers }).then(...);
  }, [password]);
  ...
}
```

이 예제는 비밀 API 토큰을 클라이언트에 유출시킬 수 있습니다. 이 API 토큰이 특정 사용자가 접근해서는 안 되는 데이터를 접근할 수 있게 한다면, 데이터 유출로 이어질 수 있습니다.

[comment]: <> (TODO: `server-only` 문서가 작성되면 링크 추가)

이와 같은 비밀은 서버의 신뢰할 수 있는 데이터 유틸리티에서만 가져올 수 있는 단일 헬퍼 파일로 추상화하는 것이 이상적입니다. 이 헬퍼는 [`server-only`](https://www.npmjs.com/package/server-only)로 태그되어 클라이언트에서 이 파일을 가져오지 않도록 할 수도 있습니다.

```js
import "server-only";

export function fetchAPI(url) {
  const headers = { Authorization: process.env.API_PASSWORD };
  return fetch(url, { headers });
}
```

때때로 리팩토링 중 실수가 발생할 수 있으며, 모든 동료가 이를 알지 못할 수도 있습니다. 
이러한 실수를 방지하기 위해 실제 비밀번호를 "taint"할 수 있습니다:

```js
import "server-only";
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'API 토큰 비밀번호를 클라이언트로 전달하지 마세요. ' +
    '대신 모든 fetch 작업을 서버에서 수행하세요.'
  process,
  process.env.API_PASSWORD
);
```

이제 누군가가 이 비밀번호를 Client Component에 전달하려 하거나 Server Action을 통해 비밀번호를 Client Component에 보내려 할 때, `taintUniqueValue`를 호출할 때 정의한 메시지와 함께 오류가 발생합니다.

</DeepDive>

---