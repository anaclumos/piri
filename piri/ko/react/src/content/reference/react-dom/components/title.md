---
title: <title>
canary: true
---

<Canary>

React의 `<title>` 확장은 현재 React의 canary 및 실험 채널에서만 사용할 수 있습니다. React의 안정적인 릴리스에서는 `<title>`이 [내장 브라우저 HTML 컴포넌트](https://react.dev/reference/react-dom/components#all-html-components)로만 작동합니다. [React의 릴리스 채널에 대해 자세히 알아보세요](/community/versioning-policy#all-release-channels).

</Canary>


<Intro>

[내장 브라우저 `<title>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title)를 사용하면 문서의 제목을 지정할 수 있습니다.

```js
<title>My Blog</title>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<title>` {/*title*/}

문서의 제목을 지정하려면 [내장 브라우저 `<title>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title)를 렌더링하세요. 어떤 컴포넌트에서든 `<title>`을 렌더링할 수 있으며, React는 항상 해당 DOM 요소를 문서의 head에 배치합니다.

```js
<title>My Blog</title>
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### Props {/*props*/}

`<title>`은 모든 [공통 요소 props](/reference/react-dom/components/common#props)를 지원합니다.

* `children`: `<title>`은 자식으로 텍스트만 허용합니다. 이 텍스트는 문서의 제목이 됩니다. 텍스트만 렌더링하는 한, 자신만의 컴포넌트를 전달할 수도 있습니다.

#### Special rendering behavior {/*special-rendering-behavior*/}

React는 `<title>` 컴포넌트에 해당하는 DOM 요소를 React 트리의 어디에서 렌더링하든지 문서의 `<head>` 내에 항상 배치합니다. `<head>`는 DOM 내에서 `<title>`이 존재할 수 있는 유일한 유효한 장소이지만, 특정 페이지를 나타내는 컴포넌트가 자체적으로 `<title>`을 렌더링할 수 있다면 편리하고 구성 가능성을 유지할 수 있습니다.

다음 두 가지 예외가 있습니다:
* `<title>`이 `<svg>` 컴포넌트 내에 있는 경우, 이 컨텍스트에서는 문서의 제목을 나타내는 것이 아니라 [해당 SVG 그래픽에 대한 접근성 주석](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title)이기 때문에 특별한 동작이 없습니다.
* `<title>`에 [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop) prop이 있는 경우, 이 경우에는 문서의 제목을 나타내는 것이 아니라 페이지의 특정 부분에 대한 메타데이터이기 때문에 특별한 동작이 없습니다.

<Pitfall>

한 번에 단일 `<title>`만 렌더링하세요. 여러 컴포넌트가 동시에 `<title>` 태그를 렌더링하면, React는 모든 제목을 문서의 head에 배치합니다. 이 경우 브라우저와 검색 엔진의 동작은 정의되지 않습니다.

</Pitfall>

---

## Usage {/*usage*/}

### Set the document title {/*set-the-document-title*/}

텍스트를 자식으로 가지는 `<title>` 컴포넌트를 어떤 컴포넌트에서든 렌더링하세요. React는 문서 `<head>`에 `<title>` DOM 노드를 배치합니다.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function ContactUsPage() {
  return (
    <ShowRenderedHTML>
      <title>My Site: Contact Us</title>
      <h1>Contact Us</h1>
      <p>Email us at support@example.com</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Use variables in the title {/*use-variables-in-the-title*/}

`<title>` 컴포넌트의 자식은 단일 텍스트 문자열이어야 합니다. (또는 단일 숫자이거나 `toString` 메서드를 가진 단일 객체일 수 있습니다.) 다음과 같이 JSX 중괄호를 사용하는 것은 명확하지 않을 수 있습니다:

```js
<title>Results page {pageNumber}</title> // 🔴 문제: 이것은 단일 문자열이 아닙니다
```

... 실제로는 `<title>` 컴포넌트가 자식으로 두 개의 요소 배열(문자열 `"Results page"`와 `pageNumber`의 값)을 받게 됩니다. 이는 오류를 일으킵니다. 대신 문자열 보간을 사용하여 `<title>`에 단일 문자열을 전달하세요:

```js
<title>{`Results page ${pageNumber}`}</title>
```