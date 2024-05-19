---
title: preconnect
canary: true
---

<Canary>

`preconnect` 함수는 현재 React의 Canary 및 실험 채널에서만 사용할 수 있습니다. [React의 릴리스 채널에 대해 자세히 알아보세요](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`preconnect`를 사용하면 리소스를 로드할 것으로 예상되는 서버에 미리 연결할 수 있습니다.

```js
preconnect("https://example.com");
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `preconnect(href)` {/*preconnect*/}

호스트에 미리 연결하려면 `react-dom`에서 `preconnect` 함수를 호출하세요.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  // ...
}

```

[아래에서 더 많은 예제를 확인하세요.](#usage)

`preconnect` 함수는 브라우저에 주어진 서버에 연결을 열어야 한다는 힌트를 제공합니다. 브라우저가 이를 선택하면 해당 서버에서 리소스를 로드하는 속도가 빨라질 수 있습니다.

#### 매개변수 {/*parameters*/}

* `href`: 문자열. 연결하려는 서버의 URL입니다.

#### 반환값 {/*returns*/}

`preconnect`는 아무것도 반환하지 않습니다.

#### 주의사항 {/*caveats*/}

* 동일한 서버에 대해 여러 번 `preconnect`를 호출하는 것은 한 번 호출하는 것과 동일한 효과를 가집니다.
* 브라우저에서는 컴포넌트를 렌더링할 때, Effect에서, 이벤트 핸들러에서 등 어떤 상황에서도 `preconnect`를 호출할 수 있습니다.
* 서버 사이드 렌더링 또는 Server Components를 렌더링할 때, 컴포넌트를 렌더링하는 동안 또는 컴포넌트를 렌더링하는 것에서 시작된 비동기 컨텍스트에서 호출하는 경우에만 `preconnect`가 효과가 있습니다. 다른 모든 호출은 무시됩니다.
* 필요한 특정 리소스를 알고 있다면, 리소스를 바로 로드할 수 있는 [다른 함수들](/reference/react-dom/#resource-preloading-apis)을 호출할 수 있습니다.
* 웹페이지 자체가 호스팅되는 동일한 서버에 미리 연결하는 것은 힌트가 주어질 때 이미 연결되어 있기 때문에 이점이 없습니다.

---

## 사용법 {/*usage*/}

### 렌더링 시 미리 연결하기 {/*preconnecting-when-rendering*/}

자식 컴포넌트가 해당 호스트에서 외부 리소스를 로드할 것임을 알고 있다면 컴포넌트를 렌더링할 때 `preconnect`를 호출하세요.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  return ...;
}
```

### 이벤트 핸들러에서 미리 연결하기 {/*preconnecting-in-an-event-handler*/}

외부 리소스가 필요한 페이지나 상태로 전환하기 전에 이벤트 핸들러에서 `preconnect`를 호출하세요. 이렇게 하면 새로운 페이지나 상태를 렌더링할 때보다 더 일찍 프로세스를 시작할 수 있습니다.

```js
import { preconnect } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preconnect('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```