---
title: React 18 계획
author: Andrew Clark, Brian Vaughn, Christine Abernathy, Dan Abramov, Rachel Nabors, Rick Hanlon, Sebastian Markbage, and Seth Webster
date: 2021/06/08
description: React 팀은 몇 가지 업데이트를 공유하게 되어 기쁩니다. 우리는 다음 주요 버전이 될 React 18 릴리스를 시작했습니다. React 18의 새로운 기능을 점진적으로 도입하기 위해 커뮤니티를 준비시키기 위해 작업 그룹을 만들었습니다. 라이브러리 작성자가 이를 시도하고 피드백을 제공할 수 있도록 React 18 Alpha를 발표했습니다...
---

2021년 6월 8일 [Andrew Clark](https://twitter.com/acdlite), [Brian Vaughn](https://github.com/bvaughn), [Christine Abernathy](https://twitter.com/abernathyca), [Dan Abramov](https://twitter.com/dan_abramov), [Rachel Nabors](https://twitter.com/rachelnabors), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage), 그리고 [Seth Webster](https://twitter.com/sethwebster)

---

<Intro>

React 팀은 몇 가지 업데이트를 공유하게 되어 기쁩니다:

1. 다음 주요 버전이 될 React 18 릴리스 작업을 시작했습니다.
2. React 18의 새로운 기능을 점진적으로 도입하기 위해 커뮤니티를 준비시키는 작업 그룹을 만들었습니다.
3. 라이브러리 작성자가 시도하고 피드백을 제공할 수 있도록 React 18 Alpha를 게시했습니다.

이 업데이트는 주로 서드파티 라이브러리 유지보수자를 대상으로 합니다. 만약 여러분이 React를 배우거나 가르치거나 사용자 인터페이스 애플리케이션을 구축하는 데 사용하고 있다면, 이 게시물을 무시해도 괜찮습니다. 하지만 궁금하다면 React 18 작업 그룹의 논의를 따라가도 좋습니다!

---

</Intro>

## React 18에 무엇이 포함될까요 {/*whats-coming-in-react-18*/}

React 18이 릴리스되면, [자동 배칭](https://github.com/reactwg/react-18/discussions/21)과 같은 기본 제공 개선 사항, [`startTransition`](https://github.com/reactwg/react-18/discussions/41)과 같은 새로운 API, 그리고 `React.lazy`에 대한 내장 지원을 갖춘 [새로운 스트리밍 서버 렌더러](https://github.com/reactwg/react-18/discussions/37)가 포함될 것입니다.

이러한 기능은 React 18에 추가되는 새로운 옵트인 메커니즘 덕분에 가능합니다. 이를 "동시 렌더링"이라고 하며, React가 동시에 여러 버전의 UI를 준비할 수 있게 합니다. 이 변경 사항은 주로 백그라운드에서 이루어지지만, 앱의 실제 및 인지 성능을 향상시킬 수 있는 새로운 가능성을 열어줍니다.

React의 미래에 대한 우리의 연구를 따라왔다면(그렇지 않더라도 괜찮습니다!), "동시 모드"라는 것을 들어봤을 수도 있고, 그것이 여러분의 앱을 망칠 수 있다는 이야기를 들었을 수도 있습니다. 커뮤니티의 이러한 피드백에 대응하여, 우리는 점진적인 도입을 위한 업그레이드 전략을 재설계했습니다. "모드"라는 전부 아니면 전무의 방식 대신, 동시 렌더링은 새로운 기능 중 하나에 의해 트리거된 업데이트에만 활성화됩니다. 실제로, **React 18을 도입하는 데 리라이트 없이 새로운 기능을 자신의 속도에 맞춰 시도할 수 있습니다.**

## 점진적인 도입 전략 {/*a-gradual-adoption-strategy*/}

React 18의 동시성은 옵트인이기 때문에, 컴포넌트 동작에 대한 중요한 기본 제공 변경 사항은 없습니다. **애플리케이션 코드에 최소한의 변경 또는 변경 없이 React 18로 업그레이드할 수 있으며, 이는 일반적인 주요 React 릴리스와 비슷한 수준의 노력으로 가능합니다.** 여러 앱을 React 18로 변환한 경험에 비추어 볼 때, 많은 사용자가 단 하루 만에 업그레이드할 수 있을 것으로 기대합니다.

우리는 Facebook에서 수만 개의 컴포넌트에 동시 기능을 성공적으로 배포했으며, 대부분의 React 컴포넌트가 추가 변경 없이 "그냥 작동"한다는 것을 경험했습니다. 우리는 전체 커뮤니티가 원활하게 업그레이드할 수 있도록 최선을 다하고 있으며, 오늘 React 18 작업 그룹을 발표합니다.

## 커뮤니티와 함께 작업하기 {/*working-with-the-community*/}

이번 릴리스에서는 새로운 시도를 하고 있습니다: React 커뮤니티 전반의 전문가, 개발자, 라이브러리 작성자, 교육자 패널을 초대하여 [React 18 작업 그룹](https://github.com/reactwg/react-18)에 참여하여 피드백을 제공하고, 질문을 하고, 릴리스에 협력하도록 했습니다. 이 초기 소규모 그룹에 모든 사람을 초대할 수는 없었지만, 이 실험이 성공하면 앞으로 더 많은 기회가 있을 것입니다!

**React 18 작업 그룹의 목표는 기존 애플리케이션과 라이브러리가 React 18을 원활하고 점진적으로 도입할 수 있도록 생태계를 준비하는 것입니다.** 작업 그룹은 [GitHub Discussions](https://github.com/reactwg/react-18/discussions)에서 호스팅되며, 공개적으로 읽을 수 있습니다. 작업 그룹의 멤버는 피드백을 남기고, 질문을 하고, 아이디어를 공유할 수 있습니다. 핵심 팀도 논의 저장소를 사용하여 연구 결과를 공유할 것입니다. 안정적인 릴리스가 가까워지면 중요한 정보는 이 블로그에도 게시될 것입니다.

React 18로 업그레이드하는 방법이나 릴리스에 대한 추가 리소스에 대한 자세한 내용은 [React 18 발표 게시물](https://github.com/reactwg/react-18/discussions/4)을 참조하세요.

## React 18 작업 그룹에 접근하기 {/*accessing-the-react-18-working-group*/}

모든 사람이 [React 18 작업 그룹 저장소](https://github.com/reactwg/react-18)의 논의를 읽을 수 있습니다.

작업 그룹에 대한 초기 관심이 급증할 것으로 예상되므로, 초대된 멤버만 스레드를 생성하거나 댓글을 달 수 있습니다. 그러나 스레드는 공개적으로 완전히 볼 수 있으므로 모든 사람이 동일한 정보에 접근할 수 있습니다. 우리는 이것이 작업 그룹 멤버에게 생산적인 환경을 조성하면서도 더 넓은 커뮤니티와의 투명성을 유지하는 좋은 타협이라고 믿습니다.

항상 그렇듯이, 버그 보고서, 질문, 일반적인 피드백은 [이슈 트래커](https://github.com/facebook/react/issues)에 제출할 수 있습니다.

## 오늘 React 18 Alpha를 시도하는 방법 {/*how-to-try-react-18-alpha-today*/}

새로운 알파 버전은 [npm에 `@alpha` 태그를 사용하여 정기적으로 게시됩니다](https://github.com/reactwg/react-18/discussions/9). 이러한 릴리스는 메인 저장소의 가장 최근 커밋을 사용하여 빌드됩니다. 기능이나 버그 수정이 병합되면, 다음 평일에 알파 버전에 나타납니다.

알파 릴리스 간에 중요한 동작 또는 API 변경이 있을 수 있습니다. **알파 릴리스는 사용자 인터페이스, 프로덕션 애플리케이션에 권장되지 않습니다.**

## 예상 React 18 릴리스 일정 {/*projected-react-18-release-timeline*/}

구체적인 릴리스 날짜는 정해지지 않았지만, React 18이 대부분의 프로덕션 애플리케이션에 준비되기까지 몇 달간의 피드백과 반복이 필요할 것으로 예상합니다.

* 라이브러리 알파: 오늘 사용 가능
* 공개 베타: 최소 몇 달
* 릴리스 후보(RC): 베타 이후 최소 몇 주
* 일반 가용성: RC 이후 최소 몇 주

예상 릴리스 일정에 대한 자세한 내용은 [작업 그룹](https://github.com/reactwg/react-18/discussions/9)에서 확인할 수 있습니다. 공개 릴리스에 가까워지면 이 블로그에 업데이트를 게시할 것입니다.