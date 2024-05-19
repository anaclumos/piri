---
title: React v18.0
author: The React Team
date: 2022/03/08
description: React 18이 이제 npm에서 사용할 수 있습니다! 지난 게시물에서는 앱을 React 18로 업그레이드하는 단계별 지침을 공유했습니다. 이번 게시물에서는 React 18의 새로운 기능과 그것이 미래에 어떤 의미를 가지는지에 대해 개요를 제공하겠습니다.
---

2022년 3월 29일 [React 팀](/community/team)

---

<Intro>

React 18이 이제 npm에서 사용할 수 있습니다! 지난 게시물에서 [앱을 React 18로 업그레이드하는 단계별 지침](/blog/2022/03/08/react-18-upgrade-guide)을 공유했습니다. 이번 게시물에서는 React 18의 새로운 기능과 앞으로의 의미에 대해 개요를 제공하겠습니다.

</Intro>

---

최신 주요 버전에는 자동 배칭, startTransition과 같은 새로운 API, 그리고 Suspense를 지원하는 스트리밍 서버 사이드 렌더링과 같은 기본 제공 개선 사항이 포함되어 있습니다.

React 18의 많은 기능은 새로운 동시성 렌더러를 기반으로 구축되었습니다. 이는 강력한 새로운 기능을 잠금 해제하는 백그라운드 변경 사항입니다. Concurrent React는 선택 사항으로, 동시성 기능을 사용할 때만 활성화됩니다. 그러나 이는 사람들이 애플리케이션을 구축하는 방식에 큰 영향을 미칠 것이라고 생각합니다.

우리는 수년간 React에서 동시성 지원을 연구하고 개발해 왔으며, 기존 사용자에게 점진적인 채택 경로를 제공하기 위해 특별히 신경을 썼습니다. 작년 여름, [React 18 작업 그룹을 구성하여](/blog/2021/06/08/the-plan-for-react-18) 커뮤니티 전문가들의 피드백을 수집하고 전체 React 생태계에 원활한 업그레이드 경험을 보장했습니다.

놓쳤다면, React Conf 2021에서 이 비전을 많이 공유했습니다:

