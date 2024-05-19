---
meta: <meta>
canary: true
---

<Canary>

React의 `<meta>`에 대한 확장은 현재 React의 canary 및 실험 채널에서만 사용할 수 있습니다. 안정적인 React 릴리스에서는 `<meta>`가 [내장 브라우저 HTML 구성 요소](https://react.dev/reference/react-dom/components#all-html-components)로만 작동합니다. [React의 릴리스 채널에 대해 자세히 알아보세요](/community/versioning-policy#all-release-channels).

</Canary>


<Intro>

[내장 브라우저 `<meta>` 구성 요소](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)를 사용하면 문서에 메타데이터를 추가할 수 있습니다.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

</Intro>

<InlineToc />

---

## 참고자료 {/*reference*/}

### `<meta>` {/*meta*/}

문서 메타데이터를 추가하려면 [내장 브라우저 `<meta>` 구성 요소](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)를 렌더링하세요. 어떤 구성 요소에서든 `<meta>`를 렌더링할 수 있으며, React는 항상 해당 DOM 요소를 문서의 head에 배치합니다.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### Props {/*props*/}

`<meta>`는 모든 [공통 요소 props](/reference/react-dom/components/common#props)를 지원합니다.

다음 props 중 *정확히 하나*를 가져야 합니다: `name`, `httpEquiv`, `charset`, `itemProp`. `<meta>` 구성 요소는 지정된 props에 따라 다른 작업을 수행합니다.

* `name`: 문자열. 문서에 첨부할 [메타데이터 종류](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name)를 지정합니다.
* `charset`: 문자열. 문서에서 사용되는 문자 집합을 지정합니다. 유효한 값은 `"utf-8"`뿐입니다.
* `httpEquiv`: 문자열. 문서 처리를 위한 지시문을 지정합니다.
* `itemProp`: 문자열. 문서 전체가 아닌 문서 내 특정 항목에 대한 메타데이터를 지정합니다.
* `content`: 문자열. `name` 또는 `itemProp` props와 함께 사용될 때 첨부할 메타데이터를 지정하거나, `httpEquiv` props와 함께 사용될 때 지시문의 동작을 지정합니다.

#### 특수 렌더링 동작 {/*special-rendering-behavior*/}

React는 `<meta>` 구성 요소에 해당하는 DOM 요소를 React 트리의 어디에서 렌더링하든 항상 문서의 `<head>`에 배치합니다. `<head>`는 DOM 내에서 `<meta>`가 존재할 수 있는 유일한 유효한 위치이지만, 특정 페이지를 나타내는 구성 요소가 자체적으로 `<meta>` 구성 요소를 렌더링할 수 있다면 편리하고 구성 가능성을 유지할 수 있습니다.

예외가 하나 있습니다: `<meta>`에 [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop) props가 있는 경우, 이는 문서에 대한 메타데이터가 아니라 페이지의 특정 부분에 대한 메타데이터를 나타내므로 특수한 동작이 없습니다.

---

## 사용법 {/*usage*/}

### 문서에 메타데이터 주석 달기 {/*annotating-the-document-with-metadata*/}

키워드, 요약 또는 저자의 이름과 같은 메타데이터로 문서에 주석을 달 수 있습니다. React는 이 메타데이터를 React 트리의 어디에서 렌더링하든 문서 `<head>`에 배치합니다.

```html
<meta name="author" content="John Smith" />
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
<meta name="description" content="API reference for the <meta> component in React DOM" />
```

어떤 구성 요소에서든 `<meta>` 구성 요소를 렌더링할 수 있습니다. React는 문서 `<head>`에 `<meta>` DOM 노드를 배치합니다.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <meta name="keywords" content="React" />
      <meta name="description" content="A site map for the React website" />
      <h1>Site Map</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### 문서 내 특정 항목에 메타데이터 주석 달기 {/*annotating-specific-items-within-the-document-with-metadata*/}

`itemProp` props와 함께 `<meta>` 구성 요소를 사용하여 문서 내 특정 항목에 메타데이터를 주석으로 달 수 있습니다. 이 경우, React는 이러한 주석을 문서 `<head>`에 배치하지 않고 다른 React 구성 요소처럼 배치합니다.

```js
<section itemScope>
  <h3>Annotating specific items</h3>
  <meta itemProp="description" content="API reference for using <meta> with itemProp" />
  <p>...</p>
</section>
```