---
title: prefetchDNS
canary: true
---

<Canary>

`prefetchDNS` 함수는 현재 React의 Canary 및 실험 채널에서만 사용할 수 있습니다. [React의 릴리스 채널에 대해 자세히 알아보세요](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`prefetchDNS`를 사용하면 리소스를 로드할 것으로 예상되는 서버의 IP를 미리 조회할 수 있습니다.

```js
prefetchDNS("https://example.com");
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `prefetchDNS(href)` {/*prefetchdns*/}

호스트를 조회하려면 `react-dom`에서 `prefetchDNS` 함수를 호출하세요.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  // ...
}

```

[아래에서 더 많은 예제를 확인하세요.](#usage)

`prefetchDNS` 함수는 브라우저에 주어진 서버의 IP 주소를 조회해야 한다는 힌트를 제공합니다. 브라우저가 이를 선택하면 해당 서버에서 리소스를 로드하는 속도가 빨라질 수 있습니다.

#### 매개변수 {/*parameters*/}

* `href`: 문자열. 연결하려는 서버의 URL.

#### 반환값 {/*returns*/}

`prefetchDNS`는 아무것도 반환하지 않습니다.

#### 주의사항 {/*caveats*/}

* 동일한 서버에 대해 여러 번 `prefetchDNS`를 호출하는 것은 한 번 호출하는 것과 동일한 효과를 가집니다.
* 브라우저에서는 컴포넌트를 렌더링할 때, Effect에서, 이벤트 핸들러에서 등 어떤 상황에서도 `prefetchDNS`를 호출할 수 있습니다.
* 서버 사이드 렌더링 또는 Server Components를 렌더링할 때, `prefetchDNS`는 컴포넌트를 렌더링하는 동안 또는 컴포넌트를 렌더링하는 것에서 시작된 비동기 컨텍스트에서 호출할 때만 효과가 있습니다. 다른 모든 호출은 무시됩니다.
* 필요한 특정 리소스를 알고 있다면, 리소스를 즉시 로드할 수 있는 [다른 함수](/reference/react-dom/#resource-preloading-apis)를 호출할 수 있습니다.
* 웹페이지 자체가 호스팅되는 동일한 서버를 미리 조회하는 것은 힌트가 주어질 때 이미 조회되었기 때문에 이점이 없습니다.
* [`preconnect`](/reference/react-dom/preconnect)와 비교했을 때, `prefetchDNS`는 많은 도메인에 대해 추측적으로 연결하는 경우, 사전 연결의 오버헤드가 이점을 초과할 수 있으므로 더 나을 수 있습니다.

---

## 사용법 {/*usage*/}

### 렌더링 시 DNS 미리 조회 {/*prefetching-dns-when-rendering*/}

자식 컴포넌트가 해당 호스트에서 외부 리소스를 로드할 것임을 알고 있다면 컴포넌트를 렌더링할 때 `prefetchDNS`를 호출하세요.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  return ...;
}
```

### 이벤트 핸들러에서 DNS 미리 조회 {/*prefetching-dns-in-an-event-handler*/}

외부 리소스가 필요한 페이지나 상태로 전환하기 전에 이벤트 핸들러에서 `prefetchDNS`를 호출하세요. 이렇게 하면 새로운 페이지나 상태를 렌더링할 때보다 더 일찍 프로세스를 시작할 수 있습니다.

```js
import { prefetchDNS } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    prefetchDNS('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```