* [기조 연설](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa)에서 React 18이 개발자가 훌륭한 사용자 경험을 쉽게 구축할 수 있도록 하는 우리의 사명에 어떻게 맞는지 설명합니다.
* [Shruti Kapoor](https://twitter.com/shrutikapoor08)는 [React 18의 새로운 기능을 사용하는 방법을 시연했습니다](https://www.youtube.com/watch?v=ytudH8je5ko&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=2).
* [Shaundai Person](https://twitter.com/shaundai)은 [Suspense를 사용한 스트리밍 서버 렌더링](https://www.youtube.com/watch?v=pj5N-Khihgc&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=3)에 대한 개요를 제공했습니다.

아래는 Concurrent Rendering부터 시작하여 이번 릴리스에서 기대할 수 있는 전체 개요입니다.

<Note>

React Native 사용자의 경우, React 18은 새로운 React Native 아키텍처와 함께 React Native에 포함될 것입니다. 자세한 내용은 [React Conf 기조 연설을 참조하세요](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s).

</Note>

## Concurrent React란 무엇인가요? {/*what-is-concurrent-react*/}

React 18에서 가장 중요한 추가 사항은 여러분이 생각할 필요가 없기를 바라는 동시성입니다. 이는 애플리케이션 개발자에게는 대체로 사실이지만, 라이브러리 유지 관리자에게는 이야기가 조금 더 복잡할 수 있습니다.

동시성은 기능 자체가 아닙니다. 이는 React가 동시에 UI의 여러 버전을 준비할 수 있게 하는 새로운 백그라운드 메커니즘입니다. 동시성을 구현 세부 사항으로 생각할 수 있습니다. 이는 잠금 해제하는 기능들 때문에 가치가 있습니다. React는 우선순위 큐와 다중 버퍼링과 같은 정교한 기술을 내부 구현에 사용합니다. 그러나 이러한 개념은 공개 API 어디에서도 볼 수 없습니다.

우리가 API를 설계할 때, 우리는 구현 세부 사항을 개발자로부터 숨기려고 합니다. React 개발자로서 여러분은 사용자 경험이 어떻게 보이기를 원하는지에 집중하고, React는 그 경험을 제공하는 방법을 처리합니다. 따라서 우리는 React 개발자가 동시성이 내부적으로 어떻게 작동하는지 알 필요가 없다고 생각합니다.

그러나 Concurrent React는 일반적인 구현 세부 사항보다 더 중요합니다. 이는 React의 핵심 렌더링 모델에 대한 기본적인 업데이트입니다. 따라서 동시성이 어떻게 작동하는지 아는 것이 매우 중요하지는 않지만, 높은 수준에서 그것이 무엇인지 아는 것이 가치가 있을 수 있습니다.

Concurrent React의 주요 속성 중 하나는 렌더링이 중단 가능하다는 것입니다. React 18로 처음 업그레이드할 때, 동시성 기능을 추가하기 전에는 업데이트가 이전 버전의 React와 동일한 방식으로 단일, 중단되지 않은 동기 트랜잭션으로 렌더링됩니다. 동기 렌더링에서는 업데이트가 렌더링을 시작하면 사용자가 화면에서 결과를 볼 수 있을 때까지 아무것도 중단할 수 없습니다.

동시성 렌더링에서는 항상 그렇지 않습니다. React는 업데이트를 렌더링하기 시작하고 중간에 일시 중지한 다음 나중에 계속할 수 있습니다. 진행 중인 렌더링을 완전히 포기할 수도 있습니다. React는 렌더링이 중단되더라도 UI가 일관되게 보일 것을 보장합니다. 이를 위해 전체 트리가 평가된 후에 DOM 변형을 수행합니다. 이 기능을 통해 React는 메인 스레드를 차단하지 않고 백그라운드에서 새로운 화면을 준비할 수 있습니다. 이는 UI가 큰 렌더링 작업 중에도 사용자 입력에 즉시 응답할 수 있음을 의미하며, 유연한 사용자 경험을 만듭니다.

또 다른 예는 재사용 가능한 상태입니다. Concurrent React는 UI의 섹션을 화면에서 제거한 다음 이전 상태를 재사용하면서 나중에 다시 추가할 수 있습니다. 예를 들어, 사용자가 화면을 탭하고 다시 돌아올 때, React는 이전 화면을 이전 상태로 복원할 수 있어야 합니다. 다가오는 마이너 버전에서는 이 패턴을 구현하는 새로운 컴포넌트인 `<Offscreen>`을 추가할 계획입니다. 마찬가지로, Offscreen을 사용하여 사용자가 UI를 표시하기 전에 백그라운드에서 새로운 UI를 준비할 수 있습니다.

Concurrent 렌더링은 React의 강력한 새로운 도구이며, 대부분의 새로운 기능은 이를 활용하도록 설계되었습니다. 여기에는 Suspense, 전환, 스트리밍 서버 렌더링이 포함됩니다. 그러나 React 18은 우리가 이 새로운 기반 위에 구축하려는 것의 시작에 불과합니다.

## 동시성 기능 점진적 채택 {/*gradually-adopting-concurrent-features*/}

기술적으로 동시성 렌더링은 중단을 초래하는 변경 사항입니다. 동시성 렌더링이 중단 가능하기 때문에, 활성화되면 컴포넌트가 약간 다르게 동작합니다.

테스트에서 우리는 수천 개의 컴포넌트를 React 18로 업그레이드했습니다. 우리가 발견한 것은 거의 모든 기존 컴포넌트가 동시성 렌더링과 함께 아무런 변경 없이 "그대로 작동"한다는 것입니다. 그러나 일부는 추가적인 마이그레이션 노력이 필요할 수 있습니다. 변경 사항은 일반적으로 작지만, 여전히 자신의 속도에 맞춰 변경할 수 있는 능력이 있습니다. React 18의 새로운 렌더링 동작은 **새로운 기능을 사용하는 앱의 일부에서만 활성화됩니다.**

전체 업그레이드 전략은 기존 코드를 깨뜨리지 않고 애플리케이션을 React 18로 실행하는 것입니다. 그런 다음 자신의 속도에 맞춰 동시성 기능을 점진적으로 추가할 수 있습니다. [`<StrictMode>`](/reference/react/StrictMode)를 사용하여 개발 중에 동시성 관련 버그를 발견할 수 있습니다. Strict Mode는 프로덕션 동작에 영향을 미치지 않지만, 개발 중에는 추가 경고를 기록하고 멱등성이 예상되는 함수를 두 번 호출합니다. 모든 것을 잡아내지는 않지만, 가장 일반적인 유형의 실수를 방지하는 데 효과적입니다.

React 18로 업그레이드한 후에는 즉시 동시성 기능을 사용할 수 있습니다. 예를 들어, startTransition을 사용하여 화면 간 탐색 시 사용자 입력을 차단하지 않을 수 있습니다. 또는 useDeferredValue를 사용하여 비용이 많이 드는 재렌더링을 조절할 수 있습니다.

그러나 장기적으로는 동시성 기능을 앱에 추가하는 주요 방법은 동시성 지원 라이브러리나 프레임워크를 사용하는 것입니다. 대부분의 경우, 동시성 API와 직접 상호작용하지 않을 것입니다. 예를 들어, 개발자가 새로운 화면으로 탐색할 때마다 startTransition을 호출하는 대신, 라우터 라이브러리가 자동으로 탐색을 startTransition으로 래핑할 것입니다.

라이브러리가 동시성 호환으로 업그레이드되는 데 시간이 걸릴 수 있습니다. 우리는 라이브러리가 동시성 기능을 활용하기 쉽게 하기 위해 새로운 API를 제공했습니다. 그동안 React 생태계를 점진적으로 마이그레이션하는 동안 유지 관리자에게 인내심을 가져주시기 바랍니다.

자세한 내용은 이전 게시물: [React 18로 업그레이드하는 방법](/blog/2022/03/08/react-18-upgrade-guide)을 참조하세요.

## 데이터 프레임워크에서의 Suspense {/*suspense-in-data-frameworks*/}

React 18에서는 Relay, Next.js, Hydrogen, Remix와 같은 의견이 있는 프레임워크에서 데이터 페칭을 위해 [Suspense](/reference/react/Suspense)를 사용할 수 있습니다. Suspense를 사용한 임시 데이터 페칭은 기술적으로 가능하지만, 일반적인 전략으로는 여전히 권장되지 않습니다.

미래에는 의견이 있는 프레임워크를 사용하지 않고도 Suspense로 데이터를 쉽게 액세스할 수 있는 추가 프리미티브를 노출할 수 있습니다. 그러나 Suspense는 애플리케이션의 아키텍처에 깊이 통합될 때 가장 잘 작동합니다: 라우터, 데이터 레이어, 서버 렌더링 환경. 따라서 장기적으로도 라이브러리와 프레임워크가 React 생태계에서 중요한 역할을 할 것이라고 예상합니다.

이전 버전의 React와 마찬가지로, React.lazy를 사용하여 클라이언트에서 코드 분할을 위해 Suspense를 사용할 수도 있습니다. 그러나 Suspense에 대한 우리의 비전은 코드 로딩 이상을 포함합니다. 목표는 Suspense 지원을 확장하여 궁극적으로 동일한 선언적 Suspense 폴백이 모든 비동기 작업(코드 로딩, 데이터, 이미지 등)을 처리할 수 있도록 하는 것입니다.

## Server Components는 여전히 개발 중입니다 {/*server-components-is-still-in-development*/}

[**Server Components**](/blog/2020/12/21/data-fetching-with-react-server-components)는 개발자가 서버와 클라이언트를 아우르는 앱을 구축할 수 있게 해주는 다가오는 기능으로, 클라이언트 측 앱의 풍부한 상호작용성과 전통적인 서버 렌더링의 향상된 성능을 결합합니다. Server Components는 Concurrent React와 본질적으로 결합되어 있지는 않지만, Suspense 및 스트리밍 서버 렌더링과 같은 동시성 기능과 함께 사용할 때 가장 잘 작동하도록 설계되었습니다.

Server Components는 여전히 실험적이지만, 18.x 마이너 릴리스에서 초기 버전을 출시할 것으로 예상합니다. 그동안 Next.js, Hydrogen, Remix와 같은 프레임워크와 협력하여 제안을 발전시키고 광범위한 채택을 준비하고 있습니다.

## React 18의 새로운 기능 {/*whats-new-in-react-18*/}

### 새로운 기능: 자동 배칭 {/*new-feature-automatic-batching*/}

배칭은 React가 여러 상태 업데이트를 단일 재렌더링으로 그룹화하여 성능을 향상시키는 것입니다. 자동 배칭이 없으면 React 이벤트 핸들러 내부에서만 업데이트를 배칭했습니다. 기본적으로 Promise, setTimeout, 네이티브 이벤트 핸들러 또는 기타 이벤트 내부의 업데이트는 React에서 배칭되지 않았습니다. 자동 배칭을 사용하면 이러한 업데이트가 자동으로 배칭됩니다:


```js
// 이전: React 이벤트만 배칭되었습니다.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React는 각 상태 업데이트에 대해 두 번 렌더링합니다 (배칭 없음)
}, 1000);

// 이후: 타임아웃, 프라미스, 네이티브 이벤트 핸들러 또는 기타 이벤트 내부의 업데이트가 배칭됩니다.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React는 끝에서 한 번만 다시 렌더링합니다 (이것이 배칭입니다!)
}, 1000);
```

자세한 내용은 [React 18에서 더 적은 렌더링을 위한 자동 배칭](https://github.com/reactwg/react-18/discussions/21) 게시물을 참조하세요.

### 새로운 기능: 전환 {/*new-feature-transitions*/}

전환은 긴급 업데이트와 비긴급 업데이트를 구별하기 위한 React의 새로운 개념입니다.

* **긴급 업데이트**는 타이핑, 클릭, 누르기 등과 같은 직접적인 상호작용을 반영합니다.
* **전환 업데이트**는 UI를 한 보기에서 다른 보기로 전환합니다.

타이핑, 클릭, 누르기와 같은 긴급 업데이트는 물리적 객체가 어떻게 동작하는지에 대한 우리의 직관과 일치하도록 즉각적인 응답이 필요합니다. 그렇지 않으면 "잘못된" 느낌이 듭니다. 그러나 전환은 다릅니다. 사용자는 화면에서 모든 중간 값을 볼 것으로 기대하지 않습니다.

예를 들어, 드롭다운에서 필터를 선택할 때, 필터 버튼 자체는 클릭할 때 즉시 응답하기를 기대합니다. 그러나 실제 결과는 별도로 전환될 수 있습니다. 작은 지연은 눈에 띄지 않으며 종종 예상됩니다. 그리고 결과가 렌더링되기 전에 필터를 다시 변경하면 최신 결과만 보기를 원합니다.

일반적으로 최고의 사용자 경험을 위해 단일 사용자 입력은 긴급 업데이트와 비긴급 업데이트 모두를 결과로 가져와야 합니다. 입력 이벤트 내부에서 startTransition API를 사용하여 React에 어떤 업데이트가 긴급하고 어떤 업데이트가 "전환"인지 알릴 수 있습니다:


```js
import { startTransition } from 'react';

// 긴급: 입력된 내용을 표시합니다.
setInputValue(input);

// 내부의 모든 상태 업데이트를 전환으로 표시합니다.
startTransition(() => {
  // 전환: 결과를 표시합니다.
  setSearchQuery(input);
});
```


startTransition으로 래핑된 업데이트는 비긴급으로 처리되며 클릭이나 키 입력과 같은 더 긴급한 업데이트가 들어오면 중단됩니다. 사용자가 전환을 중단하면(예: 여러 문자를 연속으로 입력하는 경우), React는 완료되지 않은 오래된 렌더링 작업을 버리고 최신 업데이트만 렌더링합니다.


* `useTransition`: 전환을 시작하는 훅으로, 보류 상태를 추적하는 값을 포함합니다.
* `startTransition`: 훅을 사용할 수 없을 때 전환을 시작하는 메서드입니다.

전환은 중단 가능한 렌더링을 허용하는 동시성 렌더링을 선택합니다. 콘텐츠가 다시 중단되면 전환은 React에 현재 콘텐츠를 계속 표시하면서 백그라운드에서 전환 콘텐츠를 렌더링하도록 지시합니다(자세한 내용은 [Suspense RFC](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md)를 참조하세요).

[전환에 대한 문서를 여기에서 참조하세요](/reference/react/useTransition).

### 새로운 Suspense 기능 {/*new-suspense-features*/}

Suspense를 사용하면 아직 표시할 준비가 되지 않은 컴포넌트 트리의 일부에 대한 로딩 상태를 선언적으로 지정할 수 있습니다:

```js
<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

Suspense는 "UI 로딩 상태"를 React 프로그래밍 모델에서 일급 선언적 개념으로 만듭니다. 이를 통해 우리는 그 위에 더 높은 수준의 기능을 구축할 수 있습니다.

몇 년 전 제한된 버전의 Suspense를 도입했습니다. 그러나 유일한 지원 사례는 React.lazy를 사용한 코드 분할이었으며, 서버에서 렌더링할 때는 전혀 지원되지 않았습니다.

React 18에서는 서버에서의 Suspense 지원을 추가하고 동시성 렌더링 기능을 사용하여 기능을 확장했습니다.

React 18의 Suspense는 전환 API와 결합될 때 가장 잘 작동합니다. 전환 중에 중단되면 React는 이미 표시된 콘텐츠가 폴백으로 대체되는 것을 방지합니다. 대신, React는 충분한 데이터가 로드될 때까지 렌더링을 지연시켜 나쁜 로딩 상태를 방지합니다.

자세한 내용은 [React 18의 Suspense RFC](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md)를 참조하세요.

### 새로운 클라이언트 및 서버 렌더링 API {/*new-client-and-server-rendering-apis*/}

이번 릴리스에서는 클라이언트와 서버에서 렌더링하기 위해 노출하는 API를 재설계할 기회를 가졌습니다. 이러한 변경 사항을 통해 사용자는 React 17 모드에서 기존 API를 계속 사용할 수 있으며, React 18로 업그레이드할 수 있습니다.

#### React DOM 클라이언트 {/*react-dom-client*/}

이제 이러한 새로운 API는 `react-dom/client`에서 내보내집니다:

* `createRoot`: `render` 또는 `unmount`를 위한 새로운 메서드입니다. `ReactDOM.render` 대신 사용하세요. React 18의 새로운 기능은 이것 없이는 작동하지 않습니다.
* `hydrateRoot`: 서버 렌더링된 애플리케이션을 수화하는 새로운 메서드입니다. 새로운 React DOM Server API와 함께 `ReactDOM.hydrate` 대신 사용하세요. React 18의 새로운 기능은 이것 없
이는 작동하지 않습니다.

`createRoot`와 `hydrateRoot`는 렌더링 또는 수화 중에 React가 오류에서 복구할 때 알림을 받으려는 경우 새로운 옵션인 `onRecoverableError`를 허용합니다. 기본적으로 React는 [`reportError`](https://developer.mozilla.org/en-US/docs/Web/API/reportError) 또는 이전 브라우저에서는 `console.error`를 사용합니다.

[React DOM 클라이언트에 대한 문서를 여기에서 참조하세요](/reference/react-dom/client).

#### React DOM 서버 {/*react-dom-server*/}

이제 이러한 새로운 API는 `react-dom/server`에서 내보내지며, 서버에서 스트리밍 Suspense를 완전히 지원합니다:

* `renderToPipeableStream`: Node 환경에서 스트리밍을 위한 것입니다.
* `renderToReadableStream`: Deno 및 Cloudflare 워커와 같은 최신 엣지 런타임 환경을 위한 것입니다.

기존 `renderToString` 메서드는 계속 작동하지만 권장되지 않습니다.

[React DOM 서버에 대한 문서를 여기에서 참조하세요](/reference/react-dom/server).

### 새로운 Strict Mode 동작 {/*new-strict-mode-behaviors*/}

미래에는 React가 상태를 유지하면서 UI의 섹션을 추가 및 제거할 수 있는 기능을 추가하고자 합니다. 예를 들어, 사용자가 화면을 탭하고 다시 돌아올 때, React는 이전 화면을 즉시 표시할 수 있어야 합니다. 이를 위해 React는 동일한 컴포넌트 상태를 사용하여 트리를 언마운트하고 다시 마운트할 것입니다.

이 기능은 React 앱에 기본적으로 더 나은 성능을 제공하지만, 효과가 여러 번 마운트되고 파괴되는 것에 대해 컴포넌트가 탄력적이어야 합니다. 대부분의 효과는 변경 없이 작동하지만, 일부 효과는 한 번만 마운트되거나 파괴된다고 가정합니다.

이 문제를 표면화하기 위해 React 18은 Strict Mode에 새로운 개발 전용 검사를 도입합니다. 이 새로운 검사는 컴포넌트가 처음 마운트될 때마다 자동으로 모든 컴포넌트를 언마운트하고 다시 마운트하며, 두 번째 마운트에서 이전 상태를 복원합니다.

이 변경 전에는 React가 컴포넌트를 마운트하고 효과를 생성했습니다:

```
* React가 컴포넌트를 마운트합니다.
  * 레이아웃 효과가 생성됩니다.
  * 효과가 생성됩니다.
```

React 18의 Strict Mode에서는 React가 개발 모드에서 컴포넌트를 언마운트하고 다시 마운트하는 것을 시뮬레이션합니다:

```
* React가 컴포넌트를 마운트합니다.
  * 레이아웃 효과가 생성됩니다.
  * 효과가 생성됩니다.
* React가 컴포넌트를 언마운트하는 것을 시뮬레이션합니다.
  * 레이아웃 효과가 파괴됩니다.
  * 효과가 파괴됩니다.
* React가 이전 상태로 컴포넌트를 마운트하는 것을 시뮬레이션합니다.
  * 레이아웃 효과가 생성됩니다.
  * 효과가 생성됩니다.
```

[개발 중 효과를 다시 실행하여 재사용 가능한 상태를 보장하는 방법에 대한 문서를 여기에서 참조하세요](/reference/react/StrictMode#fixing-bugs-found-by-re-running-effects-in-development).

### 새로운 Hooks {/*new-hooks*/}

#### useId {/*useid*/}

`useId`는 클라이언트와 서버에서 고유한 ID를 생성하는 새로운 Hook으로, 수화 불일치를 방지합니다. 이는 고유한 ID가 필요한 접근성 API와 통합하는 컴포넌트 라이브러리에 주로 유용합니다. 이는 React 17 이하에서 이미 존재하는 문제를 해결하지만, 새로운 스트리밍 서버 렌더러가 HTML을 순서대로 제공하지 않기 때문에 React 18에서는 더욱 중요합니다. [문서를 여기에서 참조하세요](/reference/react/useId).

> 참고
>
> `useId`는 [목록의 키](/learn/rendering-lists#where-to-get-your-key)를 생성하는 데 **사용되지 않습니다**. 키는 데이터에서 생성되어야 합니다.

#### useTransition {/*usetransition*/}

`useTransition`과 `startTransition`은 일부 상태 업데이트를 긴급하지 않다고 표시할 수 있습니다. 다른 상태 업데이트는 기본적으로 긴급한 것으로 간주됩니다. React는 긴급 상태 업데이트(예: 텍스트 입력 업데이트)가 비긴급 상태 업데이트(예: 검색 결과 목록 렌더링)를 중단할 수 있도록 합니다. [문서를 여기에서 참조하세요](/reference/react/useTransition).

#### useDeferredValue {/*usedeferredvalue*/}

`useDeferredValue`는 비긴급 트리의 일부를 다시 렌더링하는 것을 연기할 수 있습니다. 이는 디바운싱과 유사하지만 몇 가지 장점이 있습니다. 고정된 시간 지연이 없으므로 React는 첫 번째 렌더링이 화면에 반영된 직후 연기된 렌더링을 시도합니다. 연기된 렌더링은 중단 가능하며 사용자 입력을 차단하지 않습니다. [문서를 여기에서 참조하세요](/reference/react/useDeferredValue).

#### useSyncExternalStore {/*usesyncexternalstore*/}

`useSyncExternalStore`는 외부 스토어가 업데이트를 동기적으로 강제하여 동시 읽기를 지원할 수 있도록 하는 새로운 Hook입니다. 외부 데이터 소스에 대한 구독을 구현할 때 useEffect가 필요하지 않으며, React 외부 상태와 통합하는 모든 라이브러리에 권장됩니다. [문서를 여기에서 참조하세요](/reference/react/useSyncExternalStore).

> 참고
>
> `useSyncExternalStore`는 라이브러리에서 사용하도록 설계되었으며, 애플리케이션 코드에서는 사용되지 않습니다.

#### useInsertionEffect {/*useinsertioneffect*/}

`useInsertionEffect`는 CSS-in-JS 라이브러리가 렌더링 시 스타일을 주입하는 성능 문제를 해결할 수 있도록 하는 새로운 Hook입니다. CSS-in-JS 라이브러리를 이미 구축하지 않은 경우, 이를 사용할 필요가 없을 것입니다. 이 Hook은 DOM이 변형된 후, 레이아웃 효과가 새로운 레이아웃을 읽기 전에 실행됩니다. 이는 React 17 이하에서 이미 존재하는 문제를 해결하지만, React가 동시 렌더링 중에 브라우저에 양보하여 레이아웃을 다시 계산할 기회를 제공하기 때문에 React 18에서는 더욱 중요합니다. [문서를 여기에서 참조하세요](/reference/react/useInsertionEffect).

> 참고
>
> `useInsertionEffect`는 라이브러리에서 사용하도록 설계되었으며, 애플리케이션 코드에서는 사용되지 않습니다.

## 업그레이드 방법 {/*how-to-upgrade*/}

단계별 지침과 전체 중단 및 주목할 만한 변경 사항 목록은 [React 18로 업그레이드하는 방법](/blog/2022/03/08/react-18-upgrade-guide)을 참조하세요.

## 변경 로그 {/*changelog*/}

### React {/*react*/}

* 긴급 업데이트와 전환을 분리하기 위해 `useTransition` 및 `useDeferredValue`를 추가했습니다. ([#10426](https://github.com/facebook/react/pull/10426), [#10715](https://github.com/facebook/react/pull/10715), [#15593](https://github.com/facebook/react/pull/15593), [#15272](https://github.com/facebook/react/pull/15272), [#15578](https://github.com/facebook/react/pull/15578), [#15769](https://github.com/facebook/react/pull/15769), [#17058](https://github.com/facebook/react/pull/17058), [#18796](https://github.com/facebook/react/pull/18796), [#19121](https://github.com/facebook/react/pull/19121), [#19703](https://github.com/facebook/react/pull/19703), [#19719](https://github.com/facebook/react/pull/19719), [#19724](https://github.com/facebook/react/pull/19724), [#20672](https://github.com/facebook/react/pull/20672), [#20976](https://github.com/facebook/react/pull/20976) by [@acdlite](https://github.com/acdlite), [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii), and [@sebmarkbage](https://github.com/sebmarkbage))
* 고유한 ID를 생성하기 위해 `useId`를 추가했습니다. ([#17322](https://github.com/facebook/react/pull/17322), [#18576](https://github.com/facebook/react/pull/18576), [#22644](https://github.com/facebook/react/pull/22644), [#22672](https://github.com/facebook/react/pull/22672), [#21260](https://github.com/facebook/react/pull/21260) by [@acdlite](https://github.com/acdlite), [@lunaruan](https://github.com/lunaruan), and [@sebmarkbage](https://github.com/sebmarkbage))
* 외부 스토어 라이브러리가 React와 통합할 수 있도록 돕기 위해 `useSyncExternalStore`를 추가했습니다. ([#15022](https://github.com/facebook/react/pull/15022), [#18000](https://github.com/facebook/react/pull/18000), [#18771](https://github.com/facebook/react/pull/18771), [#22211](https://github.com/facebook/react/pull/22211), [#22292](https://github.com/facebook/react/pull/22292), [#22239](https://github.com/facebook/react/pull/22239), [#22347](https://github.com/facebook/react/pull/22347), [#23150](https://github.com/facebook/react/pull/23150) by [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), and [@drarmstr](https://github.com/drarmstr))
* 보류 피드백 없이 `useTransition`의 버전으로 `startTransition`을 추가했습니다. ([#19696](https://github.com/facebook/react/pull/19696) by [@rickhanlonii](https://github.com/rickhanlonii))
* CSS-in-JS 라이브러리를 위해 `useInsertionEffect`를 추가했습니다. ([#21913](https://github.com/facebook/react/pull/21913) by [@rickhanlonii](https://github.com/rickhanlonii))
* 콘텐츠가 다시 나타날 때 Suspense가 레이아웃 효과를 다시 마운트하도록 합니다. ([#19322](https://github.com/facebook/react/pull/19322), [#19374](https://github.com/facebook/react/pull/19374), [#19523](https://github.com/facebook/react/pull/19523), [#20625](https://github.com/facebook/react/pull/20625), [#21079](https://github.com/facebook/react/pull/21079) by [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), and [@lunaruan](https://github.com/lunaruan))
* `<StrictMode>`가 효과를 다시 실행하여 복원 가능한 상태를 확인하도록 합니다. ([#19523](https://github.com/facebook/react/pull/19523), [#21418](https://github.com/facebook/react/pull/21418) by [@bvaughn](https://github.com/bvaughn) and [@lunaruan](https://github.com/lunaruan))
* 심볼이 항상 사용 가능하다고 가정합니다. ([#23348](https://github.com/facebook/react/pull/23348) by [@sebmarkbage](https://github.com/sebmarkbage))
* `object-assign` 폴리필을 제거합니다. ([#23351](https://github.com/facebook/react/pull/23351) by [@sebmarkbage](https://github.com/sebmarkbage))
* 지원되지 않는 `unstable_changedBits` API를 제거합니다. ([#20953](https://github.com/facebook/react/pull/20953) by [@acdlite](https://github.com/acdlite))
* 컴포넌트가 undefined를 렌더링할 수 있도록 허용합니다. ([#21869](https://github.com/facebook/react/pull/21869) by [@rickhanlonii](https://github.com/rickhanlonii))
* 클릭과 같은 이산 이벤트로 인한 `useEffect`를 동기적으로 플러시합니다. ([#21150](https://github.com/facebook/react/pull/21150) by [@acdlite](https://github.com/acdlite))
* Suspense `fallback={undefined}`는 이제 `null`과 동일하게 동작하며 무시되지 않습니다. ([#21854](https://github.com/facebook/react/pull/21854) by [@rickhanlonii](https://github.com/rickhanlonii))
* 동일한 컴포넌트로 해결되는 모든 `lazy()`를 동등하게 간주합니다. ([#20357](https://github.com/facebook/react/pull/20357) by [@sebmarkbage](https://github.com/sebmarkbage))
* 첫 번째 렌더링 중에 콘솔을 패치하지 않습니다. ([#22308](https://github.com/facebook/react/pull/22308) by [@lunaruan](https://github.com/lunaruan))
* 메모리 사용량을 개선합니다. ([#21039](https://github.com/facebook/react/pull/21039) by [@bgirard](https://github.com/bgirard))
* 문자열 강제 변환이 예외를 발생시키는 경우 메시지를 개선합니다 (Temporal.*, Symbol 등). ([#22064](https://github.com/facebook/react/pull/22064) by [@justingrant](https://github.com/justingrant))
* `MessageChannel` 대신 `setImmediate`를 사용할 수 있을 때 사용합니다. ([#20834](https://github.com/facebook/react/pull/20834) by [@gaearon](https://github.com/gaearon))
* 중단된 트리 내부에서 전파되지 않는 컨텍스트를 수정합니다. ([#23095](https://github.com/facebook/react/pull/23095) by [@gaearon](https://github.com/gaearon))
* 조기 중단 메커니즘을 제거하여 `useReducer`가 잘못된 props를 관찰하는 문제를 수정합니다. ([#22445](https://github.com/facebook/react/pull/22445) by [@josephsavona](https://github.com/josephsavona))
* iframe을 추가할 때 Safari에서 `setState`가 무시되는 문제를 수정합니다. ([#23111](https://github.com/facebook/react/pull/23111) by [@gaearon](https://github.com/gaearon))
* 트리에서 `ZonedDateTime`을 렌더링할 때 충돌을 수정합니다. ([#20617](https://github.com/facebook/react/pull/20617) by [@dimaqq](https://github.com/dimaqq))
* 테스트에서 문서가 `null`로 설정될 때 충돌을 수정합니다. ([#22695](https://github.com/facebook/react/pull/22695) by [@SimenB](https://github.com/SimenB))
* 동시성 기능이 켜져 있을 때 `onLoad`가 트리거되지 않는 문제를 수정합니다. ([#23316](https://github.com/facebook/react/pull/23316) by [@gnoff](https://github.com/gnoff))
* 선택기가 `NaN`을 반환할 때 경고를 수정합니다. ([#23333](https://github.com/facebook/react/pull/23333) by [@hachibeeDI](https://github.com/hachibeeDI))
* 테스트에서 문서가 `null`로 설정될 때 충돌을 수정합니다. ([#22695](https://github.com/facebook/react/pull/22695) by [@SimenB](https://github.com/SimenB))
* 생성된 라이선스 헤더를 수정합니다. ([#23004](https://github.com/facebook/react/pull/23004) by [@vitaliemiron](https://github.com/vitaliemiron))
* `package.json`을 엔트리 포인트 중 하나로 추가합니다. ([#22954](https://github.com/facebook/react/pull/22954) by [@Jack](https://github.com/Jack-Works))
* Suspense 경계 외부에서 중단을 허용합니다. ([#23267](https://github.com/facebook/react/pull/23267) by [@acdlite](https://github.com/acdlite))
* 수화가 실패할 때 복구 가능한 오류를 기록합니다. ([#23319](https://github.com/facebook/react/pull/23319) by [@acdlite](https://github.com/acdlite))

### React DOM {/*react-dom*/}

* `createRoot` 및 `hydrateRoot`를 추가합니다. ([#10239](https://github.com/facebook/react/pull/10239), [#11225](https://github.com/facebook/react/pull/11225), [#12117](https://github.com/facebook/react/pull/12117), [#13732](https://github.com/facebook/react/pull/13732), [#15502](https://github.com/facebook/react/pull/15502), [#15532](https://github.com/facebook/react/pull/15532), [#17035](https://github.com/facebook/react/pull/17035), [#17165](https://github.com/facebook/react/pull/17165), [#20669](https://github.com/facebook/react/pull/20669), [#20748](https://github.com/facebook/react/pull/20748), [#20888](https://github.com/facebook/react/pull/20888), [#21072](https://github.com/facebook/react/pull/21072), [#21417](https://github.com/facebook/react/pull/21417), [#21652](https://github.com/facebook/react/pull/21652), [#21687](https://github.com/facebook/react/pull/21687), [#23207](https://github.com/facebook/react/pull/23207), [#23385](https://github.com/facebook/react/pull/23385) by [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), [@gaearon](https://github.com/gaearon), [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii), [@trueadm](https://github.com/trueadm), and [@sebmarkbage](https://github.com/sebmarkbage))
* 선택적 수화를 추가합니다. ([#14717](https://github.com/facebook/react/pull/14717), [#14884](https://github.com/facebook/react/pull/14884), [#16725](https://github.com/facebook/react/pull/16725), [#16880](https://github.com/facebook/react/pull/16880), [#17004](https://github.com/facebook/react/pull/17004), [#22416](https://github.com/facebook/react/pull/22416), [#22629](https://github.com/facebook/react/pull/22629), [#22448](https://github.com/facebook/react/pull/22448), [#22856](https://github.com/facebook/react/pull/22856), [#23176](https://github.com/facebook/react/pull/23176) by [@acdlite](https://github.com/acdlite), [@gaearon](https://github.com/gaearon), [@salazarm](https://github.com/salazarm), and [@sebmarkbage](https://github.com/sebmarkbage))
* 알려진 ARIA 속성 목록에 `aria-description`을 추가합니다. ([#22142](https://github.com/facebook/react/pull/22142) by [@mahyareb](https://github.com/mahyareb))
* 비디오 요소에 `onResize` 이벤트를 추가합니다. ([#21973](https://github.com/facebook/react/pull/21973) by [@rileyjshaw](https://github.com/rileyjshaw))
* 알려진 props에 `imageSizes` 및 `imageSrcSet`을 추가합니다. ([#22550](https://github.com/facebook/react/pull/22550) by [@eps1lon](https://github.com/eps1lon))
* `value`가 제공된 경우 비문자열 `<option>` 자식을 허용합니다. ([#21431](https://github.com/facebook/react/pull/21431) by [@sebmarkbage](https://github.com/sebmarkbage))
* `aspectRatio` 스타일이 적용되지 않는 문제를 수정합니다. ([#21100](https://github.com/facebook/react/pull/21100) by [@gaearon](https://github.com/gaearon))
* `renderSubtreeIntoContainer`가 호출될 때 경고합니다. ([#23355](https://github.com/facebook/react/pull/23355) by [@acdlite](https://github.com/acdlite))

### React DOM 서버 {/*react-dom-server-1*/}

* 새로운 스트리밍 렌더러를 추가합니다. ([#14144](https://github.com/facebook/react/pull/14144), [#20970](https://github.com/facebook/react/pull/20970), [#21056](https://github.com/facebook/react/pull/21056), [#21255](https://github.com/facebook/react/pull/21255), [#21200](https://github.com/facebook/react/pull/21200), [#21257](https://github.com/facebook/react/pull/21257), [#21276](https://github.com/facebook/react/pull/21276), [#22443](https://github.com/facebook/react/pull/22443), [#22450](https://github.com/facebook/react/pull/22450), [#23247](https://github.com/facebook/react/pull/23247), [#24025](https://github.com/facebook/react/pull/24025), [#24030](https://github.com/facebook/react/pull/24030) by [@sebmarkbage](https://github.com/sebmarkbage))
* 여러 요청을 처리할 때 SSR에서 컨텍스트 제공자를 수정합니다. ([#23171](https://github.com/facebook/react/pull/23171) by [@frandiox](https://github.com/frandiox))
* 텍스트 불일치 시 클라이언트 렌더링으로 되돌립니다. ([#23354](https://github.com/facebook/react/pull/23354) by [@acdlite](https://github.com/acdlite))
* `renderToNodeStream`을 사용 중단합니다. ([#23359](https://github.com/facebook/react/pull/23359) by [@sebmarkbage](https://github.com/sebmarkbage))
* 새로운 서버 렌더러에서 잘못된 오류 로그를 수정합니다. ([#24043](https://github.com/facebook/react/pull/24043) by [@eps1lon](https://github.com/eps1lon))
* 새로운 서버 렌더러의 버그를 수정합니다. ([#22617](https://github.com/facebook/react/pull/22617) by [@shuding](https://github.com/shuding))
* 서버에서 사용자 정의 요소 내부의 함수 및 심볼 값을 무시합니다. ([#21157](https://github.com/facebook/react/pull/21157) by [@sebmarkbage](https://github.com/sebmarkbage))

### React DOM 테스트 유틸리티 {/*react-dom-test-utils*/}

* 프로덕션에서 `act`가 사용될 때 예외를 발생시킵니다. ([#21686](https://github.com/facebook/react/pull/21686) by [@acdlite](https://github.com/acdlite))
* `global.IS_REACT_ACT_ENVIRONMENT`로 불필요한 act 경고를 비활성화하는 것을 지원합니다. ([#22561](https://github.com/facebook/react/pull/22561) by [@acdlite](https://github.com/acdlite))
* React 작업을 예약할 수 있는 모든 API를 다루기 위해 act 경고를 확장합니다. ([#22607](https://github.com/facebook/react/pull/22607) by [@acdlite](https://github.com/acdlite))
* `act`가 업데이트를 배치하도록 합니다. ([#21797](https://github.com/facebook/react/pull/21797) by [@acdlite](https://github.com/acdlite))
* 남아 있는 수동 효과에 대한 경고를 제거합니다. ([#22609](https://github.com/facebook/react/pull/22609) by [@acdlite](https://github.com/acdlite))

### React Refresh {/*react-refresh*/}

* Fast Refresh에서 늦게 마운트된 루트를 추적합니다. ([#22740](https://github.com/facebook/react/pull/22740) by [@anc95](https://github.com/anc95))
* `package.json`에 `exports` 필드를 추가합니다. ([#23087](https://github.com/facebook/react/pull/23087) by [@otakustay](https://github.com/otakustay))

### 서버 컴포넌트 (실험적) {/*server-components-experimental*/}

* 서버 컨텍스트 지원을 추가합니다. ([#23244](https://github.com/facebook/react/pull/23244) by [@salazarm](https://github.com/salazarm))
* `lazy` 지원을 추가합니다. ([#24068](https://github.com/facebook/react/pull/24068) by [@gnoff](https://github.com/gnoff))
* webpack 5용 webpack 플러그인을 업데이트합니다. ([#22739](https://github.com/facebook/react/pull/22739) by [@michenly](https://github.com/michenly))
* Node 로더의 실수를 수정합니다. ([#22537](https://github.com/facebook/react/pull/22537) by [@btea](https://github.com/btea))
* 엣지 환경을 위해 `window` 대신 `globalThis`를 사용합니다. ([#22777](https://github.com/facebook/react/pull/22777) by [@huozhi](https://github.com/huozhi))