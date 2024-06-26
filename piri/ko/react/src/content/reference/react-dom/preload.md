---
title: preload
canary: true
---

<Canary>

`preload` 함수는 현재 React의 Canary 및 실험 채널에서만 사용할 수 있습니다. [React의 릴리스 채널에 대해 자세히 알아보세요](/community/versioning-policy#all-release-channels).

</Canary>

<Note>

[React 기반 프레임워크](/learn/start-a-new-react-project)는 자원 로딩을 대신 처리해주는 경우가 많으므로, 이 API를 직접 호출할 필요가 없을 수 있습니다. 자세한 내용은 프레임워크의 문서를 참조하세요.

</Note>

<Intro>

`preload`는 스타일시트, 폰트 또는 외부 스크립트와 같은 자원을 미리 가져올 수 있게 해줍니다.

```js
preload("https://example.com/font.woff2", {as: "font"});
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `preload(href, options)` {/*preload*/}

자원을 미리 로드하려면 `react-dom`에서 `preload` 함수를 호출하세요.

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/font.woff2", {as: "font"});
  // ...
}

```

[아래에서 더 많은 예제를 확인하세요.](#usage)

`preload` 함수는 브라우저에 주어진 자원을 다운로드하기 시작하라는 힌트를 제공하여 시간을 절약할 수 있습니다.

#### 매개변수 {/*parameters*/}

* `href`: 문자열. 다운로드하려는 자원의 URL입니다.
* `options`: 객체. 다음 속성을 포함합니다:
  *  `as`: 필수 문자열. 자원의 유형입니다. [가능한 값](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#as)은 `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `worker`입니다.
  *  `crossOrigin`: 문자열. 사용할 [CORS 정책](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)입니다. 가능한 값은 `anonymous`와 `use-credentials`입니다. `as`가 `"fetch"`로 설정된 경우 필수입니다.
  *  `referrerPolicy`: 문자열. 가져올 때 보낼 [Referrer 헤더](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy)입니다. 가능한 값은 `no-referrer-when-downgrade` (기본값), `no-referrer`, `origin`, `origin-when-cross-origin`, `unsafe-url`입니다.
  *  `integrity`: 문자열. 자원의 [진위 여부를 확인](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)하기 위한 암호화 해시입니다.
  *  `type`: 문자열. 자원의 MIME 유형입니다.
  *  `nonce`: 문자열. 엄격한 콘텐츠 보안 정책을 사용할 때 자원을 허용하기 위한 암호화 [nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce)입니다.
  *  `fetchPriority`: 문자열. 자원을 가져오는 상대적 우선순위를 제안합니다. 가능한 값은 `auto` (기본값), `high`, `low`입니다.
  *  `imageSrcSet`: 문자열. `as: "image"`와 함께만 사용됩니다. [이미지의 소스 세트](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)를 지정합니다.
  *  `imageSizes`: 문자열. `as: "image"`와 함께만 사용됩니다. [이미지의 크기](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)를 지정합니다.

#### 반환값 {/*returns*/}

`preload`는 아무것도 반환하지 않습니다.

#### 주의사항 {/*caveats*/}

* `preload`의 여러 동등한 호출은 단일 호출과 동일한 효과를 가집니다. `preload` 호출은 다음 규칙에 따라 동등한 것으로 간주됩니다:
  * 두 호출이 동일한 `href`를 가지면 동등합니다. 단:
  * `as`가 `image`로 설정된 경우, 두 호출이 동일한 `href`, `imageSrcSet`, `imageSizes`를 가지면 동등합니다.
* 브라우저에서는 컴포넌트를 렌더링하는 동안, Effect에서, 이벤트 핸들러에서 등 어떤 상황에서도 `preload`를 호출할 수 있습니다.
* 서버 사이드 렌더링 또는 Server Components를 렌더링할 때, 컴포넌트를 렌더링하는 동안 또는 컴포넌트를 렌더링하는 비동기 컨텍스트에서 호출하는 경우에만 `preload`가 효과가 있습니다. 다른 모든 호출은 무시됩니다.

---

## 사용법 {/*usage*/}

### 렌더링 시 미리 로드하기 {/*preloading-when-rendering*/}

특정 자원을 사용할 것임을 알고 있다면 컴포넌트를 렌더링할 때 `preload`를 호출하세요.

<Recipes titleText="미리 로드 예제">

#### 외부 스크립트 미리 로드하기 {/*preloading-an-external-script*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/script.js", {as: "script"});
  return ...;
}
```

브라우저가 스크립트를 즉시 실행하기를 원한다면 (단순히 다운로드하는 것이 아니라), [`preinit`](/reference/react-dom/preinit)을 대신 사용하세요. ESM 모듈을 로드하려면 [`preloadModule`](/reference/react-dom/preloadModule)을 사용하세요.

<Solution />

#### 스타일시트 미리 로드하기 {/*preloading-a-stylesheet*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  return ...;
}
```

스타일시트를 문서에 즉시 삽입하려면 (브라우저가 단순히 다운로드하는 것이 아니라 즉시 파싱을 시작하도록), [`preinit`](/reference/react-dom/preinit)을 대신 사용하세요.

<Solution />

#### 폰트 미리 로드하기 {/*preloading-a-font*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  preload("https://example.com/font.woff2", {as: "font"});
  return ...;
}
```

스타일시트를 미리 로드하는 경우, 스타일시트가 참조하는 모든 폰트도 미리 로드하는 것이 좋습니다. 이렇게 하면 브라우저가 스타일시트를 다운로드하고 파싱하기 전에 폰트를 다운로드할 수 있습니다.

<Solution />

#### 이미지 미리 로드하기 {/*preloading-an-image*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("/banner.png", {
    as: "image",
    imageSrcSet: "/banner512.png 512w, /banner1024.png 1024w",
    imageSizes: "(max-width: 512px) 512px, 1024px",
  });
  return ...;
}
```

이미지를 미리 로드할 때, `imageSrcSet` 및 `imageSizes` 옵션은 브라우저가 [화면 크기에 맞는 적절한 크기의 이미지를 가져오는 데](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) 도움이 됩니다.

<Solution />

</Recipes>

### 이벤트 핸들러에서 미리 로드하기 {/*preloading-in-an-event-handler*/}

외부 자원이 필요한 페이지나 상태로 전환하기 전에 이벤트 핸들러에서 `preload`를 호출하세요. 이렇게 하면 새로운 페이지나 상태를 렌더링할 때보다 더 일찍 프로세스를 시작할 수 있습니다.

```js
import { preload } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preload("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```