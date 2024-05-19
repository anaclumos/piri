---
title: createElement
---

<Intro>

`createElement`는 React 요소를 생성할 수 있게 해줍니다. 이는 [JSX](/learn/writing-markup-with-jsx)를 작성하는 것에 대한 대안으로 사용됩니다.

```js
const element = createElement(type, props, ...children)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `createElement(type, props, ...children)` {/*createelement*/}

주어진 `type`, `props`, 및 `children`으로 React 요소를 생성하려면 `createElement`를 호출하세요.

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello'
  );
}
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `type`: `type` 인수는 유효한 React 컴포넌트 유형이어야 합니다. 예를 들어, 태그 이름 문자열(예: `'div'` 또는 `'span'`)이거나 React 컴포넌트(함수, 클래스 또는 [`Fragment`](/reference/react/Fragment)와 같은 특수 컴포넌트)일 수 있습니다.

* `props`: `props` 인수는 객체이거나 `null`이어야 합니다. `null`을 전달하면 빈 객체와 동일하게 처리됩니다. React는 전달한 `props`와 일치하는 속성을 가진 요소를 생성합니다. `props` 객체의 `ref`와 `key`는 특별하며 반환된 요소의 `element.props.ref` 및 `element.props.key`로 사용할 수 *없습니다*. 대신 `element.ref` 및 `element.key`로 사용할 수 있습니다.

* **선택 사항** `...children`: 0개 이상의 자식 노드. React 요소, 문자열, 숫자, [포털](/reference/react-dom/createPortal), 빈 노드(`null`, `undefined`, `true`, `false`), 및 React 노드 배열을 포함한 모든 React 노드가 될 수 있습니다.

#### 반환값 {/*returns*/}

`createElement`는 몇 가지 속성이 있는 React 요소 객체를 반환합니다:

* `type`: 전달한 `type`.
* `props`: `ref`와 `key`를 제외한 전달한 `props`. `type`이 레거시 `type.defaultProps`를 가진 컴포넌트인 경우, 누락되거나 정의되지 않은 `props`는 `type.defaultProps`의 값을 받습니다.
* `ref`: 전달한 `ref`. 누락된 경우, `null`.
* `key`: 전달한 `key`, 문자열로 강제 변환됨. 누락된 경우, `null`.

일반적으로, 요소를 컴포넌트에서 반환하거나 다른 요소의 자식으로 만듭니다. 요소의 속성을 읽을 수 있지만, 생성된 후에는 모든 요소를 불투명하게 취급하고 렌더링만 하는 것이 좋습니다.

#### 주의사항 {/*caveats*/}

* **React 요소와 그 props를 [불변](https://en.wikipedia.org/wiki/Immutable_object)으로 취급**하고 생성 후에는 절대 내용을 변경하지 않아야 합니다. 개발 중에는 React가 반환된 요소와 그 `props` 속성을 얕게 [동결](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)하여 이를 강제합니다.

* JSX를 사용할 때, **자신의 커스텀 컴포넌트를 렌더링하려면 태그를 대문자로 시작해야 합니다.** 즉, `<Something />`는 `createElement(Something)`와 동일하지만, `<something />`(소문자)은 `createElement('something')`(문자열이므로 내장 HTML 태그로 처리됨)과 동일합니다.

* **모든 자식이 정적으로 알려진 경우에만 `createElement`에 자식을 여러 인수로 전달해야 합니다.** 예를 들어, `createElement('h1', {}, child1, child2, child3)`와 같이. 자식이 동적이라면 전체 배열을 세 번째 인수로 전달하세요: `createElement('ul', {}, listItems)`. 이렇게 하면 React가 동적 목록에 대해 [누락된 `key`에 대해 경고](/learn/rendering-lists#keeping-list-items-in-order-with-key)합니다. 정적 목록의 경우 재정렬되지 않기 때문에 필요하지 않습니다.

---

## 사용법 {/*usage*/}

### JSX 없이 요소 생성하기 {/*creating-an-element-without-jsx*/}

[JSX](/learn/writing-markup-with-jsx)를 좋아하지 않거나 프로젝트에서 사용할 수 없는 경우, `createElement`를 대안으로 사용할 수 있습니다.

JSX 없이 요소를 생성하려면 <CodeStep step={1}>type</CodeStep>, <CodeStep step={2}>props</CodeStep>, 및 <CodeStep step={3}>children</CodeStep>을 사용하여 `createElement`를 호출하세요:

```js [[1, 5, "'h1'"], [2, 6, "{ className: 'greeting' }"], [3, 7, "'Hello ',"], [3, 8, "createElement('i', null, name),"], [3, 9, "'. Welcome!'"]]
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}
```

<CodeStep step={3}>children</CodeStep>은 선택 사항이며 필요한 만큼 전달할 수 있습니다(위 예제에는 세 개의 자식이 있습니다). 이 코드는 인사말이 있는 `<h1>` 헤더를 표시합니다. 비교를 위해, 동일한 예제를 JSX로 다시 작성한 예제는 다음과 같습니다:

```js [[1, 3, "h1"], [2, 3, "className=\\"greeting\\""], [3, 4, "Hello <i>{name}</i>. Welcome!"], [1, 5, "h1"]]
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}
```

자신의 React 컴포넌트를 렌더링하려면 문자열 대신 <CodeStep step={1}>type</CodeStep>으로 `Greeting`과 같은 함수를 전달하세요:

```js [[1, 2, "Greeting"], [2, 2, "{ name: 'Taylor' }"]]
export default function App() {
  return createElement(Greeting, { name: 'Taylor' });
}
```

JSX로는 다음과 같이 보일 것입니다:

```js [[1, 2, "Greeting"], [2, 2, "name=\\"Taylor\\""]]
export default function App() {
  return <Greeting name="Taylor" />;
}
```

다음은 `createElement`로 작성된 전체 예제입니다:

<Sandpack>

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}

export default function App() {
  return createElement(
    Greeting,
    { name: 'Taylor' }
  );
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

다음은 JSX를 사용하여 작성된 동일한 예제입니다:

<Sandpack>

```js
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}

export default function App() {
  return <Greeting name="Taylor" />;
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

두 가지 코딩 스타일 모두 괜찮으므로 프로젝트에 적합한 것을 사용하면 됩니다. `createElement`에 비해 JSX를 사용하는 주요 이점은 어떤 닫는 태그가 어떤 여는 태그에 해당하는지 쉽게 알 수 있다는 점입니다.

<DeepDive>

#### React 요소란 정확히 무엇인가요? {/*what-is-a-react-element-exactly*/}

요소는 사용자 인터페이스의 일부를 가볍게 설명한 것입니다. 예를 들어, `<Greeting name="Taylor" />`와 `createElement(Greeting, { name: 'Taylor' })`는 다음과 같은 객체를 생성합니다:

```js
// 약간 단순화된 버전
{
  type: Greeting,
  props: {
    name: 'Taylor'
  },
  key: null,
  ref: null,
}
```

**이 객체를 생성한다고 해서 `Greeting` 컴포넌트를 렌더링하거나 DOM 요소를 생성하는 것은 아닙니다.**

React 요소는 설명에 더 가깝습니다. React가 나중에 `Greeting` 컴포넌트를 렌더링하도록 지시하는 것입니다. `App` 컴포넌트에서 이 객체를 반환함으로써 React에게 다음에 무엇을 해야 하는지 알려줍니다.

요소를 생성하는 것은 매우 저렴하므로 최적화하거나 피하려고 할 필요가 없습니다.

</DeepDive>