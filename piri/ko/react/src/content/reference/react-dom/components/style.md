---
style: <style>
canary: true
---

<Canary>

React의 `<style>`에 대한 확장은 현재 React의 canary 및 실험 채널에서만 사용할 수 있습니다. 안정적인 React 릴리스에서는 `<style>`이 [내장 브라우저 HTML 구성 요소](https://react.dev/reference/react-dom/components#all-html-components)로만 작동합니다. [React의 릴리스 채널에 대해 자세히 알아보세요](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

[내장 브라우저 `<style>` 구성 요소](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style)를 사용하면 문서에 인라인 CSS 스타일시트를 추가할 수 있습니다.

```js
<style>{` p { color: red; } `}</style>
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `<style>` {/*style*/}

문서에 인라인 스타일을 추가하려면 [내장 브라우저 `<style>` 구성 요소](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style)를 렌더링하세요. 어떤 구성 요소에서든 `<style>`을 렌더링할 수 있으며, React는 [특정 경우](#special-rendering-behavior)에 해당 DOM 요소를 문서의 head에 배치하고 동일한 스타일을 중복 제거합니다.

```js
<style>{` p { color: red; } `}</style>
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### Props {/*props*/}

`<style>`은 모든 [공통 요소 props](/reference/react-dom/components/common#props)를 지원합니다.

* `children`: 문자열, 필수. 스타일시트의 내용.
* `precedence`: 문자열. 문서 `<head>` 내 다른 `<style>` DOM 노드와의 순위를 React에 알려줍니다. 이는 어떤 스타일시트가 다른 스타일시트를 덮어쓸 수 있는지를 결정합니다. 값은 (우선순위 순서로) `"reset"`, `"low"`, `"medium"`, `"high"`일 수 있습니다. 동일한 우선순위를 가진 스타일시트는 `<link>` 또는 인라인 `<style>` 태그이든 [`preload`](/reference/react-dom/preload) 또는 [`preinit`](/reference/react-dom/preinit) 함수를 사용하여 로드되든 함께 그룹화됩니다.
* `href`: 문자열. 동일한 `href`를 가진 스타일을 [중복 제거](#special-rendering-behavior)할 수 있도록 React에 허용합니다.
* `media`: 문자열. 스타일시트를 특정 [미디어 쿼리](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries)에 제한합니다.
* `nonce`: 문자열. 엄격한 콘텐츠 보안 정책을 사용할 때 리소스를 허용하는 암호화 [nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce).
* `title`: 문자열. [대체 스타일시트](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets)의 이름을 지정합니다.

React에서 사용을 **권장하지 않는** props:

* `blocking`: 문자열. `"render"`로 설정하면 스타일시트가 로드될 때까지 브라우저가 페이지를 렌더링하지 않도록 지시합니다. React는 Suspense를 사용하여 더 세밀한 제어를 제공합니다.

#### 특수 렌더링 동작 {/*special-rendering-behavior*/}

React는 `<style>` 구성 요소를 문서의 `<head>`로 이동하고, 동일한 스타일시트를 중복 제거하며, 스타일시트가 로드되는 동안 [suspend](/reference/react/Suspense)할 수 있습니다.

이 동작을 선택하려면 `href` 및 `precedence` props를 제공하세요. React는 동일한 `href`를 가진 스타일을 중복 제거합니다. precedence prop은 문서 `<head>` 내 다른 `<style>` DOM 노드와의 순위를 React에 알려주며, 이는 어떤 스타일시트가 다른 스타일시트를 덮어쓸 수 있는지를 결정합니다.

이 특수 처리는 두 가지 주의 사항이 있습니다:

* 스타일이 렌더링된 후 props 변경을 무시합니다. (개발 중에 이 경우 경고를 표시합니다.)
* 스타일을 렌더링한 구성 요소가 언마운트된 후에도 DOM에 스타일을 남길 수 있습니다.

---

## 사용법 {/*usage*/}

### 인라인 CSS 스타일시트 렌더링 {/*rendering-an-inline-css-stylesheet*/}

구성 요소가 올바르게 표시되기 위해 특정 CSS 스타일에 의존하는 경우, 구성 요소 내에서 인라인 스타일시트를 렌더링할 수 있습니다.

`href` 및 `precedence` prop을 제공하면 스타일시트가 로드되는 동안 구성 요소가 suspend됩니다. (인라인 스타일시트의 경우에도 스타일시트가 참조하는 폰트 및 이미지로 인해 로딩 시간이 발생할 수 있습니다.) `href` prop은 스타일시트를 고유하게 식별해야 합니다. React는 동일한 `href`를 가진 스타일시트를 중복 제거합니다.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';
import { useId } from 'react';

function PieChart({data, colors}) {
  const id = useId();
  const stylesheet = colors.map((color, index) =>
    `#${id} .color-${index}: \{ color: "${color}"; \}`
  ).join();
  return (
    <>
      <style href={"PieChart-" + JSON.stringify(colors)} precedence="medium">
        {stylesheet}
      </style>
      <svg id={id}>
        …
      </svg>
    </>
  );
}

export default function App() {
  return (
    <ShowRenderedHTML>
      <PieChart data="..." colors={['red', 'green', 'blue']} />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>