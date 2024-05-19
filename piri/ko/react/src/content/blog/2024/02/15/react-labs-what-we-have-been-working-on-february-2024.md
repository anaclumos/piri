---
title: React 랩스: 우리가 하고 있던 일 – 2024년 2월
author: Joseph Savona, Ricky Hanlon, Andrew Clark, Matt Carroll, and Dan Abramov
date: 2024/02/15
description: React 랩스 게시물에서는 현재 연구 및 개발 중인 프로젝트에 대해 작성합니다. 지난 업데이트 이후로 상당한 진전을 이루었으며, 그 진전을 공유하고자 합니다.
---

2024년 2월 15일 [Joseph Savona](https://twitter.com/en_JS), [Ricky Hanlon](https://twitter.com/rickhanlonii), [Andrew Clark](https://twitter.com/acdlite), [Matt Carroll](https://twitter.com/mattcarrollcode), 그리고 [Dan Abramov](https://twitter.com/dan_abramov) 작성.

---

<Intro>

React Labs 게시물에서는 현재 연구 및 개발 중인 프로젝트에 대해 작성합니다. [지난 업데이트](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023) 이후로 상당한 진전을 이루었으며, 그 진행 상황을 공유하고자 합니다.

</Intro>

<Note>

React Conf 2024가 5월 15일부터 16일까지 네바다주 헨더슨에서 열립니다! React Conf에 직접 참석하고 싶다면, 2월 28일까지 [티켓 추첨에 등록](https://forms.reform.app/bLaLeE/react-conf-2024-ticket-lottery/1aRQLK)할 수 있습니다.

티켓, 무료 스트리밍, 후원 등에 대한 자세한 정보는 [React Conf 웹사이트](https://conf.react.dev)를 참조하세요.

</Note>

---

## React Compiler {/*react-compiler*/}

React Compiler는 더 이상 연구 프로젝트가 아닙니다: 이제 컴파일러는 instagram.com에서 프로덕션 환경에서 사용되고 있으며, Meta의 추가적인 표면에 컴파일러를 배포하고 첫 오픈 소스 릴리스를 준비하고 있습니다.

[이전 게시물](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-optimizing-compiler)에서 논의한 바와 같이, React는 상태가 변경될 때 *때때로* 너무 많이 다시 렌더링할 수 있습니다. React 초기부터 이러한 경우에 대한 우리의 해결책은 수동 메모이제이션이었습니다. 현재 API에서는 [`useMemo`](/reference/react/useMemo), [`useCallback`](/reference/react/useCallback), 그리고 [`memo`](/reference/react/memo) API를 적용하여 상태 변경 시 React가 얼마나 다시 렌더링할지를 수동으로 조정합니다. 하지만 수동 메모이제이션은 타협입니다. 이는 코드가 복잡해지고, 실수하기 쉽고, 최신 상태를 유지하기 위해 추가 작업이 필요합니다.

수동 메모이제이션은 합리적인 타협이지만, 우리는 만족하지 않았습니다. 우리의 비전은 React가 상태 변경 시 UI의 적절한 부분을 *자동으로* 다시 렌더링하는 것이며, *React의 핵심 정신 모델을 타협하지 않는 것*입니다. 우리는 React의 접근 방식 — 표준 JavaScript 값과 관용구를 사용하여 상태의 단순한 함수로서의 UI — 이 많은 개발자들에게 React가 접근 가능하게 만든 중요한 부분이라고 믿습니다. 그래서 우리는 React를 위한 최적화 컴파일러를 구축하는 데 투자했습니다.

JavaScript는 느슨한 규칙과 동적 특성 때문에 최적화하기 어려운 언어로 악명이 높습니다. React Compiler는 JavaScript의 규칙 *및* "React의 규칙"을 모델링하여 코드를 안전하게 컴파일할 수 있습니다. 예를 들어, React 컴포넌트는 동일한 입력을 주면 동일한 값을 반환해야 하며, props나 상태 값을 변경할 수 없습니다. 이러한 규칙은 개발자가 할 수 있는 것을 제한하고 컴파일러가 최적화할 수 있는 안전한 공간을 마련해줍니다.

물론, 우리는 개발자가 때때로 규칙을 약간 어기는 것을 이해하고 있으며, 우리의 목표는 React Compiler가 가능한 한 많은 코드에서 바로 작동하도록 하는 것입니다. 컴파일러는 코드가 React의 규칙을 엄격히 따르지 않는 경우를 감지하려고 시도하며, 안전한 경우 코드를 컴파일하거나 안전하지 않은 경우 컴파일을 건너뜁니다. 우리는 이 접근 방식을 검증하기 위해 Meta의 크고 다양한 코드베이스를 테스트하고 있습니다.

자신의 코드가 React의 규칙을 따르는지 확인하고 싶은 개발자에게는 [Strict Mode 활성화](/reference/react/StrictMode)와 [React의 ESLint 플러그인 구성](/learn/editor-setup#linting)을 권장합니다. 이러한 도구는 React 코드의 미묘한 버그를 잡아내어 오늘날 애플리케이션의 품질을 향상시키고, React Compiler와 같은 향후 기능에 대비할 수 있습니다. 우리는 또한 React의 규칙에 대한 통합 문서와 이러한 규칙을 이해하고 적용하여 더 견고한 앱을 만들 수 있도록 팀을 돕기 위한 ESLint 플러그인 업데이트 작업을 진행하고 있습니다.

컴파일러가 작동하는 모습을 보려면 [작년 가을 발표](https://www.youtube.com/watch?v=qOQClO3g8-Y)를 확인할 수 있습니다. 발표 당시, 우리는 instagram.com의 한 페이지에서 React Compiler를 시도한 초기 실험 데이터를 가지고 있었습니다. 그 이후로, 우리는 컴파일러를 instagram.com 전체에 프로덕션으로 배포했습니다. 또한 Meta의 추가 표면에 대한 배포를 가속화하고 오픈 소스를 준비하기 위해 팀을 확장했습니다. 우리는 앞으로의 길에 대해 기대하고 있으며, 앞으로 몇 달 동안 더 많은 내용을 공유할 예정입니다.

## Actions {/*actions*/}

우리는 [이전에 공유한 바와 같이](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components), 데이터베이스 변이와 폼 구현을 위해 클라이언트에서 서버로 데이터를 보내는 Server Actions 솔루션을 탐구하고 있었습니다. Server Actions 개발 중에 이러한 API를 클라이언트 전용 애플리케이션의 데이터 처리도 지원하도록 확장했습니다.

우리는 이 더 넓은 기능 모음을 단순히 "Actions"라고 부릅니다. Actions를 사용하면 [`<form/>`](/reference/react-dom/components/form)와 같은 DOM 요소에 함수를 전달할 수 있습니다:

```js
<form action={search}>
  <input name="query" />
  <button type="submit">Search</button>
</form>
```

`action` 함수는 동기적 또는 비동기적으로 작동할 수 있습니다. 표준 JavaScript를 사용하여 클라이언트 측에서 정의하거나 [`'use server'`](/reference/rsc/use-server) 지시어를 사용하여 서버에서 정의할 수 있습니다. Action을 사용할 때 React는 데이터 제출의 생명 주기를 관리하며, [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) 및 [`useActionState`](/reference/react/useActionState)와 같은 훅을 제공하여 폼 액션의 현재 상태와 응답에 접근할 수 있습니다.

기본적으로, Actions는 [transition](/reference/react/useTransition) 내에서 제출되어, 액션이 처리되는 동안 현재 페이지를 상호작용 가능하게 유지합니다. Actions는 비동기 함수를 지원하므로, transition에서 `async/await`을 사용할 수 있는 기능도 추가했습니다. 이를 통해 `fetch`와 같은 비동기 요청이 시작될 때 `isPending` 상태로 보류 중인 UI를 표시하고, 업데이트가 적용될 때까지 보류 중인 UI를 계속 표시할 수 있습니다.

Actions와 함께 낙관적 상태 업데이트를 관리하기 위한 [`useOptimistic`](/reference/react/useOptimistic) 기능을 도입하고 있습니다. 이 훅을 사용하면 최종 상태가 커밋되면 자동으로 되돌려지는 임시 업데이트를 적용할 수 있습니다. Actions의 경우, 제출이 성공할 것으로 가정하고 클라이언트에서 데이터의 최종 상태를 낙관적으로 설정하고, 서버에서 받은 데이터 값으로 되돌릴 수 있습니다. 이는 일반 `async`/`await`을 사용하여 작동하므로, 클라이언트에서 `fetch`를 사용하든 서버에서 Server Action을 사용하든 동일하게 작동합니다.

라이브러리 작성자는 `useTransition`을 사용하여 자신의 컴포넌트에서 `action={fn}` props를 구현할 수 있습니다. 우리의 의도는 라이브러리가 컴포넌트 API를 설계할 때 Actions 패턴을 채택하여 React 개발자에게 일관된 경험을 제공하는 것입니다. 예를 들어, 라이브러리가 `<Calendar onSelect={eventHandler}>` 컴포넌트를 제공하는 경우, `<Calendar selectAction={action}>` API도 제공하는 것을 고려해 보세요.

처음에는 클라이언트-서버 데이터 전송을 위한 Server Actions에 중점을 두었지만, React에 대한 우리의 철학은 모든 플랫폼과 환경에서 동일한 프로그래밍 모델을 제공하는 것입니다. 가능할 때마다, 클라이언트에서 기능을 도입하면 서버에서도 작동하도록 하고, 그 반대의 경우도 마찬가지입니다. 이 철학은 앱이 실행되는 환경에 상관없이 작동하는 단일 API 세트를 만들 수 있게 하여 나중에 다른 환경으로 업그레이드하기 쉽게 만듭니다.

Actions는 이제 Canary 채널에서 사용할 수 있으며, 다음 React 릴리스에 포함될 예정입니다.

## React Canary의 새로운 기능 {/*new-features-in-react-canary*/}

우리는 [React Canaries](/blog/2023/05/03/react-canaries)를 도입하여 디자인이 거의 완료된 새로운 안정 기능을 안정적인 semver 버전으로 릴리스되기 전에 개별적으로 채택할 수 있는 옵션을 제공했습니다.

Canaries는 React 개발 방식의 변화를 의미합니다. 이전에는 기능이 Meta 내부에서 비공개로 연구되고 구축되었기 때문에 사용자는 안정 버전으로 릴리스될 때 최종 완성된 제품만 볼 수 있었습니다. Canaries를 통해 우리는 커뮤니티의 도움을 받아 React Labs 블로그 시리즈에서 공유하는 기능을 최종화하기 위해 공개적으로 빌드하고 있습니다. 이는 기능이 완료된 후가 아닌, 최종화되는 동안 새로운 기능에 대해 더 빨리 알 수 있음을 의미합니다.

React Server Components, Asset Loading, Document Metadata, 그리고 Actions는 모두 React Canary에 포함되었으며, 이러한 기능에 대한 문서를 react.dev에 추가했습니다:

- **Directives**: [`"use client"`](/reference/rsc/use-client) 및 [`"use server"`](/reference/rsc/use-server)는 전체 스택 React 프레임워크를 위해 설계된 번들러 기능입니다. 이는 두 환경 간의 "분할 지점"을 표시합니다: `"use client"`는 번들러에게 `<script>` 태그를 생성하도록 지시하고 (예: [Astro Islands](https://docs.astro.build/en/concepts/islands/#creating-an-island)), `"use server"`는 번들러에게 POST 엔드포인트를 생성하도록 지시합니다 (예: [tRPC Mutations](https://trpc.io/docs/concepts)). 이를 통해 클라이언트 측 상호작용과 관련된 서버 측 로직을 구성하는 재사용 가능한 컴포넌트를 작성할 수 있습니다.

- **Document Metadata**: [`<title>`](/reference/react-dom/components/title), [`<meta>`](/reference/react-dom/components/meta), 및 메타데이터 [`<link>`](/reference/react-dom/components/link) 태그를 컴포넌트 트리 어디에서나 렌더링할 수 있는 내장 지원을 추가했습니다. 이는 완전히 클라이언트 측 코드, SSR, RSC를 포함한 모든 환경에서 동일하게 작동합니다. 이는 [React Helmet](https://github.com/nfl/react-helmet)과 같은 라이브러리가 선구한 기능에 대한 내장 지원을 제공합니다.

- **Asset Loading**: 우리는 Suspense를 스타일시트, 폰트, 스크립트와 같은 리소스의 로딩 생명 주기와 통합하여 React가 [`<style>`](/reference/react-dom/components/style), [`<link>`](/reference/react-dom/components/link), 및 [`<script>`](/reference/react-dom/components/script)와 같은 요소의 콘텐츠가 표시될 준비가 되었는지 여부를 결정할 수 있도록 했습니다. 또한 `preload` 및 `preinit`과 같은 새로운 [Resource Loading APIs](/reference/react-dom#resource-preloading-apis)를 추가하여 리소스가 로드되고 초기화될 시점을 더 잘 제어할 수 있습니다.

- **Actions**: 위에서 공유한 바와 같이, 우리는 클라이언트에서 서버로 데이터를 보내기 위해 Actions를 추가했습니다. [`<form/>`](/reference/react-dom/components/form)와 같은 요소에 `action`을 추가하고, [`useFormStatus`](/reference/react-dom/hooks/useFormStatus)로 상태에 접근하고, [`useActionState`](/reference/react/useActionState)로 결과를 처리하며, [`useOptimistic`](/reference/react/useOptimistic)으로 UI를 낙관적으로 업데이트할 수 있습니다.

이 모든 기능이 함께 작동하기 때문에, 개별적으로 안정 채널에 릴리스하기는 어렵습니다. Actions를 보완하는 폼 상태에 접근하는 훅 없이 Actions를 릴리스하면 Actions의 실용성이 제한될 것입니다. React Server Components를 Server Actions와 통합하지 않고 도입하면 서버에서 데이터를 수정하는 것이 복잡해질 것입니다.

기능 세트를 안정 채널에 릴리스하기 전에, 이들이 일관되게 작동하고 개발자가 프로덕션에서 사용할 수 있는 모든 것을 갖추고 있는지 확인해야 합니다. React Canaries는 이러한 기능을 개별적으로 개발하고, 전체 기능 세트가 완성될 때까지 안정적인 API를 점진적으로 릴리스할 수 있게 합니다.

현재 React Canary의 기능 세트는 완성되었으며 릴리스 준비가 되었습니다.

## React의 다음 주요 버전 {/*the-next-major-version-of-react*/}

몇 년간의 반복 작업 끝에, `react@canary`는 이제 `react@latest`로 릴리스할 준비가 되었습니다. 위에서 언급한 새로운 기능은 앱이 실행되는 모든 환경과 호환되며, 프로덕션 사용에 필요한 모든 것을 제공합니다. Asset Loading 및 Document Metadata는 일부 앱에 대해 중단될 수 있으므로, React의 다음 버전은 주요 버전이 될 것입니다: **React 19**.

릴리스를 준비하기 위해 아직 할 일이 남아 있습니다. React 19에서는 Web Components 지원과 같은 중단이 필요한 오래 요청된 개선 사항도 추가하고 있습니다. 우리의 초점은 이제 이러한 변경 사항을 적용하고, 새로운 기능에 대한 문서를 최종화하고, 포함된 내용을 발표하는 것입니다.

React 19에 포함된 모든 것, 새로운 클라이언트 기능을 채택하는 방법, React Server Components 지원을 구축하는 방법에 대한 자세한 정보를 앞으로 몇 달 동안 공유할 예정입니다.

## Offscreen (이제 Activity로 이름 변경) {/*offscreen-renamed-to-activity*/}

지난 업데이트 이후, 우리는 연구 중인 기능의 이름을 "Offscreen"에서 "Activity"로 변경했습니다. "Offscreen"이라는 이름은 앱의 보이지 않는 부분에만 적용된다는 의미를 내포했지만, 기능을 연구하는 동안 모달 뒤의 콘텐츠와 같이 앱의 일부가 보이면서도 비활성화될 수 있다는 것을 깨달았습니다. 새로운 이름은 앱의 특정 부분을 "활성" 또는 "비활성"으로 표시하는 동작을 더 잘 반영합니다.

Activity는 여전히 연구 중이며, 라이브러리 개발자에게 노출되는 기본 요소를 최종화하는 작업이 남아 있습니다. 우리는 더 완성된 기능을 제공하는 데 집중하기 위해 이 영역의 우선순위를 낮췄습니다.

* * *

이 업데이트 외에도, 우리 팀은 컨퍼런스에서 발표하고 팟캐스트에 출연하여 우리의 작업에 대해 더 많이 이야기하고 질문에 답변했습니다.

- [Sathya Gunasekaran](/community/team#sathya-gunasekaran)은 [React India](https://www.youtube.com/watch?v=kjOacmVsLSE) 컨퍼런스에서 React Compiler에 대해 발표했습니다.

- [Dan Abramov](/community/team#dan-abramov)은 [RemixConf](https://www.youtube.com/watch?v=zMf_xeGPn6s)에서 "React from Another Dimension"이라는 제목의 발표를 통해 React Server Components와 Actions가 어떻게 만들어질 수 있었는지에 대한 대안을 탐구했습니다.

- [Dan Abramov](/community/team#dan-abramov)은 [the Changelog’s JS Party podcast](https://changelog.com/jsparty/311)에서 React Server Components에 대해 인터뷰를 했습니다.

- [Matt Carroll](/community/team#matt-carroll)은 [Front-End Fire podcast](https://www.buzzsprout.com/2226499/14462424-interview-the-two-reacts-with-rachel-nabors-evan-bacon-and-matt-carroll)에서 [The Two Reacts](https://overreacted.io/the-two-reacts/)에 대해 논의했습니다.

이 게시물을 검토해 주신 [Lauren Tan](https://twitter.com/potetotes), [Sophie Alpert](https://twitter.com/sophiebits), [Jason Bonta](https://threads.net/someextent), [Eli White](https://twitter.com/Eli_White), 그리고 [Sathya Gunasekaran](https://twitter.com/_gsathya)께 감사드립니다.

읽어주셔서 감사합니다, 그리고 [React Conf에서 뵙겠습니다](https://conf.react.dev/)!