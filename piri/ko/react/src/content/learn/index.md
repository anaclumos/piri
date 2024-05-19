---
title: 빠른 시작
---

<Intro>

React 문서에 오신 것을 환영합니다! 이 페이지는 일상적으로 사용할 React 개념의 80%에 대한 소개를 제공합니다.

</Intro>

<YouWillLearn>

- 컴포넌트를 생성하고 중첩하는 방법
- 마크업과 스타일을 추가하는 방법
- 데이터를 표시하는 방법
- 조건과 리스트를 렌더링하는 방법
- 이벤트에 응답하고 화면을 업데이트하는 방법
- 컴포넌트 간에 데이터를 공유하는 방법

</YouWillLearn>

## 컴포넌트 생성 및 중첩 {/*components*/}

React 앱은 *컴포넌트*로 구성됩니다. 컴포넌트는 자체 로직과 외형을 가진 UI(사용자 인터페이스)의 일부입니다. 컴포넌트는 버튼처럼 작을 수도 있고, 전체 페이지처럼 클 수도 있습니다.

React 컴포넌트는 마크업을 반환하는 JavaScript 함수입니다:

```js
function MyButton() {
  return (
    <button>I'm a button</button>
  );
}
```

이제 `MyButton`을 선언했으므로 다른 컴포넌트에 중첩할 수 있습니다:

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

`<MyButton />`이 대문자로 시작하는 것을 주목하세요. 이것이 React 컴포넌트임을 나타냅니다. React 컴포넌트 이름은 항상 대문자로 시작해야 하며, HTML 태그는 소문자로 시작해야 합니다.

결과를 확인해보세요:

<Sandpack>

```js
function MyButton() {
  return (
    <button>
      I'm a button
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

</Sandpack>

`export default` 키워드는 파일의 주요 컴포넌트를 지정합니다. JavaScript 문법에 익숙하지 않다면, [MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export)과 [javascript.info](https://javascript.info/import-export)에서 좋은 참고 자료를 찾을 수 있습니다.

## JSX로 마크업 작성하기 {/*writing-markup-with-jsx*/}

위에서 본 마크업 문법은 *JSX*라고 합니다. 선택 사항이지만 대부분의 React 프로젝트는 편리함 때문에 JSX를 사용합니다. [로컬 개발을 위한 도구](/learn/installation)는 모두 기본적으로 JSX를 지원합니다.

JSX는 HTML보다 엄격합니다. `<br />`과 같이 태그를 닫아야 합니다. 컴포넌트는 여러 개의 JSX 태그를 반환할 수 없습니다. `<div>...</div>` 또는 빈 `<>...</>` 래퍼와 같은 공통 부모로 감싸야 합니다:

```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>Hello there.<br />How do you do?</p>
    </>
  );
}
```

많은 HTML을 JSX로 변환해야 하는 경우, [온라인 변환기](https://transform.tools/html-to-jsx)를 사용할 수 있습니다.

## 스타일 추가하기 {/*adding-styles*/}

React에서는 `className`으로 CSS 클래스를 지정합니다. 이는 HTML [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) 속성과 동일하게 작동합니다:

```js
<img className="avatar" />
```

그런 다음 별도의 CSS 파일에 CSS 규칙을 작성합니다:

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

React는 CSS 파일을 추가하는 방법을 규정하지 않습니다. 가장 간단한 경우, HTML에 [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) 태그를 추가합니다. 빌드 도구나 프레임워크를 사용하는 경우, 프로젝트에 CSS 파일을 추가하는 방법을 배우기 위해 해당 문서를 참조하세요.

## 데이터 표시하기 {/*displaying-data*/}

JSX를 사용하면 JavaScript에 마크업을 넣을 수 있습니다. 중괄호를 사용하여 JavaScript로 "탈출"하여 코드의 변수를 임베드하고 사용자에게 표시할 수 있습니다. 예를 들어, 이는 `user.name`을 표시합니다:

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

JSX 속성에서도 JavaScript로 "탈출"할 수 있지만, 이 경우 따옴표 대신 중괄호를 사용해야 합니다. 예를 들어, `className="avatar"`는 `"avatar"` 문자열을 CSS 클래스에 전달하지만, `src={user.imageUrl}`은 JavaScript `user.imageUrl` 변수 값을 읽고, 그 값을 `src` 속성에 전달합니다:

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

JSX 중괄호 안에 더 복잡한 표현식을 넣을 수도 있습니다. 예를 들어, [문자열 연결](https://javascript.info/operators#string-concatenation-with-binary):

<Sandpack>

```js
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

