---
title: React 규칙
---

<Intro>
마치 다른 프로그래밍 언어들이 개념을 표현하는 고유한 방식이 있는 것처럼, React도 이해하기 쉽고 고품질의 애플리케이션을 만들 수 있는 패턴을 표현하는 고유한 규칙이 있습니다.
</Intro>

<InlineToc />

---

<Note>
React로 UI를 표현하는 방법에 대해 더 알고 싶다면 [Thinking in React](/learn/thinking-in-react)을 읽어보는 것을 추천합니다.
</Note>

이 섹션에서는 관용적인 React 코드를 작성하기 위해 따라야 할 규칙들을 설명합니다. 관용적인 React 코드를 작성하면 잘 조직되고, 안전하며, 구성 가능한 애플리케이션을 작성할 수 있습니다. 이러한 특성들은 애플리케이션을 변경에 더 강하게 만들고 다른 개발자, 라이브러리, 도구와 함께 작업하기 쉽게 만듭니다.

이 규칙들은 **React의 규칙**으로 알려져 있습니다. 이들은 단순한 지침이 아니라 규칙입니다. 이 규칙을 어기면 애플리케이션에 버그가 생길 가능성이 높습니다. 또한 코드가 비관용적이 되어 이해하고 논리적으로 생각하기 어려워집니다.

React의 [ESLint 플러그인](https://www.npmjs.com/package/eslint-plugin-react-hooks)과 함께 [Strict Mode](/reference/react/StrictMode)를 사용하는 것을 강력히 추천합니다. React의 규칙을 따르면 이러한 버그를 찾아내고 해결하여 애플리케이션을 유지 관리할 수 있습니다.

---

## 컴포넌트와 Hooks는 순수해야 합니다 {/*components-and-hooks-must-be-pure*/}

[컴포넌트와 Hooks의 순수성](/reference/rules/components-and-hooks-must-be-pure)은 애플리케이션을 예측 가능하게 만들고, 디버그를 쉽게 하며, React가 코드를 자동으로 최적화할 수 있게 해주는 중요한 규칙입니다.

* [컴포넌트는 멱등성을 가져야 합니다](/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent) – React 컴포넌트는 항상 입력값 – props, state, context –에 대해 동일한 출력을 반환한다고 가정합니다.
* [부수 효과는 렌더링 외부에서 실행되어야 합니다](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render) – 부수 효과는 렌더링에서 실행되지 않아야 합니다. React는 최상의 사용자 경험을 제공하기 위해 컴포넌트를 여러 번 렌더링할 수 있습니다.
* [Props와 state는 불변입니다](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable) – 컴포넌트의 props와 state는 단일 렌더링에 대해 불변 스냅샷입니다. 이를 직접 변경하지 마세요.
* [Hooks의 반환값과 인수는 불변입니다](/reference/rules/components-and-hooks-must-be-pure#return-values-and-arguments-to-hooks-are-immutable) – 값이 Hook에 전달되면 이를 수정하지 마세요. JSX의 props처럼, 값은 Hook에 전달되면 불변이 됩니다.
* [JSX에 전달된 후 값은 불변입니다](/reference/rules/components-and-hooks-must-be-pure#values-are-immutable-after-being-passed-to-jsx) – JSX에 사용된 후 값을 변경하지 마세요. 변경은 JSX가 생성되기 전에 수행하세요.

---

## React는 컴포넌트와 Hooks를 호출합니다 {/*react-calls-components-and-hooks*/}

[React는 사용자 경험을 최적화하기 위해 필요할 때 컴포넌트와 Hooks를 렌더링합니다.](/reference/rules/react-calls-components-and-hooks) React는 선언적입니다: 컴포넌트의 로직에서 무엇을 렌더링할지 React에 지시하면, React는 사용자에게 가장 잘 보여줄 방법을 찾아냅니다.

* [컴포넌트 함수를 직접 호출하지 마세요](/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly) – 컴포넌트는 JSX에서만 사용해야 합니다. 이를 일반 함수처럼 호출하지 마세요.
* [Hooks를 일반 값처럼 전달하지 마세요](/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values) – Hooks는 컴포넌트 내부에서만 호출되어야 합니다. 이를 일반 값처럼 전달하지 마세요.

---

## Hooks의 규칙 {/*rules-of-hooks*/}

Hooks는 JavaScript 함수로 정의되지만, 호출할 수 있는 위치에 제한이 있는 특별한 유형의 재사용 가능한 UI 로직을 나타냅니다. Hooks를 사용할 때는 [Hooks의 규칙](/reference/rules/rules-of-hooks)을 따라야 합니다.

* [Hooks는 최상위에서만 호출하세요](/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level) – Hooks를 루프, 조건문, 중첩 함수 내에서 호출하지 마세요. 대신, 항상 React 함수의 최상위에서, 조기 반환 전에 Hooks를 사용하세요.
* [Hooks는 React 함수에서만 호출하세요](/reference/rules/rules-of-hooks#only-call-hooks-from-react-functions) – Hooks를 일반 JavaScript 함수에서 호출하지 마세요.