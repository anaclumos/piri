---
title: useId
---

<Intro>

`useId`는 접근성 속성에 전달할 수 있는 고유 ID를 생성하기 위한 React Hook입니다.

```js
const id = useId()
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `useId()` {/*useid*/}

고유 ID를 생성하기 위해 컴포넌트의 최상위 레벨에서 `useId`를 호출하세요:

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

`useId`는 매개변수를 받지 않습니다.

#### 반환값 {/*returns*/}

`useId`는 이 특정 컴포넌트의 이 특정 `useId` 호출과 관련된 고유 ID 문자열을 반환합니다.

#### 주의사항 {/*caveats*/}

* `useId`는 Hook이므로 **컴포넌트의 최상위 레벨** 또는 자체 Hook에서만 호출할 수 있습니다. 루프나 조건문 내에서 호출할 수 없습니다. 그런 경우에는 새로운 컴포넌트를 추출하고 상태를 그 안으로 이동하세요.

* `useId`는 **목록에서 키를 생성하는 데 사용해서는 안 됩니다**. [키는 데이터에서 생성되어야 합니다.](/learn/rendering-lists#where-to-get-your-key)

---

## 사용법 {/*usage*/}

<Pitfall>

**목록에서 키를 생성하기 위해 `useId`를 호출하지 마세요.** [키는 데이터에서 생성되어야 합니다.](/learn/rendering-lists#where-to-get-your-key)

</Pitfall>

### 접근성 속성을 위한 고유 ID 생성 {/*generating-unique-ids-for-accessibility-attributes*/}

고유 ID를 생성하기 위해 컴포넌트의 최상위 레벨에서 `useId`를 호출하세요:

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

그런 다음 <CodeStep step={1}>생성된 ID</CodeStep>를 다양한 속성에 전달할 수 있습니다:

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**이것이 유용한 경우를 예제로 살펴보겠습니다.**

[HTML 접근성 속성](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)인 [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby)와 같은 속성은 두 태그가 서로 관련이 있음을 지정할 수 있게 해줍니다. 예를 들어, 입력 요소와 같은 요소가 단락과 같은 다른 요소에 의해 설명된다고 지정할 수 있습니다.

일반 HTML에서는 다음과 같이 작성합니다:

```html {5,8}
<label>
  Password:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  비밀번호는 최소 18자 이상이어야 합니다
</p>
```

그러나 React에서는 이렇게 ID를 하드코딩하는 것은 좋은 방법이 아닙니다. 컴포넌트는 페이지에 여러 번 렌더링될 수 있지만, ID는 고유해야 합니다! ID를 하드코딩하는 대신 `useId`로 고유 ID를 생성하세요:

```js {4,11,14}
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        비밀번호는 최소 18자 이상이어야 합니다
      </p>
    </>
  );
}
```

이제 `PasswordField`가 화면에 여러 번 나타나더라도 생성된 ID가 충돌하지 않습니다.

<Sandpack>

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        비밀번호는 최소 18자 이상이어야 합니다
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>비밀번호 선택</h2>
      <PasswordField />
      <h2>비밀번호 확인</h2>
      <PasswordField />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

[이 비디오를 시청하세요](https://www.youtube.com/watch?v=0dNzNcuEuOo) 보조 기술을 사용하는 사용자 경험의 차이를 확인할 수 있습니다.

<Pitfall>

[서버 렌더링](/reference/react-dom/server)과 함께, **`useId`는 서버와 클라이언트에서 동일한 컴포넌트 트리를 필요로 합니다**. 서버와 클라이언트에서 렌더링된 트리가 정확히 일치하지 않으면 생성된 ID가 일치하지 않습니다.

</Pitfall>

<DeepDive>

#### 왜 useId가 증가하는 카운터보다 나은가요? {/*why-is-useid-better-than-an-incrementing-counter*/}

`useId`가 `nextId++`와 같은 전역 변수를 증가시키는 것보다 왜 나은지 궁금할 수 있습니다.

`useId`의 주요 이점은 React가 [서버 렌더링](/reference/react-dom/server)과 함께 작동하도록 보장한다는 것입니다. 서버 렌더링 동안, 컴포넌트는 HTML 출력을 생성합니다. 나중에 클라이언트에서 [하이드레이션](/reference/react-dom/client/hydrateRoot)은 생성된 HTML에 이벤트 핸들러를 연결합니다. 하이드레이션이 작동하려면 클라이언트 출력이 서버 HTML과 일치해야 합니다.

클라이언트 컴포넌트가 하이드레이션되는 순서가 서버 HTML이 출력된 순서와 일치하지 않을 수 있기 때문에 증가하는 카운터로 이를 보장하는 것은 매우 어렵습니다. `useId`를 호출함으로써 하이드레이션이 작동하고, 서버와 클라이언트 간의 출력이 일치하도록 보장할 수 있습니다.

React 내부에서 `useId`는 호출하는 컴포넌트의 "부모 경로"에서 생성됩니다. 이것이 클라이언트와 서버 트리가 동일한 경우, 렌더링 순서와 상관없이 "부모 경로"가 일치하는 이유입니다.

</DeepDive>

---

### 여러 관련 요소에 대한 ID 생성 {/*generating-ids-for-several-related-elements*/}

여러 관련 요소에 ID를 부여해야 하는 경우, `useId`를 호출하여 공유 접두사를 생성할 수 있습니다:

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>이름:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>성:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

이렇게 하면 고유 ID가 필요한 모든 요소에 대해 `useId`를 호출할 필요가 없습니다.

---

### 생성된 모든 ID에 대한 공유 접두사 지정 {/*specifying-a-shared-prefix-for-all-generated-ids*/}

단일 페이지에 여러 독립적인 React 애플리케이션을 렌더링하는 경우, [`createRoot`](/reference/react-dom/client/createRoot#parameters) 또는 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 호출에 옵션으로 `identifierPrefix`를 전달하세요. 이렇게 하면 두 개의 다른 앱에서 생성된 ID가 충돌하지 않도록 보장할 수 있습니다. `useId`로 생성된 모든 식별자는 지정한 고유 접두사로 시작합니다.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <div id="root1"></div>
    <div id="root2"></div>
  </body>
</html>
```

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  console.log('Generated identifier:', passwordHintId)
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        비밀번호는 최소 18자 이상이어야 합니다
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>비밀번호 선택</h2>
      <PasswordField />
    </>
  );
}
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```

```css
#root1 {
  border: 5px solid blue;
  padding: 10px;
  margin: 5px;
}

#root2 {
  border: 5px solid green;
  padding: 10px;
  margin: 5px;
}

input { margin: 5px; }
```

</Sandpack>

---

### 클라이언트와 서버에서 동일한 ID 접두사 사용 {/*using-the-same-id-prefix-on-the-client-and-the-server*/}

[단일 페이지에 여러 독립적인 React 앱을 렌더링하는 경우](#specifying-a-shared-prefix-for-all-generated-ids), 이들 앱 중 일부가 서버 렌더링된 경우, 클라이언트 측의 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 호출에 전달하는 `identifierPrefix`가 [서버 API](/reference/react-dom/server)인 [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) 등에 전달하는 `identifierPrefix`와 동일한지 확인하세요.

```js
// 서버
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(
  <App />,
  { identifierPrefix: 'react-app1' }
);
```

```js
// 클라이언트
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(
  domNode,
  reactNode,
  { identifierPrefix: 'react-app1' }
);
```

페이지에 React 앱이 하나만 있는 경우 `identifierPrefix`를 전달할 필요가 없습니다.