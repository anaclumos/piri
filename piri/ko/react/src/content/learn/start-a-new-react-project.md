---
title: 새 React 프로젝트 시작하기
---

<Intro>

만약 React로 완전히 새로운 앱이나 웹사이트를 구축하고 싶다면, 커뮤니티에서 인기 있는 React 기반 프레임워크 중 하나를 선택하는 것을 추천합니다.

</Intro>

프레임워크 없이 React를 사용할 수도 있지만, 대부분의 앱과 사이트는 결국 코드 분할, 라우팅, 데이터 가져오기, HTML 생성과 같은 일반적인 문제에 대한 솔루션을 구축하게 됩니다. 이러한 문제는 React뿐만 아니라 모든 UI 라이브러리에 공통적입니다.

프레임워크로 시작하면 React를 빠르게 시작할 수 있으며, 나중에 본질적으로 자신만의 프레임워크를 구축하는 것을 피할 수 있습니다.

<DeepDive>

#### React를 프레임워크 없이 사용할 수 있나요? {/*can-i-use-react-without-a-framework*/}

React를 프레임워크 없이 사용할 수 있습니다. 이는 [페이지의 일부에 React를 사용하는 방법](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)입니다. **그러나, 만약 새로운 앱이나 사이트를 완전히 React로 구축하려는 경우, 프레임워크를 사용하는 것을 추천합니다.**

그 이유는 다음과 같습니다.

처음에는 라우팅이나 데이터 가져오기가 필요하지 않더라도, 나중에 이를 위해 라이브러리를 추가하고 싶어질 것입니다. 새로운 기능이 추가될 때마다 JavaScript 번들이 커지면서 각 라우트별로 코드를 분할하는 방법을 찾아야 할 수도 있습니다. 데이터 가져오기 요구가 복잡해지면, 서버-클라이언트 네트워크 워터폴을 만나 앱이 매우 느리게 느껴질 수 있습니다. 네트워크 상태가 좋지 않거나 저사양 기기를 사용하는 사용자가 많아질수록, 서버나 빌드 시간에 컴포넌트에서 HTML을 생성하여 콘텐츠를 일찍 표시해야 할 수도 있습니다. 설정을 변경하여 일부 코드를 서버나 빌드 시간에 실행하는 것은 매우 까다로울 수 있습니다.

**이러한 문제는 React에만 국한된 것이 아닙니다. 그래서 Svelte에는 SvelteKit, Vue에는 Nuxt가 있는 것입니다.** 이러한 문제를 스스로 해결하려면 번들러를 라우터 및 데이터 가져오기 라이브러리와 통합해야 합니다. 초기 설정을 작동시키는 것은 어렵지 않지만, 시간이 지남에 따라 앱이 커지더라도 빠르게 로드되도록 만드는 데는 많은 미묘한 부분이 있습니다. 최소한의 앱 코드를 단일 클라이언트-서버 라운드트립으로 전송하고, 페이지에 필요한 데이터를 병렬로 전송하고 싶을 것입니다. JavaScript 코드가 실행되기 전에 페이지가 상호작용할 수 있도록 하여 점진적 향상을 지원하고 싶을 것입니다. 마케팅 페이지를 위해 JavaScript가 비활성화된 상태에서도 작동하는 완전히 정적인 HTML 파일 폴더를 생성하고 싶을 수도 있습니다. 이러한 기능을 직접 구축하는 것은 많은 노력이 필요합니다.

**이 페이지의 React 프레임워크는 기본적으로 이러한 문제를 해결하며, 추가 작업이 필요하지 않습니다.** 매우 간단하게 시작하고 필요에 따라 앱을 확장할 수 있습니다. 각 React 프레임워크는 커뮤니티가 있어 질문에 대한 답을 찾고 도구를 업그레이드하는 것이 더 쉽습니다. 프레임워크는 코드에 구조를 제공하여 다른 프로젝트 간에 컨텍스트와 기술을 유지하는 데 도움이 됩니다. 반면, 사용자 정의 설정을 사용하면 지원되지 않는 종속성 버전에 갇히기 쉽고, 결국 커뮤니티나 업그레이드 경로가 없는 자신만의 프레임워크를 만들게 됩니다 (그리고 우리가 과거에 만든 것처럼 더 엉성하게 설계된 경우가 많습니다).

