---
title: renderToPipeableStream
---

<Intro>

`renderToPipeableStream`은 React 트리를 파이프 가능한 [Node.js 스트림](https://nodejs.org/api/stream.html)으로 렌더링합니다.

```js
const { pipe, abort } = renderToPipeableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

이 API는 Node.js에 특화되어 있습니다. [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)를 사용하는 환경(예: Deno 및 최신 엣지 런타임)에서는 [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream)을 대신 사용해야 합니다.

</Note>

---

## 참고 {/*reference*/}

### `renderToPipeableStream(reactNode, options?)` {/*rendertopipeablestream*/}

`renderToPipeableStream`을 호출하여 React 트리를 HTML로 [Node.js 스트림](https://nodejs.org/api/stream.html#writable-streams)으로 렌더링합니다.

```js
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

클라이언트에서는 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 호출하여 서버에서 생성된 HTML을 인터랙티브하게 만듭니다.

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `reactNode`: HTML로 렌더링하려는 React 노드입니다. 예를 들어, `<App />`와 같은 JSX 요소입니다. 전체 문서를 나타내야 하므로 `App` 컴포넌트는 `<html>` 태그를 렌더링해야 합니다.

* **선택적** `options`: 스트리밍 옵션이 포함된 객체입니다.
  * **선택적** `bootstrapScriptContent`: 지정된 경우, 이 문자열은 인라인 `<script>` 태그에 배치됩니다.
  * **선택적** `bootstrapScripts`: 페이지에 내보낼 `<script>` 태그의 URL 문자열 배열입니다. 이를 사용하여 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 호출하는 `<script>`를 포함시킵니다. 클라이언트에서 React를 실행하지 않으려면 생략하세요.
  * **선택적** `bootstrapModules`: `bootstrapScripts`와 유사하지만 [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)를 내보냅니다.
  * **선택적** `identifierPrefix`: [`useId`](/reference/react/useId)에서 생성된 ID에 대해 React가 사용하는 문자열 접두사입니다. 동일한 페이지에서 여러 루트를 사용할 때 충돌을 피하는 데 유용합니다. [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters)에 전달된 접두사와 동일해야 합니다.
  * **선택적** `namespaceURI`: 스트림의 루트 [네임스페이스 URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) 문자열입니다. 기본값은 일반 HTML입니다. SVG의 경우 `'http://www.w3.org/2000/svg'`, MathML의 경우 `'http://www.w3.org/1998/Math/MathML'`을 전달하세요.
  * **선택적** `nonce`: [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src)를 허용하는 [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) 문자열입니다.
  * **선택적** `onAllReady`: 모든 렌더링이 완료되었을 때(쉘과 모든 추가 콘텐츠 포함) 호출되는 콜백입니다. [크롤러 및 정적 생성](#waiting-for-all-content-to-load-for-crawlers-and-static-generation)을 위해 `onShellReady` 대신 사용할 수 있습니다. 여기서 스트리밍을 시작하면 점진적 로딩을 받을 수 없습니다. 스트림에는 최종 HTML이 포함됩니다.
  * **선택적** `onError`: 서버 오류가 발생할 때마다 호출되는 콜백입니다. 기본적으로 `console.error`만 호출합니다. 이를 재정의하여 [크래시 보고서를 기록](#logging-crashes-on-the-server)하려면 여전히 `console.error`를 호출해야 합니다. 또한 [상태 코드를 조정](#setting-the-status-code)하는 데 사용할 수도 있습니다.
  * **선택적** `onShellReady`: [초기 쉘](#specifying-what-goes-into-the-shell)이 렌더링된 직후에 호출되는 콜백입니다. 여기서 [상태 코드를 설정](#setting-the-status-code)하고 `pipe`를 호출하여 스트리밍을 시작할 수 있습니다. React는 쉘 이후에 추가 콘텐츠와 HTML 로딩 폴백을 대체하는 인라인 `<script>` 태그를 함께 스트리밍합니다.
  * **선택적** `onShellError`: 초기 쉘을 렌더링하는 동안 오류가 발생한 경우 호출되는 콜백입니다. 오류를 인수로 받습니다. 아직 스트림에서 바이트가 내보내지 않았으며 `onShellReady`나 `onAllReady`도 호출되지 않으므로 [폴백 HTML 쉘을 출력](#recovering-from-errors-inside-the-shell)할 수 있습니다.
  * **선택적** `progressiveChunkSize`: 청크의 바이트 수입니다. [기본 휴리스틱에 대해 자세히 알아보세요.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)


#### 반환값 {/*returns*/}

`renderToPipeableStream`은 두 가지 메서드가 있는 객체를 반환합니다:

* `pipe`는 제공된 [Writable Node.js 스트림](https://nodejs.org/api/stream.html#writable-streams)에 HTML을 출력합니다. 스트리밍을 활성화하려면 `onShellReady`에서 `pipe`를 호출하거나 크롤러 및 정적 생성을 위해 `onAllReady`에서 호출하세요.
* `abort`는 [서버 렌더링을 중단](#aborting-server-rendering)하고 나머지를 클라이언트에서 렌더링할 수 있습니다.

---

## 사용법 {/*usage*/}

### React 트리를 HTML로 Node.js 스트림에 렌더링하기 {/*rendering-a-react-tree-as-html-to-a-nodejs-stream*/}

`renderToPipeableStream`을 호출하여 React 트리를 HTML로 [Node.js 스트림](https://nodejs.org/api/stream.html#writable-streams)에 렌더링합니다:

```js [[1, 5, "<App />"], [2, 6, "['/main.js']"]]
import { renderToPipeableStream } from 'react-dom/server';

// 라우트 핸들러 구문은 백엔드 프레임워크에 따라 다릅니다.
app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

<CodeStep step={1}>루트 컴포넌트</CodeStep>와 함께 <CodeStep step={2}>부트스트랩 `<script>` 경로</CodeStep> 목록을 제공해야 합니다. 루트 컴포넌트는 **루트 `<html>` 태그를 포함한 전체 문서를 반환해야 합니다.**

예를 들어, 다음과 같이 보일 수 있습니다:

```js [[1, 1, "App"]]
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

React는 [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype)과 <CodeStep step={2}>부트스트랩 `<script>` 태그</CodeStep>를 결과 HTML 스트림에 주입합니다:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... 컴포넌트에서 생성된 HTML ... -->
</html>
<script src="/main.js" async=""></script>
```

클라이언트에서는 부트스트랩 스크립트를 사용하여 [전체 `document`를 `hydrateRoot`로 하이드레이트합니다:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

이렇게 하면 서버에서 생성된 HTML에 이벤트 리스너가 연결되어 인터랙티브하게 됩니다.

<DeepDive>

#### 빌드 출력에서 CSS 및 JS 자산 경로 읽기 {/*reading-css-and-js-asset-paths-from-the-build-output*/}

최종 자산 URL(예: JavaScript 및 CSS 파일)은 빌드 후 해시될 수 있습니다. 예를 들어, `styles.css` 대신 `styles.123456.css`가 될 수 있습니다. 정적 자산 파일 이름을 해싱하면 동일한 자산의 각 빌드가 다른 파일 이름을 가지게 됩니다. 이는 정적 자산에 대해 장기 캐싱을 안전하게 활성화할 수 있기 때문에 유용합니다. 특정 이름을 가진 파일은 내용이 변경되지 않습니다.

그러나 빌드 후까지 자산 URL을 알 수 없는 경우, 소스 코드에 이를 포함할 방법이 없습니다. 예를 들어, 이전과 같이 JSX에 `"/styles.css"`를 하드코딩하는 것은 작동하지 않습니다. 이를 소스 코드에서 제외하려면, 루트 컴포넌트가 전달된 맵에서 실제 파일 이름을 읽을 수 있습니다:

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        ...
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
        ...
      </head>
      ...
    </html>
  );
}
```

서버에서는 `assetMap`과 함께 `<App assetMap={assetMap} />`을 렌더링하고 자산 URL이 포함된 `assetMap`을 전달합니다:

```js {1-5,8,9}
// 이 JSON은 빌드 도구에서 가져와야 합니다. 예를 들어, 빌드 출력에서 읽어옵니다.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

이제 서버가 `<App assetMap={assetMap} />`을 렌더링하므로, 클라이언트에서도 `assetMap`과 함께 렌더링하여 하이드레이션 오류를 피해야 합니다. 다음과 같이 `assetMap`을 직렬화하여 클라이언트에 전달할 수 있습니다:

```js {9-10}
// 이 JSON은 빌드 도구에서 가져와야 합니다.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    // 주의: 이 데이터를 stringify()하는 것은 안전합니다. 이 데이터는 사용자 생성 데이터가 아닙니다.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

위 예제에서 `bootstrapScriptContent` 옵션은 클라이언트에서 전역 `window.assetMap` 변수를 설정하는 추가 인라인 `<script>` 태그를 추가합니다. 이를 통해 클라이언트 코드는 동일한 `assetMap`을 읽을 수 있습니다:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

클라이언트와 서버 모두 동일한 `assetMap` prop으로 `App`을 렌더링하므로 하이드레이션 오류가 발생하지 않습니다.

</DeepDive>

---

### 로드되는 콘텐츠를 스트리밍하기 {/*streaming-more-content-as-it-loads*/}

스트리밍을 통해 사용자는 서버에서 모든 데이터가 로드되기 전에 콘텐츠를 볼 수 있습니다. 예를 들어, 커버, 친구 및 사진이 있는 사이드바, 게시물 목록을 표시하는 프로필 페이지를 고려해 보세요:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Posts />
    </ProfileLayout>
  );
}
```

`<Posts />`의 데이터 로드가 시간이 걸린다고 가정해 보겠습니다. 이상적으로는 게시물을 기다리지 않고 나머지 프로필 페이지 콘텐츠를 사용자에게 보여주고 싶을 것입니다. 이를 위해 [`<Suspense>` 경계로 `Posts`를 감쌉니다:](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

```js {9,11}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

이렇게 하면 `Posts`가 데이터를 로드하기 전에 React가 HTML 스트리밍을 시작하도록 지시합니다. React는 먼저 로딩 폴백(`PostsGlimmer`)의 HTML을 보내고, `Posts`가 데이터를 로드하면 나머지 HTML과 로딩 폴백을 해당 HTML로 대체하는 인라인 `<script>` 태그를 함께 보냅니다. 사용자의 관점에서 페이지는 처음에 `PostsGlimmer`와 함께 나타나고 나중에 `Posts`로 대체됩니다.

더욱 [중첩된 `<Suspense>` 경계](/reference/react/Suspense#revealing-nested-content-as-it-loads)를 사용하여 더 세분화된 로딩 순서를 만들 수 있습니다:

```js {5,13}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

이 예제에서는 React가 페이지 스트리밍을 더 일찍 시작할 수 있습니다. `<Suspense>` 경계로 감싸지지 않은 `ProfileLayout`과 `ProfileCover`만 먼저 렌더링을 완료해야 합니다. 그러나 `Sidebar`, `Friends`, 또는 `Photos`가 데이터를 로드해야 하는 경우 React는 대신 `BigSpinner` 폴백의 HTML을 보냅니다. 그런 다음 더 많은 데이터가 사용 가능해지면 더 많은 콘텐츠가 계속 표시되어 모든 콘텐츠가 표시될 때까지 계속됩니다.

스트리밍은 React 자체가 브라우저에서 로드되거나 앱이 인터랙티브해질 때까지 기다릴 필요가 없습니다. 서버에서 HTML 콘텐츠가 점진적으로 표시됩니다.

[HTML 스트리밍 작동 방식에 대해 자세히 알아보세요.](https://github.com/reactwg/react-18/discussions/37)

<Note>

**Suspense를 활성화한 데이터 소스만이 Suspense 컴포넌트를 활성화합니다.** 여기에는 다음이 포함됩니다:

- [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) 및 [Next.js](https://nextjs.org/docs/getting-started/react-essentials)와 같은 Suspense를 활성화한 프레임워크를 사용한 데이터 가져오기
- [`lazy`](/reference/react/lazy)를 사용한 컴포넌트 코드의 지연 로드
- [`use`](/reference/react/use)를 사용하여 Promise의 값을 읽기

Suspense는 **Effect 또는 이벤트 핸들러 내에서 데이터를 가져올 때** 이를 감지하지 않습니다.

위의 `Posts` 컴포넌트에서 데이터를 로드하는 정확한 방법은 프레임워크에 따라 다릅니다. Suspense를 활성화한 프레임워크를 사용하는 경우 해당 프레임워크의 데이터 가져오기 문서에서 자세한 내용을 확인할 수 있습니다.

의견이 없는 프레임워크를 사용하지 않고 Suspense를 활성화한 데이터 가져오기는 아직 지원되지 않습니다. Suspense를 활성화한 데이터 소스를 구현하기 위한 요구 사항은 불안정하고 문서화되지 않았습니다. Suspense와 데이터 소스를 통합하기 위한 공식 API는 React의 향후 버전에서 출시될 예정입니다.

</Note>

---

### 쉘에 포함되는 내용 지정하기 {/*specifying-what-goes-into-the-shell*/}

앱의 `<Suspense>` 경계 외부에 있는 부분을 *쉘*이라고 합니다:

```js {3-5,13,14}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

이는 사용자가 볼 수 있는 가장 빠른 로딩 상태를 결정합니다:

```js {3-5,13
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

앱 전체를 루트에서<Suspense> 경계로 감싸면 쉘에는 그 스피너만 포함됩니다. 그러나 화면에 큰 스피너가 보이는 것은 느리고 짜증나게 느껴질 수 있으므로, 실제 레이아웃을 조금 더 기다렸다가 보는 것이 더 나을 수 있습니다. 이 때문에 일반적으로 `<Suspense>` 경계를 배치하여 쉘이 *최소하지만 완전한* 느낌을 주도록 하는 것이 좋습니다. 즉, 전체 페이지 레이아웃의 골격처럼 보이게 합니다.

`onShellReady` 콜백은 전체 쉘이 렌더링되었을 때 호출됩니다. 일반적으로 이때 스트리밍을 시작합니다:

```js {3-6}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

`onShellReady`가 호출될 때까지 중첩된 `<Suspense>` 경계 내의 컴포넌트는 여전히 데이터를 로드 중일 수 있습니다.

---

### 서버에서 크래시 로그 기록하기 {/*logging-crashes-on-the-server*/}

기본적으로 서버의 모든 오류는 콘솔에 기록됩니다. 이 동작을 재정의하여 크래시 보고서를 기록할 수 있습니다:

```js {7-10}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

사용자 정의 `onError` 구현을 제공하는 경우, 위와 같이 오류를 콘솔에 기록하는 것도 잊지 마세요.

---

### 쉘 내부의 오류에서 복구하기 {/*recovering-from-errors-inside-the-shell*/}

이 예제에서 쉘에는 `ProfileLayout`, `ProfileCover`, 및 `PostsGlimmer`가 포함됩니다:

```js {3-5,7-8}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

이러한 컴포넌트를 렌더링하는 동안 오류가 발생하면 React는 클라이언트에 보낼 의미 있는 HTML이 없습니다. `onShellError`를 재정의하여 서버 렌더링에 의존하지 않는 폴백 HTML을 마지막 수단으로 보낼 수 있습니다:

```js {7-11}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

쉘을 생성하는 동안 오류가 발생하면 `onError`와 `onShellError`가 모두 호출됩니다. 오류 보고를 위해 `onError`를 사용하고 폴백 HTML 문서를 보내기 위해 `onShellError`를 사용하세요. 폴백 HTML은 오류 페이지일 필요는 없습니다. 대신 클라이언트에서만 앱을 렌더링하는 대체 쉘을 포함할 수 있습니다.

---

### 쉘 외부의 오류에서 복구하기 {/*recovering-from-errors-outside-the-shell*/}

이 예제에서 `<Posts />` 컴포넌트는 `<Suspense>`로 감싸져 있으므로 쉘의 일부가 아닙니다:

```js {6}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

`Posts` 컴포넌트나 그 내부에서 오류가 발생하면 React는 이를 복구하려고 시도합니다:

1. 가장 가까운 `<Suspense>` 경계(`PostsGlimmer`)의 로딩 폴백을 HTML에 내보냅니다.
2. 더 이상 서버에서 `Posts` 콘텐츠를 렌더링하려고 하지 않습니다.
3. JavaScript 코드가 클라이언트에서 로드되면 React는 클라이언트에서 `Posts` 렌더링을 다시 시도합니다.

클라이언트에서 `Posts` 렌더링을 다시 시도하는 것도 실패하면 React는 클라이언트에서 오류를 발생시킵니다. 렌더링 중에 발생한 모든 오류와 마찬가지로 가장 가까운 부모 오류 경계가 사용자에게 오류를 표시하는 방법을 결정합니다. 실질적으로 이는 오류가 복구 불가능하다는 것이 확실해질 때까지 사용자가 로딩 표시기를 보게 된다는 것을 의미합니다.

클라이언트에서 `Posts` 렌더링을 다시 시도하는 것이 성공하면 서버의 로딩 폴백이 클라이언트 렌더링 출력으로 대체됩니다. 사용자는 서버 오류가 있었다는 것을 알지 못합니다. 그러나 서버 `onError` 콜백과 클라이언트 `onRecoverableError` 콜백이 호출되어 오류에 대해 알림을 받을 수 있습니다.

---

### 상태 코드 설정하기 {/*setting-the-status-code*/}

스트리밍은 트레이드오프를 도입합니다. 가능한 빨리 페이지 스트리밍을 시작하여 사용자가 콘텐츠를 더 빨리 볼 수 있도록 하고 싶습니다. 그러나 일단 스트리밍을 시작하면 응답 상태 코드를 더 이상 설정할 수 없습니다.

앱을 쉘(모든 `<Suspense>` 경계 위)과 나머지 콘텐츠로 나누면 이 문제의 일부를 이미 해결한 것입니다. 쉘이 오류가 발생하면 `onShellError` 콜백이 호출되어 오류 상태 코드를 설정할 수 있습니다. 그렇지 않으면 앱이 클라이언트에서 복구될 수 있으므로 "OK"를 보낼 수 있습니다.

```js {4}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

쉘 외부(즉, `<Suspense>` 경계 내)의 컴포넌트가 오류를 발생시키면 React는 렌더링을 중단하지 않습니다. 이는 `onError` 콜백이 호출되지만 `onShellError` 대신 `onShellReady`를 계속 받게 된다는 것을 의미합니다. 이는 React가 클라이언트에서 해당 오류를 복구하려고 시도하기 때문입니다.

그러나 원한다면 오류가 발생했음을 사용하여 상태 코드를 설정할 수 있습니다:

```js {1,6,16}
let didError = false;

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = didError ? 500 : 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

이 코드는 초기 쉘 콘텐츠를 생성하는 동안 발생한 쉘 외부의 오류만 포착하므로 포괄적이지 않습니다. 일부 콘텐츠에 오류가 발생했는지 여부를 아는 것이 중요하다면 이를 쉘로 이동할 수 있습니다.

---

### 다양한 오류를 다양한 방식으로 처리하기 {/*handling-different-errors-in-different-ways*/}

자신의 `Error` 하위 클래스를 만들고 `instanceof` 연산자를 사용하여 어떤 오류가 발생했는지 확인할 수 있습니다. 예를 들어, 사용자 정의 `NotFoundError`를 정의하고 컴포넌트에서 이를 발생시킬 수 있습니다. 그런 다음 `onError`, `onShellReady`, 및 `onShellError` 콜백은 오류 유형에 따라 다른 작업을 수행할 수 있습니다:

```js {2,4-14,19,24,30}
let didError = false;
let caughtError = null;

function getStatusCode() {
  if (didError) {
    if (caughtError instanceof NotFoundError) {
      return 404;
    } else {
      return 500;
    }
  } else {
    return 200;
  }
}

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = getStatusCode();
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
   response.statusCode = getStatusCode();
   response.setHeader('content-type', 'text/html');
   response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    didError = true;
    caughtError = error;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

쉘을 내보내고 스트리밍을 시작하면 상태 코드를 변경할 수 없다는 점을 유의하세요.

---

### 크롤러 및 정적 생성을 위해 모든 콘텐츠 로드를 기다리기 {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

스트리밍은 사용자가 콘텐츠를 점진적으로 볼 수 있기 때문에 더 나은 사용자 경험을 제공합니다.

그러나 크롤러가 페이지를 방문하거나 빌드 시 페이지를 생성하는 경우, 모든 콘텐츠가 먼저 로드된 후 최종 HTML 출력을 생성하고 점진적으로 표시하지 않을 수 있습니다.

`onAllReady` 콜백을 사용하여 모든 콘텐츠가 로드될 때까지 기다릴 수 있습니다:

```js {2,7,11,18-24}
let didError = false;
let isCrawler = // ... 봇 감지 전략에 따라 다릅니다 ...

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    if (!isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>'); 
  },
  onAllReady() {
    if (isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);      
    }
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

일반 방문자는 점진적으로 로드된 콘텐츠 스트림을 받게 됩니다. 크롤러는 모든 데이터가 로드된 후 최종 HTML 출력을 받게 됩니다. 그러나 이는 크롤러가 모든 데이터를 기다려야 한다는 것을 의미합니다. 일부 데이터는 로드가 느리거나 오류가 발생할 수 있습니다. 앱에 따라 크롤러에게 쉘을 보내는 것을 선택할 수 있습니다.

---

### 서버 렌더링 중단하기 {/*aborting-server-rendering*/}

타임아웃 후 서버 렌더링을 강제로 "포기"할 수 있습니다:

```js {1,5-7}
const { pipe, abort } = renderToPipeableStream(<App />, {
  // ...
});

setTimeout(() => {
  abort();
}, 10000);
```

React는 남은 로딩 폴백을 HTML로 플러시하고 나머지를 클라이언트에서 렌더링하려고 시도합니다.