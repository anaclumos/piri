---
title: React 18로 업그레이드하는 방법
author: Rick Hanlon
date: 2022/03/08
description: 우리가 릴리스 게시물에서 공유한 것처럼, React 18은 새로운 동시 렌더러로 구동되는 기능을 도입하며, 기존 애플리케이션에 대한 점진적인 채택 전략을 가지고 있습니다. 이 게시물에서는 React 18로 업그레이드하는 단계를 안내해 드리겠습니다.
---

2022년 3월 8일 작성자: [Rick Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

[릴리스 게시물](/blog/2022/03/29/react-v18)에서 공유한 것처럼, React 18은 새로운 동시성 렌더러에 의해 구동되는 기능을 도입하며 기존 애플리케이션에 대한 점진적인 채택 전략을 제공합니다. 이 게시물에서는 React 18로 업그레이드하는 단계를 안내합니다.

React 18로 업그레이드하는 동안 발생하는 문제를 [보고해 주세요](https://github.com/facebook/react/issues/new/choose).

</Intro>

<Note>

React Native 사용자에게는 React 18이 향후 React Native 버전에 포함될 예정입니다. 이는 React 18이 이 블로그 게시물에서 소개된 새로운 기능을 활용하기 위해 새로운 React Native 아키텍처에 의존하기 때문입니다. 자세한 내용은 [React Conf 기조연설](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s)을 참조하세요.

</Note>

---

## 설치 {/*installing*/}

최신 버전의 React를 설치하려면:

```bash
npm install react react-dom
```

또는 yarn을 사용하는 경우:

```bash
yarn add react react-dom
```

## 클라이언트 렌더링 API 업데이트 {/*updates-to-client-rendering-apis*/}

React 18을 처음 설치하면 콘솔에 경고가 표시됩니다:

<ConsoleBlock level="error">

ReactDOM.render는 더 이상 React 18에서 지원되지 않습니다. 대신 createRoot를 사용하세요. 새로운 API로 전환할 때까지 애플리케이션은 React 17을 실행하는 것처럼 동작합니다. 자세히 알아보기: https://reactjs.org/link/switch-to-createroot

</ConsoleBlock>

React 18은 루트를 관리하기 위한 더 나은 인체공학을 제공하는 새로운 루트 API를 도입합니다. 새로운 루트 API는 동시성 기능을 선택적으로 사용할 수 있게 해주는 새로운 동시성 렌더러도 활성화합니다.

```js
// 이전
import { render } from 'react-dom';
const container = document.getElementById('app');
render(<App tab="home" />, container);

// 이후
import { createRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = createRoot(container); // TypeScript를 사용하는 경우 createRoot(container!) 사용
root.render(<App tab="home" />);
```

`unmountComponentAtNode`도 `root.unmount`로 변경되었습니다:

```js
// 이전
unmountComponentAtNode(container);

// 이후
root.unmount();
```

Suspense를 사용할 때 예상 결과가 나오지 않는 경우가 많기 때문에 render의 콜백도 제거되었습니다:

```js
// 이전
const container = document.getElementById('app');
render(<App tab="home" />, container, () => {
  console.log('rendered');
});

// 이후
function AppWithCallbackAfterRender() {
  useEffect(() => {
    console.log('rendered');
  });

  return <App tab="home" />
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<AppWithCallbackAfterRender />);
```

<Note>

이전 render 콜백 API에 대한 일대일 대체는 없습니다 — 사용 사례에 따라 다릅니다. 자세한 내용은 [createRoot로 render 대체](https://github.com/reactwg/react-18/discussions/5)에 대한 작업 그룹 게시물을 참조하세요.

</Note>

마지막으로, 애플리케이션이 하이드레이션을 사용한 서버 사이드 렌더링을 사용하는 경우 `hydrate`를 `hydrateRoot`로 업그레이드하세요:

```js
// 이전
import { hydrate } from 'react-dom';
const container = document.getElementById('app');
hydrate(<App tab="home" />, container);

// 이후
import { hydrateRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = hydrateRoot(container, <App tab="home" />);
// createRoot와 달리 여기서는 별도의 root.render() 호출이 필요하지 않습니다.
```

자세한 내용은 [여기](https://github.com/reactwg/react-18/discussions/5)에서 작업 그룹 토론을 참조하세요.

<Note>

**업그레이드 후 애플리케이션이 작동하지 않는 경우, `<StrictMode>`로 래핑되어 있는지 확인하세요.** [Strict Mode는 React 18에서 더 엄격해졌습니다](#updates-to-strict-mode), 그리고 개발 모드에서 추가된 새로운 검사를 모든 컴포넌트가 견딜 수 없을 수도 있습니다. Strict Mode를 제거하면 애플리케이션이 작동하는 경우, 업그레이드 중에 제거하고, 문제가 해결된 후에 다시 추가할 수 있습니다 (트리의 상단 또는 일부에 추가).

</Note>

## 서버 렌더링 API 업데이트 {/*updates-to-server-rendering-apis*/}

이번 릴리스에서는 서버에서 Suspense와 스트리밍 SSR을 완전히 지원하기 위해 `react-dom/server` API를 개편하고 있습니다. 이러한 변경의 일환으로, 서버에서 점진적 Suspense 스트리밍을 지원하지 않는 이전 Node 스트리밍 API를 더 이상 사용하지 않습니다.

이 API를 사용하면 이제 경고가 표시됩니다:

* `renderToNodeStream`: **사용 중단 ⛔️️**

대신, Node 환경에서 스트리밍을 위해 다음을 사용하세요:
* `renderToPipeableStream`: **새로운 기능 ✨**

또한, Deno 및 Cloudflare workers와 같은 최신 엣지 런타임 환경에서 Suspense를 사용한 스트리밍 SSR을 지원하기 위해 새로운 API를 도입하고 있습니다:
* `renderToReadableStream`: **새로운 기능 ✨**

다음 API는 계속 작동하지만, Suspense에 대한 지원이 제한됩니다:
* `renderToString`: **제한됨** ⚠️
* `renderToStaticMarkup`: **제한됨** ⚠️

마지막으로, 이 API는 이메일 렌더링을 위해 계속 작동합니다:
* `renderToStaticNodeStream`

서버 렌더링 API 변경 사항에 대한 자세한 내용은 [서버에서 React 18로 업그레이드](https://github.com/reactwg/react-18/discussions/22)에 대한 작업 그룹 게시물, [새로운 Suspense SSR 아키텍처에 대한 심층 분석](https://github.com/reactwg/react-18/discussions/37), 및 [Shaundai Person](https://twitter.com/shaundai)의 [Suspense를 사용한 스트리밍 서버 렌더링](https://www.youtube.com/watch?v=pj5N-Khihgc)에 대한 React Conf 2021 발표를 참조하세요.

## TypeScript 정의 업데이트 {/*updates-to-typescript-definitions*/}

프로젝트에서 TypeScript를 사용하는 경우, `@types/react` 및 `@types/react-dom` 종속성을 최신 버전으로 업데이트해야 합니다. 새로운 타입은 더 안전하며 타입 검사기가 무시했던 문제를 잡아냅니다. 가장 눈에 띄는 변경 사항은 `children` prop이 이제 props를 정의할 때 명시적으로 나열되어야 한다는 것입니다. 예를 들어:

```typescript{3}
interface MyButtonProps {
  color: string;
  children?: React.ReactNode;
}
```

타입 전용 변경 사항의 전체 목록은 [React 18 typings pull request](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56210)를 참조하세요. 라이브러리 타입에서 코드 조정 방법을 볼 수 있는 예제 수정 사항도 링크되어 있습니다. [자동 마이그레이션 스크립트](https://github.com/eps1lon/types-react-codemod)를 사용하여 애플리케이션 코드를 새로운 안전한 타입으로 더 빠르게 포팅할 수 있습니다.

타입에서 버그를 발견하면, DefinitelyTyped 저장소에 [이슈를 제기](https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/new?category=issues-with-a-types-package)해 주세요.

## 자동 배칭 {/*automatic-batching*/}

React 18은 기본적으로 더 많은 배칭을 수행하여 성능을 향상시킵니다. 배칭은 React가 여러 상태 업데이트를 단일 재렌더링으로 그룹화하여 성능을 향상시키는 것입니다. React 18 이전에는 React 이벤트 핸들러 내에서만 업데이트를 배칭했습니다. 기본적으로 Promise, setTimeout, 네이티브 이벤트 핸들러 또는 기타 이벤트 내의 업데이트는 React에서 배칭되지 않았습니다:

```js
// React 18 이전에는 React 이벤트만 배칭되었습니다

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React는 끝에서 한 번만 재렌더링합니다 (이것이 배칭입니다!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React는 각 상태 업데이트에 대해 두 번 렌더링합니다 (배칭 없음)
}, 1000);
```

React 18에서 `createRoot`를 사용하면, 업데이트가 어디에서 발생하든 모든 업데이트가 자동으로 배칭됩니다. 이는 타임아웃, Promise, 네이티브 이벤트 핸들러 또는 기타 이벤트 내의 업데이트가 React 이벤트 내의 업데이트와 동일하게 배칭된다는 것을 의미합니다:

```js
// React 18 이후에는 타임아웃, Promise,
// 네이티브 이벤트 핸들러 또는 기타 이벤트 내의 업데이트가 배칭됩니다.

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React는 끝에서 한 번만 재렌더링합니다 (이것이 배칭입니다!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React는 끝에서 한 번만 재렌더링합니다 (이것이 배칭입니다!)
}, 1000);
```

이것은 중단 변경 사항이지만, 우리는 이것이 렌더링 작업을 줄이고 애플리케이션의 성능을 향상시킬 것으로 기대합니다. 자동 배칭을 선택 해제하려면 `flushSync`를 사용할 수 있습니다:

```js
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCounter(c => c + 1);
  });
  // React는 이제 DOM을 업데이트했습니다
  flushSync(() => {
    setFlag(f => !f);
  });
  // React는 이제 DOM을 업데이트했습니다
}
```

자세한 내용은 [자동 배칭 심층 분석](https://github.com/reactwg/react-18/discussions/21)을 참조하세요.

## 라이브러리를 위한 새로운 API {/*new-apis-for-libraries*/}

React 18 작업 그룹에서 우리는 스타일 및 외부 저장소와 같은 특정 사용 사례에 대해 동시 렌더링을 지원하기 위해 필요한 새로운 API를 만들기 위해 라이브러리 유지 관리자와 협력했습니다. React 18을 지원하기 위해 일부 라이브러리는 다음 API 중 하나로 전환해야 할 수 있습니다:

* `useSyncExternalStore`는 외부 저장소가 업데이트를 동기화하도록 강제하여 동시 읽기를 지원하는 새로운 Hook입니다. 이 새로운 API는 React 외부 상태와 통합되는 모든 라이브러리에 권장됩니다. 자세한 내용은 [useSyncExternalStore 개요 게시물](https://github.com/reactwg/react-18/discussions/70) 및 [useSyncExternalStore API 세부 정보](https://github.com/reactwg/react-18/discussions/86)를 참조하세요.
* `useInsertionEffect`는 CSS-in-JS 라이브러리가 렌더링 시 스타일을 주입하는 성능 문제를 해결할 수 있도록 하는 새로운 Hook입니다. 이미 CSS-in-JS 라이브러리를 구축하지 않은 경우, 이 Hook을 사용할 필요는 없습니다. 이 Hook은 DOM이 변형된 후에 실행되지만 레이아웃 효과가 새로운 레이아웃을 읽기 전에 실행됩니다. 이는 React 17 이하에서 이미 존재하는 문제를 해결하지만, React가 동시 렌더링 중에 브라우저에 양보하여 레이아웃을 다시 계산할 기회를 제공하기 때문에 React 18에서는 더욱 중요합니다. 자세한 내용은 [라이브러리 업그레이드 가이드](https://github.com/reactwg/react-18/discussions/110)를 참조하세요.

React 18은 또한 `startTransition`, `useDeferredValue` 및 `useId`와 같은 동시 렌더링을 위한 새로운 API를 도입합니다. 자세한 내용은 [릴리스 게시물](/blog/2022/03/29/react-v18)을 참조하세요.

## Strict Mode 업데이트 {/*updates-to-strict-mode*/}

미래에는 React가 상태를 유지하면서 UI의 섹션을 추가 및 제거할 수 있는 기능을 추가하고자 합니다. 예를 들어, 사용자가 화면을 탭하고 다시 돌아올 때 React는 이전 화면을 즉시 표시할 수 있어야 합니다. 이를 위해 React는 동일한 컴포넌트 상태를 사용하여 트리를 마운트 해제하고 다시 마운트할 것입니다.

이 기능은 React에 기본적으로 더 나은 성능을 제공하지만, 컴포넌트가 여러 번 마운트 및 파괴되는 것에 견딜 수 있어야 합니다. 대부분의 효과는 변경 없이 작동하지만, 일부 효과는 한 번만 마운트되거나 파괴된다고 가정합니다.

이 문제를 표면화하기 위해 React 18은 Strict Mode에 새로운 개발 전용 검사를 도입합니다. 이 새로운 검사는 컴포넌트가 처음 마운트될 때마다 자동으로 모든 컴포넌트를 마운트 해제하고 다시 마운트하며, 두 번째 마운트 시 이전 상태를 복원합니다.

이 변경 이전에는 React가 컴포넌트를 마운트하고 효과를 생성했습니다:

```
* React가 컴포넌트를 마운트합니다.
    * 레이아웃 효과가 생성됩니다.
    * 효과가 생성됩니다.
```

React 18의 Strict Mode에서는 React가 개발 모드에서 컴포넌트를 마운트 해제하고 다시 마운트하는 것을 시뮬레이션합니다:

```
* React가 컴포넌트를 마운트합니다.
    * 레이아웃 효과가 생성됩니다.
    * 효과가 생성됩니다.
* React가 컴포넌트를 마운트 해제하는 것을 시뮬레이션합니다.
    * 레이아웃 효과가 파괴됩니다.
    * 효과가 파괴됩니다.
* React가 이전 상태로 컴포넌트를 마운트하는 것을 시뮬레이션합니다.
    * 레이아웃 효과 설정 코드가 실행됩니다.
    * 효과 설정 코드가 실행됩니다.
```

자세한 내용은 [StrictMode에 재사용 가능한 상태 추가](https://github.com/reactwg/react-18/discussions/19) 및 [효과에서 재사용 가능한 상태 지원 방법](https://github.com/reactwg/react-18/discussions/18)에 대한 작업 그룹 게시물을 참조하세요.

## 테스트 환경 구성 {/*configuring-your-testing-environment*/}

테스트를 `createRoot`로 업데이트하면 테스트 콘솔에 다음 경고가 표시될 수 있습니다:

<ConsoleBlock level="error">

현재 테스트 환경은 act(...)를 지원하도록 구성되지 않았습니다.

</ConsoleBlock>

이를 해결하려면 테스트 실행 전에 `globalThis.IS_REACT_ACT_ENVIRONMENT`를 `true`로 설정하세요:

```js
// 테스트 설정 파일에서
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
```

이 플래그의 목적은 React에게 유닛 테스트와 같은 환경에서 실행 중임을 알리는 것입니다. React는 업데이트를 `act`로 래핑하는 것을 잊은 경우 유용한 경고를 기록합니다.

또한 플래그를 `false`로 설정하여 React에게 `act`가 필요하지 않음을 알릴 수 있습니다. 이는 전체 브라우저 환경을 시뮬레이션하는 엔드 투 엔드 테스트에 유용할 수 있습니다.

궁극적으로, 우리는 테스트 라이브러리가 이를 자동으로 구성할 것으로 기대합니다. 예를 들어, [다음 버전의 React Testing Library는 추가 구성 없이 React 18에 대한 내장 지원을 제공합니다](https://github.com/testing-library/react-testing-library/issues/509#issuecomment-917989936).

[act 테스트 API 및 관련 변경 사항에 대한 배경 정보](https://github.com/reactwg/react-18/discussions/102)는 작업 그룹에서 확인할 수 있습니다.

## Internet Explorer 지원 중단 {/*dropping-support-for-internet-explorer*/}

이번 릴리스에서는 React가 Internet Explorer 지원을 중단합니다. 이는 [2022년 6월 15일에 지원이 종료됩니다](https://blogs.windows.com/windowsexperience/2021/05/19/the-future-of-internet-explorer-on-windows-10-is-in-microsoft-edge). React 18에서 도입된 새로운 기능은 IE에서 적절히 폴리필할 수 없는 마이크로태스크와 같은 최신 브라우저 기능을 사용하기 때문에 지금 이 변경을 진행합니다.

Internet Explorer를 지원해야 하는 경우 React 17을 유지하는 것이 좋습니다.

## 사용 중단 {/*deprecations*/}

* `react-dom`: `ReactDOM.render`는 사용 중단되었습니다. 이를 사용하면 경고가 표시되고 애플리케이션이 React 17 모드에서 실행됩니다.
* `react-dom`: `ReactDOM.hydrate`는 사용 중단되었습니다. 이를 사용하면 경고가 표시되고 애플리케이션이 React 17 모드에서 실행됩니다.
* `react-dom`: `ReactDOM.unmountComponentAtNode`는 사용 중단되었습니다.
* `react-dom`: `ReactDOM.renderSubtreeIntoContainer`는 사용 중단되었습니다.
* `react-dom/server`: `ReactDOMServer.renderToNodeStream`는 사용 중단되었습니다.

## 기타 중단 변경 사항 {/*other-breaking-changes*/}

* **일관된 useEffect 타이밍**: React는 이제 클릭 또는 키다운 이벤트와 같은 개별 사용자 입력 이벤트 동안 트리거된 업데이트의 경우 항상 동기적으로 효과 함수를 플러시합니다. 이전에는 이 동작이 항상 예측 가능하거나 일관되지 않았습니다.
* **더 엄격한 하이드레이션 오류**: 누락되거나 추가된 텍스트 콘텐츠로 인한 하이드레이션 불일치는 이제 경고 대신 오류로 처리됩니다. React는 더 이상 서버 마크업과 일치시키기 위해 클라이언트에서 개별 노드를 삽입하거나 삭제하려고 시도하지 않으며, 트리에서 가장 가까운 `<Suspense>` 경계까지 클라이언트 렌더링으로 되돌아갑니다. 이는 하이드레이션 불일치로 인해 발생할 수 있는 잠재적인 프라이버시 및 보안 문제를 방지하고 하이드레이션된 트리가 일관성을 유지하도록 합니다.
* **Suspense 트리는 항상 일관성 있음**: 컴포넌트가 트리에 완전히 추가되기 전에 중단되면, React는 불완전한 상태로 트리에 추가하거나 효과를 실행하지 않습니다. 대신, React는 새로운 트리를 완전히 버리고 비동기 작업이 완료될 때까지 기다린 다음 처음부터 다시 렌더링을 시도합니다. React는 재시도 시도를 동시적으로 렌더링하며 브라우저를 차단하지 않습니다.
* **Suspense와 함께하는 레이아웃 효과**: 트리가 다시 중단되고 대체로 되돌아갈 때, React는 이제 레이아웃 효과를 정리한 다음 경계 내부의 콘텐츠가 다시 표시될 때 다시 생성합니다. 이는 Suspense와 함께 사용할 때 컴포넌트 라이브러리가 레이아웃을 올바르게 측정하지 못하는 문제를 해결합니다.
* **새로운 JS 환경 요구 사항**: React는 이제 `Promise`, `Symbol`, 및 `Object.assign`과 같은 최신 브라우저 기능에 의존합니다. Internet Explorer와 같이 최신 브라우저 기능을 기본적으로 제공하지 않거나 비표준 구현을 제공하는 오래된 브라우저 및 장치를 지원하는 경우, 번들된 애플리케이션에 글로벌 폴리필을 포함하는 것을 고려하세요.

## 기타 주목할 만한 변경 사항 {/*other-notable-changes*/}

### React {/*react*/}

* **컴포넌트가 이제 `undefined`를 렌더링할 수 있음**: 컴포넌트에서 `undefined`를 반환해도 React는 더 이상 경고하지 않습니다. 이는 컴포넌트 트리 중간에 허용되는 값과 일치하는 허용 컴포넌트 반환 값을 만듭니다. JSX 앞에 `return` 문을 잊는 것과 같은 실수를 방지하기 위해 린터를 사용하는 것이 좋습니다.
* **테스트에서 `act` 경고는 이제 선택 사항**: 엔드 투 엔드 테스트를 실행하는 경우 `act` 경고는 불필요합니다. 유닛 테스트에서 유용하고 유익한 경우에만 이를 활성화할 수 있는 [선택적](https://github.com/reactwg/react-18/discussions/102) 메커니즘을 도입했습니다.
* **언마운트된 컴포넌트에서 `setState`에 대한 경고 없음**: 이전에는 언마운트된 컴포넌트에서 `setState`를 호출할 때 메모리 누수에 대한 경고가 표시되었습니다. 이 경고는 구독을 위해 추가되었지만, 주로 상태 설정이 괜찮은 시나리오에서 발생하며, 해결 방법은 코드를 더 나쁘게 만듭니다. 우리는 이 경고를 [제거했습니다](https://github.com/facebook/react/pull/22114).
* **콘솔 로그 억제 없음**: Strict Mode를 사용할 때, React는 예기치 않은 부작용을 찾기 위해 각 컴포넌트를 두 번 렌더링합니다. React 17에서는 로그를 더 쉽게 읽을 수 있도록 두 번의 렌더링 중 하나에 대한 콘솔 로그를 억제했습니다. 이것이 혼란스럽다는 [커뮤니티 피드백](https://github.com/facebook/react/issues/21783)에 응답하여 억제를 제거했습니다. 대신, React DevTools가 설치된 경우 두 번째 로그의 렌더링이 회색으로 표시되며, 이를 완전히 억제하는 옵션(기본적으로 꺼짐)이 있습니다.
* **개선된 메모리 사용량**: React는 이제 언마운트 시 더 많은 내부 필드를 정리하여 애플리케이션 코드에 존재할 수 있는 수정되지 않은 메모리 누수의 영향을 덜 심각하게 만듭니다.

### React DOM Server {/*react-dom-server*/}

* **`renderToString`**: 서버에서 중단될 때 더 이상 오류가 발생하지 않습니다. 대신, 가장 가까운 `<Suspense>` 경계에 대한 대체 HTML을 내보내고 클라이언트에서 동일한 콘텐츠를 다시 렌더링하려고 시도합니다. 여전히 `renderToPipeableStream` 또는 `renderToReadableStream`과 같은 스트리밍 API로 전환하는 것이 좋습니다.
* **`renderToStaticMarkup`**: 서버에서 중단될 때 더 이상 오류가 발생하지 않습니다. 대신, 가장 가까운 `<Suspense>` 경계에 대한 대체 HTML을 내보냅니다.

## 변경 로그 {/*changelog*/}

[전체 변경 로그는 여기](https://github.com/facebook/react/blob/main/CHANGELOG.md)에서 확인할 수 있습니다.