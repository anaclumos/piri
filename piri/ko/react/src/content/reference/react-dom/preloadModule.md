---
title: preloadModule
canary: true
---

<Canary>

`preloadModule` 함수는 현재 React의 Canary 및 실험 채널에서만 사용할 수 있습니다. [React의 릴리스 채널에 대해 자세히 알아보세요](/community/versioning-policy#all-release-channels).

</Canary>

<Note>

[React 기반 프레임워크](/learn/start-a-new-react-project)는 자원을 로드하는 작업을 자주 처리해주므로, 이 API를 직접 호출할 필요가 없을 수 있습니다. 자세한 내용은 프레임워크의 문서를 참조하세요.

</Note>

<Intro>

`preloadModule`은 사용할 것으로 예상되는 ESM 모듈을 미리 가져올 수 있게 해줍니다.

```js
preloadModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `preloadModule(href, options)` {/*preloadmodule*/}

ESM 모듈을 미리 로드하려면 `react-dom`에서 `preloadModule` 함수를 호출하세요.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[아래에서 더 많은 예제를 확인하세요.](#usage)

`preloadModule` 함수는 브라우저에 주어진 모듈을 다운로드하기 시작해야 한다는 힌트를 제공하여 시간을 절약할 수 있습니다.

#### 매개변수 {/*parameters*/}

* `href`: 문자열. 다운로드하려는 모듈의 URL입니다.
* `options`: 객체. 다음 속성을 포함합니다:
  *  `as`: 필수 문자열. `'script'`여야 합니다.
  *  `crossOrigin`: 문자열. 사용할 [CORS 정책](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin). 가능한 값은 `anonymous`와 `use-credentials`입니다.
  *  `integrity`: 문자열. 모듈의 암호화 해시로, [진위 여부를 확인](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)합니다.
  *  `nonce`: 문자열. 엄격한 콘텐츠 보안 정책을 사용할 때 모듈을 허용하기 위한 암호화 [nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce)입니다.


#### 반환값 {/*returns*/}

`preloadModule`은 아무것도 반환하지 않습니다.

#### 주의사항 {/*caveats*/}

* 동일한 `href`로 `preloadModule`을 여러 번 호출하는 것은 한 번 호출하는 것과 동일한 효과를 가집니다.
* 브라우저에서는 컴포넌트를 렌더링할 때, Effect에서, 이벤트 핸들러에서 등 어떤 상황에서도 `preloadModule`을 호출할 수 있습니다.
* 서버 사이드 렌더링 또는 Server Components를 렌더링할 때, `preloadModule`은 컴포넌트를 렌더링하는 동안 또는 컴포넌트를 렌더링하는 것에서 시작된 비동기 컨텍스트에서 호출할 때만 효과가 있습니다. 다른 모든 호출은 무시됩니다.

---

## 사용법 {/*usage*/}

### 렌더링 시 미리 로드하기 {/*preloading-when-rendering*/}

특정 모듈을 사용할 것임을 알고 있다면 컴포넌트를 렌더링할 때 `preloadModule`을 호출하세요.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

브라우저가 모듈을 즉시 실행하기 시작하도록 하려면 (단순히 다운로드하는 것이 아니라) [`preinitModule`](/reference/react-dom/preinitModule)을 대신 사용하세요. ESM 모듈이 아닌 스크립트를 로드하려면 [`preload`](/reference/react-dom/preload)를 사용하세요.

### 이벤트 핸들러에서 미리 로드하기 {/*preloading-in-an-event-handler*/}

모듈이 필요할 페이지나 상태로 전환하기 전에 이벤트 핸들러에서 `preloadModule`을 호출하세요. 이렇게 하면 새로운 페이지나 상태를 렌더링할 때 호출하는 것보다 더 일찍 프로세스를 시작할 수 있습니다.

```js
import { preloadModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preloadModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```