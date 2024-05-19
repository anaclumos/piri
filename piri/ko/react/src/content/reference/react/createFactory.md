---
title: createFactory
---

<Deprecated>

이 API는 React의 향후 주요 버전에서 제거될 예정입니다. [대안을 참조하세요.](#alternatives)

</Deprecated>

<Intro>

`createFactory`는 주어진 타입의 React 요소를 생성하는 함수를 만들 수 있게 해줍니다.

```js
const factory = createFactory(type)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `createFactory(type)` {/*createfactory*/}

`createFactory(type)`를 호출하여 주어진 `type`의 React 요소를 생성하는 팩토리 함수를 만듭니다.

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

그런 다음 JSX 없이 React 요소를 생성하는 데 사용할 수 있습니다:

```js
export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

[아래에서 더 많은 예제를 참조하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `type`: `type` 인수는 유효한 React 컴포넌트 타입이어야 합니다. 예를 들어, 태그 이름 문자열(예: `'div'` 또는 `'span'`)이거나 React 컴포넌트(함수, 클래스 또는 [`Fragment`](/reference/react/Fragment)와 같은 특수 컴포넌트)일 수 있습니다.

#### 반환값 {/*returns*/}

팩토리 함수를 반환합니다. 이 팩토리 함수는 첫 번째 인수로 `props` 객체를 받고, 그 뒤에 `...children` 인수 목록을 받아 주어진 `type`, `props` 및 `children`을 가진 React 요소를 반환합니다.

---

## 사용법 {/*usage*/}

### 팩토리로 React 요소 생성하기 {/*creating-react-elements-with-a-factory*/}

대부분의 React 프로젝트는 사용자 인터페이스를 설명하기 위해 [JSX](/learn/writing-markup-with-jsx)를 사용하지만, JSX는 필수는 아닙니다. 과거에는 `createFactory`가 JSX 없이 사용자 인터페이스를 설명할 수 있는 방법 중 하나였습니다.

특정 요소 타입(예: `'button'`)에 대한 *팩토리 함수*를 만들기 위해 `createFactory`를 호출합니다:

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

그 팩토리 함수를 호출하면 제공된 props와 children으로 React 요소가 생성됩니다:

<Sandpack>

```js src/App.js
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

</Sandpack>

이것이 `createFactory`가 JSX의 대안으로 사용된 방법입니다. 그러나 `createFactory`는 더 이상 사용되지 않으며, 새로운 코드에서는 `createFactory`를 호출하지 않아야 합니다. 아래에서 `createFactory`를 대체하는 방법을 참조하세요.

---

## 대안 {/*alternatives*/}

### `createFactory`를 프로젝트에 복사하기 {/*copying-createfactory-into-your-project*/}

프로젝트에 많은 `createFactory` 호출이 있는 경우, 이 `createFactory.js` 구현을 프로젝트에 복사하세요:

<Sandpack>

```js src/App.js
import { createFactory } from './createFactory.js';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

```js src/createFactory.js
import { createElement } from 'react';

export function createFactory(type) {
  return createElement.bind(null, type);
}
```

</Sandpack>

이렇게 하면 import를 제외한 모든 코드를 변경하지 않고 유지할 수 있습니다.

---

### `createFactory`를 `createElement`로 대체하기 {/*replacing-createfactory-with-createelement*/}

JSX를 사용하고 싶지 않지만 수동으로 포팅하는 것이 괜찮은 몇 가지 `createFactory` 호출이 있는 경우, 모든 팩토리 함수 호출을 [`createElement`](/reference/react/createElement) 호출로 대체할 수 있습니다. 예를 들어, 이 코드를:

```js {1,3,6}
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

이 코드로 대체할 수 있습니다:

```js {1,4}
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

여기 JSX 없이 React를 사용하는 완전한 예제가 있습니다:

<Sandpack>

```js src/App.js
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

</Sandpack>

---

### `createFactory`를 JSX로 대체하기 {/*replacing-createfactory-with-jsx*/}

마지막으로, `createFactory` 대신 JSX를 사용할 수 있습니다. 이것이 React를 사용하는 가장 일반적인 방법입니다:

<Sandpack>

```js src/App.js
export default function App() {
  return (
    <button onClick={() => {
      alert('Clicked!');
    }}>
      Click me
    </button>
  );
};
```

</Sandpack>

<Pitfall>

기존 코드가 상수 대신 변수로 `type`을 전달할 때가 있습니다:

```js {3}
function Heading({ isSubheading, ...props }) {
  const type = isSubheading ? 'h2' : 'h1';
  const factory = createFactory(type);
  return factory(props);
}
```

JSX에서 동일하게 하려면 변수 이름을 대문자로 시작하는 `Type`으로 변경해야 합니다:

```js {2,3}
function Heading({ isSubheading, ...props }) {
  const Type = isSubheading ? 'h2' : 'h1';
  return <Type {...props} />;
}
```

그렇지 않으면 React는 `<type>`을 소문자이기 때문에 내장 HTML 태그로 해석합니다.

</Pitfall>