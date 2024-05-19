---
title: React 랩스: 우리가 하고 있던 일 – 2022년 6월
author: Andrew Clark, Dan Abramov, Jan Kassens, Joseph Savona, Josh Story, Lauren Tan, Luna Ruan, Mengdi Chen, Rick Hanlon, Robert Zhang, Sathya Gunasekaran, Sebastian Markbage, and Xuan Huang
date: 2022/06/15
description: React 18은 여러 해에 걸쳐 만들어졌으며, 이를 통해 React 팀에게 귀중한 교훈을 안겨주었습니다. 이 릴리스는 수년간의 연구와 다양한 경로 탐색의 결과였습니다. 그 중 일부 경로는 성공적이었고, 더 많은 경로는 새로운 통찰력을 제공한 막다른 길이었습니다. 우리가 배운 교훈 중 하나는 커뮤니티가 우리가 탐색하고 있는 이러한 경로에 대한 통찰 없이 새로운 기능을 기다리는 것이 좌절감을 준다는 것입니다.
---

2022년 6월 15일 [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://twitter.com/dan_abramov), [Jan Kassens](https://twitter.com/kassens), [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Luna Ruan](https://twitter.com/lunaruan), [Mengdi Chen](https://twitter.com/mengdi_en), [Rick Hanlon](https://twitter.com/rickhanlonii), [Robert Zhang](https://twitter.com/jiaxuanzhang01), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage), 그리고 [Xuan Huang](https://twitter.com/Huxpro)

---

<Intro>

[React 18](/blog/2022/03/29/react-v18)은 수년간의 작업 끝에 완성되었으며, 이를 통해 React 팀에게 귀중한 교훈을 안겨주었습니다. 이 릴리스는 수년간의 연구와 다양한 경로를 탐색한 결과입니다. 그 중 일부 경로는 성공적이었고, 많은 경로는 새로운 통찰력을 제공한 막다른 길이었습니다. 우리가 배운 교훈 중 하나는 커뮤니티가 우리가 탐색하고 있는 경로에 대한 통찰 없이 새로운 기능을 기다리는 것이 좌절감을 준다는 것입니다.

</Intro>

---

우리는 일반적으로 실험적인 것부터 명확하게 정의된 것까지 다양한 프로젝트를 동시에 진행하고 있습니다. 앞으로는 이러한 프로젝트 전반에 걸쳐 우리가 작업하고 있는 내용을 커뮤니티와 정기적으로 공유하고자 합니다.

기대치를 설정하기 위해, 이것은 명확한 타임라인이 있는 로드맵이 아닙니다. 많은 프로젝트가 활발한 연구 중이며 구체적인 출시 날짜를 정하기 어렵습니다. 우리가 배운 것에 따라 현재의 형태로는 절대 출시되지 않을 수도 있습니다. 대신, 우리가 적극적으로 고민하고 있는 문제 영역과 지금까지 배운 내용을 공유하고자 합니다.

## Server Components {/*server-components*/}

우리는 2020년 12월에 [React Server Components](https://legacy.reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html) (RSC)의 실험적 데모를 발표했습니다. 그 이후로 우리는 React 18에서의 종속성을 마무리하고 실험적 피드백에 영감을 받은 변경 작업을 진행해왔습니다.

특히, 우리는 포크된 I/O 라이브러리(예: react-fetch)를 사용하는 아이디어를 포기하고, 더 나은 호환성을 위해 async/await 모델을 채택하고 있습니다. 이는 RSC의 출시를 기술적으로 막지는 않지만, 데이터 페칭을 위해 라우터를 사용할 수도 있습니다. 또 다른 변경 사항은 파일 확장자 접근 방식에서 [경계 주석](https://github.com/reactjs/rfcs/pull/189#issuecomment-1116482278)으로 이동하고 있다는 것입니다.

우리는 Vercel 및 Shopify와 협력하여 Webpack과 Vite 모두에서 공유 의미론에 대한 번들러 지원을 통합하고 있습니다. 출시 전에 RSC의 의미론이 전체 React 생태계에서 동일한지 확인하고자 합니다. 이것이 안정적인 상태에 도달하기 위한 주요 장애물입니다.

## Asset Loading {/*asset-loading*/}

현재 스크립트, 외부 스타일, 폰트 및 이미지와 같은 자산은 일반적으로 외부 시스템을 사용하여 사전 로드 및 로드됩니다. 이는 스트리밍, Server Components 등 새로운 환경에서 조정하기 어렵게 만들 수 있습니다.
우리는 모든 React 환경에서 작동하는 React API를 통해 중복되지 않은 외부 자산을 사전 로드하고 로드하는 API를 추가하는 것을 검토하고 있습니다.

또한, Suspense를 지원하여 이미지, CSS 및 폰트가 로드될 때까지 표시를 차단하지만 스트리밍 및 동시 렌더링을 차단하지 않도록 하는 것을 검토하고 있습니다. 이는 시각적 요소가 팝업되고 레이아웃이 이동하는 [“팝코닝“](https://twitter.com/sebmarkbage/status/1516852731251724293)을 방지하는 데 도움이 될 수 있습니다.

## Static Server Rendering Optimizations {/*static-server-rendering-optimizations*/}

Static Site Generation (SSG) 및 Incremental Static Regeneration (ISR)은 캐시 가능한 페이지의 성능을 얻는 훌륭한 방법이지만, 우리는 동적 Server Side Rendering (SSR)의 성능을 향상시키기 위해 기능을 추가할 수 있다고 생각합니다. 특히 대부분의 콘텐츠는 캐시 가능하지만 일부는 그렇지 않은 경우에 말입니다. 우리는 컴파일 및 정적 패스를 활용하여 서버 렌더링을 최적화하는 방법을 탐구하고 있습니다.

## React Optimizing Compiler {/*react-compiler*/}

우리는 React Conf 2021에서 React Forget의 [초기 미리보기](https://www.youtube.com/watch?v=lGEMwh32soc)를 제공했습니다. 이는 `useMemo` 및 `useCallback` 호출의 비용을 최소화하면서 React의 프로그래밍 모델을 유지하기 위해 자동으로 생성하는 컴파일러입니다.

최근 우리는 컴파일러를 더 신뢰할 수 있고 유능하게 만들기 위해 재작성 작업을 완료했습니다. 이 새로운 아키텍처는 [로컬 변이](/learn/keeping-components-pure#local-mutation-your-components-little-secret)와 같은 더 복잡한 패턴을 분석하고 메모이제이션할 수 있게 해주며, 메모이제이션 Hooks와 동등한 수준을 넘어서는 많은 새로운 컴파일 타임 최적화 기회를 열어줍니다.

우리는 또한 컴파일러의 여러 측면을 탐구하기 위한 플레이그라운드를 작업하고 있습니다. 플레이그라운드의 목표는 컴파일러 개발을 더 쉽게 만드는 것이지만, 컴파일러가 하는 일을 시도하고 직관을 쌓는 데도 도움이 될 것이라고 생각합니다. 이는 컴파일러가 내부적으로 어떻게 작동하는지에 대한 다양한 통찰력을 제공하며, 입력할 때 컴파일러의 출력을 실시간으로 렌더링합니다. 이는 컴파일러가 출시될 때 함께 제공될 것입니다.

## Offscreen {/*offscreen*/}

오늘날, 컴포넌트를 숨기고 표시하려면 두 가지 옵션이 있습니다. 하나는 트리에서 완전히 추가하거나 제거하는 것입니다. 이 접근 방식의 문제는 DOM에 저장된 스크롤 위치와 같은 UI 상태가 매번 언마운트될 때마다 손실된다는 것입니다.

다른 옵션은 컴포넌트를 마운트 상태로 유지하고 CSS를 사용하여 시각적으로 표시를 전환하는 것입니다. 이는 UI 상태를 유지하지만, React가 숨겨진 컴포넌트와 모든 자식을 새로운 업데이트를 받을 때마다 계속 렌더링해야 하기 때문에 성능 비용이 발생합니다.

Offscreen은 세 번째 옵션을 도입합니다: UI를 시각적으로 숨기지만 콘텐츠의 우선순위를 낮춥니다. 이 아이디어는 `content-visibility` CSS 속성과 유사합니다: 콘텐츠가 숨겨져 있을 때, 나머지 UI와 동기화될 필요가 없습니다. React는 앱이 유휴 상태일 때까지 또는 콘텐츠가 다시 표시될 때까지 렌더링 작업을 연기할 수 있습니다.

Offscreen은 고급 기능을 잠금 해제하는 저수준 기능입니다. `startTransition`과 같은 React의 다른 동시 기능과 유사하게, 대부분의 경우 Offscreen API와 직접 상호작용하지 않고, 다음과 같은 패턴을 구현하기 위한 의견이 반영된 프레임워크를 통해 상호작용하게 됩니다:

* **즉시 전환.** 일부 라우팅 프레임워크는 링크 위에 마우스를 올릴 때와 같이 후속 탐색을 가속화하기 위해 데이터를 미리 가져옵니다. Offscreen을 사용하면 다음 화면을 백그라운드에서 미리 렌더링할 수도 있습니다.
* **재사용 가능한 상태.** 마찬가지로, 라우트 또는 탭 간 탐색 시 Offscreen을 사용하여 이전 화면의 상태를 유지하고 다시 전환할 때 이전 상태를 그대로 유지할 수 있습니다.
* **가상화된 목록 렌더링.** 많은 항목이 있는 목록을 표시할 때, 가상화된 목록 프레임워크는 현재 보이는 항목보다 더 많은 행을 미리 렌더링합니다. Offscreen을 사용하여 목록의 보이는 항목보다 낮은 우선순위로 숨겨진 행을 미리 렌더링할 수 있습니다.
* **백그라운드 콘텐츠.** 모달 오버레이를 표시할 때와 같이 콘텐츠를 숨기지 않고 백그라운드에서 우선순위를 낮추는 관련 기능도 탐구하고 있습니다.

## Transition Tracing {/*transition-tracing*/}

현재 React에는 두 가지 프로파일링 도구가 있습니다. [원래의 Profiler](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)는 프로파일링 세션의 모든 커밋에 대한 개요를 보여줍니다. 각 커밋에 대해 렌더링된 모든 컴포넌트와 렌더링에 걸린 시간을 보여줍니다. 또한 React 18에서 도입된 [타임라인 프로파일러](https://github.com/reactwg/react-18/discussions/76)의 베타 버전도 있습니다. 이 프로파일러는 컴포넌트가 업데이트를 예약하는 시점과 React가 이러한 업데이트를 작업하는 시점을 보여줍니다. 이 두 프로파일러는 개발자가 코드의 성능 문제를 식별하는 데 도움을 줍니다.

우리는 개발자들이 개별적인 느린 커밋이나 컴포넌트를 맥락 없이 아는 것이 유용하지 않다는 것을 깨달았습니다. 느린 커밋의 실제 원인을 아는 것이 더 유용합니다. 또한 개발자들은 특정 상호작용(예: 버튼 클릭, 초기 로드 또는 페이지 탐색)을 추적하여 성능 저하를 감시하고 상호작용이 느린 이유와 이를 해결하는 방법을 이해하고자 합니다.

우리는 이전에 [Interaction Tracing API](https://gist.github.com/bvaughn/8de925562903afd2e7a12554adcdda16)를 만들어 이 문제를 해결하려고 했지만, 상호작용이 느린 이유를 추적하는 정확성을 떨어뜨리고 때로는 상호작용이 끝나지 않는 근본적인 설계 결함이 있었습니다. 이러한 문제로 인해 [이 API를 제거](https://github.com/facebook/react/pull/20037)했습니다.

우리는 이러한 문제를 해결하는 Interaction Tracing API의 새로운 버전(임시로 `startTransition`을 통해 시작되기 때문에 Transition Tracing이라고 함)을 작업하고 있습니다.

## New React Docs {/*new-react-docs*/}

작년에 우리는 새로운 React 문서 웹사이트의 베타 버전을 발표했습니다([나중에 react.dev로 출시됨](/blog/2023/03/16/introducing-react-dev)). 새로운 학습 자료는 Hooks를 먼저 가르치며, 새로운 다이어그램, 일러스트레이션, 많은 인터랙티브 예제 및 도전 과제를 포함하고 있습니다. 우리는 React 18 릴리스에 집중하기 위해 그 작업을 잠시 중단했지만, 이제 React 18이 출시되었으므로 새로운 문서를 완성하고 출시하기 위해 적극적으로 작업하고 있습니다.

우리는 현재 새로운 React 사용자와 경험이 있는 사용자 모두에게 도전적인 주제 중 하나인 효과에 대한 자세한 섹션을 작성하고 있습니다. [효과와 동기화하기](/learn/synchronizing-with-effects)는 시리즈의 첫 번째 게시된 페이지이며, 앞으로 몇 주 동안 더 많은 내용이 추가될 예정입니다. 효과에 대한 자세한 섹션을 작성하기 시작했을 때, 많은 일반적인 효과 패턴이 React에 새로운 원시 기능을 추가하여 단순화될 수 있다는 것을 깨달았습니다. 우리는 [useEvent RFC](https://github.com/reactjs/rfcs/pull/220)에서 이에 대한 초기 생각을 공유했습니다. 이는 현재 초기 연구 단계에 있으며, 아이디어를 계속 수정하고 있습니다. 우리는 RFC에 대한 커뮤니티의 의견과 [피드백](https://github.com/reactjs/react.dev/issues/3308) 및 진행 중인 문서 재작성에 대한 기여를 감사히 여기고 있습니다. 특히 [Harish Kumar](https://github.com/harish-sethuraman)에게 새로운 웹사이트 구현에 대한 많은 개선 사항을 제출하고 검토해 주신 것에 대해 감사드립니다.

*이 블로그 게시물을 검토해 주신 [Sophie Alpert](https://twitter.com/sophiebits)에게 감사드립니다!*