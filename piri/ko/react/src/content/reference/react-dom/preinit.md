---
title: preinit
canary: true
---

<Canary>

`preinit` 함수는 현재 React의 Canary 및 실험 채널에서만 사용할 수 있습니다. [React의 릴리스 채널에 대해 자세히 알아보세요](/community/versioning-policy#all-release-channels).

</Canary>

<Note>

[React 기반 프레임워크](/learn/start-a-new-react-project)는 자원을 로드하는 작업을 자주 처리해주므로, 이 API를 직접 호출할 필요가 없을 수 있습니다. 자세한 내용은 프레임워크의 문서를 참조하세요.

</Note>

<Intro>

`preinit`는 스타일시트나 외부 스크립트를 미리 가져와 평가할 수 있게 해줍니다.

```js
preinit("https://example.com/script.js", {as: "style"});
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `preinit(href, options)` {/*preinit*/}

스크립트나 스타일시트를 미리 초기화하려면 `react-dom`에서 `preinit` 함수를 호출하세요.

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  // ...
}

```

[아래에서 더 많은 예제를 확인하세요.](#usage)

`preinit` 함수는 브라우저에 주어진 자원을 다운로드하고 실행해야 한다는 힌트를 제공하여 시간을 절약할 수 있습니다. `preinit`한 스크립트는 다운로드가 완료되면 실행됩니다. 미리 초기화한 스타일시트는 문서에 삽입되어 즉시 적용됩니다.

#### 매개변수 {/*parameters*/}

* `href`: 문자열. 다운로드하고 실행하려는 자원의 URL.
* `options`: 객체. 다음 속성을 포함합니다:
  *  `as`: 필수 문자열. 자원의 유형. 가능한 값은 `script`와 `style`입니다.
  * `precedence`: 문자열. 스타일시트와 함께 필수입니다. 다른 스타일시트와의 상대적 위치를 지정합니다. 우선순위가 높은 스타일시트는 낮은 스타일시트를 덮어쓸 수 있습니다. 가능한 값은 `reset`, `low`, `medium`, `high`입니다.
  *  `crossOrigin`: 문자열. 사용할 [CORS 정책](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin). 가능한 값은 `anonymous`와 `use-credentials`입니다. `as`가 `"fetch"`로 설정된 경우 필수입니다.
  *  `integrity`: 문자열. 자원의 암호화 해시로, [진위 여부를 확인](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)합니다.
  *  `nonce`: 문자열. 엄격한 콘텐츠 보안 정책을 사용할 때 자원을 허용하기 위한 암호화 [nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce).
  *  `fetchPriority`: 문자열. 자원을 가져오는 상대적 우선순위를 제안합니다. 가능한 값은 `auto`(기본값), `high`, `low`입니다.

#### 반환값 {/*returns*/}

`preinit`는 아무것도 반환하지 않습니다.

#### 주의사항 {/*caveats*/}

* 동일한 `href`로 `preinit`를 여러 번 호출하는 것은 한 번 호출하는 것과 동일한 효과를 가집니다.
* 브라우저에서는 컴포넌트를 렌더링할 때, Effect에서, 이벤트 핸들러에서 등 어떤 상황에서도 `preinit`를 호출할 수 있습니다.
* 서버 사이드 렌더링이나 Server Components를 렌더링할 때, 컴포넌트를 렌더링하는 동안 또는 컴포넌트를 렌더링하는 비동기 컨텍스트에서 호출하는 경우에만 `preinit`가 효과가 있습니다. 다른 모든 호출은 무시됩니다.

---

## 사용법 {/*usage*/}

### 렌더링 시 미리 초기화하기 {/*preiniting-when-rendering*/}

특정 자원을 사용할 것이 확실하고, 자원이 다운로드되자마자 평가되어 즉시 적용되는 것이 괜찮다면 컴포넌트를 렌더링할 때 `preinit`를 호출하세요.

<Recipes titleText="미리 초기화 예제">

#### 외부 스크립트 미리 초기화하기 {/*preiniting-an-external-script*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  return ...;
}
```

브라우저가 스크립트를 다운로드하지만 즉시 실행하지 않기를 원한다면, [`preload`](/reference/react-dom/preload)를 대신 사용하세요. ESM 모듈을 로드하려면 [`preinitModule`](/reference/react-dom/preinitModule)를 사용하세요.

<Solution />

#### 스타일시트 미리 초기화하기 {/*preiniting-a-stylesheet*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/style.css", {as: "style", precedence: "medium"});
  return ...;
}
```

필수 옵션인 `precedence`는 문서 내에서 스타일시트의 순서를 제어할 수 있게 해줍니다. 우선순위가 높은 스타일시트는 낮은 스타일시트를 덮어쓸 수 있습니다.

스타일시트를 다운로드하지만 즉시 문서에 삽입하지 않으려면 [`preload`](/reference/react-dom/preload)를 대신 사용하세요.

<Solution />

</Recipes>

### 이벤트 핸들러에서 미리 초기화하기 {/*preiniting-in-an-event-handler*/}

외부 자원이 필요한 페이지나 상태로 전환하기 전에 이벤트 핸들러에서 `preinit`를 호출하세요. 이렇게 하면 새로운 페이지나 상태를 렌더링할 때보다 더 일찍 프로세스를 시작할 수 있습니다.

```js
import { preinit } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinit("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```