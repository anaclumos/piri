---
title: 클라이언트 React DOM API
---

<Intro>

`react-dom/client` API는 클라이언트(브라우저)에서 React 컴포넌트를 렌더링할 수 있게 해줍니다. 이 API는 일반적으로 앱의 최상위 레벨에서 React 트리를 초기화하는 데 사용됩니다. [프레임워크](/learn/start-a-new-react-project#production-grade-react-frameworks)가 이를 대신 호출해 줄 수도 있습니다. 대부분의 컴포넌트는 이를 가져오거나 사용할 필요가 없습니다.

</Intro>

---

## 클라이언트 API {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot)는 브라우저 DOM 노드 안에 React 컴포넌트를 표시할 수 있는 루트를 생성할 수 있게 해줍니다.
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)는 HTML 콘텐츠가 이전에 [`react-dom/server`](/reference/react-dom/server)에 의해 생성된 브라우저 DOM 노드 안에 React 컴포넌트를 표시할 수 있게 해줍니다.

---

## 브라우저 지원 {/*browser-support*/}

React는 Internet Explorer 9 이상을 포함한 모든 인기 있는 브라우저를 지원합니다. IE 9 및 IE 10과 같은 오래된 브라우저에는 일부 폴리필이 필요합니다.