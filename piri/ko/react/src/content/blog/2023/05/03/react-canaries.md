---
title: React 카나리아: Meta 외부에서 점진적 기능 롤아웃 활성화
author: Dan Abramov, Sophie Alpert, Rick Hanlon, Sebastian Markbage, and Andrew Clark
date: 2023/05/03
description: React 커뮤니티에 안정적인 버전으로 출시되기 전에 디자인이 거의 완료된 개별 새로운 기능을 채택할 수 있는 옵션을 제공하고자 합니다. 이는 Meta가 오랫동안 내부적으로 최신 버전의 React를 사용해온 방식과 유사합니다. 우리는 새로운 공식 지원 [Canary 릴리스 채널](/community/versioning-policy#canary-channel)을 도입하고 있습니다. 이 채널은 프레임워크와 같은 큐레이션된 설정이 React 릴리스 일정과는 별도로 개별 React 기능을 채택할 수 있게 합니다.
---

2023년 5월 3일 [Dan Abramov](https://twitter.com/dan_abramov), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage), 그리고 [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

React 커뮤니티에 새로운 기능을 안정 버전으로 출시하기 전에, 설계가 거의 완료된 상태에서 개별적으로 채택할 수 있는 옵션을 제공하고자 합니다. 이는 Meta가 오랫동안 내부적으로 최신 버전의 React를 사용해온 방식과 유사합니다. 우리는 새로운 공식 지원 [Canary 릴리스 채널](/community/versioning-policy#canary-channel)을 도입하고 있습니다. 이를 통해 프레임워크와 같은 큐레이션된 설정이 React 릴리스 일정과 독립적으로 개별 React 기능을 채택할 수 있습니다.

</Intro>

---

## 요약 {/*tldr*/}

* React에 대해 공식 지원되는 [Canary 릴리스 채널](/community/versioning-policy#canary-channel)을 도입하고 있습니다. 공식 지원되므로, 회귀가 발생하면 안정 릴리스의 버그와 유사한 긴급도로 처리할 것입니다.
* Canary를 통해 semver 안정 릴리스에 도달하기 전에 개별 새로운 React 기능을 사용할 수 있습니다.
* [Experimental](/community/versioning-policy#experimental-channel) 채널과 달리, React Canaries는 채택 준비가 되었다고 합리적으로 믿는 기능만 포함합니다. 프레임워크가 고정된 Canary React 릴리스를 번들로 고려하도록 권장합니다.
* Canary 릴리스에 포함된 주요 변경 사항과 새로운 기능을 블로그에 발표할 것입니다.
* **항상 그렇듯이, React는 모든 안정 릴리스에 대해 semver를 따릅니다.**

## React 기능이 일반적으로 개발되는 방식 {/*how-react-features-are-usually-developed*/}

일반적으로, 모든 React 기능은 동일한 단계를 거칩니다:

1. 초기 버전을 개발하고 `experimental_` 또는 `unstable_` 접두사를 붙입니다. 이 기능은 `experimental` 릴리스 채널에서만 사용할 수 있습니다. 이 시점에서 기능은 크게 변경될 수 있습니다.
2. Meta에서 이 기능을 테스트하고 피드백을 제공할 팀을 찾습니다. 이를 통해 변경 사항이 발생합니다. 기능이 더 안정화되면 Meta의 더 많은 팀과 함께 시도해 봅니다.
3. 결국 설계에 자신감을 갖게 됩니다. API 이름에서 접두사를 제거하고, 대부분의 Meta 제품이 사용하는 기본 `main` 브랜치에서 기능을 사용할 수 있게 합니다. 이 시점에서 Meta의 모든 팀이 이 기능을 사용할 수 있습니다.
4. 방향에 대한 자신감을 쌓으면서 새로운 기능에 대한 RFC를 게시합니다. 이 시점에서 설계가 광범위한 사례에 대해 작동한다는 것을 알고 있지만, 마지막 순간에 약간의 조정을 할 수 있습니다.
5. 오픈 소스 릴리스를 준비할 때, 기능에 대한 문서를 작성하고 최종적으로 안정적인 React 릴리스에서 기능을 릴리스합니다.

이 플레이북은 지금까지 출시된 대부분의 기능에 잘 작동했습니다. 그러나 기능이 일반적으로 사용 준비가 된 시점(3단계)과 오픈 소스에서 릴리스되는 시점(5단계) 사이에 상당한 격차가 있을 수 있습니다.

**React 커뮤니티에 Meta와 동일한 접근 방식을 따르고, 개별 새로운 기능을 더 일찍 채택할 수 있는 옵션을 제공하고자 합니다 (사용 가능해질 때). React의 다음 릴리스 주기를 기다릴 필요 없이.**

항상 그렇듯이, 모든 React 기능은 결국 안정 릴리스에 포함될 것입니다.

## 더 많은 마이너 릴리스를 할 수는 없나요? {/*can-we-just-do-more-minor-releases*/}

일반적으로, 우리는 새로운 기능을 도입하기 위해 마이너 릴리스를 사용합니다.

그러나 항상 가능한 것은 아닙니다. 때로는 새로운 기능이 아직 완전히 완료되지 않은 *다른* 새로운 기능과 상호 연결되어 있으며, 여전히 적극적으로 반복 작업을 하고 있습니다. 구현이 관련되어 있기 때문에 별도로 릴리스할 수 없습니다. 별도로 버전 관리를 할 수 없기 때문에 동일한 패키지(예: `react`와 `react-dom`)에 영향을 미칩니다. 그리고 semver가 요구하는 대로 주요 버전 릴리스의 홍수 없이 준비되지 않은 부분을 반복할 수 있는 능력을 유지해야 합니다.

Meta에서는 `main` 브랜치에서 React를 빌드하고 매주 특정 고정 커밋으로 수동 업데이트하여 이 문제를 해결했습니다. 이는 React Native 릴리스가 지난 몇 년 동안 따랐던 접근 방식이기도 합니다. React Native의 모든 *안정* 릴리스는 React 저장소의 `main` 브랜치에서 특정 커밋에 고정되어 있습니다. 이를 통해 React Native는 중요한 버그 수정을 포함하고 프레임워크 수준에서 새로운 React 기능을 점진적으로 채택할 수 있으며, 글로벌 React 릴리스 일정에 얽매이지 않습니다.

이 워크플로를 다른 프레임워크와 큐레이션된 설정에 제공하고자 합니다. 예를 들어, React 위에 있는 프레임워크가 안정적인 React 릴리스에 포함되기 전에 React 관련 주요 변경 사항을 포함할 수 있습니다. 이는 일부 주요 변경 사항이 프레임워크 통합에만 영향을 미치기 때문에 특히 유용합니다. 이를 통해 프레임워크는 semver를 깨지 않고 자체 마이너 버전에서 이러한 변경 사항을 릴리스할 수 있습니다.

Canaries 채널을 통한 롤링 릴리스는 더 긴밀한 피드백 루프를 제공하고 새로운 기능이 커뮤니티에서 포괄적인 테스트를 받을 수 있도록 할 것입니다. 이 워크플로는 TC39, JavaScript 표준 위원회가 [단계별로 변경 사항을 처리하는 방식](https://tc39.es/process-document/)과 더 유사합니다. 새로운 React 기능은 React 안정 릴리스에 포함되기 전에 React를 기반으로 한 프레임워크에서 사용할 수 있으며, 새로운 JavaScript 기능이 공식적으로 사양의 일부로 승인되기 전에 브라우저에 포함되는 것과 유사합니다.

## 실험적 릴리스를 대신 사용하지 않는 이유는 무엇인가요? {/*why-not-use-experimental-releases-instead*/}

기술적으로 [Experimental 릴리스](/community/versioning-policy#canary-channel)를 사용할 수 있지만, 실험적 API는 안정화 과정에서 상당한 주요 변경 사항이 발생할 수 있으므로 프로덕션에서 사용하는 것을 권장하지 않습니다 (또는 완전히 제거될 수도 있습니다). Canaries도 실수(모든 릴리스와 마찬가지로)를 포함할 수 있지만, 앞으로 Canaries에서 발생하는 주요 변경 사항을 블로그에 발표할 계획입니다. Canaries는 Meta가 내부적으로 실행하는 코드와 가장 가까우므로 일반적으로 상대적으로 안정적일 것으로 기대할 수 있습니다. 그러나 *고정된* 버전을 유지하고 고정된 커밋 간의 업데이트 시 GitHub 커밋 로그를 수동으로 스캔해야 합니다.

**큐레이션된 설정(예: 프레임워크) 외부에서 React를 사용하는 대부분의 사람들은 안정 릴리스를 계속 사용하고자 할 것입니다.** 그러나 프레임워크를 구축하는 경우 특정 커밋에 고정된 Canary 버전의 React를 번들로 고려할 수 있습니다. 그 이점은 개별 완료된 React 기능과 버그 수정을 사용자에게 더 일찍 제공하고 자체 릴리스 일정에 맞출 수 있다는 것입니다. 단점은 어떤 React 커밋이 포함되는지 검토하고 사용자에게 어떤 React 변경 사항이 포함되었는지 전달하는 추가 책임을 지게 된다는 것입니다.

프레임워크 작성자이고 이 접근 방식을 시도하고 싶다면, 저희에게 연락해 주세요.

## 주요 변경 사항과 새로운 기능을 조기에 발표하기 {/*announcing-breaking-changes-and-new-features-early*/}

Canary 릴리스는 언제든지 다음 안정 React 릴리스에 포함될 가능성이 있는 최선의 추측을 나타냅니다.

전통적으로, 주요 변경 사항은 릴리스 주기의 *끝*에 (주요 릴리스 시) 발표했습니다. 이제 Canary 릴리스가 React를 소비하는 공식 지원 방법이 되었으므로, 주요 변경 사항과 중요한 새로운 기능을 *Canaries에 포함될 때* 발표하는 방향으로 전환할 계획입니다. 예를 들어, Canary에 포함될 주요 변경 사항을 병합하면, React 블로그에 이에 대한 게시물을 작성하고 필요시 코드모드와 마이그레이션 지침을 포함할 것입니다. 그런 다음, 주요 릴리스를 준비하는 프레임워크 작성자가 해당 변경 사항을 포함하는 고정된 React canary로 업데이트할 때, 릴리스 노트에서 우리의 블로그 게시물에 링크할 수 있습니다. 마지막으로, 안정적인 주요 버전의 React가 준비되면, 이미 게시된 블로그 게시물에 링크할 것이며, 이를 통해 팀이 더 빠르게 진행할 수 있기를 바랍니다.

Canaries에 포함된 API를 문서화할 계획입니다--이 API가 아직 Canaries 외부에서 사용할 수 없더라도. Canaries에서만 사용할 수 있는 API는 해당 페이지에 특별한 주석으로 표시될 것입니다. 여기에는 [`use`](https://github.com/reactjs/rfcs/pull/229)와 같은 API와 `cache` 및 `createServerContext`와 같은 일부 다른 API가 포함될 것입니다.

## Canaries는 고정되어야 합니다 {/*canaries-must-be-pinned*/}

앱이나 프레임워크에 Canary 워크플로를 채택하기로 결정한 경우, 사용 중인 Canary의 *정확한* 버전을 항상 고정해야 합니다. Canaries는 사전 릴리스이므로 여전히 주요 변경 사항을 포함할 수 있습니다.

## 예시: React Server Components {/*example-react-server-components*/}

[3월에 발표한 것처럼](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components), React Server Components 규칙이 최종 확정되었으며, 사용자 인터페이스 API 계약과 관련된 주요 변경 사항은 예상하지 않습니다. 그러나 여전히 여러 상호 연결된 프레임워크 전용 기능(예: [asset loading](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#asset-loading))을 작업 중이므로 안정적인 React 버전에서 React Server Components 지원을 릴리스할 수 없습니다.

이는 React Server Components가 프레임워크에 의해 채택될 준비가 되었음을 의미합니다. 그러나 다음 주요 React 릴리스까지 프레임워크가 이를 채택할 수 있는 유일한 방법은 고정된 Canary 버전의 React를 제공하는 것입니다. (React의 두 복사본을 번들로 묶지 않기 위해, 이를 수행하려는 프레임워크는 `react`와 `react-dom`의 해상도를 프레임워크와 함께 제공하는 고정된 Canary로 강제하고, 이를 사용자에게 설명해야 합니다. 예를 들어, 이는 Next.js App Router가 수행하는 방식입니다.)

## 안정 및 Canary 버전 모두에 대해 라이브러리 테스트하기 {/*testing-libraries-against-both-stable-and-canary-versions*/}

모든 Canary 릴리스를 테스트하는 것은 매우 어렵기 때문에 라이브러리 작성자가 모든 Canary 릴리스를 테스트할 것으로 기대하지 않습니다. 그러나 [3년 전 React 사전 릴리스 채널을 처음 도입했을 때](https://legacy.reactjs.org/blog/2019/10/22/react-release-channels.html)와 마찬가지로, 라이브러리가 최신 안정 버전과 최신 Canary 버전 모두에 대해 테스트를 실행하도록 권장합니다. 발표되지 않은 동작 변경 사항을 발견하면, React 저장소에 버그를 신고하여 진단을 도울 수 있도록 하십시오. 이 관행이 널리 채택되면, 주요 React 버전으로 라이브러리를 업그레이드하는 데 필요한 노력이 줄어들 것으로 기대합니다. 이는 착오로 인한 회귀가 발생할 때마다 발견될 것이기 때문입니다.

<Note>

엄밀히 말하면, Canary는 *새로운* 릴리스 채널이 아닙니다--이전에는 Next라고 불렸습니다. 그러나 Next.js와의 혼동을 피하기 위해 이름을 변경하기로 했습니다. 새로운 기대치를 전달하기 위해 이를 *새로운* 릴리스 채널로 발표하고 있습니다. 예를 들어, Canaries는 React를 사용하는 공식 지원 방법입니다.

</Note>

## 안정 릴리스는 이전과 동일하게 작동합니다 {/*stable-releases-work-like-before*/}

안정적인 React 릴리스에는 아무런 변경 사항을 도입하지 않습니다.