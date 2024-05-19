---
title: renderToStaticMarkup
---

<Intro>

`renderToStaticMarkup`는 상호작용하지 않는 React 트리를 HTML 문자열로 렌더링합니다.

```js
const html = renderToStaticMarkup(reactNode, options?)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `renderToStaticMarkup(reactNode, options?)` {/*rendertostaticmarkup*/}

서버에서 `renderToStaticMarkup`를 호출하여 앱을 HTML로 렌더링합니다.

```js
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<Page />);
```

이것은 React 컴포넌트의 상호작용하지 않는 HTML 출력을 생성합니다.

[아래에서 더 많은 예제를 보세요.](#usage)

#### 매개변수 {/*parameters*/}

* `reactNode`: HTML로 렌더링하려는 React 노드입니다. 예를 들어, `<Page />`와 같은 JSX 노드입니다.
* **선택적** `options`: 서버 렌더링을 위한 객체입니다.
  * **선택적** `identifierPrefix`: [`useId`](/reference/react/useId)에서 생성된 ID에 React가 사용하는 문자열 접두사입니다. 동일한 페이지에서 여러 루트를 사용할 때 충돌을 피하는 데 유용합니다.

#### 반환값 {/*returns*/}

HTML 문자열입니다.

#### 주의사항 {/*caveats*/}

* `renderToStaticMarkup` 출력은 하이드레이션할 수 없습니다.

* `renderToStaticMarkup`는 제한된 Suspense 지원을 제공합니다. 컴포넌트가 서스펜드되면, `renderToStaticMarkup`는 즉시 그 대체를 HTML로 보냅니다.

* `renderToStaticMarkup`는 브라우저에서 작동하지만, 클라이언트 코드에서 사용하는 것은 권장되지 않습니다. 브라우저에서 컴포넌트를 HTML로 렌더링해야 하는 경우, [DOM 노드에 렌더링하여 HTML을 얻으세요.](/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code)

---

## 사용법 {/*usage*/}

### 상호작용하지 않는 React 트리를 HTML로 렌더링하여 문자열로 변환하기 {/*rendering-a-non-interactive-react-tree-as-html-to-a-string*/}

`renderToStaticMarkup`를 호출하여 앱을 HTML 문자열로 렌더링하고 서버 응답으로 보낼 수 있습니다:

```js {5-6}
import { renderToStaticMarkup } from 'react-dom/server';

// 라우트 핸들러 구문은 백엔드 프레임워크에 따라 다릅니다
app.use('/', (request, response) => {
  const html = renderToStaticMarkup(<Page />);
  response.send(html);
});
```

이것은 React 컴포넌트의 초기 상호작용하지 않는 HTML 출력을 생성합니다.

<Pitfall>

이 메서드는 **하이드레이션할 수 없는 상호작용하지 않는 HTML을 렌더링합니다.** 이는 React를 단순한 정적 페이지 생성기로 사용하거나 이메일과 같은 완전히 정적인 콘텐츠를 렌더링하려는 경우에 유용합니다.

상호작용하는 앱은 서버에서 [`renderToString`](/reference/react-dom/server/renderToString)을 사용하고 클라이언트에서 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 사용해야 합니다.

</Pitfall>