앱에 이러한 프레임워크로 잘 해결되지 않는 특이한 제약이 있거나, 이러한 문제를 스스로 해결하고 싶다면, React로 사용자 정의 설정을 만들 수 있습니다. npm에서 `react`와 `react-dom`을 가져오고, [Vite](https://vitejs.dev/)나 [Parcel](https://parceljs.org/)과 같은 번들러로 사용자 정의 빌드 프로세스를 설정하고, 라우팅, 정적 생성 또는 서버 사이드 렌더링 등을 위해 필요한 도구를 추가하십시오.

</DeepDive>

## 프로덕션급 React 프레임워크 {/*production-grade-react-frameworks*/}

이 프레임워크들은 프로덕션에서 앱을 배포하고 확장하는 데 필요한 모든 기능을 지원하며, 우리의 [풀스택 아키텍처 비전](#which-features-make-up-the-react-teams-full-stack-architecture-vision)을 지원하기 위해 노력하고 있습니다. 우리가 추천하는 모든 프레임워크는 오픈 소스이며, 지원을 위한 활발한 커뮤니티가 있으며, 자체 서버나 호스팅 제공업체에 배포할 수 있습니다. 프레임워크 작성자로서 이 목록에 포함되기를 원한다면, [알려주세요](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+).

### Next.js {/*nextjs-pages-router*/}

**[Next.js의 Pages Router](https://nextjs.org/)는 풀스택 React 프레임워크입니다.** 매우 유연하며, 대부분 정적인 블로그부터 복잡한 동적 애플리케이션까지 모든 크기의 React 앱을 만들 수 있습니다. 새로운 Next.js 프로젝트를 만들려면 터미널에서 다음을 실행하십시오:

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

Next.js를 처음 사용하는 경우, [Next.js 학습 과정](https://nextjs.org/learn)을 확인하십시오.

Next.js는 [Vercel](https://vercel.com/)에서 유지 관리합니다. [Next.js 앱을 배포](https://nextjs.org/docs/app/building-your-application/deploying)하여 Node.js 또는 서버리스 호스팅, 또는 자체 서버에 배포할 수 있습니다. Next.js는 서버가 필요 없는 [정적 내보내기](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports)도 지원합니다.

### Remix {/*remix*/}

**[Remix](https://remix.run/)는 중첩 라우팅을 지원하는 풀스택 React 프레임워크입니다.** 앱을 중첩된 부분으로 나누어 병렬로 데이터를 로드하고 사용자 작업에 따라 새로 고칠 수 있습니다. 새로운 Remix 프로젝트를 만들려면 다음을 실행하십시오:

<TerminalBlock>
npx create-remix
</TerminalBlock>

Remix를 처음 사용하는 경우, Remix [블로그 튜토리얼](https://remix.run/docs/en/main/tutorials/blog) (짧은)과 [앱 튜토리얼](https://remix.run/docs/en/main/tutorials/jokes) (긴)을 확인하십시오.

Remix는 [Shopify](https://www.shopify.com/)에서 유지 관리합니다. Remix 프로젝트를 만들 때 [배포 대상](https://remix.run/docs/en/main/guides/deployment)을 선택해야 합니다. Remix 앱을 Node.js 또는 서버리스 호스팅에 배포하려면 [어댑터](https://remix.run/docs/en/main/other-api/adapter)를 사용하거나 작성해야 합니다.

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/)는 빠른 CMS 기반 웹사이트를 위한 React 프레임워크입니다.** 풍부한 플러그인 생태계와 GraphQL 데이터 레이어는 콘텐츠, API 및 서비스를 하나의 웹사이트로 통합하는 것을 단순화합니다. 새로운 Gatsby 프로젝트를 만들려면 다음을 실행하십시오:

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

Gatsby를 처음 사용하는 경우, [Gatsby 튜토리얼](https://www.gatsbyjs.com/docs/tutorial/)을 확인하십시오.

Gatsby는 [Netlify](https://www.netlify.com/)에서 유지 관리합니다. [완전히 정적인 Gatsby 사이트를 배포](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting)하여 모든 정적 호스팅에 배포할 수 있습니다. 서버 전용 기능을 사용하도록 선택한 경우, 호스팅 제공업체가 Gatsby를 지원하는지 확인하십시오.

### Expo (네이티브 앱용) {/*expo*/}

**[Expo](https://expo.dev/)는 진정한 네이티브 UI를 갖춘 범용 Android, iOS 및 웹 앱을 만들 수 있는 React 프레임워크입니다.** [React Native](https://reactnative.dev/)를 위한 SDK를 제공하여 네이티브 부분을 더 쉽게 사용할 수 있습니다. 새로운 Expo 프로젝트를 만들려면 다음을 실행하십시오:

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

Expo를 처음 사용하는 경우, [Expo 튜토리얼](https://docs.expo.dev/tutorial/introduction/)을 확인하십시오.

Expo는 [Expo (회사)](https://expo.dev/about)에서 유지 관리합니다. Expo로 앱을 만드는 것은 무료이며, Google 및 Apple 앱 스토어에 제한 없이 제출할 수 있습니다. Expo는 추가로 선택 가능한 유료 클라우드 서비스를 제공합니다.

## 최첨단 React 프레임워크 {/*bleeding-edge-react-frameworks*/}

React를 계속 개선하는 방법을 탐구하면서, React를 프레임워크(특히 라우팅, 번들링 및 서버 기술)와 더 밀접하게 통합하는 것이 React 사용자가 더 나은 앱을 구축할 수 있도록 돕는 가장 큰 기회라는 것을 깨달았습니다. Next.js 팀은 [React Server Components](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)와 같은 프레임워크에 구애받지 않는 최첨단 React 기능을 연구, 개발, 통합 및 테스트하는 데 협력하기로 동의했습니다.

이 기능들은 매일 프로덕션 준비에 가까워지고 있으며, 다른 번들러 및 프레임워크 개발자들과 통합에 대해 논의하고 있습니다. 우리의 희망은 1~2년 내에 이 페이지에 나열된 모든 프레임워크가 이러한 기능을 완전히 지원하는 것입니다. (이 기능을 실험하는 데 관심이 있는 프레임워크 작성자라면, 알려주세요!)

### Next.js (App Router) {/*nextjs-app-router*/}

**[Next.js의 App Router](https://nextjs.org/docs)는 React 팀의 풀스택 아키텍처 비전을 실현하기 위해 Next.js API를 재설계한 것입니다.** 서버나 빌드 중에 실행되는 비동기 컴포넌트에서 데이터를 가져올 수 있습니다.

Next.js는 [Vercel](https://vercel.com/)에서 유지 관리합니다. [Next.js 앱을 배포](https://nextjs.org/docs/app/building-your-application/deploying)하여 Node.js 또는 서버리스 호스팅, 또는 자체 서버에 배포할 수 있습니다. Next.js는 서버가 필요 없는 [정적 내보내기](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)도 지원합니다.

<DeepDive>

#### React 팀의 풀스택 아키텍처 비전을 구성하는 기능은 무엇인가요? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Next.js의 App Router 번들러는 공식 [React Server Components 사양](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)을 완전히 구현합니다. 이를 통해 빌드 타임, 서버 전용 및 상호작용 컴포넌트를 단일 React 트리에서 혼합할 수 있습니다.

예를 들어, 데이터베이스나 파일에서 읽는 `async` 함수로 서버 전용 React 컴포넌트를 작성할 수 있습니다. 그런 다음 데이터를 상호작용 컴포넌트로 전달할 수 있습니다:

```js
// 이 컴포넌트는 *오직* 서버(또는 빌드 중)에만 실행됩니다.
async function Talks({ confId }) {
  // 1. 서버에 있으므로 데이터 레이어와 통신할 수 있습니다. API 엔드포인트가 필요하지 않습니다.
  const talks = await db.Talks.findAll({ confId });

  // 2. 렌더링 로직을 얼마든지 추가할 수 있습니다. 이는 JavaScript 번들을 더 크게 만들지 않습니다.
  const videos = talks.map(talk => talk.video);

  // 3. 브라우저에서 실행될 컴포넌트에 데이터를 전달합니다.
  return <SearchableVideoList videos={videos} />;
}
```

Next.js의 App Router는 [Suspense를 사용한 데이터 가져오기](/blog/2022/03/29/react-v18#suspense-in-data-frameworks)도 통합합니다. 이를 통해 React 트리에서 사용자 인터페이스의 다양한 부분에 대해 로딩 상태(예: 스켈레톤 플레이스홀더)를 지정할 수 있습니다:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

서버 컴포넌트와 Suspense는 Next.js 기능이 아니라 React 기능입니다. 그러나 프레임워크 수준에서 이를 채택하려면 동의와 비트리비얼한 구현 작업이 필요합니다. 현재 Next.js App Router는 가장 완전한 구현을 제공합니다. React 팀은 이러한 기능을 차세대 프레임워크에서 더 쉽게 구현할 수 있도록 번들러 개발자들과 협력하고 있습니다.

</DeepDive>