---
title: React 랩스: 우리가 하고 있던 일 – 2023년 3월
author: Joseph Savona, Josh Story, Lauren Tan, Mengdi Chen, Samuel Susla, Sathya Gunasekaran, Sebastian Markbage, and Andrew Clark
date: 2023/03/22
description: React 랩스 게시물에서는 현재 연구 및 개발 중인 프로젝트에 대해 작성합니다. 지난 업데이트 이후로 상당한 진전을 이루었으며, 우리가 배운 것을 공유하고자 합니다.
---

2023년 3월 22일 [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Mengdi Chen](https://twitter.com/mengdi_en), [Samuel Susla](https://twitter.com/SamuelSusla), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage), 그리고 [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

React Labs 게시물에서는 현재 연구 및 개발 중인 프로젝트에 대해 작성합니다. [지난 업데이트](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022) 이후로 상당한 진전을 이루었으며, 배운 내용을 공유하고자 합니다.

</Intro>

---

## React Server Components {/*react-server-components*/}

React Server Components (또는 RSC)은 React 팀이 설계한 새로운 애플리케이션 아키텍처입니다.

우리는 [소개 강연](/blog/2020/12/21/data-fetching-with-react-server-components)과 [RFC](https://github.com/reactjs/rfcs/pull/188)에서 RSC에 대한 연구를 처음 공유했습니다. 이를 요약하자면, 우리는 JavaScript 번들에서 제외되고 사전에 실행되는 새로운 종류의 컴포넌트인 Server Components를 도입하고 있습니다. Server Components는 빌드 중에 실행되어 파일 시스템에서 읽거나 정적 콘텐츠를 가져올 수 있습니다. 또한 서버에서 실행되어 API를 구축하지 않고도 데이터 계층에 접근할 수 있습니다. Server Components에서 브라우저의 상호작용 클라이언트 컴포넌트로 props를 통해 데이터를 전달할 수 있습니다.

RSC는 서버 중심의 Multi-Page Apps의 간단한 "요청/응답" 정신 모델과 클라이언트 중심의 Single-Page Apps의 원활한 상호작용을 결합하여 두 세계의 장점을 제공합니다.

지난 업데이트 이후, 우리는 제안을 확정하기 위해 [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)를 병합했습니다. [React Server Module Conventions](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md) 제안과 관련된 문제를 해결하고, 파트너들과 함께 "use client" 규칙을 따르기로 합의했습니다. 이 문서들은 또한 RSC 호환 구현이 지원해야 하는 사양으로 작용합니다.

가장 큰 변화는 [`async` / `await`](https://github.com/reactjs/rfcs/pull/229)를 Server Components에서 데이터 가져오기를 수행하는 주요 방법으로 도입한 것입니다. 또한 Promises를 풀어주는 새로운 Hook인 `use`를 도입하여 클라이언트에서 데이터 로딩을 지원할 계획입니다. 클라이언트 전용 앱에서 임의의 컴포넌트에서 `async / await`를 지원할 수는 없지만, RSC 앱과 유사한 구조로 클라이언트 전용 앱을 구성할 때 이를 지원할 계획입니다.

이제 데이터 가져오기가 잘 정리되었으므로, 다른 방향으로 탐구하고 있습니다: 클라이언트에서 서버로 데이터를 보내어 데이터베이스 변형을 실행하고 폼을 구현할 수 있도록 하는 것입니다. 이를 위해 서버/클라이언트 경계를 넘어 Server Action 함수를 전달하여 클라이언트가 이를 호출할 수 있도록 하고, 원활한 RPC를 제공합니다. Server Actions는 JavaScript가 로드되기 전에 점진적으로 향상된 폼을 제공합니다.

React Server Components는 [Next.js App Router](/learn/start-a-new-react-project#nextjs-app-router)에 출시되었습니다. 이는 RSC를 원시적으로 통합한 라우터의 깊은 통합을 보여주지만, RSC 호환 라우터와 프레임워크를 구축하는 유일한 방법은 아닙니다. RSC 사양과 구현이 제공하는 기능에는 명확한 구분이 있습니다. React Server Components는 호환 가능한 React 프레임워크에서 작동하는 컴포넌트에 대한 사양으로 의도되었습니다.

일반적으로 기존 프레임워크를 사용하는 것을 권장하지만, 자체 맞춤형 프레임워크를 구축해야 하는 경우도 가능합니다. 자체 RSC 호환 프레임워크를 구축하는 것은 우리가 원하는 만큼 쉽지는 않습니다. 주로 필요한 깊은 번들러 통합 때문입니다. 현재 세대의 번들러는 클라이언트에서 사용하기에 훌륭하지만, 서버와 클라이언트 간에 단일 모듈 그래프를 분할하는 것을 1급 지원으로 설계하지 않았습니다. 이 때문에 우리는 이제 번들러 개발자와 직접 협력하여 RSC를 위한 원시 기능을 내장하고 있습니다.

## Asset Loading {/*asset-loading*/}

[Suspense](/reference/react/Suspense)는 컴포넌트의 데이터나 코드가 아직 로드 중일 때 화면에 무엇을 표시할지 지정할 수 있게 합니다. 이를 통해 사용자는 페이지가 로드되는 동안과 라우터 탐색 중에 점진적으로 더 많은 콘텐츠를 볼 수 있습니다. 그러나 사용자의 관점에서 데이터 로딩과 렌더링은 새로운 콘텐츠가 준비되었는지 여부를 판단하는 데 충분하지 않습니다. 기본적으로 브라우저는 스타일시트, 폰트, 이미지를 독립적으로 로드하여 UI 점프와 연속적인 레이아웃 이동을 초래할 수 있습니다.

우리는 스타일시트, 폰트, 이미지의 로딩 라이프사이클과 완전히 통합된 Suspense를 작업 중입니다. 이를 통해 React는 콘텐츠가 표시될 준비가 되었는지 여부를 판단할 수 있습니다. React 컴포넌트를 작성하는 방식에 아무런 변경 없이 업데이트는 더 일관되고 만족스러운 방식으로 작동할 것입니다. 최적화로서, 우리는 컴포넌트에서 폰트와 같은 자산을 직접 미리 로드하는 수동 방법도 제공할 것입니다.

현재 이러한 기능을 구현 중이며 곧 더 많은 내용을 공유할 예정입니다.

## Document Metadata {/*document-metadata*/}

앱의 다른 페이지와 화면에는 해당 화면에 특정한 `<title>` 태그, 설명, 기타 `<meta>` 태그와 같은 메타데이터가 있을 수 있습니다. 유지 관리 관점에서 이 정보를 해당 페이지나 화면의 React 컴포넌트 가까이에 두는 것이 더 확장 가능합니다. 그러나 이 메타데이터의 HTML 태그는 일반적으로 앱의 최상위 컴포넌트에 렌더링되는 문서 `<head>`에 있어야 합니다.

오늘날 사람들은 이 문제를 두 가지 기술 중 하나로 해결합니다.

한 가지 기술은 `<title>`, `<meta>`, 기타 태그를 문서 `<head>`로 이동시키는 특수한 서드파티 컴포넌트를 렌더링하는 것입니다. 이는 주요 브라우저에서 작동하지만, Open Graph 파서와 같은 클라이언트 측 JavaScript를 실행하지 않는 많은 클라이언트에서는 이 기술이 보편적으로 적합하지 않습니다.

다른 기술은 페이지를 두 부분으로 서버 렌더링하는 것입니다. 먼저 주요 콘텐츠를 렌더링하고 모든 태그를 수집합니다. 그런 다음 이러한 태그로 `<head>`를 렌더링합니다. 마지막으로 `<head>`와 주요 콘텐츠를 브라우저로 보냅니다. 이 접근 방식은 작동하지만, 모든 콘텐츠가 렌더링될 때까지 기다려야 하므로 [React 18의 스트리밍 서버 렌더러](/reference/react-dom/server/renderToReadableStream)를 활용할 수 없습니다.

이 때문에 우리는 `<title>`, `<meta>`, 메타데이터 `<link>` 태그를 컴포넌트 트리 어디에서나 기본적으로 렌더링할 수 있는 내장 지원을 추가하고 있습니다. 이는 완전히 클라이언트 측 코드, SSR, 그리고 미래의 RSC를 포함한 모든 환경에서 동일한 방식으로 작동할 것입니다. 곧 이에 대한 자세한 내용을 공유할 예정입니다.

## React Optimizing Compiler {/*react-optimizing-compiler*/}

이전 업데이트 이후 우리는 [React Forget](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022#react-compiler), React를 위한 최적화 컴파일러의 설계를 적극적으로 반복해왔습니다. 이전에는 이를 "자동 메모이제이션 컴파일러"라고 불렀으며, 어느 정도는 사실입니다. 그러나 컴파일러를 구축하면서 React의 프로그래밍 모델을 더 깊이 이해하게 되었습니다. React Forget을 이해하는 더 나은 방법은 자동 *반응성* 컴파일러로 보는 것입니다.

React의 핵심 아이디어는 개발자가 현재 상태의 함수로 UI를 정의한다는 것입니다. 숫자, 문자열, 배열, 객체와 같은 일반 JavaScript 값을 사용하고, if/else, for 등 표준 JavaScript 관용구를 사용하여 컴포넌트 로직을 설명합니다. 정신 모델은 애플리케이션 상태가 변경될 때마다 React가 다시 렌더링된다는 것입니다. 우리는 이 간단한 정신 모델과 JavaScript 의미론에 가까운 상태를 유지하는 것이 React의 프로그래밍 모델에서 중요한 원칙이라고 믿습니다.

문제는 React가 때때로 *너무* 반응적일 수 있다는 것입니다: 너무 많이 다시 렌더링할 수 있습니다. 예를 들어, JavaScript에서는 두 객체나 배열이 동일한 키와 값을 가지고 있는지 비교하는 저렴한 방법이 없기 때문에, 각 렌더링에서 새로운 객체나 배열을 생성하면 React가 필요 이상으로 많은 작업을 수행할 수 있습니다. 이는 개발자가 변경에 과도하게 반응하지 않도록 명시적으로 컴포넌트를 메모이제이션해야 함을 의미합니다.

React Forget의 목표는 기본적으로 React 앱이 적절한 양의 반응성을 가지도록 하는 것입니다: 상태 값이 *의미 있게* 변경될 때만 앱이 다시 렌더링되도록 하는 것입니다. 구현 관점에서 이는 자동 메모이제이션을 의미하지만, 우리는 반응성 프레임이 React와 Forget을 이해하는 더 나은 방법이라고 믿습니다. React는 현재 객체 정체성이 변경될 때 다시 렌더링됩니다. Forget을 사용하면 React는 의미적 값이 변경될 때 다시 렌더링되지만, 깊은 비교의 런타임 비용을 발생시키지 않습니다.

구체적인 진전 측면에서, 지난 업데이트 이후 우리는 이 자동 반응성 접근 방식에 맞추어 컴파일러의 설계를 상당히 반복하고 내부적으로 컴파일러를 사용한 피드백을 통합했습니다. 작년 말부터 컴파일러에 대한 중요한 리팩터링을 거친 후, 이제 Meta의 제한된 영역에서 프로덕션에서 컴파일러를 사용하기 시작했습니다. 프로덕션에서 입증되면 오픈 소스화할 계획입니다.

마지막으로, 많은 사람들이 컴파일러가 어떻게 작동하는지에 대해 관심을 표명했습니다. 우리는 컴파일러를 입증하고 오픈 소스화할 때 더 많은 세부 사항을 공유할 것을 기대하고 있습니다. 그러나 지금 공유할 수 있는 몇 가지 사항이 있습니다:

컴파일러의 핵심은 Babel과 거의 완전히 분리되어 있으며, 핵심 컴파일러 API는 (대략적으로) 오래된 AST 입력, 새로운 AST 출력 (소스 위치 데이터를 유지하면서)입니다. 내부적으로 우리는 저수준 의미 분석을 수행하기 위해 사용자 정의 코드 표현 및 변환 파이프라인을 사용합니다. 그러나 컴파일러의 주요 공개 인터페이스는 Babel 및 기타 빌드 시스템 플러그인을 통해 제공될 것입니다. 테스트의 용이성을 위해 현재 매우 얇은 래퍼인 Babel 플러그인을 보유하고 있으며, 이는 컴파일러를 호출하여 각 함수의 새 버전을 생성하고 이를 교체합니다.

지난 몇 달 동안 컴파일러를 리팩터링하면서, 조건문, 루프, 재할당 및 변형과 같은 복잡성을 처리할 수 있도록 핵심 컴파일 모델을 정제하는 데 중점을 두었습니다. 그러나 JavaScript에는 이러한 기능을 표현하는 많은 방법이 있습니다: if/else, 삼항 연산자, for, for-in, for-of 등. 전체 언어를 처음부터 지원하려고 하면 핵심 모델을 검증할 시점이 지연될 것입니다. 대신, 우리는 언어의 작지만 대표적인 하위 집합으로 시작했습니다: let/const, if/else, for 루프, 객체, 배열, 원시값, 함수 호출 및 몇 가지 다른 기능. 핵심 모델에 대한 자신감을 얻고 내부 추상화를 정제하면서 지원되는 언어 하위 집합을 확장했습니다. 아직 지원하지 않는 구문에 대해 명시적으로 진단을 기록하고 지원되지 않는 입력에 대해 컴파일을 건너뜁니다. Meta의 코드베이스에서 컴파일러를 시도하고 가장 일반적인 지원되지 않는 기능을 확인하여 다음 우선 순위를 정할 수 있는 유틸리티를 보유하고 있습니다. 전체 언어를 지원하는 방향으로 점진적으로 확장할 것입니다.

React 컴포넌트에서 평범한 JavaScript를 반응적으로 만드는 것은 코드가 정확히 무엇을 하는지 이해할 수 있는 깊은 의미론적 이해를 가진 컴파일러가 필요합니다. 이러한 접근 방식을 통해 도메인 특화 언어에 제한되지 않고 언어의 완전한 표현력을 사용하여 모든 복잡성의 제품 코드를 작성할 수 있는 JavaScript 내 반응성 시스템을 만들고 있습니다.

## Offscreen Rendering {/*offscreen-rendering*/}

Offscreen 렌더링은 추가 성능 오버헤드 없이 백그라운드에서 화면을 렌더링하는 React의 다가오는 기능입니다. 이는 DOM 요소뿐만 아니라 React 컴포넌트에도 작동하는 [`content-visibility` CSS 속성](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility)의 버전으로 생각할 수 있습니다. 연구 중에 다양한 사용 사례를 발견했습니다:

- 라우터는 백그라운드에서 화면을 미리 렌더링하여 사용자가 화면으로 이동할 때 즉시 사용할 수 있습니다.
- 탭 전환 컴포넌트는 숨겨진 탭의 상태를 유지하여 사용자가 진행 상황을 잃지 않고 탭 간에 전환할 수 있습니다.
- 가상화된 목록 컴포넌트는 보이는 창 위아래에 추가 행을 미리 렌더링할 수 있습니다.
- 모달이나 팝업을 열 때, 나머지 앱을 "백그라운드" 모드로 전환하여 모달을 제외한 모든 이벤트와 업데이트를 비활성화할 수 있습니다.

대부분의 React 개발자는 React의 오프스크린 API와 직접 상호작용하지 않을 것입니다. 대신, 오프스크린 렌더링은 라우터 및 UI 라이브러리에 통합될 것이며, 이러한 라이브러리를 사용하는 개발자는 추가 작업 없이 자동으로 혜택을 받을 것입니다.

아이디어는 컴포넌트를 작성하는 방식을 변경하지 않고도 모든 React 트리를 오프스크린으로 렌더링할 수 있어야 한다는 것입니다. 컴포넌트가 오프스크린으로 렌더링되면, 컴포넌트가 보이게 될 때까지 실제로 *마운트*되지 않습니다 — 그 효과는 실행되지 않습니다. 예를 들어, 컴포넌트가 처음 나타날 때 분석을 기록하기 위해 `useEffect`를 사용하는 경우, 미리 렌더링은 분석의 정확성을 망치지 않습니다. 마찬가지로, 컴포넌트가 오프스크린으로 전환되면 그 효과도 언마운트됩니다. 오프스크린 렌더링의 주요 기능은 컴포넌트의 상태를 잃지 않고 가시성을 전환할 수 있다는 것입니다.

지난 업데이트 이후, 우리는 Android 및 iOS의 React Native 앱에서 내부적으로 미리 렌더링의 실험적 버전을 테스트했으며 긍정적인 성능 결과를 얻었습니다. 또한 오프스크린 렌더링이 Suspense와 함께 작동하는 방식을 개선했습니다 — 오프스크린 트리 내부에서 중단되면 Suspense 대체가 트리거되지 않습니다. 남은 작업은 라이브러리 개발자에게 노출되는 원시 기능을 최종화하는 것입니다. 올해 말에 RFC를 발표하고 실험적 API를 테스트 및 피드백을 위해 제공할 예정입니다.

## Transition Tracing {/*transition-tracing*/}

Transition Tracing API는 [React Transitions](/reference/react/useTransition)이 느려지는 시점을 감지하고 왜 느려질 수 있는지 조사할 수 있게 합니다. 지난 업데이트 이후, 우리는 API의 초기 설계를 완료하고 [RFC](https://github.com/reactjs/rfcs/pull/238)를 발표했습니다. 기본 기능도 구현되었습니다. 현재 프로젝트는 보류 중입니다. RFC에 대한 피드백을 환영하며, React를 위한 더 나은 성능 측정 도구를 제공하기 위해 개발을 재개할 것을 기대하고 있습니다. 이는 [Next.js App Router](/learn/start-a-new-react-project#nextjs-app-router)와 같은 React Transitions을 기반으로 구축된 라우터에 특히 유용할 것입니다.

* * *
이 업데이트 외에도, 우리 팀은 커뮤니티 팟캐스트와 라이브 스트림에 최근 게스트로 출연하여 우리의 작업에 대해 더 많이 이야기하고 질문에 답변했습니다.

* [Dan Abramov](https://twitter.com/dan_abramov)와 [Joe Savona](https://twitter.com/en_JS)는 [Kent C. Dodds의 YouTube 채널](https://www.youtube.com/watch?v=h7tur48JSaw)에서 인터뷰를 받아 React Server Components에 대한 우려를 논의했습니다.
* [Dan Abramov](https://twitter.com/dan_abramov)와 [Joe Savona](https://twitter.com/en_JS)는 [JSParty 팟캐스트](https://jsparty.fm/267)에 게스트로 출연하여 React의 미래에 대한 생각을 공유했습니다.

이 게시물을 검토해 주신 [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://twitter.com/dan_abramov), [Dave McCabe](https://twitter.com/mcc_abe), [Luna Wei](https://twitter.com/lunaleaps), [Matt Carroll](https://twitter.com/mattcarrollcode), [Sean Keegan](https://twitter.com/DevRelSean), [Sebastian Silbermann](https://twitter.com/sebsilbermann), [Seth Webster](https://twitter.com/sethwebster), 그리고 [Sophie Alpert](https://twitter.com/sophiebits)에게 감사드립니다.

읽어주셔서 감사합니다. 다음 업데이트에서 뵙겠습니다!