---
title: React DOM API
---

<Intro>

`react-dom` 패키지는 웹 애플리케이션(브라우저 DOM 환경에서 실행되는)에서만 지원되는 메서드를 포함하고 있습니다. React Native에서는 지원되지 않습니다.

</Intro>

---

## APIs {/*apis*/}

이 API들은 컴포넌트에서 임포트할 수 있습니다. 이들은 거의 사용되지 않습니다:

* [`createPortal`](/reference/react-dom/createPortal)은 자식 컴포넌트를 DOM 트리의 다른 부분에 렌더링할 수 있게 해줍니다.
* [`flushSync`](/reference/react-dom/flushSync)은 React가 상태 업데이트를 플러시하고 DOM을 동기적으로 업데이트하도록 강제할 수 있게 해줍니다.

## 리소스 프리로딩 APIs {/*resource-preloading-apis*/}

이 API들은 스크립트, 스타일시트, 폰트와 같은 리소스를 미리 로드하여 앱을 더 빠르게 만들 수 있습니다. 예를 들어, 리소스가 사용될 다른 페이지로 이동하기 전에 미리 로드할 수 있습니다.

[React 기반 프레임워크](/learn/start-a-new-react-project)는 자주 리소스 로딩을 처리해주므로, 직접 이 API들을 호출할 필요가 없을 수도 있습니다. 프레임워크의 문서를 참조하십시오.

* [`prefetchDNS`](/reference/react-dom/prefetchDNS)은 연결할 것으로 예상되는 DNS 도메인 이름의 IP 주소를 미리 가져올 수 있게 해줍니다.
* [`preconnect`](/reference/react-dom/preconnect)은 요청할 리소스를 아직 모르는 경우에도 서버에 미리 연결할 수 있게 해줍니다.
* [`preload`](/reference/react-dom/preload)은 사용할 것으로 예상되는 스타일시트, 폰트, 이미지 또는 외부 스크립트를 미리 가져올 수 있게 해줍니다.
* [`preloadModule`](/reference/react-dom/preloadModule)은 사용할 것으로 예상되는 ESM 모듈을 미리 가져올 수 있게 해줍니다.
* [`preinit`](/reference/react-dom/preinit)은 외부 스크립트를 가져와 평가하거나 스타일시트를 가져와 삽입할 수 있게 해줍니다.
* [`preinitModule`](/reference/react-dom/preinitModule)은 ESM 모듈을 가져와 평가할 수 있게 해줍니다.

---

## 엔트리 포인트 {/*entry-points*/}

`react-dom` 패키지는 두 개의 추가 엔트리 포인트를 제공합니다:

* [`react-dom/client`](/reference/react-dom/client)은 클라이언트(브라우저)에서 React 컴포넌트를 렌더링하는 API를 포함하고 있습니다.
* [`react-dom/server`](/reference/react-dom/server)은 서버에서 React 컴포넌트를 렌더링하는 API를 포함하고 있습니다.

---

## 사용 중단된 APIs {/*deprecated-apis*/}

<Deprecated>

이 API들은 React의 향후 주요 버전에서 제거될 예정입니다.

</Deprecated>

* [`findDOMNode`](/reference/react-dom/findDOMNode)은 클래스 컴포넌트 인스턴스에 해당하는 가장 가까운 DOM 노드를 찾습니다.
* [`hydrate`](/reference/react-dom/hydrate)은 서버 HTML에서 생성된 트리를 DOM에 마운트합니다. [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 대신 사용합니다.
* [`render`](/reference/react-dom/render)은 트리를 DOM에 마운트합니다. [`createRoot`](/reference/react-dom/client/createRoot)를 대신 사용합니다.
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode)은 트리를 DOM에서 언마운트합니다. [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount)를 대신 사용합니다.