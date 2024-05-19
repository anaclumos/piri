---
title: React Conf 2021 요약
author: Jesslyn Tannady and Rick Hanlon
date: 2021/12/17
description: 지난주에 우리는 6번째 React Conf를 개최했습니다. 이전 몇 년 동안, 우리는 React Conf 무대를 React Native와 React Hooks와 같은 업계를 변화시키는 발표를 전달하는 데 사용했습니다. 올해는 React 18의 출시와 동시성 기능의 점진적인 도입을 시작으로 React의 멀티 플랫폼 비전을 공유했습니다.
---

2021년 12월 17일 [Jesslyn Tannady](https://twitter.com/jtannady)와 [Rick Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

지난주 우리는 6번째 React Conf를 개최했습니다. 이전 연도에는 [_React Native_](https://engineering.fb.com/2015/03/26/android/react-native-bringing-modern-web-techniques-to-mobile/)와 [_React Hooks_](https://reactjs.org/docs/hooks-intro.html)와 같은 산업을 변화시키는 발표를 React Conf 무대에서 했습니다. 올해는 React 18의 출시와 동시성 기능의 점진적 도입을 시작으로 React의 멀티 플랫폼 비전을 공유했습니다.

</Intro>

---

이번 React Conf는 처음으로 온라인에서 개최되었으며, 무료로 스트리밍되고 8개 언어로 번역되었습니다. 전 세계의 참가자들이 우리 컨퍼런스 Discord와 모든 시간대에서 접근할 수 있는 재생 이벤트에 참여했습니다. 50,000명 이상이 등록했으며, 19개의 강연이 60,000회 이상 조회되었고, 두 이벤트에서 Discord에 5,000명의 참가자가 있었습니다.

모든 강연은 [온라인에서 스트리밍 가능합니다](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa).

다음은 무대에서 공유된 내용의 요약입니다:

## React 18과 동시성 기능 {/*react-18-and-concurrent-features*/}

기조연설에서 우리는 React 18로 시작하는 React의 미래 비전을 공유했습니다.

React 18은 오랫동안 기다려온 동시성 렌더러와 주요한 파괴적 변경 없이 Suspense 업데이트를 추가합니다. 앱은 React 18로 업그레이드하고 다른 주요 릴리스와 마찬가지로 동시성 기능을 점진적으로 도입할 수 있습니다.

**이는 동시성 모드가 없고, 동시성 기능만 있다는 것을 의미합니다.**

기조연설에서는 또한 Suspense, Server Components, 새로운 React 작업 그룹, 그리고 React Native의 장기적인 멀티 플랫폼 비전에 대한 우리의 비전을 공유했습니다.

[Andrew Clark](https://twitter.com/acdlite), [Juan Tejada](https://twitter.com/_jstejada), [Lauren Tan](https://twitter.com/potetotes), 그리고 [Rick Hanlon](https://twitter.com/rickhanlonii)의 전체 기조연설을 여기에서 시청하세요:

<YouTubeIframe src="https://www.youtube.com/embed/FZ0cG47msEk" />

## 애플리케이션 개발자를 위한 React 18 {/*react-18-for-application-developers*/}

기조연설에서 우리는 React 18 RC가 지금 사용해볼 수 있다고 발표했습니다. 추가 피드백을 기다리는 동안, 이것이 내년 초에 안정적으로 배포될 React의 정확한 버전입니다.

React 18 RC를 사용해보려면 종속성을 업그레이드하세요:

```bash
npm install react@rc react-dom@rc
```

그리고 새로운 `createRoot` API로 전환하세요:

```js
// 이전
const container = document.getElementById('root');
ReactDOM.render(<App />, container);

// 이후
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App/>);
```

React 18로 업그레이드하는 데모는 [Shruti Kapoor](https://twitter.com/shrutikapoor08)의 강연을 참조하세요:

<YouTubeIframe src="https://www.youtube.com/embed/ytudH8je5ko" />

## Suspense를 사용한 스트리밍 서버 렌더링 {/*streaming-server-rendering-with-suspense*/}

React 18은 또한 Suspense를 사용한 서버 측 렌더링 성능 개선을 포함합니다.

스트리밍 서버 렌더링을 통해 서버에서 React 컴포넌트로부터 HTML을 생성하고, 그 HTML을 사용자에게 스트리밍할 수 있습니다. React 18에서는 `Suspense`를 사용하여 앱을 더 작은 독립적인 단위로 나눌 수 있으며, 이 단위들은 서로 독립적으로 스트리밍될 수 있어 앱의 나머지 부분을 차단하지 않습니다. 이는 사용자가 콘텐츠를 더 빨리 볼 수 있고, 더 빨리 상호작용을 시작할 수 있음을 의미합니다.

자세한 내용은 [Shaundai Person](https://twitter.com/shaundai)의 강연을 참조하세요:

<YouTubeIframe src="https://www.youtube.com/embed/pj5N-Khihgc" />

## 첫 번째 React 작업 그룹 {/*the-first-react-working-group*/}

React 18을 위해 우리는 전문가, 개발자, 라이브러리 유지 관리자, 교육자 패널과 협력하기 위해 첫 번째 작업 그룹을 만들었습니다. 함께 우리는 점진적 도입 전략을 만들고 `useId`, `useSyncExternalStore`, `useInsertionEffect`와 같은 새로운 API를 다듬었습니다.

이 작업에 대한 개요는 [Aakansha' Doshi](https://twitter.com/aakansha1216)의 강연을 참조하세요:

<YouTubeIframe src="https://www.youtube.com/embed/qn7gRClrC9U" />

## React 개발자 도구 {/*react-developer-tooling*/}

이번 릴리스의 새로운 기능을 지원하기 위해, 우리는 새로 구성된 React DevTools 팀과 React 앱을 디버그하는 데 도움이 되는 새로운 타임라인 프로파일러를 발표했습니다.

새로운 DevTools 기능에 대한 정보와 데모는 [Brian Vaughn](https://twitter.com/brian_d_vaughn)의 강연을 참조하세요:

<YouTubeIframe src="https://www.youtube.com/embed/oxDfrke8rZg" />

## memo 없이 React {/*react-without-memo*/}

미래를 더 내다보며, [Xuan Huang (黄玄)](https://twitter.com/Huxpro)은 자동 메모이징 컴파일러에 대한 React Labs 연구의 업데이트를 공유했습니다. 자세한 정보와 컴파일러 프로토타입의 데모는 이 강연을 참조하세요:

<YouTubeIframe src="https://www.youtube.com/embed/lGEMwh32soc" />

## React 문서 기조연설 {/*react-docs-keynote*/}

[Rachel Nabors](https://twitter.com/rachelnabors)는 React의 새로운 문서([현재 react.dev로 배포됨](/blog/2023/03/16/introducing-react-dev))에 대한 우리의 투자를 주제로 한 기조연설로 React를 배우고 디자인하는 것에 대한 강연 섹션을 시작했습니다:

<YouTubeIframe src="https://www.youtube.com/embed/mneDaMYOKP8" />

## 그리고 더... {/*and-more*/}

**우리는 또한 React를 배우고 디자인하는 것에 대한 강연을 들었습니다:**

* Debbie O'Brien: [새로운 React 문서에서 배운 것들](https://youtu.be/-7odLW_hG7s).
* Sarah Rainsberger: [브라우저에서 배우기](https://youtu.be/5X-WEQflCL0).
* Linton Ye: [React로 디자인하는 것의 ROI](https://youtu.be/7cPWmID5XAk).
* Delba de Oliveira: [React를 사용한 인터랙티브 플레이그라운드](https://youtu.be/zL8cz2W0z34).

**Relay, React Native, PyTorch 팀의 강연:**

* Robert Balicki: [Relay 재소개](https://youtu.be/lhVGdErZuN4).
* Eric Rozell과 Steven Moyes: [React Native 데스크탑](https://youtu.be/9L4FFrvwJwY).
* Roman Rädle: [React Native를 위한 온디바이스 머신 러닝](https://youtu.be/NLj73vrc2I8)

**접근성, 도구, Server Components에 대한 커뮤니티 강연:**

* Daishi Kato: [외부 스토어 라이브러리를 위한 React 18](https://youtu.be/oPfSC5bQPR8).
* Diego Haz: [React 18에서 접근 가능한 컴포넌트 빌드하기](https://youtu.be/dcm8fjBfro8).
* Tafu Nakazaki: [React를 사용한 접근 가능한 일본어 폼 컴포넌트](https://youtu.be/S4a0QlsH0pU).
* Lyle Troxell: [아티스트를 위한 UI 도구](https://youtu.be/b3l4WxipFsE).
* Helen Lin: [Hydrogen + React 18](https://youtu.be/HS6vIYkSNks).

## 감사합니다 {/*thank-you*/}

이번이 우리가 직접 컨퍼런스를 계획한 첫 해였으며, 감사드릴 분들이 많습니다.

먼저, 모든 연사분들께 감사드립니다 [Aakansha Doshi](https://twitter.com/aakansha1216), [Andrew Clark](https://twitter.com/acdlite), [Brian Vaughn](https://twitter.com/brian_d_vaughn), [Daishi Kato](https://twitter.com/dai_shi), [Debbie O'Brien](https://twitter.com/debs_obrien), [Delba de Oliveira](https://twitter.com/delba_oliveira), [Diego Haz](https://twitter.com/diegohaz), [Eric Rozell](https://twitter.com/EricRozell), [Helen Lin](https://twitter.com/wizardlyhel), [Juan Tejada](https://twitter.com/_jstejada), [Lauren Tan](https://twitter.com/potetotes), [Linton Ye](https://twitter.com/lintonye), [Lyle Troxell](https://twitter.com/lyle), [Rachel Nabors](https://twitter.com/rachelnabors), [Rick Hanlon](https://twitter.com/rickhanlonii), [Robert Balicki](https://twitter.com/StatisticsFTW), [Roman Rädle](https://twitter.com/raedle), [Sarah Rainsberger](https://twitter.com/sarah11918), [Shaundai Person](https://twitter.com/shaundai), [Shruti Kapoor](https://twitter.com/shrutikapoor08), [Steven Moyes](https://twitter.com/moyessa), [Tafu Nakazaki](https://twitter.com/hawaiiman0), 그리고 [Xuan Huang (黄玄)](https://twitter.com/Huxpro).

강연에 피드백을 제공해주신 모든 분들께 감사드립니다 [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://twitter.com/dan_abramov), [Dave McCabe](https://twitter.com/mcc_abe), [Eli White](https://twitter.com/Eli_White), [Joe Savona](https://twitter.com/en_JS),  [Lauren Tan](https://twitter.com/potetotes), [Rachel Nabors](https://twitter.com/rachelnabors), 그리고 [Tim Yung](https://twitter.com/yungsters).

컨퍼런스 Discord를 설정하고 Discord 관리자로 활동해주신 [Lauren Tan](https://twitter.com/potetotes)께 감사드립니다.

전반적인 방향에 대한 피드백을 제공하고 다양성과 포용성에 집중할 수 있도록 도와주신 [Seth Webster](https://twitter.com/sethwebster)께 감사드립니다.

우리의 중재 노력을 주도해주신 [Rachel Nabors](https://twitter.com/rachelnabors)와 중재 가이드를 작성하고 중재 팀을 이끌고 번역가와 중재자를 교육하며 두 이벤트를 중재하는 데 도움을 주신 [Aisha Blake](https://twitter.com/AishaBlake)께 감사드립니다.

중재자 [Jesslyn Tannady](https://twitter.com/jtannady), [Suzie Grange](https://twitter.com/missuze), [Becca Bailey](https://twitter.com/beccaliz), [Luna Wei](https://twitter.com/lunaleaps), [Joe Previte](https://twitter.com/jsjoeio), [Nicola Corti](https://twitter.com/Cortinico), [Gijs Weterings](https://twitter.com/gweterings), [Claudio Procida](https://twitter.com/claudiopro), Julia Neumann, Mengdi Chen, Jean Zhang, Ricky Li, 그리고 [Xuan Huang (黄玄)](https://twitter.com/Huxpro)께 감사드립니다.

[React India](https://www.reactindia.io/)의 [Manjula Dube](https://twitter.com/manjula_dube), [Sahil Mhapsekar](https://twitter.com/apheri0), Vihang Patel, 그리고 [React China](https://twitter.com/ReactChina)의 [Jasmine Xie](https://twitter.com/jasmine_xby), [QiChang Li](https://twitter.com/QCL15), [YanLun Li](https://twitter.com/anneincoding)께 재생 이벤트를 중재하고 커뮤니티를 위해 흥미롭게 유지해주신 것에 대해 감사드립니다.

컨퍼런스 웹사이트를 구축한 [Virtual Event Starter Kit](https://vercel.com/virtual-event-starter-kit)를 게시해주신 Vercel과 Next.js Conf를 운영한 경험을 공유해주신 [Lee Robinson](https://twitter.com/leeerob)과 [Delba de Oliveira](https://twitter.com/delba_oliveira)께 감사드립니다.

컨퍼런스를 운영한 경험을 공유해주신 [Leah Silber](https://twitter.com/wifelette)께 감사드리며, [RustConf](https://rustconf.com/)를 운영한 경험과 컨퍼런스를 운영하는 데 필요한 조언을 담은 그녀의 책 [Event Driven](https://leanpub.com/eventdriven/)에 감사드립니다.

Women of React Conf를 운영한 경험을 공유해주신 [Kevin Lewis](https://twitter.com/_phzn)와 [Rachel Nabors](https://twitter.com/rachelnabors)께 감사드립니다.

계획 전반에 걸쳐 조언과 아이디어를 제공해주신 [Aakansha Doshi](https://twitter.com/aakansha1216), [Laurie Barth](https://twitter.com/laurieontech), [Michael Chan](https://twitter.com/chantastic), 그리고 [Shaundai Person](https://twitter.com/shaundai)께 감사드립니다.

컨퍼런스 웹사이트와 티켓을 디자인하고 구축하는 데 도움을 주신 [Dan Lebowitz](https://twitter.com/lebo)께 감사드립니다.

기조연설과 Meta 직원 강연 비디오를 녹화해주신 Facebook Video Productions 팀의 Laura Podolak Waddell, Desmond Osei-Acheampong, Mark Rossi, Josh Toberman 및 다른 분들께 감사드립니다.

컨퍼런스를 조직하고, 스트림의 모든 비디오를 편집하고, 모든 강연을 번역하고, 여러 언어로 Discord를 중재하는 데 도움을 주신 파트너 HitPlay께 감사드립니다.

마지막으로, 이번 React Conf를 훌륭하게 만들어주신 모든 참가자분들께 감사드립니다!