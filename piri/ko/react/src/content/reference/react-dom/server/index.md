---
title: 서버 React DOM API
---

<Intro>

`react-dom/server` API는 서버에서 React 컴포넌트를 HTML로 렌더링할 수 있게 해줍니다. 이 API는 앱의 최상위 레벨에서 초기 HTML을 생성하기 위해서만 서버에서 사용됩니다. [프레임워크](/learn/start-a-new-react-project#production-grade-react-frameworks)가 이를 대신 호출할 수 있습니다. 대부분의 컴포넌트는 이를 가져오거나 사용할 필요가 없습니다.

</Intro>

---

## Node.js 스트림을 위한 서버 API {/*server-apis-for-nodejs-streams*/}

이 메서드는 [Node.js 스트림:](https://nodejs.org/api/stream.html) 환경에서만 사용할 수 있습니다:

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)은 React 트리를 파이프 가능한 [Node.js 스트림](https://nodejs.org/api/stream.html)으로 렌더링합니다.
* [`renderToStaticNodeStream`](/reference/react-dom/server/renderToStaticNodeStream)은 상호작용이 없는 React 트리를 [Node.js 읽기 가능한 스트림](https://nodejs.org/api/stream.html#readable-streams)으로 렌더링합니다.

---

## 웹 스트림을 위한 서버 API {/*server-apis-for-web-streams*/}

이 메서드는 브라우저, Deno, 일부 최신 엣지 런타임을 포함한 [웹 스트림](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) 환경에서만 사용할 수 있습니다:

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream)은 React 트리를 [읽기 가능한 웹 스트림](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)으로 렌더링합니다.

---

## 스트리밍을 지원하지 않는 환경을 위한 서버 API {/*server-apis-for-non-streaming-environments*/}

이 메서드는 스트림을 지원하지 않는 환경에서 사용할 수 있습니다:

* [`renderToString`](/reference/react-dom/server/renderToString)은 React 트리를 문자열로 렌더링합니다.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup)은 상호작용이 없는 React 트리를 문자열로 렌더링합니다.

이들은 스트리밍 API에 비해 기능이 제한적입니다.

---

## 사용 중단된 서버 API {/*deprecated-server-apis*/}

<Deprecated>

이 API는 향후 React의 주요 버전에서 제거될 예정입니다.

</Deprecated>

* [`renderToNodeStream`](/reference/react-dom/server/renderToNodeStream)은 React 트리를 [Node.js 읽기 가능한 스트림](https://nodejs.org/api/stream.html#readable-streams)으로 렌더링합니다. (사용 중단됨.)
