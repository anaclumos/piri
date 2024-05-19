---
title: renderToStaticNodeStream
---

<Intro>

`renderToStaticNodeStream`은 상호작용이 없는 React 트리를 [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams)으로 렌더링합니다.

```js
const stream = renderToStaticNodeStream(reactNode, options?)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `renderToStaticNodeStream(reactNode, options?)` {/*rendertostaticnodestream*/}

서버에서 `renderToStaticNodeStream`을 호출하여 [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams)을 얻습니다.

```js
import { renderToStaticNodeStream } from 'react-dom/server';

const stream = renderToStaticNodeStream(<Page />);
stream.pipe(response);
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

이 스트림은 React 컴포넌트의 상호작용이 없는 HTML 출력을 생성합니다.

#### 매개변수 {/*parameters*/}

* `reactNode`: HTML로 렌더링하려는 React 노드입니다. 예를 들어, `<Page />`와 같은 JSX 요소입니다.

* **선택적** `options`: 서버 렌더링을 위한 객체입니다.
  * **선택적** `identifierPrefix`: [`useId`](/reference/react/useId)에서 생성된 ID에 React가 사용하는 문자열 접두사입니다. 동일한 페이지에서 여러 루트를 사용할 때 충돌을 피하는 데 유용합니다.

#### 반환값 {/*returns*/}

HTML 문자열을 출력하는 [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams)입니다. 결과 HTML은 클라이언트에서 하이드레이션할 수 없습니다.

#### 주의사항 {/*caveats*/}

* `renderToStaticNodeStream` 출력은 하이드레이션할 수 없습니다.

* 이 메서드는 모든 [Suspense 경계](/reference/react/Suspense)가 완료될 때까지 출력하지 않습니다.

* React 18부터 이 메서드는 모든 출력을 버퍼링하므로 실제로 스트리밍 이점을 제공하지 않습니다.

* 반환된 스트림은 utf-8로 인코딩된 바이트 스트림입니다. 다른 인코딩의 스트림이 필요한 경우, 텍스트 트랜스코딩을 위한 변환 스트림을 제공하는 [iconv-lite](https://www.npmjs.com/package/iconv-lite)와 같은 프로젝트를 참조하세요.

---

## 사용법 {/*usage*/}

### React 트리를 정적 HTML로 Node.js Readable Stream에 렌더링하기 {/*rendering-a-react-tree-as-static-html-to-a-nodejs-readable-stream*/}

`renderToStaticNodeStream`을 호출하여 서버 응답에 파이프할 수 있는 [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams)을 얻습니다:

```js {5-6}
import { renderToStaticNodeStream } from 'react-dom/server';

// 라우트 핸들러 구문은 백엔드 프레임워크에 따라 다릅니다
app.use('/', (request, response) => {
  const stream = renderToStaticNodeStream(<Page />);
  stream.pipe(response);
});
```

이 스트림은 React 컴포넌트의 초기 상호작용이 없는 HTML 출력을 생성합니다.

<Pitfall>

이 메서드는 **하이드레이션할 수 없는 상호작용이 없는 HTML을 렌더링합니다.** 이는 React를 단순한 정적 페이지 생성기로 사용하거나 이메일과 같은 완전히 정적인 콘텐츠를 렌더링하려는 경우에 유용합니다.

상호작용 앱은 서버에서 [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)을 사용하고 클라이언트에서 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 사용해야 합니다.

</Pitfall>