---
title: useInsertionEffect
---

<Pitfall>

`useInsertionEffect`는 CSS-in-JS 라이브러리 작성자를 위한 것입니다. CSS-in-JS 라이브러리를 작업하고 스타일을 주입할 장소가 필요한 경우가 아니라면, 아마도 [`useEffect`](/reference/react/useEffect) 또는 [`useLayoutEffect`](/reference/react/useLayoutEffect)를 원할 것입니다.

</Pitfall>

<Intro>

`useInsertionEffect`는 레이아웃 효과가 실행되기 전에 DOM에 요소를 삽입할 수 있게 합니다.

```js
useInsertionEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useInsertionEffect(setup, dependencies?)` {/*useinsertioneffect*/}

레이아웃을 읽어야 할 수 있는 효과가 실행되기 전에 스타일을 삽입하려면 `useInsertionEffect`를 호출하십시오:

```js
import { useInsertionEffect } from 'react';

// CSS-in-JS 라이브러리 내부
function useCSS(rule) {
  useInsertionEffect(() => {
    // ... 여기에 <style> 태그를 주입합니다 ...
  });
  return rule;
}
```

[아래에서 더 많은 예제를 보십시오.](#usage)

#### Parameters {/*parameters*/}

* `setup`: 효과의 로직이 담긴 함수입니다. setup 함수는 선택적으로 *정리* 함수를 반환할 수도 있습니다. 컴포넌트가 DOM에 추가되었을 때, 하지만 레이아웃 효과가 실행되기 전에, React는 setup 함수를 실행합니다. 종속성이 변경된 상태로 다시 렌더링될 때마다 React는 먼저 이전 값으로 정리 함수를 실행한 다음 새 값으로 setup 함수를 실행합니다. 컴포넌트가 DOM에서 제거되면 React는 정리 함수를 실행합니다.
 
* **optional** `dependencies`: `setup` 코드 내부에서 참조된 모든 반응형 값의 목록입니다. 반응형 값에는 props, state, 그리고 컴포넌트 본문 내부에 직접 선언된 모든 변수와 함수가 포함됩니다. 린터가 [React에 맞게 구성된 경우](/learn/editor-setup#linting), 모든 반응형 값이 종속성으로 올바르게 지정되었는지 확인합니다. 종속성 목록은 항목 수가 일정해야 하며 `[dep1, dep2, dep3]`와 같이 인라인으로 작성되어야 합니다. React는 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교 알고리즘을 사용하여 각 종속성을 이전 값과 비교합니다. 종속성을 전혀 지정하지 않으면, 컴포넌트가 다시 렌더링될 때마다 효과가 다시 실행됩니다.

#### Returns {/*returns*/}

`useInsertionEffect`는 `undefined`를 반환합니다.

#### Caveats {/*caveats*/}

* 효과는 클라이언트에서만 실행됩니다. 서버 렌더링 중에는 실행되지 않습니다.
* `useInsertionEffect` 내부에서 상태를 업데이트할 수 없습니다.
* `useInsertionEffect`가 실행될 때 refs는 아직 연결되지 않았습니다.
* `useInsertionEffect`는 DOM이 업데이트되기 전이나 후에 실행될 수 있습니다. 특정 시간에 DOM이 업데이트된다고 가정해서는 안 됩니다.
* 다른 유형의 효과와 달리, 모든 효과에 대해 정리를 실행한 다음 설정을 실행하는 것이 아니라, `useInsertionEffect`는 한 컴포넌트씩 정리와 설정을 실행합니다. 이는 정리와 설정 함수의 "교차"를 초래합니다.
---

## Usage {/*usage*/}

### CSS-in-JS 라이브러리에서 동적 스타일 주입 {/*injecting-dynamic-styles-from-css-in-js-libraries*/}

전통적으로 React 컴포넌트는 일반 CSS를 사용하여 스타일링합니다.

```js
// JS 파일에서:
<button className="success" />

// CSS 파일에서:
.success { color: green; }
```

일부 팀은 CSS 파일을 작성하는 대신 JavaScript 코드에서 직접 스타일을 작성하는 것을 선호합니다. 이는 일반적으로 CSS-in-JS 라이브러리나 도구를 사용하는 것을 필요로 합니다. CSS-in-JS에는 세 가지 일반적인 접근 방식이 있습니다:

1. 컴파일러를 사용한 CSS 파일로의 정적 추출
2. 인라인 스타일, 예: `<div style={{ opacity: 1 }}>`
3. `<style>` 태그의 런타임 주입

CSS-in-JS를 사용하는 경우, 첫 번째 두 가지 접근 방식(CSS 파일은 정적 스타일에, 인라인 스타일은 동적 스타일에)을 조합하여 사용하는 것을 권장합니다. **두 가지 이유로 런타임 `<style>` 태그 주입은 권장하지 않습니다:**

1. 런타임 주입은 브라우저가 스타일을 훨씬 더 자주 다시 계산하도록 강제합니다.
2. 런타임 주입은 React 라이프사이클의 잘못된 시점에 발생하면 매우 느릴 수 있습니다.

첫 번째 문제는 해결할 수 없지만, `useInsertionEffect`는 두 번째 문제를 해결하는 데 도움이 됩니다.

레이아웃 효과가 실행되기 전에 스타일을 삽입하려면 `useInsertionEffect`를 호출하십시오:

```js {4-11}
// CSS-in-JS 라이브러리 내부
let isInserted = new Set();
function useCSS(rule) {
  useInsertionEffect(() => {
    // 앞서 설명한 대로, 런타임 <style> 태그 주입은 권장하지 않습니다.
    // 하지만 해야 한다면, useInsertionEffect에서 하는 것이 중요합니다.
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS('...');
  return <div className={className} />;
}
```

`useEffect`와 유사하게, `useInsertionEffect`는 서버에서 실행되지 않습니다. 서버에서 사용된 CSS 규칙을 수집해야 하는 경우, 렌더링 중에 이를 수행할 수 있습니다:

```js {1,4-6}
let collectedRulesSet = new Set();

function useCSS(rule) {
  if (typeof window === 'undefined') {
    collectedRulesSet.add(rule);
  }
  useInsertionEffect(() => {
    // ...
  });
  return rule;
}
```

[런타임 주입을 `useInsertionEffect`로 업그레이드하는 CSS-in-JS 라이브러리에 대해 더 읽어보십시오.](https://github.com/reactwg/react-18/discussions/110)

<DeepDive>

#### 렌더링 중 또는 useLayoutEffect에서 스타일을 주입하는 것보다 어떻게 더 나은가요? {/*how-is-this-better-than-injecting-styles-during-rendering-or-uselayouteffect*/}

렌더링 중에 스타일을 삽입하고 React가 [비차단 업데이트](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition)를 처리하는 경우, 브라우저는 컴포넌트 트리를 렌더링하는 동안 매 프레임마다 스타일을 다시 계산하게 되어 **매우 느려질 수 있습니다.**

`useInsertionEffect`는 [`useLayoutEffect`](/reference/react/useLayoutEffect) 또는 [`useEffect`](/reference/react/useEffect) 중에 스타일을 삽입하는 것보다 낫습니다. 이는 다른 효과가 컴포넌트에서 실행될 때 `<style>` 태그가 이미 삽입되었음을 보장하기 때문입니다. 그렇지 않으면 일반 효과의 레이아웃 계산이 오래된 스타일로 인해 잘못될 수 있습니다.

</DeepDive>