---
link: <link>
canary: true
---

<Canary>

React의 `<link>`에 대한 확장은 현재 React의 canary 및 실험 채널에서만 사용할 수 있습니다. React의 안정적인 릴리스에서는 `<link>`가 [내장 브라우저 HTML 구성 요소](https://react.dev/reference/react-dom/components#all-html-components)로만 작동합니다. [React의 릴리스 채널에 대해 자세히 알아보세요](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

[내장 브라우저 `<link>` 구성 요소](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)를 사용하면 스타일시트와 같은 외부 리소스를 사용하거나 링크 메타데이터로 문서를 주석 처리할 수 있습니다.

```js
<link rel="icon" href="favicon.ico" />
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `<link>` {/*link*/}

스타일시트, 폰트 및 아이콘과 같은 외부 리소스에 연결하거나 링크 메타데이터로 문서를 주석 처리하려면 [내장 브라우저 `<link>` 구성 요소](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)를 렌더링하세요. 어떤 구성 요소에서든 `<link>`를 렌더링할 수 있으며, React는 [대부분의 경우](#special-rendering-behavior) 해당 DOM 요소를 문서의 head에 배치합니다.

```js
<link rel="icon" href="favicon.ico" />
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### Props {/*props*/}

`<link>`는 모든 [공통 요소 props](/reference/react-dom/components/common#props)를 지원합니다.

* `rel`: 문자열, 필수. [리소스와의 관계](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel)를 지정합니다. React는 `rel="stylesheet"`인 링크를 [다르게 처리](#special-rendering-behavior)합니다.

이 props는 `rel="stylesheet"`일 때 적용됩니다:

* `precedence`: 문자열. 문서 `<head>` 내 다른 `<link>` DOM 노드에 비해 이 스타일시트의 우선순위를 지정합니다. 값은 `"reset"`, `"low"`, `"medium"`, `"high"`일 수 있습니다. 동일한 우선순위를 가진 스타일시트는 `<link>` 또는 인라인 `<style>` 태그이든 [`preload`](/reference/react-dom/preload) 또는 [`preinit`](/reference/react-dom/preinit) 함수를 사용하여 로드되든 함께 그룹화됩니다.
* `media`: 문자열. 스타일시트를 특정 [미디어 쿼리](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries)에 제한합니다.
* `title`: 문자열. [대체 스타일시트](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets)의 이름을 지정합니다.

이 props는 `rel="stylesheet"`일 때 적용되지만 React의 [스타일시트에 대한 특별 처우](#special-rendering-behavior)를 비활성화합니다:

* `disabled`: 불리언. 스타일시트를 비활성화합니다.
* `onError`: 함수. 스타일시트 로드에 실패했을 때 호출됩니다.
* `onLoad`: 함수. 스타일시트 로드가 완료되었을 때 호출됩니다.

이 props는 `rel="preload"` 또는 `rel="modulepreload"`일 때 적용됩니다:

* `as`: 문자열. 리소스의 유형. 가능한 값은 `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `worker`입니다.
* `imageSrcSet`: 문자열. `as="image"`일 때만 적용됩니다. [이미지의 소스 세트](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)를 지정합니다.
* `imageSizes`: 문자열. `as="image"`일 때만 적용됩니다. [이미지의 크기](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)를 지정합니다.

이 props는 `rel="icon"` 또는 `rel="apple-touch-icon"`일 때 적용됩니다:

* `sizes`: 문자열. [아이콘의 크기](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

이 props는 모든 경우에 적용됩니다:

* `href`: 문자열. 연결된 리소스의 URL.
* `crossOrigin`: 문자열. 사용할 [CORS 정책](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin). 가능한 값은 `anonymous`와 `use-credentials`입니다. `as`가 `"fetch"`로 설정된 경우 필수입니다.
* `referrerPolicy`: 문자열. 가져올 때 보낼 [Referrer 헤더](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy). 가능한 값은 `no-referrer-when-downgrade`(기본값), `no-referrer`, `origin`, `origin-when-cross-origin`, `unsafe-url`입니다.
* `fetchPriority`: 문자열. 리소스를 가져올 때 상대적인 우선순위를 제안합니다. 가능한 값은 `auto`(기본값), `high`, `low`입니다.
* `hrefLang`: 문자열. 연결된 리소스의 언어.
* `integrity`: 문자열. 리소스의 암호화 해시로, [진위 여부를 확인](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)합니다.
* `type`: 문자열. 연결된 리소스의 MIME 유형.

React와 함께 사용하기 **권장되지 않는** props:

* `blocking`: 문자열. `"render"`로 설정된 경우, 스타일시트가 로드될 때까지 브라우저가 페이지를 렌더링하지 않도록 지시합니다. React는 Suspense를 사용하여 더 세밀한 제어를 제공합니다.

#### 특별한 렌더링 동작 {/*special-rendering-behavior*/}

React는 `<link>` 구성 요소에 해당하는 DOM 요소를 React 트리의 어디에 렌더링하든 상관없이 항상 문서의 `<head>` 내에 배치합니다. `<head>`는 DOM 내에서 `<link>`가 존재할 수 있는 유일한 유효한 위치이지만, 특정 페이지를 나타내는 구성 요소가 자체적으로 `<link>` 구성 요소를 렌더링할 수 있다면 편리하고 구성 가능성을 유지할 수 있습니다.

다음은 몇 가지 예외 사항입니다:

* `<link>`에 `rel="stylesheet"` prop이 있는 경우, 이 특별한 동작을 얻으려면 `precedence` prop도 있어야 합니다. 이는 문서 내 스타일시트의 순서가 중요하기 때문에 React가 다른 스타일시트에 비해 이 스타일시트를 어떻게 정렬할지 알아야 하기 때문입니다. `precedence` prop이 생략되면 특별한 동작이 없습니다.
* `<link>`에 [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop) prop이 있는 경우, 특별한 동작이 없습니다. 이 경우 문서에 적용되는 것이 아니라 페이지의 특정 부분에 대한 메타데이터를 나타내기 때문입니다.
* `<link>`에 `onLoad` 또는 `onError` prop이 있는 경우, 이 경우 연결된 리소스의 로드를 React 구성 요소 내에서 수동으로 관리하고 있기 때문입니다.

#### 스타일시트에 대한 특별한 동작 {/*special-behavior-for-stylesheets*/}

또한, `<link>`가 스타일시트에 대한 것이라면(즉, props에 `rel="stylesheet"`가 있는 경우), React는 다음과 같은 방식으로 이를 특별히 처리합니다:

* `<link>`를 렌더링하는 구성 요소는 스타일시트가 로드되는 동안 [suspend](/reference/react/Suspense)됩니다.
* 여러 구성 요소가 동일한 스타일시트에 대한 링크를 렌더링하는 경우, React는 이를 중복 제거하고 DOM에 단일 링크만 넣습니다. 두 링크는 `href` prop이 동일하면 동일한 것으로 간주됩니다.

이 특별한 동작에는 두 가지 예외가 있습니다:

* 링크에 `precedence` prop이 없는 경우, 특별한 동작이 없습니다. 이는 문서 내 스타일시트의 순서가 중요하기 때문에 React가 다른 스타일시트에 비해 이 스타일시트를 어떻게 정렬할지 알아야 하기 때문입니다.
* `onLoad`, `onError`, `disabled` props 중 하나를 제공하는 경우, 특별한 동작이 없습니다. 이러한 props는 구성 요소 내에서 스타일시트의 로드를 수동으로 관리하고 있음을 나타내기 때문입니다.

이 특별한 처우에는 두 가지 주의 사항이 있습니다:

* 링크가 렌더링된 후 props 변경을 무시합니다. (개발 중에 이 경우 경고를 발행합니다.)
* 링크를 렌더링한 구성 요소가 언마운트된 후에도 DOM에 링크를 남길 수 있습니다.

---

## 사용법 {/*usage*/}

### 관련 리소스에 링크하기 {/*linking-to-related-resources*/}

아이콘, 정식 URL 또는 핑백과 같은 관련 리소스에 대한 링크로 문서를 주석 처리할 수 있습니다. React는 이를 React 트리의 어디에 렌더링하든 상관없이 문서 `<head>` 내에 이 메타데이터를 배치합니다.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function BlogPage() {
  return (
    <ShowRenderedHTML>
      <link rel="icon" href="favicon.ico" />
      <link rel="pingback" href="http://www.example.com/xmlrpc.php" />
      <h1>My Blog</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### 스타일시트에 링크하기 {/*linking-to-a-stylesheet*/}

구성 요소가 올바르게 표시되기 위해 특정 스타일시트에 의존하는 경우, 해당 구성 요소 내에서 해당 스타일시트에 대한 링크를 렌더링할 수 있습니다. 구성 요소는 스타일시트가 로드되는 동안 [suspend](/reference/react/Suspense)됩니다. `precedence` prop을 제공해야 하며, 이는 다른 스타일시트에 비해 이 스타일시트를 어디에 배치할지 React에 알려줍니다. 우선순위가 높은 스타일시트는 우선순위가 낮은 스타일시트를 덮어쓸 수 있습니다.

<Note>
스타일시트를 사용하려는 경우, [preinit](/reference/react-dom/preinit) 함수를 호출하는 것이 유익할 수 있습니다. 이 함수를 호출하면 브라우저가 `<link>` 구성 요소를 렌더링하는 것보다 스타일시트를 더 일찍 가져오기 시작할 수 있습니다. 예를 들어 [HTTP Early Hints 응답](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103)을 보내는 방식으로 가능합니다.
</Note>

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <link rel="stylesheet" href="sitemap.css" precedence="medium" />
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### 스타일시트 우선순위 제어하기 {/*controlling-stylesheet-precedence*/}

스타일시트는 서로 충돌할 수 있으며, 충돌할 때 브라우저는 문서에서 나중에 오는 스타일시트를 선택합니다. React는 `precedence` prop을 사용하여 스타일시트의 순서를 제어할 수 있습니다. 이 예제에서는 두 개의 구성 요소가 스타일시트를 렌더링하며, 우선순위가 높은 스타일시트가 문서에서 나중에 오게 됩니다. 비록 이를 렌더링하는 구성 요소가 더 일찍 오더라도 말입니다.

{/*FIXME: 이게 실제로 작동하지 않는 것 같아요 -- 아마도 precedence가 아직 구현되지 않았나요?*/}

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <FirstComponent />
      <SecondComponent />
      ...
    </ShowRenderedHTML>
  );
}

function FirstComponent() {
  return <link rel="stylesheet" href="first.css" precedence="high" />;
}

function SecondComponent() {
  return <link rel="stylesheet" href="second.css" precedence="low" />;
}

```

</SandpackWithHTMLOutput>

### 중복 제거된 스타일시트 렌더링 {/*deduplicated-stylesheet-rendering*/}

여러 구성 요소에서 동일한 스타일시트를 렌더링하는 경우, React는 문서 head에 단일 `<link>`만 배치합니다.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <Component />
      <Component />
      ...
    </ShowRenderedHTML>
  );
}

function Component() {
  return <link rel="stylesheet" href="styles.css" precedence="medium" />;
}
```

</SandpackWithHTMLOutput>

### 문서 내 특정 항목을 링크로 주석 처리하기 {/*annotating-specific-items-within-the-document-with-links*/}

`itemProp` prop을 사용하여 문서 내 특정 항목을 관련 리소스에 대한 링크로 주석 처리할 수 있습니다. 이 경우, React는 이러한 주석을 문서 `<head>` 내에 배치하지 않고 다른 React 구성 요소처럼 배치합니다.

```js
<section itemScope>
  <h3>Annotating specific items</h3>
  <link itemProp="author" href="http://example.com/" />
  <p>...</p>
</section>
```