---
title: experimental_taintObjectReference
---

<Wip>

**이 API는 실험적이며 아직 안정적인 버전의 React에서는 사용할 수 없습니다.**

React 패키지를 최신 실험 버전으로 업그레이드하여 시도해 볼 수 있습니다:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

React의 실험 버전은 버그가 있을 수 있습니다. 프로덕션 환경에서는 사용하지 마세요.

이 API는 React Server Components 내에서만 사용할 수 있습니다.

</Wip>


<Intro>

`taintObjectReference`는 `user` 객체와 같은 특정 객체 인스턴스가 Client Component로 전달되지 않도록 방지할 수 있습니다.

```js
experimental_taintObjectReference(message, object);
```

키, 해시 또는 토큰의 전달을 방지하려면 [`taintUniqueValue`](/reference/react/experimental_taintUniqueValue)를 참조하세요.

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `taintObjectReference(message, object)` {/*taintobjectreference*/}

객체를 `taintObjectReference`로 호출하여 React에 클라이언트로 그대로 전달되지 않도록 등록합니다:

```js
import {experimental_taintObjectReference} from 'react';

experimental_taintObjectReference(
  '모든 환경 변수를 클라이언트에 전달하지 마세요.',
  process.env
);
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### Parameters {/*parameters*/}

* `message`: 객체가 Client Component로 전달될 경우 표시할 메시지입니다. 이 메시지는 객체가 Client Component로 전달될 경우 발생하는 오류의 일부로 표시됩니다.

* `object`: 오염시킬 객체입니다. 함수와 클래스 인스턴스는 `object`로 `taintObjectReference`에 전달될 수 있습니다. 함수와 클래스는 이미 Client Components로 전달되는 것이 차단되지만, React의 기본 오류 메시지는 `message`에 정의된 내용으로 대체됩니다. 특정 Typed Array 인스턴스가 `object`로 `taintObjectReference`에 전달되면, 다른 모든 Typed Array 복사본은 오염되지 않습니다.

#### Returns {/*returns*/}

`experimental_taintObjectReference`는 `undefined`를 반환합니다.

#### Caveats {/*caveats*/}

- 오염된 객체를 재생성하거나 복제하면 민감한 데이터를 포함할 수 있는 새로운 오염되지 않은 객체가 생성됩니다. 예를 들어, 오염된 `user` 객체가 있는 경우, `const userInfo = {name: user.name, ssn: user.ssn}` 또는 `{...user}`는 오염되지 않은 새로운 객체를 생성합니다. `taintObjectReference`는 객체가 변경되지 않은 상태로 Client Component에 전달될 때 발생하는 단순한 실수를 방지하는 데만 보호 기능을 제공합니다.

<Pitfall>

**보안 목적으로 오염에만 의존하지 마세요.** 객체를 오염시키는 것은 모든 가능한 파생 값을 누출하는 것을 방지하지 않습니다. 예를 들어, 오염된 객체의 복제본은 새로운 오염되지 않은 객체를 생성합니다. 오염된 객체의 데이터를 사용하는 것(e.g. `{secret: taintedObj.secret}`)은 새로운 값이나 오염되지 않은 객체를 생성합니다. 오염은 보호의 한 층일 뿐입니다; 안전한 앱은 여러 보호 층, 잘 설계된 API, 격리 패턴을 갖추고 있어야 합니다.

</Pitfall>

---

## Usage {/*usage*/}

### 사용자 데이터가 의도치 않게 클라이언트에 도달하는 것을 방지하기 {/*prevent-user-data-from-unintentionally-reaching-the-client*/}

Client Component는 민감한 데이터를 포함한 객체를 절대 받아서는 안 됩니다. 이상적으로는 데이터 가져오기 함수가 현재 사용자가 접근할 수 없는 데이터를 노출하지 않아야 합니다. 때때로 리팩토링 중에 실수가 발생할 수 있습니다. 이러한 실수를 방지하기 위해 데이터 API에서 사용자 객체를 "오염"시킬 수 있습니다.

```js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    '전체 사용자 객체를 클라이언트에 전달하지 마세요. ' +
      '대신, 이 사용 사례에 필요한 특정 속성을 선택하세요.',
    user,
  );
  return user;
}
```

이제 누군가가 이 객체를 Client Component에 전달하려고 하면, 전달된 오류 메시지와 함께 오류가 발생합니다.

<DeepDive>

#### 데이터 가져오기에서 누출 방지하기 {/*protecting-against-leaks-in-data-fetching*/}

민감한 데이터에 접근할 수 있는 Server Components 환경을 실행 중인 경우, 객체를 바로 전달하지 않도록 주의해야 합니다:

```js
// api.js
export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  return user;
}
```

```js
import { getUser } from 'api.js';
import { InfoCard } from 'components.js';

export async function Profile(props) {
  const user = await getUser(props.userId);
  // 이렇게 하지 마세요
  return <InfoCard user={user} />;
}
```

```js
// components.js
"use client";

export async function InfoCard({ user }) {
  return <div>{user.name}</div>;
}
```

이상적으로는 `getUser`가 현재 사용자가 접근할 수 없는 데이터를 노출하지 않아야 합니다. `user` 객체를 Client Component에 전달하지 않도록 하기 위해 사용자 객체를 "오염"시킬 수 있습니다:

```js
// api.js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    '전체 사용자 객체를 클라이언트에 전달하지 마세요. ' +
      '대신, 이 사용 사례에 필요한 특정 속성을 선택하세요.',
    user,
  );
  return user;
}
```

이제 누군가가 `user` 객체를 Client Component에 전달하려고 하면, 전달된 오류 메시지와 함께 오류가 발생합니다.

</DeepDive>