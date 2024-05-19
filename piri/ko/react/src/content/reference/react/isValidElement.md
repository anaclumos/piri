---
title: isValidElement
---

<Intro>

`isValidElement`는 값이 React 요소인지 확인합니다.

```js
const isElement = isValidElement(value)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `isValidElement(value)` {/*isvalidelement*/}

`isValidElement(value)`를 호출하여 `value`가 React 요소인지 확인합니다.

```js
import { isValidElement, createElement } from 'react';

// ✅ React 요소
console.log(isValidElement(<p />)); // true
console.log(isValidElement(createElement('p'))); // true

// ❌ React 요소가 아님
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `value`: 확인하려는 `value`. 모든 타입의 값이 될 수 있습니다.

#### 반환값 {/*returns*/}

`isValidElement`는 `value`가 React 요소인 경우 `true`를 반환합니다. 그렇지 않으면 `false`를 반환합니다.

#### 주의사항 {/*caveats*/}

* **오직 [JSX 태그](/learn/writing-markup-with-jsx)와 [`createElement`](/reference/react/createElement)로 반환된 객체만이 React 요소로 간주됩니다.** 예를 들어, `42`와 같은 숫자는 유효한 React *노드*이지만 (컴포넌트에서 반환될 수 있음), 유효한 React 요소는 아닙니다. [`createPortal`](/reference/react-dom/createPortal)로 생성된 배열과 포털도 React 요소로 간주되지 않습니다.

---

## 사용법 {/*usage*/}

### 어떤 것이 React 요소인지 확인하기 {/*checking-if-something-is-a-react-element*/}

어떤 값이 *React 요소*인지 확인하려면 `isValidElement`를 호출하세요.

React 요소는 다음과 같습니다:

- [JSX 태그](/learn/writing-markup-with-jsx)로 생성된 값
- [`createElement`](/reference/react/createElement)를 호출하여 생성된 값

React 요소의 경우, `isValidElement`는 `true`를 반환합니다:

```js
import { isValidElement, createElement } from 'react';

// ✅ JSX 태그는 React 요소입니다
console.log(isValidElement(<p />)); // true
console.log(isValidElement(<MyComponent />)); // true

// ✅ createElement로 반환된 값은 React 요소입니다
console.log(isValidElement(createElement('p'))); // true
console.log(isValidElement(createElement(MyComponent))); // true
```

문자열, 숫자, 임의의 객체 및 배열과 같은 다른 값은 React 요소가 아닙니다.

이 경우, `isValidElement`는 `false`를 반환합니다:

```js
// ❌ 이들은 *React 요소가 아닙니다*
console.log(isValidElement(null)); // false
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
console.log(isValidElement([<div />, <div />])); // false
console.log(isValidElement(MyComponent)); // false
```

`isValidElement`가 필요한 경우는 매우 드뭅니다. 주로 다른 API가 *오직* 요소만을 허용할 때 (예: [`cloneElement`](/reference/react/cloneElement)) 인수로 전달된 값이 React 요소가 아닐 때 오류를 피하고자 할 때 유용합니다.

`isValidElement` 검사를 추가할 매우 구체적인 이유가 없다면, 아마도 필요하지 않을 것입니다.

<DeepDive>

#### React 요소 vs React 노드 {/*react-elements-vs-react-nodes*/}

컴포넌트를 작성할 때, 어떤 종류의 *React 노드*도 반환할 수 있습니다:

```js
function MyComponent() {
  // ... 어떤 React 노드도 반환할 수 있습니다 ...
}
```

React 노드는 다음과 같습니다:

- `<div />` 또는 `createElement('div')`로 생성된 React 요소
- [`createPortal`](/reference/react-dom/createPortal)로 생성된 포털
- 문자열
- 숫자
- `true`, `false`, `null`, 또는 `undefined` (표시되지 않음)
- 다른 React 노드의 배열

**`isValidElement`는 인수가 *React 요소*인지 확인합니다, React 노드인지 확인하는 것이 아닙니다.** 예를 들어, `42`는 유효한 React 요소가 아닙니다. 그러나, 이는 완벽하게 유효한 React 노드입니다:

```js
function MyComponent() {
  return 42; // 컴포넌트에서 숫자를 반환하는 것은 괜찮습니다
}
```

이것이 `isValidElement`를 사용하여 무언가가 렌더링될 수 있는지 확인하는 방법으로 사용해서는 안 되는 이유입니다.

</DeepDive>