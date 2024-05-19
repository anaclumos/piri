---
title: React 참조 개요
---

<Intro>

이 섹션은 React 작업을 위한 자세한 참조 문서를 제공합니다. React에 대한 소개는 [Learn](/learn) 섹션을 방문하세요.

</Intro>

React 참조 문서는 기능별 하위 섹션으로 나뉩니다:

## React {/*react*/}

프로그래밍 가능한 React 기능:

* [Hooks](/reference/react/hooks) - 컴포넌트에서 다양한 React 기능을 사용합니다.
* [Components](/reference/react/components) - JSX에서 사용할 수 있는 내장 컴포넌트를 문서화합니다.
* [APIs](/reference/react/apis) - 컴포넌트를 정의하는 데 유용한 API입니다.
* [Directives](/reference/rsc/directives) - React Server Components와 호환되는 번들러에 지침을 제공합니다.

## React DOM {/*react-dom*/}

React-dom은 웹 애플리케이션(브라우저 DOM 환경에서 실행되는)에서만 지원되는 기능을 포함합니다. 이 섹션은 다음과 같이 나뉩니다:

* [Hooks](/reference/react-dom/hooks) - 브라우저 DOM 환경에서 실행되는 웹 애플리케이션을 위한 Hooks입니다.
* [Components](/reference/react-dom/components) - React는 모든 브라우저 내장 HTML 및 SVG 컴포넌트를 지원합니다.
* [APIs](/reference/react-dom) - `react-dom` 패키지는 웹 애플리케이션에서만 지원되는 메서드를 포함합니다.
* [Client APIs](/reference/react-dom/client) - `react-dom/client` API는 클라이언트(브라우저)에서 React 컴포넌트를 렌더링할 수 있게 합니다.
* [Server APIs](/reference/react-dom/server) - `react-dom/server` API는 서버에서 React 컴포넌트를 HTML로 렌더링할 수 있게 합니다.

## React의 규칙 {/*rules-of-react*/}

React는 이해하기 쉽고 고품질의 애플리케이션을 제공하는 패턴을 표현하는 방법에 대한 관용구 — 또는 규칙 —를 가지고 있습니다:

* [Components와 Hooks는 순수해야 합니다](/reference/rules/components-and-hooks-must-be-pure) – 순수성은 코드를 이해하고 디버그하기 쉽게 만들며, React가 컴포넌트와 Hooks를 자동으로 최적화할 수 있게 합니다.
* [React는 Components와 Hooks를 호출합니다](/reference/rules/react-calls-components-and-hooks) – React는 사용자 경험을 최적화하기 위해 필요할 때 컴포넌트와 Hooks를 렌더링하는 책임이 있습니다.
* [Hooks의 규칙](/reference/rules/rules-of-hooks) – Hooks는 JavaScript 함수로 정의되지만, 호출할 수 있는 위치에 제한이 있는 특별한 유형의 재사용 가능한 UI 로직을 나타냅니다.

## 레거시 API {/*legacy-apis*/}

* [레거시 API](/reference/react/legacy) - `react` 패키지에서 내보내지지만, 새로 작성된 코드에서는 사용을 권장하지 않습니다.