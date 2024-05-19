---
title: Hooks의 규칙
---

당신은 아마도 다음과 같은 오류 메시지를 받았기 때문에 여기에 있을 것입니다:

<ConsoleBlock level="error">

Hooks는 함수 컴포넌트의 본문 내에서만 호출할 수 있습니다.

</ConsoleBlock>

이 오류를 보게 되는 일반적인 세 가지 이유가 있습니다:

1. **Hooks 규칙을 위반**하고 있을 수 있습니다.
2. React와 React DOM의 **버전이 일치하지 않**을 수 있습니다.
3. 동일한 앱에 **React의 복사본이 둘 이상** 있을 수 있습니다.

각 경우를 살펴보겠습니다.

## Hooks 규칙 위반 {/*breaking-rules-of-hooks*/}

이름이 `use`로 시작하는 함수는 React에서 [*Hooks*](/reference/react)라고 합니다.

**루프, 조건문 또는 중첩된 함수 내에서 Hooks를 호출하지 마십시오.** 대신 항상 React 함수의 최상위 레벨에서, 조기 반환 전에 Hooks를 사용하십시오. React가 함수 컴포넌트를 렌더링하는 동안에만 Hooks를 호출할 수 있습니다:

* ✅ [함수 컴포넌트](/learn/your-first-component)의 본문 최상위 레벨에서 호출하십시오.
* ✅ [커스텀 Hook](/learn/reusing-logic-with-custom-hooks)의 본문 최상위 레벨에서 호출하십시오.

```js{2-3,8-9}
function Counter() {
  // ✅ 좋음: 함수 컴포넌트의 최상위 레벨에서
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ 좋음: 커스텀 Hook의 최상위 레벨에서
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

다른 경우에는 Hooks(이름이 `use`로 시작하는 함수)를 호출하는 것이 **지원되지 않습니다**, 예를 들어:

* 🔴 조건문이나 루프 내에서 Hooks를 호출하지 마십시오.
* 🔴 조건부 `return` 문 이후에 Hooks를 호출하지 마십시오.
* 🔴 이벤트 핸들러 내에서 Hooks를 호출하지 마십시오.
* 🔴 클래스 컴포넌트 내에서 Hooks를 호출하지 마십시오.
* 🔴 `useMemo`, `useReducer`, 또는 `useEffect`에 전달된 함수 내에서 Hooks를 호출하지 마십시오.

이 규칙을 위반하면 이 오류가 발생할 수 있습니다.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 나쁨: 조건문 내에서 (수정하려면 밖으로 이동하십시오!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 나쁨: 루프 내에서 (수정하려면 밖으로 이동하십시오!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 나쁨: 조건부 반환 이후 (수정하려면 반환 이전으로 이동하십시오!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 나쁨: 이벤트 핸들러 내에서 (수정하려면 밖으로 이동하십시오!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 나쁨: useMemo 내에서 (수정하려면 밖으로 이동하십시오!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 나쁨: 클래스 컴포넌트 내에서 (수정하려면 클래스 대신 함수 컴포넌트를 작성하십시오!)
    useEffect(() => {})
    // ...
  }
}
```

이러한 실수를 잡기 위해 [`eslint-plugin-react-hooks` 플러그인](https://www.npmjs.com/package/eslint-plugin-react-hooks)을 사용할 수 있습니다.

<Note>

[커스텀 Hooks](/learn/reusing-logic-with-custom-hooks)는 다른 Hooks를 호출할 *수 있습니다* (그것이 그들의 전체 목적입니다). 이는 커스텀 Hooks도 함수 컴포넌트가 렌더링되는 동안에만 호출되어야 하기 때문에 작동합니다.

</Note>

## React와 React DOM의 버전 불일치 {/*mismatching-versions-of-react-and-react-dom*/}

Hooks를 아직 지원하지 않는 버전의 `react-dom` (< 16.8.0) 또는 `react-native` (< 0.59)을 사용하고 있을 수 있습니다. 애플리케이션 폴더에서 `npm ls react-dom` 또는 `npm ls react-native`를 실행하여 사용 중인 버전을 확인할 수 있습니다. 둘 이상의 버전을 찾으면 문제가 발생할 수 있습니다(아래에서 자세히 설명합니다).

## 중복된 React {/*duplicate-react*/}

Hooks가 작동하려면 애플리케이션 코드에서 `react`를 가져오는 것이 `react-dom` 패키지 내부에서 `react`를 가져오는 것과 동일한 모듈로 해결되어야 합니다.

이 `react` 가져오기가 두 개의 다른 내보내기 객체로 해결되면 이 경고가 표시됩니다. 이는 **실수로 `react` 패키지의 두 개의 복사본**을 갖게 된 경우 발생할 수 있습니다.

패키지 관리를 위해 Node를 사용하는 경우 프로젝트 폴더에서 이 검사를 실행할 수 있습니다:

<TerminalBlock>

npm ls react

</TerminalBlock>

두 개 이상의 React가 보이면 왜 이런 일이 발생했는지 파악하고 종속성 트리를 수정해야 합니다. 예를 들어, 사용 중인 라이브러리가 `react`를 피어 종속성 대신 종속성으로 잘못 지정했을 수 있습니다. 해당 라이브러리가 수정될 때까지 [Yarn resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/)이 가능한 해결 방법 중 하나입니다.

또한 일부 로그를 추가하고 개발 서버를 다시 시작하여 이 문제를 디버깅할 수 있습니다:

```js
// node_modules/react-dom/index.js에 추가
window.React1 = require('react');

// 컴포넌트 파일에 추가
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

`false`가 출력되면 두 개의 React가 있을 수 있으며 왜 그런 일이 발생했는지 파악해야 합니다. [이 이슈](https://github.com/facebook/react/issues/13991)에는 커뮤니티에서 겪은 일반적인 이유가 포함되어 있습니다.

이 문제는 `npm link` 또는 이와 동등한 것을 사용할 때도 발생할 수 있습니다. 이 경우 번들러가 애플리케이션 폴더와 라이브러리 폴더에서 두 개의 React를 "볼" 수 있습니다. `myapp`과 `mylib`가 형제 폴더라고 가정하면, 한 가지 가능한 해결 방법은 `mylib`에서 `npm link ../myapp/node_modules/react`를 실행하는 것입니다. 이렇게 하면 라이브러리가 애플리케이션의 React 복사본을 사용하게 됩니다.

<Note>

일반적으로 React는 한 페이지에서 여러 독립적인 복사본을 사용하는 것을 지원합니다(예: 앱과 타사 위젯이 모두 사용하는 경우). `require('react')`가 컴포넌트와 `react-dom` 복사본 간에 다르게 해결되는 경우에만 문제가 발생합니다.

</Note>

## 기타 원인 {/*other-causes*/}

이 중 어느 것도 효과가 없었다면 [이 이슈](https://github.com/facebook/react/issues/13991)에 댓글을 달아 주시면 도와드리겠습니다. 작은 재현 예제를 만들어 보십시오 — 그렇게 하면서 문제를 발견할 수 있습니다.