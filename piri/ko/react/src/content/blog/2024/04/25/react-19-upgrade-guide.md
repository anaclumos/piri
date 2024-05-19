---
title: React 19 베타 업그레이드 가이드
author: Ricky Hanlon
date: 2024/04/25
description: React 19에 추가된 개선 사항은 몇 가지 중대한 변경을 필요로 하지만, 업그레이드를 최대한 원활하게 만들기 위해 노력했으며 대부분의 앱에 영향을 미치지 않을 것으로 예상합니다. 이 게시물에서는 라이브러리를 React 19 베타로 업그레이드하는 단계를 안내해 드리겠습니다.
---

2024년 4월 25일 작성자: [Ricky Hanlon](https://twitter.com/rickhanlonii)

---

<Note>

이 베타 릴리스는 라이브러리가 React 19에 대비할 수 있도록 하기 위한 것입니다. 앱 개발자는 18.3.0으로 업그레이드하고, 우리가 라이브러리와 협력하고 피드백을 기반으로 변경 사항을 적용하는 동안 React 19 안정 버전을 기다려야 합니다.

</Note>

<Intro>

React 19에 추가된 개선 사항은 몇 가지 중단적인 변경을 요구하지만, 업그레이드를 최대한 원활하게 만들기 위해 노력했으며 대부분의 앱에 영향을 미치지 않을 것으로 예상합니다.

업그레이드를 더 쉽게 하기 위해 오늘 React 18.3도 발표합니다.

</Intro>

<Note>

#### React 18.3도 발표되었습니다 {/*react-18-3*/}

React 19로의 업그레이드를 더 쉽게 하기 위해, 18.2와 동일하지만 React 19에 필요한 API 사용 중단 경고 및 기타 변경 사항을 추가한 `react@18.3` 릴리스를 발표했습니다.

React 19로 업그레이드하기 전에 문제를 식별하는 데 도움이 되도록 먼저 React 18.3으로 업그레이드하는 것을 권장합니다.

18.3의 변경 사항 목록은 [릴리스 노트](https://github.com/facebook/react/blob/main/CHANGELOG.md)를 참조하세요.

</Note>

이 게시물에서는 라이브러리를 React 19 베타로 업그레이드하는 단계에 대해 안내합니다:

- [설치](#installing)
- [중단적인 변경 사항](#breaking-changes)
- [새로운 사용 중단](#new-deprecations)
- [주요 변경 사항](#notable-changes)
- [TypeScript 변경 사항](#typescript-changes)
- [변경 로그](#changelog)

React 19를 테스트하는 데 도움을 주고 싶다면 이 업그레이드 가이드의 단계를 따르고 [발생하는 문제를 보고](https://github.com/facebook/react/issues/new?assignees=&labels=React+19&projects=&template=19.md&title=%5BReact+19%5D)하세요. React 19 베타에 추가된 새로운 기능 목록은 [React 19 릴리스 게시물](/blog/2024/04/25/react-19)을 참조하세요.

---
## 설치 {/*installing*/}

<Note>

#### 새로운 JSX 변환이 이제 필요합니다 {/*new-jsx-transform-is-now-required*/}

2020년에 번들 크기를 줄이고 React를 가져오지 않고 JSX를 사용할 수 있도록 [새로운 JSX 변환](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)을 도입했습니다. React 19에서는 prop으로 ref를 사용하는 것과 JSX 속도 개선과 같은 추가 개선 사항을 추가하고 있으며, 이는 새로운 변환이 필요합니다.

새로운 변환이 활성화되지 않으면 다음 경고가 표시됩니다:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

앱(또는 그 종속성 중 하나)이 오래된 JSX 변환을 사용하고 있습니다. 더 빠른 성능을 위해 최신 JSX 변환으로 업데이트하세요: https://react.dev/link/new-jsx-transform

</ConsoleLogLine>

</ConsoleBlockMulti>

대부분의 앱은 이미 대부분의 환경에서 변환이 활성화되어 있으므로 영향을 받지 않을 것으로 예상합니다. 수동 업그레이드 지침은 [발표 게시물](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)을 참조하세요.

</Note>

최신 버전의 React와 React DOM을 설치하려면:

```bash
npm install react@beta react-dom@beta
```

TypeScript를 사용하는 경우, 타입도 업데이트해야 합니다. React 19가 안정 버전으로 출시되면, `@types/react`와 `@types/react-dom`에서 일반적으로 타입을 설치할 수 있습니다. 베타 기간 동안 타입은 다른 패키지에서 사용할 수 있으며 `package.json`에서 강제해야 합니다:

```json
{
  "dependencies": {
    "@types/react": "npm:types-react@beta",
    "@types/react-dom": "npm:types-react-dom@beta"
  },
  "overrides": {
    "@types/react": "npm:types-react@beta",
    "@types/react-dom": "npm:types-react-dom@beta"
  }
}
```

가장 일반적인 대체를 위한 codemod도 포함하고 있습니다. 아래의 [TypeScript 변경 사항](#typescript-changes)을 참조하세요.

## 중단적인 변경 사항 {/*breaking-changes*/}

### 렌더링 중 오류가 다시 발생하지 않음 {/*errors-in-render-are-not-re-thrown*/}

이전 버전의 React에서는 렌더링 중 발생한 오류가 포착되고 다시 발생했습니다. DEV에서는 `console.error`에 로그를 기록하여 중복 오류 로그가 발생했습니다.

React 19에서는 중복을 줄이기 위해 오류를 다시 발생시키지 않도록 [오류 처리 방식을 개선](/blog/2024/04/25/react-19#error-handling)했습니다:

- **포착되지 않은 오류**: 오류 경계에 의해 포착되지 않은 오류는 `window.reportError`에 보고됩니다.
- **포착된 오류**: 오류 경계에 의해 포착된 오류는 `console.error`에 보고됩니다.

이 변경 사항은 대부분의 앱에 영향을 미치지 않지만, 프로덕션 오류 보고가 오류가 다시 발생하는 것에 의존하는 경우 오류 처리를 업데이트해야 할 수 있습니다. 이를 지원하기 위해 `createRoot`와 `hydrateRoot`에 사용자 정의 오류 처리를 위한 새로운 메서드를 추가했습니다:

```js [[1, 2, "onUncaughtError"], [2, 5, "onCaughtError"]]
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    // ... 오류 보고 로그
  },
  onCaughtError: (error, errorInfo) => {
    // ... 오류 보고 로그
  }
});
```

자세한 내용은 [`createRoot`](https://react.dev/reference/react-dom/client/createRoot) 및 [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot) 문서를 참조하세요.

### 사용 중단된 React API 제거 {/*removed-deprecated-react-apis*/}

#### 제거됨: 함수의 `propTypes` 및 `defaultProps` {/*removed-proptypes-and-defaultprops*/}
`PropTypes`는 [2017년 4월 (v15.5.0)](https://legacy.reactjs.org/blog/2017/04/07/react-v15.5.0.html#new-deprecation-warnings)에 사용 중단되었습니다.

React 19에서는 React 패키지에서 `propType` 검사를 제거하고, 이를 사용하는 것은 조용히 무시됩니다. `propTypes`를 사용하는 경우 TypeScript 또는 다른 타입 검사 솔루션으로 마이그레이션하는 것을 권장합니다.

또한 함수 컴포넌트에서 `defaultProps`를 ES6 기본 매개변수로 대체하여 제거하고 있습니다. 클래스 컴포넌트는 ES6 대안이 없기 때문에 계속해서 `defaultProps`를 지원합니다.

```js
// 이전
import PropTypes from 'prop-types';

function Heading({text}) {
  return <h1>{text}</h1>;
}
Heading.propTypes = {
  text: PropTypes.string,
};
Heading.defaultProps = {
  text: 'Hello, world!',
};
```
```ts
// 이후
interface Props {
  text?: string;
}
function Heading({text = 'Hello, world!'}: Props) {
  return <h1>{text}</h1>;
}
```

#### 제거됨: `contextTypes` 및 `getChildContext`를 사용하는 레거시 컨텍스트 {/*removed-removing-legacy-context*/}

레거시 컨텍스트는 [2018년 10월 (v16.6.0)](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html)에 사용 중단되었습니다.

레거시 컨텍스트는 클래스 컴포넌트에서만 `contextTypes` 및 `getChildContext` API를 사용하여 사용할 수 있었으며, 미묘한 버그로 인해 `contextType`으로 대체되었습니다. React 19에서는 React를 약간 더 작고 빠르게 만들기 위해 레거시 컨텍스트를 제거하고 있습니다.

클래스 컴포넌트에서 여전히 레거시 컨텍스트를 사용하는 경우, 새로운 `contextType` API로 마이그레이션해야 합니다:

```js {5-11,19-21}
// 이전
import PropTypes from 'prop-types';

class Parent extends React.Component {
  static childContextTypes = {
    foo: PropTypes.string.isRequired,
  };

  getChildContext() {
    return { foo: 'bar' };
  }

  render() {
    return <Child />;
  }
}

class Child extends React.Component {
  static contextTypes = {
    foo: PropTypes.string.isRequired,
  };

  render() {
    return <div>{this.context.foo}</div>;
  }
}
```

```js {2,7,9,15}
// 이후
const FooContext = React.createContext();

class Parent extends React.Component {
  render() {
    return (
      <FooContext value='bar'>
        <Child />
      </FooContext>
    );
  }
}

class Child extends React.Component {
  static contextType = FooContext;

  render() {
    return <div>{this.context}</div>;
  }
}
```

#### 제거됨: 문자열 refs {/*removed-string-refs*/}
문자열 refs는 [2018년 3월 (v16.3.0)](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html)에 사용 중단되었습니다.

클래스 컴포넌트는 [여러 단점](https://github.com/facebook/react/issues/1373)으로 인해 ref 콜백으로 대체되기 전에 문자열 refs를 지원했습니다. React 19에서는 React를 더 간단하고 이해하기 쉽게 만들기 위해 문자열 refs를 제거하고 있습니다.

클래스 컴포넌트에서 여전히 문자열 refs를 사용하는 경우, ref 콜백으로 마이그레이션해야 합니다:

```js {4,8}
// 이전
class MyComponent extends React.Component {
  componentDidMount() {
    this.refs.input.focus();
  }

  render() {
    return <input ref='input' />;
  }
}
```

```js {4,8}
// 이후
class MyComponent extends React.Component {
  componentDidMount() {
    this.input.focus();
  }

  render() {
    return <input ref={input => this.input = input} />;
  }
}
```

<Note>

마이그레이션을 돕기 위해 문자열 refs를 `ref` 콜백으로 자동으로 대체하는 [react-codemod](https://github.com/reactjs/react-codemod/#string-refs)를 게시할 예정입니다. 업데이트를 팔로우하고 시도하려면 [이 PR](https://github.com/reactjs/react-codemod/pull/309)을 참조하세요.

</Note>

#### 제거됨: 모듈 패턴 팩토리 {/*removed-module-pattern-factories*/}
모듈 패턴 팩토리는 [2019년 8월 (v16.9.0)](https://legacy.reactjs.org/blog/2019/08/08/react-v16.9.0.html#deprecating-module-pattern-factories)에 사용 중단되었습니다.

이 패턴은 거의 사용되지 않았으며, 이를 지원하는 것은 React를 약간 더 크고 느리게 만듭니다. React 19에서는 모듈 패턴 팩토리 지원을 제거하고, 정규 함수로 마이그레이션해야 합니다:

```js
// 이전
function FactoryComponent() {
  return { render() { return <div />; } }
}
```

```js
// 이후
function FactoryComponent() {
  return <div />;
}
```

#### 제거됨: `React.createFactory` {/*removed-createfactory*/}
`createFactory`는 [2020년 2월 (v16.13.0)](https://legacy.reactjs.org/blog/2020/02/26/react-v16.13.0.html#deprecating-createfactory)에 사용 중단되었습니다.

`createFactory`를 사용하는 것은 JSX에 대한 광범위한 지원 이전에 일반적이었지만, 오늘날에는 거의 사용되지 않으며 JSX로 대체할 수 있습니다. React 19에서는 `createFactory`를 제거하고 JSX로 마이그레이션해야 합니다:

```js
// 이전
import { createFactory } from 'react';

const button = createFactory('button');
```

```js
// 이후
const button = <button />;
```

#### 제거됨: `react-test-renderer/shallow` {/*removed-react-test-renderer-shallow*/}

React 18에서는 `react-test-renderer/shallow`를 [react-shallow-renderer](https://github.com/enzymejs/react-shallow-renderer)를 다시 내보내도록 업데이트했습니다. React 19에서는 `react-test-render/shallow`를 제거하여 패키지를 직접 설치하는 것을 선호합니다:

```bash
npm install react-shallow-renderer --save-dev
```
```diff
- import ShallowRenderer from 'react-test-renderer/shallow';
+ import ShallowRenderer from 'react-shallow-renderer';
```

<Note>

##### 얕은 렌더링을 재고하세요 {/*please-reconsider-shallow-rendering*/}

얕은 렌더링은 React 내부에 의존하며 향후 업그레이드를 방해할 수 있습니다. 테스트를 [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) 또는 [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/getting-started)로 마이그레이션하는 것을 권장합니다.

</Note>

### 사용 중단된 React DOM API 제거 {/*removed-deprecated-react-dom-apis*/}

#### 제거됨: `react-dom/test-utils` {/*removed-react-dom-test-utils*/}

`act`를 `react-dom/test-utils`에서 `react` 패키지로 이동했습니다:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

`ReactDOMTestUtils.act`는 `React.act`를 선호하여 사용 중단되었습니다. `react-dom/test-utils` 대신 `react`에서 `act`를 가져오세요. 자세한 내용은 https://react.dev/warnings/react-dom-test-utils를 참조하세요.

</ConsoleLogLine>

</ConsoleBlockMulti>

이 경고를 수정하려면 `react`에서 `act`를 가져올 수 있습니다:

```diff
- import {act} from 'react-dom/test-utils'
+ import {act} from 'react';
```

다른 모든 `test-utils` 함수는 제거되었습니다. 이러한 유틸리티는 드물게 사용되었으며, 구성 요소와 React의 저수준 구현 세부 사항에 의존하기 너무 쉬웠습니다. React 19에서는 이러한 함수가 호출될 때 오류가 발생하며, 향후 버전에서 내보내기가 제거될 것입니다.

대안은 [경고 페이지](https://react.dev/warnings/react-dom-test-utils)를 참조하세요.

#### 제거됨: `ReactDOM.render` {/*removed-reactdom-render*/}

`ReactDOM.render`는 [2022년 3월 (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)에 사용 중단되었습니다. React 19에서는 `ReactDOM.render`를 제거하고 [`ReactDOM.createRoot`](https://react.dev/reference/react-dom/client/createRoot)를 사용하여 마이그레이션해야 합니다:

```js
// 이전
import {render} from 'react-dom';
render(<App />, document.getElementById('root'));

// 이후
import {createRoot} from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

#### 제거됨: `ReactDOM.hydrate` {/*removed-reactdom-hydrate*/}

`ReactDOM.hydrate`는 [2022년 3월 (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)에 사용 중단되었습니다. React 19에서는 `ReactDOM.hydrate`를 제거하고 [`ReactDOM.hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot)를 사용하여 마이그레이션해야 합니다,

```js
// 이전
import {hydrate} from 'react-dom';
hydrate(<App />, document.getElementById('root'));

// 이후
import {hydrateRoot} from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);
```

#### 제거됨: `unmountComponentAtNode` {/*removed-unmountcomponentatnode*/}

`ReactDOM.unmountComponentAtNode`는 [2022년 3월 (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)에 사용 중단되었습니다. React 19에서는 `root.unmount()`를 사용하여 마이그레이션해야 합니다.

```js
// 이전
unmountComponentAtNode(document.getElementById('root'));

// 이후
root.unmount();
```

자세한 내용은 [`createRoot`](https://react.dev/reference/react-dom/client/createRoot#root-unmount) 및 [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot#root-unmount)의 `root.unmount()`를 참조하세요.

#### 제거됨: `ReactDOM.findDOMNode` {/*removed-reactdom-finddomnode*/}
`ReactDOM.findDOMNode`는 [2018년 10월 (v16.6.0)](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html#deprecations-in-strictmode)에 사용 중단되었습니다.

`findDOMNode`는 첫 번째 자식만 반환하고, 추상화 수준을 깨뜨리며, 느리게 실행되고, 리팩토링에 취약한 레거시 탈출구였기 때문에 제거하고 있습니다(자세한 내용은 [여기](https://legacy.reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)를 참조하세요). `ReactDOM.findDOMNode`를 [DOM refs](/learn/manipulating-the-dom-with-refs)로 대체할 수 있습니다:

```js
// 이전
import {findDOMNode} from 'react-dom';

function AutoselectingInput() {
  useEffect(() => {
    const input = findDOMNode(this);
    input.select()
  }, []);

  return <input defaultValue="Hello" />;
}
```

```js
//// 이후
function AutoselectingInput() {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.select();
  }, []);

  return <input ref={ref} defaultValue="Hello" />
}
```

## 새로운 사용 중단 {/*new-deprecations*/}

### 사용 중단됨: `element.ref` {/*deprecated-element-ref*/}

React 19는 [`ref`를 prop으로 지원](/blog/2024/04/25/react-19#ref-as-a-prop)하므로, `element.props.ref` 대신 `element.ref`를 사용 중단합니다.

`element.ref`에 접근하면 경고가 표시됩니다:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

element.ref에 접근하는 것은 더 이상 지원되지 않습니다. ref는 이제 일반 prop입니다. 향후 릴리스에서 JSX Element 타입에서 제거될 것입니다.

</ConsoleLogLine>

</ConsoleBlockMulti>

### 사용 중단됨: `react-test-renderer` {/*deprecated-react-test-renderer*/}

`react-test-renderer`는 자체 렌더러 환경을 구현하여 사용자가 사용하는 환경과 일치하지 않으며, 구현 세부 사항을 테스트하도록 장려하고, React의 내부를 조사하는 데 의존하기 때문에 사용 중단됩니다.

테스트 렌더러는 [React Testing Library](https://testing-library.com)와 같은 더 실행 가능한 테스트 전략이 사용 가능하기 전에 만들어졌으며, 이제는 현대적인 테스트 라이브러리를 사용하는 것을 권장합니다.

React 19에서는 `react-test-renderer`가 사용 중단 경고를 기록하고, 동시 렌더링으로 전환되었습니다. 테스트를 [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) 또는 [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/getting-started)로 마이그레이션하는 것을 권장합니다.

## 주요 변경 사항 {/*notable-changes*/}

### StrictMode 변경 사항 {/*strict-mode-improvements*/}

React 19에는 Strict Mode에 대한 여러 수정 및 개선 사항이 포함되어 있습니다.

개발 중 Strict Mode에서 이중 렌더링할 때, `useMemo` 및 `useCallback`은 두 번째 렌더링 동안 첫 번째 렌더링의 메모이제이션 결과를 재사용합니다. 이미 Strict Mode와 호환되는 구성 요소는 동작의 차이를 느끼지 못할 것입니다.

모든 Strict Mode 동작과 마찬가지로, 이러한 기능은 개발 중 구성 요소의 버그를 사전에 발견하여 프로덕션에 배포되기 전에 수정할 수 있도록 설계되었습니다. 예를 들어, 개발 중 Strict Mode는 초기 마운트 시 ref 콜백 함수를 두 번 호출하여 마운트된 구성 요소가 Suspense 폴백으로 대체될 때 발생하는 상황을 시뮬레이션합니다.

### UMD 빌드 제거 {/*umd-builds-removed*/}

UMD는 빌드 단계 없이 React를 로드하는 편리한 방법으로 과거에 널리 사용되었습니다. 이제 HTML 문서에서 모듈을 스크립트로 로드하는 현대적인 대안이 있습니다. React 19부터 React는 테스트 및 릴리스 프로세스의 복잡성을 줄이기 위해 더 이상 UMD 빌드를 생성하지 않습니다.

스크립트 태그로 React 19를 로드하려면 [esm.sh](https://esm.sh/)와 같은 ESM 기반 CDN을 사용하는 것을 권장합니다.

```html
<script type="module">
  import React from "https://esm.sh/react@19/?dev"
  import ReactDOMClient from "https://esm.sh/react-dom@19/client?dev"
  ...
</script>
```

### React 내부에 의존하는 라이브러리는 업그레이드를 방해할 수 있음 {/*libraries-depending-on-react-internals-may-block-upgrades*/}

이 릴리스에는 React 19의 개선 사항을 적용하기 위해 필요한 React 내부 변경 사항이 포함되어 있으며, `SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`와 같은 내부를 사용하는 라이브러리에 영향을 미칠 수 있습니다. 이러한 변경 사항은 가이드라인을 따르는 라이브러리에는 영향을 미치지 않습니다.

[버전 관리 정책](https://react.dev/community/versioning-policy#what-counts-as-a-breaking-change)에 따라 이러한 업데이트는 중단적인 변경 사항으로 나열되지 않으며, 업그레이드 방법에 대한 문서를 포함하지 않습니다. 내부에 의존하는 코드를 제거하는 것이 권장됩니다.

내부 사용의 영향을 반영하기 위해 `SECRET_INTERNALS` 접미사를 다음과 같이 변경했습니다:

`_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE`

향후 React 내부에 접근하는 것을 더 적극적으로 차단하여 사용을 방지하고 사용자가 업그레이드를 방해하지 않도록 할 것입니다.

## TypeScript 변경 사항 {/*typescript-changes*/}

### 사용 중단된 TypeScript 타입 제거 {/*removed-deprecated-typescript-types*/}

React 19에서 제거된 API를 기반으로 TypeScript 타입을 정리했습니다. 일부 제거된 타입은 더 관련성 있는 패키지로 이동되었으며, 다른 일부는 React의 동작을 설명하는 데 더 이상 필요하지 않습니다.

<Note>
대부분의 타입 관련 중단적인 변경 사항을 마이그레이션하기 위해 [`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/)를 게시했습니다:

```bash
npx types-react-codemod@latest preset-19 ./path-to-app
```

`element.props`에 대한 많은 불안정한 접근이 있는 경우, 추가 codemod를 실행할 수 있습니다:

```bash
npx types-react-codemod@latest react-element-default-any-props ./path-to-your-react-ts-files
```

</Note>

지원되는 대체 목록은 [`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/)를 참조하세요. 누락된 codemod가 있다고 생각되면 [누락된 React 19 codemod 목록](https://github.com/eps1lon/types-react-codemod/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22React+19%22+label%3Aenhancement)에서 추적할 수 있습니다.

### `ref` 정리가 필요함 {/*ref-cleanup-required*/}

_이 변경 사항은 [`no-implicit-ref-callback-return`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return)으로 `react-19` codemod 프리셋에 포함되어 있습니다._

ref 정리 함수 도입으로 인해, 이제 ref 콜백에서 다른 것을 반환하는 것은 TypeScript에 의해 거부됩니다. 수정 방법은 일반적으로 암시적 반환을 중지하는 것입니다:

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

원래 코드는 `HTMLDivElement`의 인스턴스를 반환했으며, TypeScript는 이것이 정리 함수인지 아닌지 알 수 없었습니다.

### `useRef`는 인수를 필요로 함 {/*useref-requires-argument*/}

_이 변경 사항은 [`refobject-defaults`](https://github.com/eps1lon/types-react-codemod/#refobject-defaults)로 `react-19` codemod 프리셋에 포함되어 있습니다._

TypeScript와 React의 작동 방식에 대한 오랜 불만은 `useRef`였습니다. 타입을 변경하여 이제 `useRef`가 인수를 필요로 합니다. 이는 타입 시그니처를 크게 단순화합니다. 이제 `createContext`와 더 유사하게 동작합니다.

```ts
// @ts-expect-error: 인수가 없지만 하나가 필요합니다
useRef();
// 통과
useRef(undefined);
// @ts-expect-error: 인수가 없지만 하나가 필요합니다
createContext();
// 통과
createContext(undefined);
```

이제 모든 ref가 변경 가능하다는 의미도 있습니다. `null`로 초기화했기 때문에 ref를 변경할 수 없는 문제에 더 이상 직면하지 않습니다:

```ts
const ref = useRef<number>(null);

// 'current'에 할당할 수 없습니다. 읽기 전용 속성입니다.
ref.current = 1;
```

`MutableRef`는 이제 `useRef`가 항상 반환하는 단일 `RefObject` 타입을 선호하여 사용 중단되었습니다:

```ts
interface RefObject<T> {
  current: T
}

declare function useRef<T>: RefObject<T>
```

`useRef`는 `useRef<T>(null)`에 대한 편의 오버로드를 여전히 가지고 있으며, 이는 자동으로 `RefObject<T | null>`을 반환합니다. `useRef`에 대한 필수 인수로 인해 마이그레이션을 용이하게 하기 위해 `useRef(undefined)`에 대한 편의 오버로드가 추가되어 자동으로 `RefObject<T | undefined>`를 반환합니다.

이 변경 사항에 대한 이전 논의는 [[RFC] 모든 ref를 변경 가능하게 만들기](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/64772)를 참조하세요.

### `ReactElement` TypeScript 타입의 변경 사항 {/*changes-to-the-reactelement-typescript-type*/}

_이 변경 사항은 [`react-element-default-any-props`](https://github.com/eps1lon/types-react-codemod#react-element-default-any-props) codemod에 포함되어 있습니다._

React 요소의 `props`는 이제 `ReactElement`로 타입이 지정된 경우 `any` 대신 `unknown`을 기본값으로 합니다. 이는 요소에 타입 인수를 전달하는 경우에는 영향을 미치지 않습니다:

```ts
type Example2 = ReactElement<{ id: string }>["props"];
//   ^? { id: string }
```

그러나 기본값에 의존하는 경우, 이제 `unknown`을 처리해야 합니다:

```ts
type Example = ReactElement["props"];
//   ^? 이전에는 'any'였지만, 이제는 'unknown'입니다.
```

많은 레거시 코드가 요소 props의 불안정한 접근에 의존하는 경우에만 필요합니다. 요소 내성은 탈출구로만 존재하며, props 접근이 불안정하다는 것을 명시적으로 `any`로 표시해야 합니다.

### TypeScript의 JSX 네임스페이스 {/*the-jsx-namespace-in-typescript*/}
이 변경 사항은 [`scoped-jsx`](https://github.com/eps1lon/types-react-codemod#scoped-jsx)로 `react-19` codemod 프리셋에 포함되어 있습니다.

오랜 요청은 타입에서 글로벌 `JSX` 네임스페이스를 제거하고 `React.JSX`를 선호하는 것이었습니다. 이는 글로벌 타입의 오염을 방지하여 JSX를 활용하는 다른 UI 라이브러리 간의 충돌을 방지합니다.

이제 JSX 네임스페이스의 모듈 확장을 `declare module "...."`로 래핑해야 합니다:

```diff
// global.d.ts
+ declare module "react" {
    namespace JSX {
      interface IntrinsicElements {
        "my-element": {
          myElementProps: string;
        };
      }
    }
+ }
```

정확한 모듈 지정자는 `tsconfig.json`의 `compilerOptions`에서 지정한 JSX 런타임에 따라 다릅니다:

- `"jsx": "react-jsx"`의 경우 `react/jsx-runtime`입니다.
- `"jsx": "react-jsxdev"`의 경우 `react/jsx-dev-runtime`입니다.
- `"jsx": "react"` 및 `"jsx": "preserve"`의 경우 `react`입니다.

### `useReducer` 타이핑 개선 {/*better-usereducer-typings*/}

`useReducer`는 [@mfp22](https://github.com/mfp22) 덕분에 타입 추론이 개선되었습니다.

그러나 이는 `useReducer`가 전체 리듀서 타입을 타입 매개변수로 허용하지 않고 대신 상태 및 액션 타입을 모두 필요로 하는 중단적인 변경을 요구했습니다.

새로운 모범 사례는 `useReducer`에 타입 인수를 전달하지 않는 것입니다.
```diff
- useReducer<React.Reducer<State, Action>>(reducer)
+ useReducer(reducer)
```
이는 상태 및 액션을 명시적으로 타입 지정해야 하는 경우에는 작동하지 않을 수 있습니다. 이 경우 `Action`을 튜플로 전달하여 명시적으로 타입 지정할 수 있습니다:
```diff
- useReducer<React.Reducer<State, Action>>(reducer)
+ useReducer<State, [Action]>(reducer)
```
리듀서를 인라인으로 정의하는 경우, 함수 매개변수를 주석으로 달아야 합니다:
```diff
- useReducer<React.Reducer<State, Action>>((state, action) => state)
+ useReducer((state: State, action: Action) => state)
```
이는 `useReducer` 호출 외부로 리듀서를 이동하는 경우에도 동일합니다:

```ts
const reducer = (state: State, action: Action) => state;
```

## 변경 로그 {/*changelog*/}

### 기타 중단적인 변경 사항 {/*other-breaking-changes*/}

- **react-dom**: src/href의 자바스크립트 URL에 대한 오류 [#26507](https://github.com/facebook/react/pull/26507)
- **react-dom**: `onRecoverableError`에서 `errorInfo.digest` 제거 [#28222](https://github.com/facebook/react/pull/28222)
- **react-dom**: `unstable_flushControlled` 제거 [#26397](https://github.com/facebook/react/pull/26397)
- **react-dom**: `unstable_createEventHandle` 제거 [#28271](https://github.com/facebook/react/pull/28271)
- **react-dom**: `unstable_renderSubtreeIntoContainer` 제거 [#28271](https://github.com/facebook/react/pull/28271)
- **react-dom**: `unstable_runWithPrioirty` 제거 [#28271](https://github.com/facebook/react/pull/28271)
- **react-is**: `react-is`에서 사용 중단된 메서드 제거 [28224](https://github.com/facebook/react/pull/28224)

### 기타 주요 변경 사항 {/*other-notable-changes*/}

- **react**: 동기, 기본 및 연속 레인 배치 [#25700](https://github.com/facebook/react/pull/25700)
- **react**: 중단된 구성 요소의 형제 요소를 사전 렌더링하지 않음 [#26380](https://github.com/facebook/react/pull/26380)
- **react**: 렌더링 단계 업데이트로 인한 무한 업데이트 루프 감지 [#26625](https://github.com/facebook/react/pull/26625)
- **react-dom**: popstate의 전환이 이제 동기적임 [#26025](https://github.com/facebook/react/pull/26025)
- **react-dom**: SSR 중 레이아웃 효과 경고 제거 [#26395](https://github.com/facebook/react/pull/26395)
- **react-dom**: src/href에 빈 문자열을 설정하지 않도록 경고하고 설정하지 않음 (앵커 태그 제외) [#28124](https://github.com/facebook/react/pull/28124)

React 19의 안정 버전 릴리스와 함께 전체 변경 로그를 게시할 예정입니다.

---

이 게시물을 검토하고 편집해 주신 [Andrew Clark](https://twitter.com/acdlite), [Eli White](https://twitter.com/Eli_White), [Jack Pope](https://github.com/jackpope), [Jan Kassens](https://github.com/kassens), [Josh Story](https://twitter.com/joshcstory), [Matt Carroll](https://twitter.com/mattcarrollcode), [Noah Lemen](https://twitter.com/noahlemen), [Sophie Alpert](https://twitter.com/sophiebits), [Sebastian Silbermann](https://twitter.com/sebsilbermann)께 감사드립니다.