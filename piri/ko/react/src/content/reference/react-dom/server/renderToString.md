---
title: renderToString
---

<Pitfall>

`renderToString`는 스트리밍이나 데이터 대기를 지원하지 않습니다. [대안을 참조하세요.](#alternatives)

</Pitfall>

<Intro>

`renderToString`는 React 트리를 HTML 문자열로 렌더링합니다.

```js
const html = renderToString(reactNode, options?)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `renderToString(reactNode, options?)` {/*rendertostring*/}

서버에서 `renderToString`를 호출하여 앱을 HTML로 렌더링합니다.

```js
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

클라이언트에서는 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 호출하여 서버에서 생성된 HTML을 인터랙티브하게 만듭니다.

[아래에서 더 많은 예제를 참조하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `reactNode`: HTML로 렌더링하려는 React 노드입니다. 예를 들어, `<App />`와 같은 JSX 노드입니다.

* **선택적** `options`: 서버 렌더링을 위한 객체입니다.
  * **선택적** `identifierPrefix`: [`useId`](/reference/react/useId)에서 생성된 ID에 React가 사용하는 문자열 접두사입니다. 동일한 페이지에서 여러 루트를 사용할 때 충돌을 피하는 데 유용합니다. [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters)에 전달된 접두사와 동일해야 합니다.

#### 반환값 {/*returns*/}

HTML 문자열입니다.

#### 주의사항 {/*caveats*/}

* `renderToString`는 제한된 Suspense 지원을 제공합니다. 컴포넌트가 서스펜드되면 `renderToString`는 즉시 그 대체를 HTML로 보냅니다.

* `renderToString`는 브라우저에서도 작동하지만, 클라이언트 코드에서 사용하는 것은 [권장되지 않습니다.](#removing-rendertostring-from-the-client-code)

---

## 사용법 {/*usage*/}

### React 트리를 HTML로 렌더링하여 문자열로 변환하기 {/*rendering-a-react-tree-as-html-to-a-string*/}

`renderToString`를 호출하여 앱을 HTML 문자열로 렌더링하고 서버 응답으로 보낼 수 있습니다:

```js {5-6}
import { renderToString } from 'react-dom/server';

// 라우트 핸들러 구문은 백엔드 프레임워크에 따라 다릅니다.
app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(html);
});
```

이렇게 하면 React 컴포넌트의 초기 비인터랙티브 HTML 출력이 생성됩니다. 클라이언트에서는 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 호출하여 서버에서 생성된 HTML을 *하이드레이트*하고 인터랙티브하게 만들어야 합니다.


<Pitfall>

`renderToString`는 스트리밍이나 데이터 대기를 지원하지 않습니다. [대안을 참조하세요.](#alternatives)

</Pitfall>

---

## 대안 {/*alternatives*/}

### 서버에서 `renderToString`에서 스트리밍 방식으로 마이그레이션하기 {/*migrating-from-rendertostring-to-a-streaming-method-on-the-server*/}

`renderToString`는 문자열을 즉시 반환하므로 스트리밍이나 데이터 대기를 지원하지 않습니다.

가능한 경우, 다음과 같은 완전한 기능을 갖춘 대안을 사용하는 것이 좋습니다:

* Node.js를 사용하는 경우, [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)을 사용하세요.
* Deno 또는 [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)를 지원하는 최신 엣지 런타임을 사용하는 경우, [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream)을 사용하세요.

서버 환경이 스트림을 지원하지 않는 경우 `renderToString`를 계속 사용할 수 있습니다.

---

### 클라이언트 코드에서 `renderToString` 제거하기 {/*removing-rendertostring-from-the-client-code*/}

때때로, `renderToString`는 클라이언트에서 일부 컴포넌트를 HTML로 변환하는 데 사용됩니다.

```js {1-2}
// 🚩 불필요: 클라이언트에서 renderToString 사용
import { renderToString } from 'react-dom/server';

const html = renderToString(<MyIcon />);
console.log(html); // 예를 들어, "<svg>...</svg>"
```

클라이언트에서 `react-dom/server`를 가져오는 것은 번들 크기를 불필요하게 증가시키므로 피해야 합니다. 브라우저에서 일부 컴포넌트를 HTML로 렌더링해야 하는 경우, [`createRoot`](/reference/react-dom/client/createRoot)를 사용하고 DOM에서 HTML을 읽으세요:

```js
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

const div = document.createElement('div');
const root = createRoot(div);
flushSync(() => {
  root.render(<MyIcon />);
});
console.log(div.innerHTML); // 예를 들어, "<svg>...</svg>"
```

[`flushSync`](/reference/react-dom/flushSync) 호출은 DOM이 업데이트되기 전에 [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) 속성을 읽을 수 있도록 필요합니다.

---

## 문제 해결 {/*troubleshooting*/}

### 컴포넌트가 서스펜드될 때, HTML은 항상 대체를 포함합니다 {/*when-a-component-suspends-the-html-always-contains-a-fallback*/}

`renderToString`는 Suspense를 완전히 지원하지 않습니다.

일부 컴포넌트가 서스펜드되면 (예를 들어, [`lazy`](/reference/react/lazy)로 정의되었거나 데이터를 가져오기 때문에), `renderToString`는 그 내용이 해결될 때까지 기다리지 않습니다. 대신, `renderToString`는 가장 가까운 [`<Suspense>`](/reference/react/Suspense) 경계 위에 있는 `fallback` 속성을 HTML로 렌더링합니다. 내용은 클라이언트 코드가 로드될 때까지 나타나지 않습니다.

이를 해결하려면 [권장 스트리밍 솔루션](#migrating-from-rendertostring-to-a-streaming-method-on-the-server) 중 하나를 사용하세요. 이들은 서버에서 내용이 해결될 때마다 청크로 스트리밍할 수 있어 사용자가 클라이언트 코드가 로드되기 전에 페이지가 점진적으로 채워지는 것을 볼 수 있습니다.