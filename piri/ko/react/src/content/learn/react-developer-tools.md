---
title: React 개발자 도구
---

<Intro>

React Developer Tools를 사용하여 React [컴포넌트](/learn/your-first-component)를 검사하고, [props](/learn/passing-props-to-a-component)와 [state](/learn/state-a-components-memory)를 편집하며, 성능 문제를 식별하세요.

</Intro>

<YouWillLearn>

* React Developer Tools 설치 방법

</YouWillLearn>

## 브라우저 확장 프로그램 {/*browser-extension*/}

React로 구축된 웹사이트를 디버그하는 가장 쉬운 방법은 React Developer Tools 브라우저 확장 프로그램을 설치하는 것입니다. 이는 여러 인기 있는 브라우저에서 사용할 수 있습니다:

* [**Chrome**에 설치](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [**Firefox**에 설치](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [**Edge**에 설치](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

이제 **React로 구축된** 웹사이트를 방문하면 _Components_ 및 _Profiler_ 패널을 볼 수 있습니다.

![React Developer Tools 확장 프로그램](/images/docs/react-devtools-extension.png)

### Safari 및 기타 브라우저 {/*safari-and-other-browsers*/}
다른 브라우저(Safari 등)의 경우, [`react-devtools`](https://www.npmjs.com/package/react-devtools) npm 패키지를 설치하세요:
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

다음으로 터미널에서 개발자 도구를 엽니다:
```bash
react-devtools
```

그런 다음 웹사이트의 `<head>` 시작 부분에 다음 `<script>` 태그를 추가하여 웹사이트를 연결하세요:
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

이제 브라우저에서 웹사이트를 다시 로드하여 개발자 도구에서 확인하세요.

![React Developer Tools 독립 실행형](/images/docs/react-devtools-standalone.png)

## 모바일 (React Native) {/*mobile-react-native*/}
React Developer Tools는 [React Native](https://reactnative.dev/)로 구축된 앱을 검사하는 데에도 사용할 수 있습니다.

React Developer Tools를 사용하는 가장 쉬운 방법은 전역으로 설치하는 것입니다:
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

다음으로 터미널에서 개발자 도구를 엽니다.
```bash
react-devtools
```

로컬에서 실행 중인 모든 React Native 앱에 연결되어야 합니다.

> 몇 초 후에도 개발자 도구가 연결되지 않으면 앱을 다시 로드해 보세요.

[React Native 디버깅에 대해 자세히 알아보세요.](https://reactnative.dev/docs/debugging)