</Sandpack>

위 예제에서 `style={{}}`는 특별한 문법이 아니라, `style={ }` JSX 중괄호 안에 있는 일반 `{}` 객체입니다. 스타일이 JavaScript 변수에 의존할 때 `style` 속성을 사용할 수 있습니다.

## 조건부 렌더링 {/*conditional-rendering*/}

React에서는 조건을 작성하기 위한 특별한 문법이 없습니다. 대신, 일반 JavaScript 코드를 작성할 때 사용하는 동일한 기술을 사용합니다. 예를 들어, [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) 문을 사용하여 조건부로 JSX를 포함할 수 있습니다:

```js
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return (
  <div>
    {content}
  </div>
);
```

더 간결한 코드를 선호하는 경우, [조건부 `?` 연산자](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)를 사용할 수 있습니다. `if`와 달리 JSX 내부에서 작동합니다:

```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

`else` 분기가 필요하지 않은 경우, 더 짧은 [논리 `&&` 문법](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation)을 사용할 수도 있습니다:

```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

이 모든 접근 방식은 속성을 조건부로 지정하는 데에도 작동합니다. 이 JavaScript 문법에 익숙하지 않은 경우, 항상 `if...else`를 사용하는 것부터 시작할 수 있습니다.

## 리스트 렌더링 {/*rendering-lists*/}

컴포넌트의 리스트를 렌더링하기 위해 [`for` 루프](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for)와 [배열 `map()` 함수](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)와 같은 JavaScript 기능을 사용할 것입니다.

예를 들어, 제품 배열이 있다고 가정해 봅시다:

```js
const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

컴포넌트 내부에서 `map()` 함수를 사용하여 제품 배열을 `<li>` 항목 배열로 변환합니다:

```js
const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

`<li>`에 `key` 속성이 있는 것을 주목하세요. 리스트의 각 항목에 대해 형제 항목 중에서 해당 항목을 고유하게 식별하는 문자열 또는 숫자를 전달해야 합니다. 일반적으로 키는 데이터베이스 ID와 같은 데이터에서 가져와야 합니다. React는 나중에 항목을 삽입, 삭제 또는 재정렬할 때 무슨 일이 일어났는지 알기 위해 키를 사용합니다.

<Sandpack>

```js
const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```

</Sandpack>

## 이벤트에 응답하기 {/*responding-to-events*/}

컴포넌트 내부에 *이벤트 핸들러* 함수를 선언하여 이벤트에 응답할 수 있습니다:

```js {2-4,7}
function MyButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

`onClick={handleClick}`에 괄호가 없는 것을 주목하세요! 이벤트 핸들러 함수를 _호출하지 마세요_: 단지 *전달*하기만 하면 됩니다. 사용자가 버튼을 클릭하면 React가 이벤트 핸들러를 호출합니다.

## 화면 업데이트하기 {/*updating-the-screen*/}

종종 컴포넌트가 일부 정보를 "기억"하고 표시하기를 원할 것입니다. 예를 들어, 버튼이 클릭된 횟수를 세고 싶을 수 있습니다. 이를 위해 컴포넌트에 *상태*를 추가합니다.

먼저, React에서 [`useState`](/reference/react/useState)를 가져옵니다:

```js
import { useState } from 'react';
```

이제 컴포넌트 내부에 *상태 변수*를 선언할 수 있습니다:

```js
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

`useState`에서 두 가지를 얻을 수 있습니다: 현재 상태(`count`)와 이를 업데이트할 수 있는 함수(`setCount`). 이들에게 어떤 이름을 주어도 되지만, 관례적으로 `[something, setSomething]`으로 작성합니다.

버튼이 처음 표시될 때, `count`는 `useState()`에 `0`을 전달했기 때문에 `0`이 됩니다. 상태를 변경하고 싶을 때, `setCount()`를 호출하고 새 값을 전달합니다. 이 버튼을 클릭하면 카운터가 증가합니다:

