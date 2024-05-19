---
script: <script>
canary: true
---

<Canary>

React의 `<script>`에 대한 확장은 현재 React의 canary 및 실험 채널에서만 사용할 수 있습니다. React의 안정적인 릴리스에서는 `<script>`가 [내장 브라우저 HTML 컴포넌트](https://react.dev/reference/react-dom/components#all-html-components)로만 작동합니다. [React의 릴리스 채널에 대해 자세히 알아보세요](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

[내장 브라우저 `<script>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)를 사용하면 문서에 스크립트를 추가할 수 있습니다.

```js
<script> alert("hi!") </script>
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `<script>` {/*script*/}

문서에 인라인 또는 외부 스크립트를 추가하려면 [내장 브라우저 `<script>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)를 렌더링하세요. 어떤 컴포넌트에서든 `<script>`를 렌더링할 수 있으며, React는 [특정 경우](#special-rendering-behavior)에 해당 DOM 요소를 문서의 head에 배치하고 동일한 스크립트를 중복 제거합니다.

```js
<script> alert("hi!") </script>
<script src="script.js" />
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### Props {/*props*/}

`<script>`는 모든 [공통 요소 props](/reference/react-dom/components/common#props)를 지원합니다.

* `children`: 문자열. 인라인 스크립트의 소스 코드.
* `src`: 문자열. 외부 스크립트의 URL.

다른 지원되는 props:

* `async`: 불리언. 브라우저가 문서의 나머지 부분을 처리할 때까지 스크립트 실행을 지연시킬 수 있습니다 — 성능을 위한 선호되는 동작.
* `crossOrigin`: 문자열. 사용할 [CORS 정책](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin). 가능한 값은 `anonymous`와 `use-credentials`입니다.
* `fetchPriority`: 문자열. 여러 스크립트를 동시에 가져올 때 브라우저가 스크립트의 우선 순위를 매기도록 합니다. `"high"`, `"low"`, 또는 `"auto"`(기본값)일 수 있습니다.
* `integrity`: 문자열. 스크립트의 암호화 해시로, [진위 여부를 확인](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)합니다.
* `noModule`: 불리언. ES 모듈을 지원하는 브라우저에서 스크립트를 비활성화합니다 — ES 모듈을 지원하지 않는 브라우저에 대한 대체 스크립트를 허용합니다.
* `nonce`: 문자열. 엄격한 콘텐츠 보안 정책을 사용할 때 리소스를 허용하는 [암호화 nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce).
* `referrer`: 문자열. 스크립트를 가져올 때 및 스크립트가 가져오는 모든 리소스를 가져올 때 [어떤 Referer 헤더를 보낼지](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#referrerpolicy) 지정합니다.
* `type`: 문자열. 스크립트가 [클래식 스크립트, ES 모듈, 또는 import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type)인지 여부를 지정합니다.

React의 [특별한 스크립트 처리](#special-rendering-behavior)를 비활성화하는 props:

* `onError`: 함수. 스크립트 로드에 실패했을 때 호출됩니다.
* `onLoad`: 함수. 스크립트가 로드 완료되었을 때 호출됩니다.

React와 함께 사용하기 **권장되지 않는** props:

* `blocking`: 문자열. `"render"`로 설정하면 스크립트가 로드될 때까지 브라우저가 페이지를 렌더링하지 않도록 지시합니다. React는 Suspense를 사용하여 더 세밀한 제어를 제공합니다.
* `defer`: 문자열. 문서가 로드될 때까지 브라우저가 스크립트를 실행하지 않도록 합니다. 스트리밍 서버 렌더링된 컴포넌트와 호환되지 않습니다. 대신 `async` prop을 사용하세요.

#### 특별한 렌더링 동작 {/*special-rendering-behavior*/}

React는 `<script>` 컴포넌트를 문서의 `<head>`로 이동시키고, 동일한 스크립트를 중복 제거하며, 스크립트가 로드되는 동안 [suspend](/reference/react/Suspense)할 수 있습니다.

이 동작을 사용하려면 `src`와 `async={true}` props를 제공하세요. React는 `src`가 동일한 스크립트를 중복 제거합니다. 스크립트를 안전하게 이동시키려면 `async` prop이 true여야 합니다.

`onLoad` 또는 `onError` props 중 하나를 제공하면, 특별한 동작이 없습니다. 이러한 props는 컴포넌트 내에서 스크립트 로드를 수동으로 관리하고 있음을 나타내기 때문입니다.

이 특별한 처리는 두 가지 주의 사항이 있습니다:

* 스크립트가 렌더링된 후 props 변경을 무시합니다. (개발 중에 이 경우 경고를 표시합니다.)
* 스크립트를 렌더링한 컴포넌트가 언마운트된 후에도 DOM에 스크립트를 남길 수 있습니다. (스크립트는 DOM에 삽입될 때 한 번만 실행되므로 아무런 영향이 없습니다.)

---

## 사용법 {/*usage*/}

### 외부 스크립트 렌더링 {/*rendering-an-external-script*/}

컴포넌트가 올바르게 표시되기 위해 특정 스크립트에 의존하는 경우, 컴포넌트 내에서 `<script>`를 렌더링할 수 있습니다.

`src`와 `async` prop을 제공하면, 컴포넌트는 스크립트가 로드되는 동안 suspend됩니다. React는 동일한 `src`를 가진 스크립트를 중복 제거하여 여러 컴포넌트가 렌더링하더라도 DOM에 하나만 삽입합니다.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Map({lat, long}) {
  return (
    <>
      <script async src="map-api.js" />
      <div id="map" data-lat={lat} data-long={long} />
    </>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <Map />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

<Note>
스크립트를 사용하려는 경우, [preinit](/reference/react-dom/preinit) 함수를 호출하는 것이 유용할 수 있습니다. 이 함수를 호출하면 브라우저가 `<script>` 컴포넌트를 렌더링하는 것보다 스크립트를 더 일찍 가져올 수 있습니다. 예를 들어 [HTTP Early Hints 응답](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103)을 보내는 방식으로 가능합니다.
</Note>

### 인라인 스크립트 렌더링 {/*rendering-an-inline-script*/}

인라인 스크립트를 포함하려면, 스크립트 소스 코드를 children으로 하는 `<script>` 컴포넌트를 렌더링하세요. 인라인 스크립트는 중복 제거되거나 문서 `<head>`로 이동되지 않으며, 외부 리소스를 로드하지 않기 때문에 컴포넌트가 suspend되지 않습니다.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Tracking() {
  return (
    <script>
      ga('send', 'pageview');
    </script>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <h1>My Website</h1>
      <Tracking />
      <p>Welcome</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>