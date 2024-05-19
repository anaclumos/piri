---
title: 기존 프로젝트에 React 추가하기
---

<Intro>

기존 프로젝트에 상호작용성을 추가하고 싶다면, React로 다시 작성할 필요가 없습니다. 기존 스택에 React를 추가하고, 어디서든 상호작용 가능한 React 컴포넌트를 렌더링하세요.

</Intro>

<Note>

**로컬 개발을 위해 [Node.js](https://nodejs.org/en/)를 설치해야 합니다.** 온라인에서 또는 간단한 HTML 페이지로 [React를 시도](/learn/installation#try-react)할 수 있지만, 현실적으로 개발에 사용하고 싶은 대부분의 JavaScript 도구는 Node.js를 필요로 합니다.

</Note>

## 기존 웹사이트의 전체 하위 경로에 React 사용하기 {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

`example.com`에서 다른 서버 기술(예: Rails)로 구축된 기존 웹 앱이 있고, `example.com/some-app/`로 시작하는 모든 경로를 React로 완전히 구현하고 싶다고 가정해봅시다.

다음은 설정 방법입니다:

1. **앱의 React 부분을 구축**합니다. [React 기반 프레임워크](/learn/start-a-new-react-project) 중 하나를 사용하세요.
2. 프레임워크의 설정에서 **`/some-app`을 *기본 경로*로 지정**합니다 (예: [Next.js](https://nextjs.org/docs/api-reference/next.config.js/basepath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. **서버 또는 프록시를 구성**하여 `/some-app/` 아래의 모든 요청이 React 앱에 의해 처리되도록 합니다.

이렇게 하면 앱의 React 부분이 해당 프레임워크에 내장된 [최고의 실천 방법](/learn/start-a-new-react-project#can-i-use-react-without-a-framework)을 활용할 수 있습니다.

많은 React 기반 프레임워크는 풀스택이며, React 앱이 서버의 이점을 활용할 수 있게 합니다. 그러나 서버에서 JavaScript를 실행할 수 없거나 실행하고 싶지 않은 경우에도 동일한 접근 방식을 사용할 수 있습니다. 이 경우, HTML/CSS/JS 내보내기([`next export` 출력](https://nextjs.org/docs/advanced-features/static-html-export) for Next.js, Gatsby의 기본값)를 `/some-app/`에 제공하세요.

## 기존 페이지의 일부에 React 사용하기 {/*using-react-for-a-part-of-your-existing-page*/}

다른 기술(서버 기술인 Rails 또는 클라이언트 기술인 Backbone 등)로 구축된 기존 페이지가 있고, 그 페이지의 일부에 상호작용 가능한 React 컴포넌트를 렌더링하고 싶다고 가정해봅시다. 이는 React를 통합하는 일반적인 방법입니다. 실제로 Meta에서 많은 해 동안 대부분의 React 사용이 이렇게 이루어졌습니다!

이 작업은 두 단계로 수행할 수 있습니다:

1. [JSX 문법](/learn/writing-markup-with-jsx)을 사용할 수 있고, `import` / `export` 문법으로 코드를 모듈로 분할하며, [npm](https://www.npmjs.com/) 패키지 레지스트리에서 패키지(예: React)를 사용할 수 있는 **JavaScript 환경을 설정**합니다.
2. 페이지에서 원하는 위치에 **React 컴포넌트를 렌더링**합니다.

구체적인 접근 방식은 기존 페이지 설정에 따라 다르므로, 몇 가지 세부 사항을 살펴보겠습니다.

### 단계 1: 모듈식 JavaScript 환경 설정하기 {/*step-1-set-up-a-modular-javascript-environment*/}

모듈식 JavaScript 환경을 사용하면 모든 코드를 하나의 파일에 작성하는 대신 개별 파일에 React 컴포넌트를 작성할 수 있습니다. 또한, [npm](https://www.npmjs.com/) 레지스트리에 다른 개발자가 게시한 모든 멋진 패키지(React 포함)를 사용할 수 있습니다! 이를 수행하는 방법은 기존 설정에 따라 다릅니다:

* **앱이 이미 `import` 문을 사용하는 파일로 분할되어 있는 경우,** 이미 가지고 있는 설정을 사용해 보세요. JS 코드에서 `<div />`를 작성할 때 구문 오류가 발생하는지 확인하세요. 구문 오류가 발생하면, [Babel로 JavaScript 코드를 변환](https://babeljs.io/setup)하고, JSX를 사용하기 위해 [Babel React preset](https://babeljs.io/docs/babel-preset-react)을 활성화해야 할 수 있습니다.

* **앱에 JavaScript 모듈을 컴파일하는 기존 설정이 없는 경우,** [Vite](https://vitejs.dev/)로 설정하세요. Vite 커뮤니티는 Rails, Django, Laravel을 포함한 [백엔드 프레임워크와의 많은 통합](https://github.com/vitejs/awesome-vite#integrations-with-backends)을 유지 관리합니다. 백엔드 프레임워크가 목록에 없으면, [이 가이드](https://vitejs.dev/guide/backend-integration.html)를 따라 Vite 빌드를 백엔드와 수동으로 통합하세요.

설정이 작동하는지 확인하려면 프로젝트 폴더에서 다음 명령을 실행하세요:

<TerminalBlock>
npm install react react-dom
</TerminalBlock>

그런 다음, 메인 JavaScript 파일(예: `index.js` 또는 `main.js`) 상단에 다음 코드를 추가하세요:

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Your existing page content (in this example, it gets replaced) -->
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

</Sandpack>

페이지의 전체 내용이 "Hello, world!"로 대체되었다면, 모든 것이 제대로 작동한 것입니다! 계속 읽어보세요.

<Note>

기존 프로젝트에 모듈식 JavaScript 환경을 처음 통합하는 것은 겁이 날 수 있지만, 그만한 가치가 있습니다! 문제가 발생하면, [커뮤니티 리소스](/community)나 [Vite Chat](https://chat.vitejs.dev/)을 시도해 보세요.

</Note>

### 단계 2: 페이지 어디서나 React 컴포넌트 렌더링하기 {/*step-2-render-react-components-anywhere-on-the-page*/}

이전 단계에서, 메인 파일 상단에 다음 코드를 추가했습니다:

```js
import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

물론, 기존 HTML 콘텐츠를 실제로 지우고 싶지는 않습니다!

이 코드를 삭제하세요.

대신, HTML의 특정 위치에 React 컴포넌트를 렌더링하고 싶을 것입니다. HTML 페이지(또는 이를 생성하는 서버 템플릿)를 열고, 모든 태그에 고유한 [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) 속성을 추가하세요. 예를 들어:

```html
<!-- ... somewhere in your html ... -->
<nav id="navigation"></nav>
<!-- ... more html ... -->
```

이렇게 하면 [`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById)를 사용하여 해당 HTML 요소를 찾고, [`createRoot`](/reference/react-dom/client/createRoot)에 전달하여 해당 요소 내부에 React 컴포넌트를 렌더링할 수 있습니다:

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <p>This paragraph is a part of HTML.</p>
    <nav id="navigation"></nav>
    <p>This paragraph is also a part of HTML.</p>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: Actually implement a navigation bar
  return <h1>Hello from React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

</Sandpack>

`index.html`의 원래 HTML 콘텐츠가 유지되지만, HTML의 `<nav id="navigation">` 내부에 이제 `NavigationBar` React 컴포넌트가 나타나는 것을 확인하세요. 기존 HTML 페이지 내부에 React 컴포넌트를 렌더링하는 방법에 대해 더 알고 싶다면 [`createRoot` 사용 설명서](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react)를 읽어보세요.

기존 프로젝트에 React를 도입할 때, 작은 상호작용 컴포넌트(예: 버튼)로 시작하고 점차 "위로 이동"하여 결국 전체 페이지가 React로 구축될 때까지 진행하는 것이 일반적입니다. 그런 시점에 도달하면, React의 장점을 최대한 활용하기 위해 [React 프레임워크](/learn/start-a-new-react-project)로 마이그레이션하는 것을 권장합니다.

## 기존 네이티브 모바일 앱에 React Native 사용하기 {/*using-react-native-in-an-existing-native-mobile-app*/}

[React Native](https://reactnative.dev/)도 기존 네이티브 앱에 점진적으로 통합할 수 있습니다. Android(Java 또는 Kotlin) 또는 iOS(Objective-C 또는 Swift)용 기존 네이티브 앱이 있는 경우, [이 가이드](https://reactnative.dev/docs/integration-with-existing-apps)를 따라 React Native 화면을 추가하세요.