```js {5}
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

React는 컴포넌트 함수를 다시 호출합니다. 이번에는 `count`가 `1`이 됩니다. 그런 다음 `2`가 됩니다. 계속해서 증가합니다.

같은 컴포넌트를 여러 번 렌더링하면 각각 고유한 상태를 갖게 됩니다. 각 버튼을 개별적으로 클릭해보세요:

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

각 버튼이 자신의 `count` 상태를 "기억"하고 다른 버튼에 영향을 주지 않는 것을 주목하세요.

## Hooks 사용하기 {/*using-hooks*/}

`use`로 시작하는 함수는 *Hooks*라고 합니다. `useState`는 React에서 제공하는 내장 Hook입니다. 다른 내장 Hooks는 [API 참조](/reference/react)에서 찾을 수 있습니다. 기존 Hooks를 결합하여 자체 Hooks를 작성할 수도 있습니다.

Hooks는 다른 함수보다 더 제한적입니다. Hooks는 컴포넌트(또는 다른 Hooks)의 *상단*에서만 호출할 수 있습니다. 조건이나 루프에서 `useState`를 사용하려면 새 컴포넌트를 추출하고 거기에 넣어야 합니다.

## 컴포넌트 간 데이터 공유하기 {/*sharing-data-between-components*/}

이전 예제에서 각 `MyButton`은 독립적인 `count`를 가지고 있었고, 각 버튼이 클릭될 때마다 클릭된 버튼의 `count`만 변경되었습니다:

<DiagramGroup>

<Diagram name="sharing_data_child" height={367} width={407} alt="Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. Both MyButton components contain a count with value zero.">

처음에는 각 `MyButton`의 `count` 상태가 `0`입니다

</Diagram>

<Diagram name="sharing_data_child_clicked" height={367} width={407} alt="The same diagram as the previous, with the count of the first child MyButton component highlighted indicating a click with the count value incremented to one. The second MyButton component still contains value zero." >

첫 번째 `MyButton`이 `count`를 `1`로 업데이트합니다

</Diagram>

</DiagramGroup>

그러나 종종 컴포넌트가 *데이터를 공유하고 항상 함께 업데이트*해야 할 필요가 있습니다.

두 `MyButton` 컴포넌트가 동일한 `count`를 표시하고 함께 업데이트되도록 하려면, 상태를 개별 버튼에서 "위로" 이동하여 모든 버튼을 포함하는 가장 가까운 컴포넌트로 이동해야 합니다.

이 예제에서는 `MyApp`입니다:

<DiagramGroup>

<Diagram name="sharing_data_parent" height={385} width={410} alt="Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. MyApp contains a count value of zero which is passed down to both of the MyButton components, which also show value zero." >

처음에는 `MyApp`의 `count` 상태가 `0`이며, 두 자식에게 전달됩니다

</Diagram>

<Diagram name="sharing_data_parent_clicked" height={385} width={410} alt="The same diagram as the previous, with the count of the parent MyApp component highlighted indicating a click with the value incremented to one. The flow to both of the children MyButton components is also highlighted, and the count value in each child is set to one indicating the value was passed down." >

클릭 시, `MyApp`는 `count` 상태를 `1`로 업데이트하고 두 자식에게 전달합니다

</Diagram>

</DiagramGroup>

이제 버튼을 클릭할 때마다 `MyApp`의 `count`가 변경되어 두 `MyButton`의 `count`도 변경됩니다. 이를 코드로 표현하는 방법은 다음과 같습니다.

먼저, 상태를 `MyButton`에서 `MyApp`으로 *이동*합니다:

```js {2-6,18}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... we're moving code from here ...
}

```

그런 다음, `MyApp`에서 각 `MyButton`으로 상태를 *전달*합니다. 공유된 클릭 핸들러와 함께. `<img>`와 같은 내장 태그에서 했던 것처럼 JSX 중괄호를 사용하여 `MyButton`에 정보를 전달할 수 있습니다:

```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

이렇게 전달하는 정보를 _props_라고 합니다. 이제 `MyApp` 컴포넌트는 `count` 상태와 `handleClick` 이벤트 핸들러를 포함하고, *두 버튼에 props로 전달*합니다.

마지막으로, `MyButton`을 변경하여 부모 컴포넌트에서 전달된 props를 *읽도록* 합니다:

```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

버튼을 클릭하면 `onClick` 핸들러가 실행됩니다. 각 버튼의 `onClick` props는 `MyApp` 내부의 `handleClick` 함수로 설정되었으므로, 그 안의 코드가 실행됩니다. 그 코드는 `setCount(count + 1)`을 호출하여 `count` 상태 변수를 증가시킵니다. 새로운 `count` 값이 각 버튼에 props로 전달되므로, 모든 버튼이 새로운 값을 표시합니다. 이를 "상태 올리기"라고 합니다. 상태를 올림으로써 컴포넌트 간에 상태를 공유하게 됩니다.

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

## 다음 단계 {/*next-steps*/}

이제 React 코드를 작성하는 기본 사항을 알게 되었습니다!

[Tutorial](/learn/tutorial-tic-tac-toe)을 확인하여 이를 실습하고 React로 첫 번째 미니 앱을 만들어보세요.